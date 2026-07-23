import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-admin";

/**
 * Monthly affiliate payout run.
 *
 * Intended to be invoked by a scheduled job (Vercel Cron) on the 1st of each
 * month, paying out the previous month's accrued commission.
 *
 * Protected by CRON_SECRET. Vercel Cron sends `Authorization: Bearer <secret>`.
 *
 * Safety properties:
 *  - Batching is atomic in Postgres (batch_affiliate_payout row-locks the
 *    affiliate), so a crash mid-run cannot double-claim earnings.
 *  - Each affiliate is processed independently; one failure does not abort
 *    the run.
 *  - If the Stripe transfer fails, the payout row is marked 'failed' and its
 *    earnings are released back to unpaid so the next run retries them.
 */

const MIN_PAYOUT_CENTS = 2500; // $25.00

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createAdminClient();

  // ── Period: the previous calendar month ───────────────────────────────────
  const now = new Date();
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  // ── Candidates: onboarded, active, with unpaid earnings over threshold ────
  const { data: candidates, error: candidatesError } = await supabase
    .from("affiliate_balances")
    .select("affiliate_id, email, unpaid_cents, stripe_onboarded, status")
    .eq("status", "active")
    .eq("stripe_onboarded", true)
    .gte("unpaid_cents", MIN_PAYOUT_CENTS);

  if (candidatesError) {
    console.error("Affiliate payout: candidate query failed:", candidatesError);
    return NextResponse.json({ error: "Query failed." }, { status: 500 });
  }

  const results: Array<{
    affiliateId: string;
    status: "paid" | "skipped" | "failed";
    amountCents?: number;
    reason?: string;
  }> = [];

  for (const c of candidates ?? []) {
    try {
      // 1. Claim earnings into a batch (atomic).
      const { data: payoutId, error: batchError } = await supabase.rpc(
        "batch_affiliate_payout",
        {
          p_affiliate_id: c.affiliate_id,
          p_period_start: fmt(periodStart),
          p_period_end: fmt(periodEnd),
          p_min_cents: MIN_PAYOUT_CENTS,
        }
      );

      if (batchError || !payoutId) {
        results.push({ affiliateId: c.affiliate_id, status: "skipped", reason: "below threshold or not payable" });
        continue;
      }

      // 2. Read the batch we just created.
      const { data: payout } = await supabase
        .from("affiliate_payouts")
        .select("id, amount_cents")
        .eq("id", payoutId)
        .single();

      const { data: affiliate } = await supabase
        .from("affiliates")
        .select("stripe_account_id")
        .eq("id", c.affiliate_id)
        .single();

      if (!payout || !affiliate?.stripe_account_id) {
        await releaseBatch(supabase, payoutId, "missing payout or stripe account");
        results.push({ affiliateId: c.affiliate_id, status: "failed", reason: "missing stripe account" });
        continue;
      }

      await supabase
        .from("affiliate_payouts")
        .update({ status: "processing" })
        .eq("id", payoutId);

      // 3. Move the money. Platform balance -> affiliate connected account.
      const transfer = await stripe.transfers.create({
        amount: payout.amount_cents,
        currency: "usd",
        destination: affiliate.stripe_account_id,
        description: `Thankly affiliate commission ${fmt(periodStart)} to ${fmt(periodEnd)}`,
        metadata: {
          affiliate_id: c.affiliate_id,
          payout_id: payoutId,
          period_start: fmt(periodStart),
          period_end: fmt(periodEnd),
        },
      });

      await supabase
        .from("affiliate_payouts")
        .update({
          status: "paid",
          stripe_transfer_id: transfer.id,
          paid_at: new Date().toISOString(),
        })
        .eq("id", payoutId);

      results.push({
        affiliateId: c.affiliate_id,
        status: "paid",
        amountCents: payout.amount_cents,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "unknown error";
      console.error(`Affiliate payout failed for ${c.affiliate_id}:`, e);
      results.push({ affiliateId: c.affiliate_id, status: "failed", reason: message });
    }
  }

  return NextResponse.json({
    period: { start: fmt(periodStart), end: fmt(periodEnd) },
    processed: results.length,
    paid: results.filter((r) => r.status === "paid").length,
    failed: results.filter((r) => r.status === "failed").length,
    results,
  });
}

/**
 * Release a failed batch: mark the payout failed and return its earnings to
 * unpaid so the next monthly run picks them up again.
 */
async function releaseBatch(
  supabase: ReturnType<typeof createAdminClient>,
  payoutId: string,
  reason: string
) {
  await supabase
    .from("affiliate_earnings")
    .update({ payout_id: null })
    .eq("payout_id", payoutId);

  await supabase
    .from("affiliate_payouts")
    .update({ status: "failed", failure_reason: reason })
    .eq("id", payoutId);
}
