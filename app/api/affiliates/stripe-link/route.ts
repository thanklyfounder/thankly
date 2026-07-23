import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

/**
 * Creates a Stripe Connect Express onboarding link for an affiliate.
 *
 * Affiliates onboard only when they have earnings to claim — commission accrues
 * to the ledger regardless of onboarding status, it just can't be paid out until
 * this completes.
 *
 * Affiliate commission is service income (1099-NEC reportable at $600+/yr),
 * unlike worker tips which flow as 1099-K. Stripe collects the W-9 and issues
 * the form, which is the main reason we use Connect rather than manual payouts.
 */
export async function POST() {
  try {
    const authClient = await createServerClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const admin = createAdminClient();

    const { data: affiliate, error } = await admin
      .from("affiliates")
      .select("id, email, stripe_account_id, stripe_onboarded, status")
      .eq("email", user.email ?? "")
      .maybeSingle();

    if (error || !affiliate) {
      return NextResponse.json({ error: "Affiliate not found." }, { status: 404 });
    }

    if (affiliate.status !== "active") {
      return NextResponse.json({ error: "Affiliate account is not active." }, { status: 400 });
    }

    let accountId = affiliate.stripe_account_id;

    // Already onboarded — send them to the Express dashboard instead of
    // re-running onboarding (which would loop on "confirm your account").
    if (accountId && affiliate.stripe_onboarded) {
      const loginLink = await stripe.accounts.createLoginLink(accountId);
      return NextResponse.json({ url: loginLink.url, mode: "dashboard" });
    }

    // Create the connected account on first use.
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: affiliate.email,
        capabilities: {
          transfers: { requested: true },
        },
        business_type: "individual",
        metadata: {
          thankly_affiliate_id: affiliate.id,
          account_purpose: "affiliate_commission",
        },
      });

      accountId = account.id;

      await admin
        .from("affiliates")
        .update({ stripe_account_id: accountId })
        .eq("id", affiliate.id);
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://getthankly.com";

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${baseUrl}/affiliates/dashboard?stripe=refresh`,
      return_url: `${baseUrl}/affiliates/dashboard?stripe=return`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url, mode: "onboarding" });
  } catch (e) {
    console.error("Affiliate stripe link error:", e);
    return NextResponse.json({ error: "Unable to start Stripe onboarding." }, { status: 500 });
  }
}
