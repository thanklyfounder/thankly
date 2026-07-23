import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

/**
 * Dashboard data for the signed-in affiliate.
 *
 * Also opportunistically syncs Stripe onboarding status — Stripe doesn't call
 * us back when an affiliate finishes onboarding, so we check on dashboard load.
 */
export async function GET() {
  try {
    const authClient = await createServerClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const admin = createAdminClient();

    const { data: affiliate } = await admin
      .from("affiliates")
      .select("id, referral_code, status, share_rate, stripe_account_id, stripe_onboarded, earning_window_months")
      .eq("email", user.email ?? "")
      .maybeSingle();

    if (!affiliate) {
      return NextResponse.json({ error: "Affiliate not found." }, { status: 404 });
    }

    // Sync onboarding status from Stripe if we think they're not done yet.
    let stripeOnboarded = affiliate.stripe_onboarded;
    if (affiliate.stripe_account_id && !stripeOnboarded) {
      try {
        const account = await stripe.accounts.retrieve(affiliate.stripe_account_id);
        const ready = Boolean(account.payouts_enabled && account.details_submitted);
        if (ready) {
          await admin
            .from("affiliates")
            .update({ stripe_onboarded: true })
            .eq("id", affiliate.id);
          stripeOnboarded = true;
        }
      } catch (e) {
        console.error("Affiliate Stripe status sync failed (non-blocking):", e);
      }
    }

    const { data: balance } = await admin
      .from("affiliate_balances")
      .select("active_referrals, pending_referrals, unpaid_cents, lifetime_cents")
      .eq("affiliate_id", affiliate.id)
      .maybeSingle();

    // Referral list — no personal data about the referred worker beyond a
    // first name, since affiliates have no legitimate need for worker PII.
    const { data: referrals } = await admin
      .from("affiliate_referrals")
      .select("id, status, referred_at, activated_at, earning_ends_at, workers(full_name)")
      .eq("affiliate_id", affiliate.id)
      .order("referred_at", { ascending: false })
      .limit(100);

    const { data: payouts } = await admin
      .from("affiliate_payouts")
      .select("id, period_start, period_end, amount_cents, status, paid_at")
      .eq("affiliate_id", affiliate.id)
      .order("created_at", { ascending: false })
      .limit(24);

    return NextResponse.json({
      referralCode: affiliate.referral_code,
      status: affiliate.status,
      shareRate: Number(affiliate.share_rate),
      earningWindowMonths: affiliate.earning_window_months,
      stripeOnboarded,
      hasStripeAccount: Boolean(affiliate.stripe_account_id),
      totals: {
        activeReferrals: balance?.active_referrals ?? 0,
        pendingReferrals: balance?.pending_referrals ?? 0,
        unpaidCents: balance?.unpaid_cents ?? 0,
        lifetimeCents: balance?.lifetime_cents ?? 0,
      },
      referrals: (referrals ?? []).map((r) => {
        const w = r.workers as unknown as { full_name?: string | null } | null;
        const name = w?.full_name?.trim() ?? "";
        return {
          id: r.id,
          status: r.status,
          referredAt: r.referred_at,
          activatedAt: r.activated_at,
          earningEndsAt: r.earning_ends_at,
          // First name only.
          displayName: name ? name.split(" ")[0] : "Worker",
        };
      }),
      payouts: payouts ?? [],
    });
  } catch (e) {
    console.error("Affiliate summary error:", e);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
