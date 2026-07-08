// app/api/ensure-worker/route.ts
// Creates the signed-in user's worker row if it doesn't exist yet.
// Stripe is deferred — the row starts with stripe_onboarded: false and the
// worker can use their dashboard, profile, and QR code before ever connecting Stripe.
// Identity comes from the cookie session; the write uses the admin client so it
// never depends on client-side RLS timing.

import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST() {
  try {
    const authClient = await createServerClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const admin = createAdminClient();

    const { data: existing } = await admin
      .from("workers")
      .select("id, profile_slug")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ ok: true, slug: existing.profile_slug, created: false });
    }

    const email = user.email ?? "";
    const baseSlug =
      email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "worker";
    const generatedSlug = `${baseSlug}-${user.id.slice(0, 8)}`;

    const { data: created, error } = await admin
      .from("workers")
      .insert({
        auth_user_id: user.id,
        email,
        full_name: "",
        profile_slug: generatedSlug,
        bio: "Thank you for joining",
        stripe_onboarded: false,
      })
      .select("id, profile_slug")
      .single();

    if (error) {
      console.error("ensure-worker insert error:", error);
      return NextResponse.json({ error: "Could not create profile." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, slug: created.profile_slug, created: true });
  } catch (e) {
    console.error("ensure-worker error:", e);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}