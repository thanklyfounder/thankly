import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SMS Consent & Opt-In Flow — Thankly",
  description: "Thankly SMS consent documentation and opt-in flow for A2P 10DLC compliance.",
};

export default function SmsConsentPage() {
  return (
    <>
      <nav className="bg-[#0F2347] h-16 flex items-center justify-between px-[5%]">
        <Link href="/" className="text-white font-black text-xl tracking-tight">
          Thankly
        </Link>
        <Link href="/" className="text-white/65 text-sm font-medium hover:text-white transition-colors">
          ← Back to home
        </Link>
      </nav>

      <div className="bg-gradient-to-br from-[#0F2347] to-[#1B3A6B] px-[5%] pt-14 pb-12 text-white">
        <div className="max-w-[860px] mx-auto">
          <p className="text-[#00B4D8] text-xs font-bold tracking-widest uppercase mb-3">
            A2P 10DLC Compliance — SMS Consent Documentation
          </p>
          <h1 className="text-4xl font-black tracking-tight mb-3">SMS Opt-In Flow</h1>
          <div className="flex flex-wrap gap-5 text-white/55 text-sm">
            <span>Thankly LLC — getthankly.com</span>
            <span>Twilio Number: +1 (407) 759-7255</span>
            <span>Use Case: Two-Factor Authentication (2FA)</span>
          </div>
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-[5%] pt-14 pb-20">

        {/* Summary box */}
        <div className="bg-[#F0F6FF] border-l-4 border-[#00B4D8] rounded-r-xl px-6 py-5 mb-12 text-[#4A5568] text-[0.95rem] leading-relaxed">
          Thankly sends a one-time SMS verification code (OTP) during account registration. Users provide explicit, active consent before any SMS is sent. This page documents the complete opt-in flow for carrier review.
        </div>

        {/* Step by step flow */}
        <h2 className="text-2xl font-black text-slate-900 mb-8">Complete Opt-In Flow</h2>

        <div className="space-y-10">

          {/* Step 1 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0F2347] text-white flex items-center justify-center font-black text-sm">1</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-1">User visits getthankly.com/auth or downloads the Thankly app</h3>
              <p className="text-slate-500 text-sm">Available on iOS (App Store) and Android (Google Play), or via web browser at getthankly.com/auth.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0F2347] text-white flex items-center justify-center font-black text-sm">2</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-1">User selects "Worker" account type</h3>
              <p className="text-slate-500 text-sm">The registration flow presents a role selector. The Worker path leads to the SMS opt-in form.</p>
            </div>
          </div>

          {/* Step 3 — the key step with mock UI */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0F2347] text-white flex items-center justify-center font-black text-sm">3</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">User enters phone number — consent disclosure shown</h3>
              <p className="text-slate-500 text-sm mb-6">Below the phone number field, before the submit button, the following disclosure is displayed. The user must actively tap "Create Account" to proceed — consent is never pre-checked or assumed.</p>

              {/* Mock UI of the signup form */}
              <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm border border-slate-200">
                <div className="bg-[#0F4C81] rounded-2xl h-24 flex items-center justify-center mb-6">
                  <span className="text-white font-black text-2xl tracking-tight">Thankly</span>
                </div>

                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Worker Account</p>
                <h3 className="text-lg font-black text-slate-900 mb-4">Create your account</h3>

                <div className="space-y-3 mb-4">
                  <div className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-400">Full name</div>
                  <div className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-400">Email address</div>
                  <div className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-400">Password (min 8 characters)</div>
                  <div className="rounded-2xl border border-[#0F4C81] bg-[#f0f5ff] px-4 py-3 text-sm text-slate-700 font-medium">Phone number (e.g. 4075551234)</div>
                </div>

                {/* The consent disclosure — highlighted */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
                  <p className="text-xs text-amber-800 text-center leading-relaxed font-medium">
                    By continuing, you consent to receive a verification SMS. Standard message and data rates may apply.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#0F4C81] py-3 text-white font-bold text-sm text-center">
                  Create Worker Account
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">↑ Exact UI shown to users at getthankly.com/auth and in the Thankly mobile app during account registration.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0F2347] text-white flex items-center justify-center font-black text-sm">4</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-1">User taps "Create Account" — active consent confirmed</h3>
              <p className="text-slate-500 text-sm">Tapping the button constitutes explicit, active opt-in consent. Consent is never pre-checked. Users cannot proceed without actively tapping the button.</p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0F2347] text-white flex items-center justify-center font-black text-sm">5</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Thankly sends a one-time 6-digit SMS verification code</h3>
              <p className="text-slate-500 text-sm mb-3">A single OTP is sent to the number provided. No marketing messages are sent. Example message:</p>
              <div className="bg-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-700 font-mono border border-slate-200">
                Your Thankly verification code is: <strong>847291</strong>. Do not share this code with anyone.
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0F2347] text-white flex items-center justify-center font-black text-sm">6</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-1">User enters the 6-digit code to verify their phone number</h3>
              <p className="text-slate-500 text-sm">One-time use only. No further SMS messages are sent after verification is complete.</p>
            </div>
          </div>

        </div>

        {/* Compliance summary */}
        <div className="mt-16 rounded-3xl bg-[#0F2347] p-8 text-white">
          <h2 className="text-xl font-black mb-6">Compliance Summary</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Message type", "One-time passcode (OTP) / 2FA only"],
              ["Opt-in method", "Active — user taps 'Create Account'"],
              ["Pre-checked consent", "No — never pre-checked or assumed"],
              ["Consent disclosure", "Displayed inline above submit button"],
              ["Message frequency", "One message per verification attempt"],
              ["Opt-out", "Reply STOP to unsubscribe at any time"],
              ["Help", "Reply HELP for support information"],
              ["Privacy Policy", "getthankly.com/privacy"],
              ["Terms of Service", "getthankly.com/terms"],
              ["Sending number", "+1 (407) 759-7255"],
            ].map(([label, value]) => (
              <div key={label} className="bg-white/10 rounded-2xl px-5 py-4">
                <p className="text-white/55 text-xs uppercase tracking-widest mb-1">{label}</p>
                <p className="text-white text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-400 text-center">
          Questions? Contact <a href="mailto:admin@getthankly.com" className="text-[#0F4C81] hover:underline">admin@getthankly.com</a>
        </p>

      </div>

      <footer className="bg-[#0F2347] py-10 px-[5%] text-center">
        <div className="flex flex-wrap gap-5 justify-center mb-4">
          {[
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/terms", label: "Terms of Service" },
            { href: "/disclosures", label: "Disclosures" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="text-white/65 text-sm hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-white/40 text-xs">© 2026 Thankly LLC. All rights reserved. Orlando, Florida.</p>
      </footer>
    </>
  );
}