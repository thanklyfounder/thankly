import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase-server";

export async function POST() {
  try {
    const supabase = await createServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { data: worker, error } = await supabase
      .from("workers")
      .select("stripe_account_id, stripe_onboarded")
      .eq("auth_user_id", user.id)
      .single();

    if (error || !worker?.stripe_account_id) {
      return NextResponse.json({ error: "Stripe account not found." }, { status: 404 });
    }

    if (!worker.stripe_onboarded) {
      return NextResponse.json({ error: "Finish Stripe setup first." }, { status: 400 });
    }

    const loginLink = await stripe.accounts.createLoginLink(worker.stripe_account_id);

    return NextResponse.json({ url: loginLink.url });
  } catch (e) {
    console.error("Stripe login link error:", e);
    return NextResponse.json({ error: "Unable to open Stripe dashboard." }, { status: 500 });
  }
}