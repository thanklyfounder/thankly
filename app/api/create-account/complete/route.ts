import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  try {
    console.log("HIT COMPLETE ROUTE:", req.url);

    const { searchParams } = new URL(req.url);

    const accountId = searchParams.get("account");
    const authUserId = searchParams.get("authUserId");
    const email = searchParams.get("email") ?? "";
    const fullName = searchParams.get("fullName") ?? "Thankly User";
    const slug = searchParams.get("slug") ?? "user";

    if (!accountId) {
      return NextResponse.redirect(
        new URL("/create?error=missing_account", req.url)
      );
    }

    if (!authUserId) {
      return NextResponse.redirect(
        new URL("/create?error=missing_auth_user_id", req.url)
      );
    }

    const supabase = createAdminClient();

    const account = await stripe.accounts.retrieve(accountId);

    const stripeOnboarded =
      !!account.details_submitted &&
      !!account.charges_enabled &&
      !!account.payouts_enabled;

    const { data: existingWorker, error: workerLookupError } = await supabase
      .from("workers")
      .select("id")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (workerLookupError) {
      console.error("Error checking worker:", workerLookupError);
      return NextResponse.redirect(
        new URL("/create?error=worker_lookup_failed", req.url)
      );
    }

    if (!existingWorker) {
      const { error: insertError } = await supabase.from("workers").insert({
        auth_user_id: authUserId,
        full_name: fullName,
        email,
        profile_slug: slug,
        stripe_account_id: account.id,
        stripe_onboarded: stripeOnboarded,
      });

      if (insertError) {
        console.error("Error creating worker:", insertError);
        return NextResponse.redirect(
          new URL("/create?error=worker_insert_failed", req.url)
        );
      }
    } else {
      const { error: updateError } = await supabase
        .from("workers")
        .update({
          full_name: fullName,
          email,
          profile_slug: slug,
          stripe_account_id: account.id,
          stripe_onboarded: stripeOnboarded,
        })
        .eq("auth_user_id", authUserId);

      if (updateError) {
        console.error("Error updating worker:", updateError);
        return NextResponse.redirect(
          new URL("/create?error=worker_update_failed", req.url)
        );
      }
    }

    return NextResponse.redirect(new URL("/manage", req.url));
  } catch (error) {
    console.error("Stripe onboarding complete route error:", error);
    return NextResponse.redirect(
      new URL("/create?error=unexpected", req.url)
    );
  }
}