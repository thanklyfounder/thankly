"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verifyResetLink() {
      // If a session already exists (e.g. PASSWORD_RECOVERY already fired), proceed.
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (!cancelled) setReady(true);
        return;
      }

      // PKCE flow: exchange the ?code= in the URL for a recovery session.
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!cancelled) {
          if (error) {
            // Re-check in case the client auto-consumed the code.
            const { data: { session: retry } } = await supabase.auth.getSession();
            if (retry) {
              setReady(true);
            } else {
              setMessage("This reset link is invalid or has expired. Please request a new one.");
            }
          } else {
            setReady(true);
          }
        }
        return;
      }

      // No session and no code — nothing to verify.
      if (!cancelled) {
        setMessage("This reset link is invalid or has expired. Please request a new one.");
      }
    }

    // Keep listening too, in case the event fires independently.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" && !cancelled) setReady(true);
    });

    verifyResetLink();

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleReset() {
    if (!password || password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    // Verify we actually hold a recovery session before attempting the update.
    // Without this, a failed PKCE exchange lets updateUser no-op while still
    // reporting success — the password silently doesn't change.
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      setMessage("Your reset session has expired or is invalid. Please request a new reset link and open it in the same browser.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password updated successfully. Redirecting...");
    setTimeout(() => router.push("/auth"), 2000);
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-3xl bg-white shadow-xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4" style={{background: "linear-gradient(135deg, #1b5a96, #0f3f73)"}} />
          <p className="text-slate-700 text-sm">{message || "Verifying your reset link..."}</p>
        </div>
      </main>
    );
  }

  return (
    <>
    <AppNav variant="public" backLabel="← Back to home" backHref="/" />
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-xl overflow-hidden">
        <div className="p-8 text-center" style={{background: "linear-gradient(135deg, #1b5a96, #0f3f73)"}}>
          <h1 className="text-white text-2xl font-black tracking-wide">Thankly</h1>
          <p className="text-blue-200 text-sm mt-1">Worker Finance Platform</p>
        </div>
        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Set new password</h2>
          <p className="text-slate-700 text-sm mb-6">Choose a strong password for your Thankly account.</p>

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 mb-3"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 mb-4"
          />

          {message && (
            <p className="text-sm text-center text-slate-600 mb-4">{message}</p>
          )}

          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full rounded-2xl py-3 text-white font-bold text-sm disabled:opacity-60"
            style={{background: "#0F4C81"}}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </main>
    </>
  );
}