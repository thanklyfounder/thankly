import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-admin";
import { sendPushNotification } from "@/lib/sendPushNotification";


function formatDollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}


export async function POST(req: NextRequest) {
  console.log("🔥 STRIPE WEBHOOK RECEIVED");
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");


  if (!signature) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }


  let event: Stripe.Event;


  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }


  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;


      const workerId = session.metadata?.worker_id ?? null;
      const tipAmount = Number(session.metadata?.tip_amount ?? 0);
      const stripeFee = Number(session.metadata?.stripe_fee ?? 0);
      const thanklyFee = Number(session.metadata?.thankly_fee ?? 0);
      const workerReceives = Number(session.metadata?.worker_receives ?? 0);
      const customerCoveredFee =
        session.metadata?.customer_covered_fee === "true";


      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null;


      if (!workerId || !paymentIntentId || !tipAmount) {
        console.error("Missing webhook metadata", {
          workerId,
          paymentIntentId,
          tipAmount,
        });


        return new NextResponse("Missing metadata", { status: 400 });
      }


      const supabase = createAdminClient();


      const { data: worker, error: workerError } = await supabase
        .from("workers")
        .select("tax_withholding_rate")
        .eq("id", workerId)
        .single();


      if (workerError) {
        console.error("Error fetching worker tax rate:", workerError);
        return new NextResponse("Worker lookup failed", { status: 500 });
      }


      const taxRate = Number(worker?.tax_withholding_rate ?? 0);
      const taxReserveAmount = Math.round(workerReceives * taxRate);
      const availableAmount = workerReceives - taxReserveAmount;


      // Look up active shift at tip time
      const { data: activeShift } = await supabase
        .from("work_shifts")
        .select("id, business_id")
        .eq("worker_id", workerId)
        .is("ended_at", null)
        .order("started_at", { ascending: false })
        .maybeSingle();

      const { data: insertedTx, error } = await supabase
        .from("transactions")
        .insert({
          worker_id: workerId,
          business_id: activeShift?.business_id ?? null,
          shift_id: activeShift?.id ?? null,
          tip_amount: tipAmount,
          fee_amount: thanklyFee,
          stripe_fee: stripeFee,
          worker_receives: workerReceives,
          tax_reserve_amount: taxReserveAmount,
          available_amount: availableAmount,
          customer_covered_fee: customerCoveredFee,
          stripe_payment_id: paymentIntentId,
          status: "completed",
        })
        .select("id")
        .single();


      if (error) {
        console.error("Error inserting transaction:", error);
        return new NextResponse("Database insert failed", { status: 500 });
      }

      // Affiliate commission accrual. Non-blocking — a failure here must never
      // fail the webhook, or Stripe will retry and duplicate the transaction.
      // Idempotent server-side via UNIQUE(transaction_id).
      if (insertedTx?.id) {
        try {
          await supabase.rpc("accrue_affiliate_commission", {
            p_transaction_id: insertedTx.id,
          });
        } catch (e) {
          console.error("Affiliate accrual failed (non-blocking):", e);
        }
      }


      console.log("Transaction inserted successfully");


      const {
        data: workerForNotification,
        error: workerNotificationError,
      } = await supabase
        .from("workers")
        .select("full_name, expo_push_token, notify_tips")
        .eq("id", workerId)
        .single();

      if (workerNotificationError) {
        console.error(
          "Unable to load worker for notification:",
          workerNotificationError
        );
      }

      if (workerForNotification?.expo_push_token && workerForNotification?.notify_tips !== false) {
        await sendPushNotification({
          expoPushToken: workerForNotification.expo_push_token,
          title: `💰 ${workerForNotification.full_name}, you just received a tip!`,
          body: `You received ${formatDollars(
            tipAmount
          )}. Your Safe-to-Spend balance has been updated.`,
          data: {
            screen: "activity",
            workerId,
          },
        });


        console.log("Push notification sent.");
      }
    }

    if (event.type === "account.updated") {
      const account = event.data.object as Stripe.Account;

      const supabase = createAdminClient();

      const stripeOnboarded =
        account.details_submitted &&
        account.charges_enabled &&
        account.payouts_enabled;

      const { error } = await supabase
        .from("workers")
        .update({
          stripe_onboarded: stripeOnboarded,
          stripe_charges_enabled: account.charges_enabled,
          stripe_payouts_enabled: account.payouts_enabled,
          stripe_details_submitted: account.details_submitted,
        })
        .eq("stripe_account_id", account.id);

      if (error) {
        console.error("Stripe account update failed:", error);

        return new NextResponse("Account update failed", {
          status: 500,
        });
      }

      console.log("Stripe onboarding status updated:", {
        accountId: account.id,
        stripeOnboarded,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        detailsSubmitted: account.details_submitted,
      });
      if (stripeOnboarded) {
        const { data: workerForNotification } = await supabase
          .from("workers")
          .select("expo_push_token, notify_account_updates")
          .eq("stripe_account_id", account.id)
          .single();

        if (workerForNotification?.expo_push_token && workerForNotification?.notify_account_updates !== false) {
          await sendPushNotification({
            expoPushToken: workerForNotification.expo_push_token,
            title: "✅ Bank account connected",
            body: "Your Stripe account is fully verified. You're ready to receive payouts.",
            data: { screen: "payouts" },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}

