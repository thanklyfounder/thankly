// app/api/mobile/initiate-payout/route.ts
// This route did not previously exist — the mobile app was calling it and receiving
// an HTML 404 response, causing SyntaxError: JSON Parse on the client.

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-admin";

const IS_SANDBOX = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ?? false;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { authUserId, method } = body;

    if (!authUserId) {
      return NextResponse.json({ error: "Missing authUserId" }, { status: 400 });
    }

    if (!method || !["standard", "instant"].includes(method)) {
      return NextResponse.json(
        { error: "Invalid method. Must be 'standard' or 'instant'." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: worker, error: workerError } = await supabase
      .from("workers")
      .select("id, stripe_account_id, stripe_onboarded")
      .eq("auth_user_id", authUserId)
      .single();

    if (workerError || !worker) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    if (!worker.stripe_account_id || !worker.stripe_onboarded) {
      return NextResponse.json(
        { error: "Stripe account not connected or not fully onboarded." },
        { status: 400 }
      );
    }

    // In sandbox, Stripe connected account balances are always $0 for one-time payments.
    // We simulate a successful payout response so the flow can be tested end-to-end.
    if (IS_SANDBOX) {
      return NextResponse.json({
        success: true,
        payoutId: "po_sandbox_simulated",
        amount: 18650,
        method,
        arrivalDate: Math.floor(Date.now() / 1000) + (method === "instant" ? 60 : 172800),
        status: "paid",
        sandbox: true,
      });
    }

    // --- Live mode: fetch real balance ---
    const balance = await stripe.balance.retrieve(
      {},
      { stripeAccount: worker.stripe_account_id }
    );

    const availableUSD = balance.available.find((b) => b.currency === "usd");
    const availableAmount = availableUSD?.amount ?? 0;

    if (availableAmount <= 0) {
      return NextResponse.json(
        { error: "No available balance to pay out." },
        { status: 400 }
      );
    }

    // Fetch external account (bank for standard, debit card for instant)
    const externalAccounts = await stripe.accounts.listExternalAccounts(
      worker.stripe_account_id,
      { object: method === "instant" ? "card" : "bank_account", limit: 1 }
    );

    if (externalAccounts.data.length === 0) {
      const missingType = method === "instant" ? "debit card" : "bank account";
      return NextResponse.json(
        { error: `No ${missingType} found on this Stripe account.` },
        { status: 400 }
      );
    }

    const destinationId = externalAccounts.data[0].id;

    const payout = await stripe.payouts.create(
      {
        amount: availableAmount,
        currency: "usd",
        method,
        destination: destinationId,
        description: `Thankly ${method} payout`,
      },
      {
        stripeAccount: worker.stripe_account_id,
      }
    );

    return NextResponse.json({
      success: true,
      payoutId: payout.id,
      amount: payout.amount,
      method: payout.method,
      arrivalDate: payout.arrival_date,
      status: payout.status,
    });
  } catch (error: any) {
    console.error("Initiate payout error:", error);

    if (error?.type === "StripeInvalidRequestError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Unexpected error initiating payout." },
      { status: 500 }
    );
  }
}
