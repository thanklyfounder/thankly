import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const authUserId = body?.authUserId;
    const email = body?.email;
    const fullName = body?.fullName ?? "";

    if (!authUserId || !email) {
      return NextResponse.json(
        { error: "Missing auth user information." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    let { data: worker, error: workerError } = await supabase
      .from("workers")
      .select("*")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (workerError) {
      console.error("Worker lookup error:", workerError);
      return NextResponse.json(
        { error: "Unable to load worker profile." },
        { status: 500 }
      );
    }

    if (!worker) {
      const baseSlug =
        email
          .split("@")[0]
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || "worker";

      const generatedSlug = `${baseSlug}-${authUserId.slice(0, 8)}`;

      const { data: createdWorker, error: createWorkerError } = await supabase
        .from("workers")
        .insert({
          auth_user_id: authUserId,
          email,
          full_name: fullName,
          profile_slug: generatedSlug,
          bio: "Thank you for joining",
          stripe_onboarded: false,
        })
        .select("*")
        .single();

      if (createWorkerError) {
        console.error("Worker create error:", createWorkerError);
        return NextResponse.json(
          { error: "Unable to create worker profile." },
          { status: 500 }
        );
      }

      worker = createdWorker;
    }

    let stripeAccountId = worker.stripe_account_id;

    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          worker_id: worker.id,
          auth_user_id: authUserId,
        },
      });

      stripeAccountId = account.id;

      const { data: updatedWorker, error: updateError } = await supabase
        .from("workers")
        .update({
          stripe_account_id: stripeAccountId,
          stripe_onboarded: false,
        })
        .eq("id", worker.id)
        .select("*")
        .single();

      if (updateError) {
        console.error("Stripe account save error:", updateError);
        return NextResponse.json(
          { error: "Unable to save Stripe account." },
          { status: 500 }
        );
      }

      worker = updatedWorker;

      console.log("Stripe account saved to worker:", {
        workerId: worker.id,
        stripeAccountId,
      });
    }

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: "http://192.168.1.125:3000/stripe-return",
      return_url: "http://192.168.1.125:3000/stripe-return",
      type: "account_onboarding",
    });

    return NextResponse.json({
      url: accountLink.url,
      stripeAccountId,
    });
  } catch (error) {
    console.error("Mobile create account link error:", error);

    return NextResponse.json(
      { error: "Unable to create mobile onboarding link." },
      { status: 500 }
    );
  }
}
