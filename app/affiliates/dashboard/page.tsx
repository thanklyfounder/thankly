// app/affiliates/dashboard/page.tsx
// Affiliate dashboard. Data comes from GET /api/affiliates/summary, which also
// syncs Stripe onboarding status on load. Stripe button calls
// /api/affiliates/stripe-link and follows whatever mode comes back
// (onboarding vs. Express dashboard login link).
// A 404 from summary means no affiliate row → back to /affiliates/join, whose
// gate screen explains why.

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AppNav from "@/components/AppNav";

type Referral = {
  id: string;
  status: string;
  referredAt: string | null;
  activatedAt: string | null;
  earningEndsAt: string | null;
  displayName: string;
};

type Payout = {
  id: string;
  period_start: string;
  period_end: string;
  amount_cents: number;
  status: string;
  paid_at: string | null;
};

type Summary = {
  referralCode: string;
  status: string;
  shareRate: number;
  earningWindowMonths: number;
  stripeOnboarded: boolean;
  hasStripeAccount: boolean;
  totals: {
    activeReferrals: number;
    pendingReferrals: number;
    unpaidCents: number;
    lifetimeCents: number;
  };
  referrals: Referral[];
  payouts: Payout[];
};

function dollars(cents: number) {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function shortDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AffiliateDashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      // Provision on first load. Idempotent and invite-gated — mirrors
      // ensure-worker. Required because the confirm page's auto-provision only
      // runs when the session survives the email round trip; users who land
      // here via sign-in instead would otherwise never get an affiliate row.
      await fetch("/api/affiliates/ensure", { method: "POST" });

      const res = await fetch("/api/affiliates/summary");
      if (cancelled) return;

      if (res.status === 404) {
        router.push("/affiliates/join");
        return;
      }
      if (!res.ok) {
        setError("Could not load your dashboard. Please refresh.");
        setLoading(false);
        return;
      }

      setSummary(await res.json());
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const referralLink = summary
    ? `https://getthankly.com/auth?ref=${summary.referralCode}`
    : "";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — user can select the text manually
    }
  }

  async function handleStripe() {
    setStripeLoading(true);
    setError("");
    try {
      const res = await fetch("/api/affiliates/stripe-link", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error ?? "Could not open Stripe. Please try again.");
    } catch {
      setError("Could not open Stripe. Please try again.");
    }
    setStripeLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-500">Loading your dashboard…</p>
      </main>
    );
  }

  if (!summary) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-500">{error || "Something went wrong."}</p>
      </main>
    );
  }

  const sharePct = (summary.shareRate * 100).toFixed(0);

  return (
    <>
      <AppNav variant="public" backLabel="← Thankly home" backHref="/" />
      <main className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#0A1F44]">
                Affiliate Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                You earn {sharePct}% of Thankly&apos;s platform fee from each
                activated referral for {summary.earningWindowMonths} months.
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm font-semibold text-slate-500 hover:text-slate-700"
            >
              Sign out
            </button>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Referral link */}
          <section className="rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">
              Your referral link
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Workers who sign up through this link are attributed to you.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                readOnly
                value={referralLink}
                onFocus={(e) => e.target.select()}
                className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              />
              <button
                onClick={handleCopy}
                className="rounded-2xl bg-[#0f3f73] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a2f5e] transition"
              >
                {copied ? "Copied ✓" : "Copy link"}
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Your code: <span className="font-mono font-semibold text-slate-600">{summary.referralCode}</span>
            </p>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-3xl bg-white p-5 shadow-xl">
              <p className="text-xs uppercase tracking-wide text-slate-500">Active referrals</p>
              <p className="mt-1 text-2xl font-black text-slate-900">{summary.totals.activeReferrals}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-xl">
              <p className="text-xs uppercase tracking-wide text-slate-500">Pending</p>
              <p className="mt-1 text-2xl font-black text-slate-900">{summary.totals.pendingReferrals}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-xl">
              <p className="text-xs uppercase tracking-wide text-slate-500">Unpaid</p>
              <p className="mt-1 text-2xl font-black text-slate-900">{dollars(summary.totals.unpaidCents)}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-xl">
              <p className="text-xs uppercase tracking-wide text-slate-500">Lifetime</p>
              <p className="mt-1 text-2xl font-black text-slate-900">{dollars(summary.totals.lifetimeCents)}</p>
            </div>
          </section>

          {/* Stripe */}
          <section className="rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Payouts</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {summary.stripeOnboarded
                    ? "Stripe is connected. Payouts run monthly on balances of $25 or more."
                    : "Connect Stripe to receive payouts. Commission accrues either way — it just can't be paid out until this is done."}
                </p>
              </div>
              <button
                onClick={handleStripe}
                disabled={stripeLoading}
                className={`shrink-0 rounded-2xl px-6 py-3 text-sm font-semibold transition disabled:opacity-60 ${
                  summary.stripeOnboarded
                    ? "border border-slate-200 text-slate-700 hover:bg-slate-50"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {stripeLoading
                  ? "Opening…"
                  : summary.stripeOnboarded
                  ? "Open Stripe dashboard"
                  : "Connect Stripe →"}
              </button>
            </div>
          </section>

          {/* Referrals */}
          <section className="rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">Referrals</h2>
            {summary.referrals.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                No referrals yet. Share your link to get started.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full min-w-[480px] text-sm">
                  <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Worker</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Referred</th>
                      <th className="px-4 py-3 font-semibold">Earning until</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.referrals.map((r) => (
                      <tr key={r.id} className="border-b border-slate-100 bg-white even:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">{r.displayName}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              r.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : r.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{shortDate(r.referredAt)}</td>
                        <td className="px-4 py-3 text-slate-600">{shortDate(r.earningEndsAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Payout history */}
          <section className="rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">Payout history</h2>
            {summary.payouts.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No payouts yet.</p>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full min-w-[480px] text-sm">
                  <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Period</th>
                      <th className="px-4 py-3 font-semibold text-right">Amount</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.payouts.map((p) => (
                      <tr key={p.id} className="border-b border-slate-100 bg-white even:bg-slate-50">
                        <td className="px-4 py-3 text-slate-600">
                          {shortDate(p.period_start)} – {shortDate(p.period_end)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">
                          {dollars(p.amount_cents)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              p.status === "paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : p.status === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{shortDate(p.paid_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
