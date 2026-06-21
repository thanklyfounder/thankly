// app/api/mobile/get-stripe-balance/route.ts
// This is the route the mobile app calls at /api/mobile/get-stripe-balance.
// Previously this file did not exist, causing the balance to silently return $0 every time.

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-admin";

const IS_SANDBOX = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ?? false;

const SANDBOX_MOCK_BALANCE = {
  available: [{ amount: 18650, currency: "usd" }], // $186.50
  pending: [{ amount: 7400, currency: "usd" }],    // $74.00
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authUserId = body?.authUserId;

    if (!authUserId) {
      return NextResponse.json(
        { error: "Missing auth user id." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: worker, error } = await supabase
      .from("workers")
      .select("stripe_account_id, stripe_onboarded")
      .eq("auth_user_id", authUserId)
      .single();

    if (error || !worker?.stripe_account_id) {
      return NextResponse.json(
        { error: "Stripe account not found." },
        { status: 404 }
      );
    }

    if (IS_SANDBOX) {
      return NextResponse.json(SANDBOX_MOCK_BALANCE);
    }

    const balance = await stripe.balance.retrieve(
      {},
      { stripeAccount: worker.stripe_account_id }
    );

    return NextResponse.json({
      available: balance.available,
      pending: balance.pending,
    });
  } catch (error) {
    console.error("Get stripe balance error:", error);
    return NextResponse.json(
      { error: "Unable to retrieve balance." },
      { status: 500 }
    );
  }
}
