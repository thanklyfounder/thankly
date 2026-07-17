import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-admin";

const VALID = ["daily", "weekly", "manual"] as const;
type Pref = (typeof VALID)[number];

function buildSchedule(pref: Pref, weeklyAnchor: string) {
  switch (pref) {
    case "daily":
      return { interval: "daily" as const };
    case "weekly":
      return { interval: "weekly" as const, weekly_anchor: weeklyAnchor };
    case "manual":
      return { interval: "manual" as const };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { authUserId, preference, weeklyAnchor } = await req.json();

    if (!authUserId || !VALID.includes(preference)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const anchor = weeklyAnchor || "friday";

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
      return NextResponse.json({ error: "Finish Stripe setup first." }, { status: 400 });
    }

    // Update the payout schedule on the connected account.
    await stripe.accounts.update(worker.stripe_account_id, {
      settings: {
        payouts: {
          schedule: buildSchedule(preference as Pref, anchor),
        },
      },
    });

    // Persist the preference so the UI reflects it.
    const { error: updateError } = await supabase
      .from("workers")
      .update({
        payout_preference: preference,
        weekly_anchor: preference === "weekly" ? anchor : null,
      })
      .eq("auth_user_id", authUserId);

    if (updateError) {
      return NextResponse.json({ error: "Saved to Stripe but failed to record preference." }, { status: 500 });
    }

    return NextResponse.json({ success: true, preference, weeklyAnchor: anchor });
  } catch (e) {
    console.error("Update payout schedule error:", e);
    return NextResponse.json({ error: "Unable to update payout schedule." }, { status: 500 });
  }
}