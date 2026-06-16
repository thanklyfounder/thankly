import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase-server";

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

    const supabase = await createServerClient();

    const { data: worker, error: workerError } = await supabase
      .from("workers")
      .select("id, full_name, profile_slug, stripe_account_id, stripe_onboarded")
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
        { error: "Worker is not ready to receive payments" },
        { status: 400 }
      );
    }

    // FINAL FEE MODEL
    const stripeRate = 0.029;
    const thanklyRate = 0.04;
    const fixedFee = 30;

    let finalChargeAmount = amount;
    let stripeFee = 0;
    let thanklyFee = 0;
    let workerReceives = 0;

    if (coverFee) {
      // Correct approved formula:
      // (tip + $0.30) / (1 - 2.9% - 4%)
      finalChargeAmount = Math.ceil(
        (amount + fixedFee) / (1 - stripeRate - thanklyRate)
      );

      stripeFee = Math.round(finalChargeAmount * stripeRate) + fixedFee;

      // Reconciles rounding so worker receives exact selected tip
      thanklyFee = finalChargeAmount - stripeFee - amount;

      workerReceives = amount;
    } else {
      finalChargeAmount = amount;

      stripeFee = Math.round(amount * stripeRate) + fixedFee;
      thanklyFee = Math.round(amount * thanklyRate);

      workerReceives = amount - stripeFee - thanklyFee;
    }

    const applicationFeeAmount = stripeFee + thanklyFee;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

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
        metadata: {
          worker_id: worker.id,
          worker_name: worker.full_name,
          slug: worker.profile_slug,
          tip_amount: String(amount),
          final_charge_amount: String(finalChargeAmount),
          stripe_fee: String(stripeFee),
          thankly_fee: String(thanklyFee),
          worker_receives: String(workerReceives),
          customer_covered_fee: String(coverFee),
        },
      },

      metadata: {
        worker_id: worker.id,
        worker_name: worker.full_name,
        slug: worker.profile_slug,
        tip_amount: String(amount),
        final_charge_amount: String(finalChargeAmount),
        stripe_fee: String(stripeFee),
        thankly_fee: String(thanklyFee),
        worker_receives: String(workerReceives),
        customer_covered_fee: String(coverFee),
      },
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