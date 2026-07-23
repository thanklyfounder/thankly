import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

/**
 * Provisions an affiliate record for the signed-in user.
 *
 * Mirrors ensure-worker: idempotent, safe to call on every dashboard load.
 * Generates a unique referral code on first call.
 *
 * Affiliates are external — they do NOT get a worker record, and they do not
 * need one. Stripe Connect onboarding happens later, only when they have
 * earnings to claim.
 */

// Unambiguous alphabet: no O/0, I/1, S/5 — these get misread when shared verbally.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRTUVWXYZ2346789";

function generateCode(length = 7): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return out;
}

async function releaseInvite(
  admin: ReturnType<typeof createAdminClient>,
  inviteId: string
) {
  await admin
    .from("affiliate_invites")
    .update({ used_at: null, used_by_auth_user_id: null })
    .eq("id", inviteId);
}

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

    // Already provisioned?
    const { data: existing } = await admin
      .from("affiliates")
      .select("id, referral_code, status, stripe_onboarded")
      .eq("email", user.email ?? "")
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        ok: true,
        created: false,
        referralCode: existing.referral_code,
        status: existing.status,
        stripeOnboarded: existing.stripe_onboarded,
      });
    }

    // ── Invite gate ─────────────────────────────────────────────────────────
    // Affiliates are invite-only. The token rides in signup metadata
    // (affiliate_invite) and is validated + consumed here, after email
    // confirmation — abandoned signups never burn an invite, and direct
    // signUp calls with affiliate metadata still can't get in.
    const token = ((user.user_metadata?.affiliate_invite as string) ?? "").trim();
    if (!token) {
      return NextResponse.json({ error: "invite_required" }, { status: 403 });
    }

    const { data: invite } = await admin
      .from("affiliate_invites")
      .select("id, invited_email, expires_at, used_at")
      .eq("token", token)
      .maybeSingle();

    if (!invite) {
      return NextResponse.json({ error: "invite_invalid" }, { status: 403 });
    }
    if (invite.used_at) {
      return NextResponse.json({ error: "invite_used" }, { status: 403 });
    }
    if (new Date(invite.expires_at) <= new Date()) {
      return NextResponse.json({ error: "invite_expired" }, { status: 403 });
    }
    if (
      invite.invited_email &&
      invite.invited_email.toLowerCase() !== (user.email ?? "").toLowerCase()
    ) {
      return NextResponse.json({ error: "invite_email_mismatch" }, { status: 403 });
    }

    // Consume atomically — the used_at IS NULL guard prevents double-use.
    const { data: consumed } = await admin
      .from("affiliate_invites")
      .update({ used_at: new Date().toISOString(), used_by_auth_user_id: user.id })
      .eq("id", invite.id)
      .is("used_at", null)
      .select("id");

    if (!consumed || consumed.length === 0) {
      return NextResponse.json({ error: "invite_used" }, { status: 403 });
    }

    // Generate a unique code. Collisions are vanishingly rare at this alphabet
    // and length, but retry a few times rather than fail the signup.
    let referralCode = "";
    let inserted = null;

    for (let attempt = 0; attempt < 5; attempt++) {
      referralCode = generateCode();

      const { data, error } = await admin
        .from("affiliates")
        .insert({
          email: user.email ?? "",
          full_name: (user.user_metadata?.full_name as string) ?? null,
          auth_user_id: user.id,
          referral_code: referralCode,
          status: "active",
        })
        .select("id, referral_code, status, stripe_onboarded")
        .single();

      if (!error) {
        inserted = data;
        break;
      }

      // 23505 = unique violation. If it's the code, retry; otherwise bail.
      if (error.code !== "23505") {
        console.error("ensure-affiliate insert error:", error);
        await releaseInvite(admin, invite.id);
        return NextResponse.json({ error: "Could not create affiliate." }, { status: 500 });
      }
      if (!error.message?.includes("referral_code")) {
        // Unique violation on email — someone raced us. Read the existing row.
        const { data: raced } = await admin
          .from("affiliates")
          .select("id, referral_code, status, stripe_onboarded")
          .eq("email", user.email ?? "")
          .maybeSingle();

        await releaseInvite(admin, invite.id);
        if (raced) {
          return NextResponse.json({
            ok: true,
            created: false,
            referralCode: raced.referral_code,
            status: raced.status,
            stripeOnboarded: raced.stripe_onboarded,
          });
        }
        return NextResponse.json({ error: "Could not create affiliate." }, { status: 500 });
      }
    }

    if (!inserted) {
      await releaseInvite(admin, invite.id);
      return NextResponse.json({ error: "Could not generate a referral code." }, { status: 500 });
    }

    // Audit trail: link the consumed invite to the affiliate it created.
    await admin
      .from("affiliate_invites")
      .update({ affiliate_id: inserted.id })
      .eq("id", invite.id);

    return NextResponse.json({
      ok: true,
      created: true,
      referralCode: inserted.referral_code,
      status: inserted.status,
      stripeOnboarded: inserted.stripe_onboarded,
    });
  } catch (e) {
    console.error("ensure-affiliate error:", e);
    return NextResponse.json({ error: "Unexpected error." }, { status: 500 });
  }
}
