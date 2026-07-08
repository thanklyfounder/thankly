// app/api/web/initiate-payout/route.ts
// Web version of /api/mobile/initiate-payout.
// Identity comes from the cookie session (createServerClient → getUser) — never from the request body.
// GET  = fetch Stripe balance for the signed-in worker (used by WebPayoutCard)
// POST = initiate a payout ({ method: "standard" | "instant" })

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase-server";
import { sendPushNotification } from "@/lib/sendPushNotification";

const IS_SANDBOX = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ?? false;

// Same mock shape as /api/mobile/get-stripe-balance for sandbox parity
const SANDBOX_MOCK_BALANCE = {
  available: [{ amount: 18650, currency: "usd" }],
  pending: [{ amount: 7400, currency: "usd" }],
};

function formatDollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

async function getAuthedWorker() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { worker: null, errorResponse: NextResponse.json({ error: "Not authenticated." }, { status: 401 }) };
  }

  const { data: worker, error } = await supabase
    .from("workers")
    .select("id, stripe_account_id, stripe_onboarded, expo_push_token, notify_payouts")
    .eq("auth_user_id", user.id)
    .single();

  if (error || !worker) {
    return { worker: null, errorResponse: NextResponse.json({ error: "Worker not found." }, { status: 404 }) };
  }

  return { worker, errorResponse: null };
}

export async function GET() {
  try {
    const { worker, errorResponse } = await getAuthedWorker();
    if (!worker) return errorResponse;

    // Not onboarded (or reset): no account to query — return an empty,
    // non-error balance so the card renders its normal "not ready" state.
    if (!worker.stripe_account_id || !worker.stripe_onboarded) {
      return NextResponse.json({ available: [], pending: [], accountReady: false });
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
  } catch (error: any) {
    // A Stripe account that's invalid, restricted, or inaccessible is an
    // account-state issue, not a server failure. Return calmly (no 500, no log
    // spam) so the UI can prompt the worker to fix their payout account.
    if (
      error?.type === "StripePermissionError" ||
      error?.code === "account_invalid" ||
      error?.statusCode === 403
    ) {
      return NextResponse.json(
        { available: [], pending: [], accountReady: false, needsAttention: true },
        { status: 200 }
      );
    }

    console.error("Web balance fetch error:", error);
    return NextResponse.json({ error: "Unable to fetch Stripe balance." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { worker, errorResponse } = await getAuthedWorker();
    if (!worker) return errorResponse;

    const body = await req.json();
    const method = body?.method;

    if (!method || !["standard", "instant"].includes(method)) {
      return NextResponse.json(
        { error: "Invalid method. Must be 'standard' or 'instant'." },
        { status: 400 }
      );
    }

    if (!worker.stripe_account_id || !worker.stripe_onboarded) {
      return NextResponse.json(
        { error: "Stripe account not connected or not fully onboarded." },
        { status: 400 }
      );
    }

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

    if (worker.expo_push_token && worker.notify_payouts !== false) {
      await sendPushNotification({
        expoPushToken: worker.expo_push_token,
        title: "💸 Payout initiated",
        body: `${formatDollars(payout.amount)} is on its way. Estimated arrival: ${method === "instant" ? "within minutes" : "1–2 business days"}.`,
        data: { screen: "payouts" },
      });
    }

    return NextResponse.json({
      success: true,
      payoutId: payout.id,
      amount: payout.amount,
      method: payout.method,
      arrivalDate: payout.arrival_date,
      status: payout.status,
    });
  } catch (error: any) {
    console.error("Web initiate payout error:", error);

    if (error?.type === "StripeInvalidRequestError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Unexpected error initiating payout." },
      { status: 500 }
    );
  }
}