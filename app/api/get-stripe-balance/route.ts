import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-admin";

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

    const balance = await stripe.balance.retrieve(
      undefined,
      {
        stripeAccount: worker.stripe_account_id,
      }
    );

    return NextResponse.json({
      available: balance.available,
      pending: balance.pending,
    });
  } catch (error) {
    console.error("Stripe balance fetch error:", error);

    return NextResponse.json(
      { error: "Unable to fetch Stripe balance." },
      { status: 500 }
    );
  }
}
