// app/affiliates/join/page.tsx
// Invite-only affiliate signup. Validates ?invite= up front via
// /api/affiliates/validate-invite; a dead token never renders the form.
// Signup metadata carries { affiliate: true, affiliate_invite: token } so the
// confirm page can branch and /api/affiliates/ensure can consume the invite.

"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AppNav from "@/components/AppNav";
import PasswordInput from "@/components/PasswordInput";

type Gate = "checking" | "valid" | "invalid";
type View = "form" | "check_email";

const REASON_COPY: Record<string, string> = {
  invite_invalid: "This invite link isn't valid. Check that you copied the full link.",
  invite_used: "This invite has already been used.",
  invite_expired: "This invite has expired. Ask for a new one.",
  invite_required: "This page requires an invite link.",
  error: "Something went wrong checking your invite. Please try again.",
};

function JoinContent() {
  const searchParams = useSearchParams();
  const invite = (searchParams.get("invite") ?? "").trim();

  const [gate, setGate] = useState<Gate>("checking");
  const [gateReason, setGateReason] = useState("invite_required");
  const [view, setView] = useState<View>("form");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailLocked, setEmailLocked] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (!invite) {
        setGate("invalid");
        setGateReason("invite_required");
        return;
      }
      try {
        const res = await fetch("/api/affiliates/validate-invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invite }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (data.valid) {
          if (data.invitedEmail) {
            setEmail(data.invitedEmail);
            setEmailLocked(true);
          }
          setGate("valid");
        } else {
          setGate("invalid");
          setGateReason(data.reason ?? "invite_invalid");
        }
      } catch {
        if (!cancelled) {
          setGate("invalid");
          setGateReason("error");
        }
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [invite]);

  async function handleSignup() {
    setError("");
    if (!fullName.trim()) return setError("Enter your name.");
    if (!email.trim()) return setError("Enter your email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          affiliate: true,
          affiliate_invite: invite,
        },
        emailRedirectTo: "https://getthankly.com/auth/confirm?next=affiliate",
      },
    });
    setLoading(false);

    if (signUpError) {
      const msg = signUpError.message.toLowerCase().includes("already")
        ? "An account with this email already exists. Try signing in instead."
        : signUpError.message;
      setError(msg);
      return;
    }

    setView("check_email");
  }

  const inputClass =
    "w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0f3f73]";
  const btnPrimary =
    "w-full rounded-2xl bg-[#0f3f73] py-3 text-white font-semibold text-sm hover:bg-[#0a2f5e] transition disabled:opacity-60";

  return (
    <>
      <AppNav variant="public" backLabel="← Back to home" backHref="/" />
      <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-3 sm:px-6 pt-4 pb-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-3 flex flex-col items-center">
            <img
              src="/images/app-icon-true.png"
              alt="Thankly"
              className="w-16 h-16 rounded-2xl mb-2 object-contain"
            />
            <h1 className="text-xl font-black text-[#0A1F44]">Thankly Affiliates</h1>
            <p className="text-sm text-[#0A1F44]/75 mt-0.5">
              Help your community discover Thankly.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl">
            {gate === "checking" && (
              <p className="text-center text-sm text-slate-500 py-8">
                Checking your invite…
              </p>
            )}

            {gate === "invalid" && (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🔒</div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">
                  Invite required
                </h2>
                <p className="text-sm text-slate-600">
                  {REASON_COPY[gateReason] ?? REASON_COPY.invite_invalid}
                </p>
              </div>
            )}

            {gate === "valid" && view === "check_email" && (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">📬</div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">
                  Check your email
                </h2>
                <p className="text-sm text-slate-600">
                  We sent a confirmation link to <strong>{email}</strong>. Open
                  it to activate your affiliate account.
                </p>
              </div>
            )}

            {gate === "valid" && view === "form" && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900">
                  Create your affiliate account
                </h2>
                <input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  readOnly={emailLocked}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputClass} ${emailLocked ? "bg-slate-50 text-slate-500" : ""}`}
                />
                {emailLocked && (
                  <p className="text-xs text-slate-500 -mt-1">
                    This invite is tied to this email address.
                  </p>
                )}
                <PasswordInput
                  placeholder="Password (8+ characters)"
                  value={password}
                  onChange={setPassword}
                  className={inputClass}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button onClick={handleSignup} disabled={loading} className={btnPrimary}>
                  {loading ? "Creating account…" : "Create account →"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default function AffiliateJoinPage() {
  return (
    <Suspense>
      <JoinContent />
    </Suspense>
  );
}
