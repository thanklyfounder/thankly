// app/api/create-payment/route.ts
// Change: added avatar_url to both metadata blocks so success page can show worker photo.
// Everything else is unchanged from original.

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = body?.slug;
    const amount = Number(body?.amount);
    const coverFee = Boolean(body?.coverFee);

    if (!slug || !amount) {
      return NextResponse.json(
        { error: "Missing slug or amount" },
        { status: 400 }
      );
    }

    const minimumAmount = 500; // $5 minimum
    const maximumAmount = 50000; // $500 safety cap for now

    if (amount < minimumAmount) {
      return NextResponse.json(
        { error: "Minimum tip is $5.00" },
        { status: 400 }
      );
    }

    if (amount > maximumAmount) {
      return NextResponse.json(
        { error: "Maximum tip is $500.00" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: worker, error: workerError } = await supabase
      .from("workers")
      .select("id, full_name, profile_slug, stripe_account_id, stripe_onboarded, avatar_url")
      .eq("profile_slug", slug)
      .single();

    if (workerError || !worker) {
      return NextResponse.json(
        { error: "Worker not found" },
        { status: 404 }
      );
    }

    if (!worker.stripe_account_id || !worker.stripe_onboarded) {
      return NextResponse.json(
        { error: "Worker Stripe account not ready" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

    // Fee calculations (unchanged from original)
    const thanklyFeeRate = 0.04;
    const stripeFixedFee = 30;
    const stripePercentFee = 0.029;

    let finalChargeAmount: number;
    let stripeFee: number;
    let thanklyFee: number;
    let workerReceives: number;
    let applicationFeeAmount: number;

    if (coverFee) {
      // Customer covers all fees — worker receives full tip amount
      const grossWithFees = Math.ceil(
        (amount + stripeFixedFee) / (1 - stripePercentFee - thanklyFeeRate)
      );
      finalChargeAmount = grossWithFees;
      stripeFee = Math.round(grossWithFees * stripePercentFee + stripeFixedFee);
      thanklyFee = Math.round(grossWithFees * thanklyFeeRate);
      workerReceives = amount;
      applicationFeeAmount = thanklyFee + stripeFee;
    } else {
      // Worker absorbs fees
      finalChargeAmount = amount;
      stripeFee = Math.round(amount * stripePercentFee + stripeFixedFee);
      thanklyFee = Math.round(amount * thanklyFeeRate);
      workerReceives = amount - thanklyFee - stripeFee;
      applicationFeeAmount = thanklyFee + stripeFee;
    }

    const sharedMetadata = {
      worker_id: worker.id,
      worker_name: worker.full_name ?? "",
      avatar_url: worker.avatar_url ?? "",   // NEW — used by success page for worker photo
      slug: worker.profile_slug,
      tip_amount: String(amount),
      final_charge_amount: String(finalChargeAmount),
      stripe_fee: String(stripeFee),
      thankly_fee: String(thanklyFee),
      worker_receives: String(workerReceives),
      customer_covered_fee: String(coverFee),
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Tip for ${worker.full_name}`,
            },
            unit_amount: finalChargeAmount,
          },
          quantity: 1,
        },
      ],

      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${worker.profile_slug}?canceled=true`,

      payment_intent_data: {
        transfer_data: {
          destination: worker.stripe_account_id,
        },
        application_fee_amount: applicationFeeAmount,
        metadata: sharedMetadata,
      },

      metadata: sharedMetadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { error: "Unable to create payment" },
      { status: 500 }
    );
  }
}
