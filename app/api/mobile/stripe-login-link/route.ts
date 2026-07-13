import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { authUserId } = await req.json();
    if (!authUserId) {
      return NextResponse.json({ error: "Missing authUserId." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: worker, error } = await supabase
      .from("workers")
      .select("stripe_account_id, stripe_onboarded")
      .eq("auth_user_id", authUserId)
      .single();

    if (error || !worker?.stripe_account_id) {
      return NextResponse.json({ error: "Stripe account not found." }, { status: 404 });
    }
    if (!worker.stripe_onboarded) {
      return NextResponse.json({ error: "Account not onboarded." }, { status: 400 });
    }

    const loginLink = await stripe.accounts.createLoginLink(worker.stripe_account_id);
    return NextResponse.json({ url: loginLink.url });
  } catch (e) {
    console.error("Mobile stripe login link error:", e);
    return NextResponse.json({ error: "Unable to open Stripe dashboard." }, { status: 500 });
  }
}