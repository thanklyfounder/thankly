// app/api/affiliates/validate-invite/route.ts
// Read-only pre-check so /affiliates/join can gate the signup form.
// Does NOT consume the invite — consumption happens in /api/affiliates/ensure
// after email confirmation. Holding the token is the credential, so returning
// the locked email (for pre-fill) leaks nothing.

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    let token = "";
    try {
      const body = await req.json();
      if (typeof body?.invite === "string") token = body.invite.trim();
    } catch {
      // no body
    }

    if (!token) {
      return NextResponse.json({ valid: false, reason: "invite_required" });
    }

    const admin = createAdminClient();

    const { data: invite } = await admin
      .from("affiliate_invites")
      .select("invited_email, expires_at, used_at")
      .eq("token", token)
      .maybeSingle();

    if (!invite) {
      return NextResponse.json({ valid: false, reason: "invite_invalid" });
    }
    if (invite.used_at) {
      return NextResponse.json({ valid: false, reason: "invite_used" });
    }
    if (new Date(invite.expires_at) <= new Date()) {
      return NextResponse.json({ valid: false, reason: "invite_expired" });
    }

    return NextResponse.json({
      valid: true,
      invitedEmail: invite.invited_email ?? null,
    });
  } catch (e) {
    console.error("validate-invite error:", e);
    return NextResponse.json({ valid: false, reason: "error" }, { status: 500 });
  }
}
