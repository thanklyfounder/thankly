"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AppNav from "@/components/AppNav";
import PasswordInput from "@/components/PasswordInput";

type View = "select" | "worker_signup" | "business_signup" | "signin" | "check_email";

import { Suspense } from "react";

function AuthContent() {
  const router = useRouter();
  const [view, setView] = useState<View>("select");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    const intent = sessionStorage.getItem("authView");
    if (intent === "signin") {
      setView("signin");
      sessionStorage.removeItem("authView");
      return;
    }

    const role = new URLSearchParams(window.location.search).get("role");
    if (role === "business") {
      setView("business_signup");
    } else if (role === "worker") {
      setView("worker_signup");
    }
  }, []);
  // Shared
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [workerInfo, setWorkerInfo] = useState(false);
  const [businessInfo, setBusinessInfo] = useState(false);

  // Worker signup
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Business signup
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");

  async function handleWorkerSignup() {
    setError("");
    if (!fullName.trim()) return setError("Enter your full name.");
    if (!email.trim()) return setError("Enter your email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (!phone.trim()) return setError("Enter your phone number.");

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: "https://getthankly.com/auth/confirm?next=create",
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

  async function handleBusinessSignup() {
    setError("");
    if (!businessName.trim()) return setError("Enter your business name.");
    if (!ownerName.trim()) return setError("Enter your name.");
    if (!email.trim()) return setError("Enter your email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: ownerName.trim(), business_name: businessName.trim() },
        emailRedirectTo: "https://getthankly.com/auth/confirm?next=business",
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

  async function handleForgotPassword() {
    setError("");
    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: "https://getthankly.com/auth/reset-password" }
    );
    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setForgotSent(true);
  }

  async function handleSignIn() {
    setError("");
    if (!email.trim() || !password) return setError("Enter your email and password.");

    setLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError("Incorrect email or password. Please try again.");
        return;
      }

      // Business owners are identified by business_name in signup metadata.
      const isBusinessOwner = !!data.user.user_metadata?.business_name;

      if (isBusinessOwner) {
        const { data: business } = await supabase
          .from("businesses")
          .select("slug")
          .eq("owner_auth_user_id", data.user.id)
          .maybeSingle();

        // Has a business → their dashboard. Orphaned (confirmed but never
        // finished creating) → /business/create, which pre-fills their name.
        router.push(business?.slug ? `/business/${business.slug}` : "/business/create");
        return;
      }

      const { data: worker } = await supabase
        .from("workers")
        .select("profile_slug")
        .eq("auth_user_id", data.user.id)
        .maybeSingle();

      if (!worker?.profile_slug) {
        // Provision the worker row if missing (Stripe deferred). Covers accounts
        // created before deferral and any path that skipped ensure-worker.
        await fetch("/api/ensure-worker", { method: "POST" });
      }

      router.push("/manage");
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0f3f73]";
  const btnPrimary = "w-full rounded-2xl bg-[#0f3f73] py-3 text-white font-semibold text-sm hover:bg-[#0a2f5e] transition disabled:opacity-60";
  const btnSecondary = "w-full rounded-2xl border border-slate-200 py-3 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition";

  return (
    <>
    <AppNav variant="public" backLabel="← Back to home" backHref="/" />
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-3 sm:px-6 pt-4 pb-8">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-3 flex flex-col items-center">
          <img src="/images/app-icon-true.png" alt="Thankly" className="w-16 h-16 rounded-2xl mb-2 object-contain" />
          <h1 className="text-xl font-black text-[#0A1F44]">Thankly</h1>
          <p className="text-sm text-[#0A1F44]/75 mt-0.5">Your Tips. Your Money.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-900/10 p-4">

          {/* ── ROLE SELECTOR ── */}
          {view === "select" && (
            <>
              <h2 className="text-lg font-bold text-slate-900 text-center mb-1">Get started</h2>
              <p className="text-sm text-slate-500 text-center mb-6">Choose the account you want to create</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="relative">
                  <button
                    onClick={() => { setError(""); setView("worker_signup"); }}
                    className="w-full flex flex-col items-center gap-2 rounded-2xl border-2 border-slate-200 hover:border-[#0f3f73] hover:bg-[#f0f5ff] transition p-5"
                  >
                    <span className="text-3xl">👤</span>
                    <span className="font-bold text-slate-900 text-sm">Worker</span>
                    <span className="text-xs text-slate-500 text-center leading-tight">I receive tips</span>
                  </button>
                  <button
                    onClick={() => setWorkerInfo(w => !w)}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-100 text-slate-400 text-xs font-bold hover:bg-slate-200 flex items-center justify-center"
                  >i</button>
                  {workerInfo && (
                    <div className="absolute z-10 top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl text-xs text-slate-600 leading-relaxed">
                      A Worker account is for individuals who receive tips. You'll get a personal QR code, earnings dashboard, payouts to your bank, and a built-in Tax Pocket to set aside funds for tax season.
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => { setError(""); setView("business_signup"); }}
                    className="w-full flex flex-col items-center gap-2 rounded-2xl border-2 border-slate-200 hover:border-[#0f3f73] hover:bg-[#f0f5ff] transition p-5"
                  >
                    <span className="text-3xl">🏢</span>
                    <span className="font-bold text-slate-900 text-sm">Business</span>
                    <span className="text-xs text-slate-500 text-center leading-tight">I manage a team</span>
                  </button>
                  <button
                    onClick={() => setBusinessInfo(b => !b)}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-100 text-slate-400 text-xs font-bold hover:bg-slate-200 flex items-center justify-center"
                  >i</button>
                  {businessInfo && (
                    <div className="absolute z-10 top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl text-xs text-slate-600 leading-relaxed">
                      A Business account is for managers and owners who oversee a team of tipped workers. You'll get a team dashboard, combined earnings reports, and worker QR code management.
                    </div>
                  )}
                </div>
              </div>

              <div className="relative flex items-center mb-5">
                <div className="flex-1 border-t border-slate-200" />
                <span className="px-3 text-xs text-slate-400">or</span>
                <div className="flex-1 border-t border-slate-200" />
              </div>

              <button onClick={() => { setError(""); setView("signin"); }} className={btnSecondary}>
                Sign in to existing account
              </button>
            </>
          )}

          {/* ── WORKER SIGNUP ── */}
          {view === "worker_signup" && (
            <>
              <button onClick={() => { setError(""); setView("select"); }} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition">
                ← All options
              </button>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Worker Account</h2>
              <p className="text-sm text-slate-500 mb-5">For individuals who receive tips.</p>

              <div className="space-y-3">
                <input type="text" placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} />
                <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
                <PasswordInput placeholder="Password" value={password} onChange={setPassword} className={inputClass} />
                <input type="tel" placeholder="Phone number (e.g. 4075551234)" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} />
                <p className="text-xs text-slate-400 text-center">By continuing, you consent to receive a verification SMS. Standard message and data rates may apply.</p>
              </div>

              {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}

              <button onClick={handleWorkerSignup} disabled={loading} className={`${btnPrimary} mt-5`}>
                {loading ? "Creating account..." : "Create Worker Account"}
              </button>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Secure registration — your data is encrypted
              </p>
              <button onClick={() => { setError(""); setView("signin"); }} className="mt-3 w-full text-center text-sm text-slate-500 hover:text-slate-700">
                Already have an account? Sign in
              </button>
            </>
          )}

          {/* ── BUSINESS SIGNUP ── */}
          {view === "business_signup" && (
            <>
              <button onClick={() => { setError(""); setView("select"); }} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition">
                ← All options
              </button>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Business Account</h2>
              <p className="text-sm text-slate-500 mb-5">For managers and business owners.</p>

              <div className="space-y-3">
                <input type="text" placeholder="Business name" value={businessName} onChange={e => setBusinessName(e.target.value)} className={inputClass} />
                <input type="text" placeholder="Your name" value={ownerName} onChange={e => setOwnerName(e.target.value)} className={inputClass} />
                <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
                <PasswordInput placeholder="Password" value={password} onChange={setPassword} className={inputClass} />
              </div>

              {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}

              <button onClick={handleBusinessSignup} disabled={loading} className={`${btnPrimary} mt-5`}>
                {loading ? "Creating account..." : "Create Business Account"}
              </button>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Secure registration — your data is encrypted
              </p>
              <button onClick={() => { setError(""); setView("signin"); }} className="mt-3 w-full text-center text-sm text-slate-500 hover:text-slate-700">
                Already have an account? Sign in
              </button>
            </>
          )}

          {/* ── SIGN IN ── */}
          {view === "signin" && (
            <>
              <button onClick={() => { setError(""); setView("select"); }} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition">
                ← All options
              </button>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Welcome back</h2>
              <p className="text-sm text-slate-500 mb-5">Sign in to your Thankly account.</p>

              <div className="space-y-3">
                <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
                <PasswordInput placeholder="Password" value={password} onChange={setPassword} className={inputClass} />
              </div>

              {!showForgot && (
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => { setError(""); setForgotSent(false); setShowForgot(true); }}
                    className="text-xs text-[#0f3f73] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {showForgot && !forgotSent && (
                <div className="mt-3 rounded-2xl bg-[#f0f5ff] border border-[#0f3f73]/20 p-4">
                  <p className="text-sm text-slate-700 mb-2">Enter your email and we'll send you a reset link.</p>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={inputClass}
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={loading}
                      className="flex-1 rounded-2xl bg-[#0F4C81] py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {loading ? "Sending..." : "Send reset link"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setError(""); setShowForgot(false); }}
                      className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {showForgot && forgotSent && (
                <div className="mt-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
                  <p className="text-sm text-emerald-800">
                    Check your inbox — we've sent a password reset link to <strong>{email}</strong>. Open it in this same browser to reset your password.
                  </p>
                </div>
              )}

              {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}

              <button onClick={handleSignIn} disabled={loading} className={`${btnPrimary} mt-4`}>
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <button onClick={() => { setError(""); setView("select"); }} className="mt-3 w-full text-center text-sm text-slate-500 hover:text-slate-700">
                Don't have an account? Get started
              </button>
            </>
          )}

          {/* ── CHECK EMAIL ── */}
          {view === "check_email" && (
            <>
              <div className="text-center">
                <div className="text-5xl mb-4">📬</div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">Check your email</h2>
                <p className="text-sm text-slate-500 mb-2">A confirmation link has been sent to <strong>{email}</strong>.</p>
                <p className="text-sm text-slate-500">Tap the link to activate your account. If you don't see it, check your spam or junk folder.</p>
              </div>
              <button onClick={() => setView("signin")} className={`${btnSecondary} mt-6`}>
                Back to sign in
              </button>
            </>
          )}

        {/* Download the app — inside card */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 mb-3">Prefer the app? Download Thankly for free.</p>
            <div className="flex items-center justify-center gap-3">
              <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                App Store
              </a>
              <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.64.24.99.2l12.6-7.28-2.72-2.72-10.87 9.8zm-1.9-20.7C1.1 3.4 1 3.73 1 4.1v15.8c0 .37.1.7.28.99l.1.09 8.85-8.85v-.2L1.38 3.04l-.1.02zM20.1 10.8l-2.54-1.47-3.03 3.03 3.03 3.03 2.56-1.48c.73-.42.73-1.1 0-1.52v-.59zm-18.72 11.4l.09-.05 10.1-5.83-2.72-2.72-7.47 8.6z"/></svg>
                Google Play
              </a>
            </div>
          </div>
        </div>
      </div>    
    </main>
    </>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  );
}