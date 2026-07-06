"use client";

import { useMemo, useState } from "react";
import ShareQrCard from "@/components/ShareQrCard";
import EditWorkerProfile from "@/components/EditWorkerProfile";
import ResumeStripeButton from "@/components/ResumeStripeButton";
import TaxWithholdingCard from "@/components/TaxWithholdingCard";
import ExportEarningsButton from "@/components/ExportEarningsButton";
import WebPayoutCard from "@/components/WebPayoutCard";
import AppNav from "@/components/AppNav";

type Filter = "today" | "week" | "month" | "all" | "custom";
type Language = "en" | "es";

type Worker = {
  id: string;
  full_name: string;
  email: string;
  bio: string | null;
  bio_es: string | null;
  profile_slug: string;
  stripe_onboarded: boolean;
  stripe_account_id: string | null;
  tax_withholding_rate: number | null;
  auth_user_id: string;
};

type Transaction = {
  id: string;
  tip_amount: number;
  fee_amount: number;
  worker_receives: number;
  tax_reserve_amount: number;
  available_amount: number;
  status: string;
  created_at: string;
};

type Props = {
  worker: Worker;
  transactions: Transaction[];
  publicUrl: string;
};

function formatDollars(cents: number | null | undefined) {
  return `$${((cents ?? 0) / 100).toFixed(2)}`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function formatStatus(value: string | null | undefined) {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function isInRange(
  dateValue: string,
  filter: Filter,
  customStartDate: string,
  customEndDate: string
) {
  const txDate = new Date(dateValue);
  const now = new Date();

  if (filter === "all") return true;

  if (filter === "today") {
    return txDate.toDateString() === now.toDateString();
  }

  if (filter === "week") {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return txDate >= startOfWeek;
  }

  if (filter === "month") {
    return (
      txDate.getFullYear() === now.getFullYear() &&
      txDate.getMonth() === now.getMonth()
    );
  }

  if (filter === "custom") {
    if (!customStartDate && !customEndDate) return true;

    const start = customStartDate ? new Date(customStartDate) : null;
    const end = customEndDate ? new Date(customEndDate) : null;

    if (start) {
      start.setHours(0, 0, 0, 0);
    }

    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    if (start && txDate < start) return false;
    if (end && txDate > end) return false;

    return true;
  }

  return true;
}

export default function ManageDashboardClient({
  worker,
  transactions,
  publicUrl,
}: Props) {
  const [language, setLanguage] = useState<Language>("en");
  const [filter, setFilter] = useState<Filter>("today");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const t = {
    dashboard:
      language === "en"
        ? "Thankly Dashboard"
        : "Panel de Thankly",

    welcome:
      language === "en"
        ? `Welcome, ${worker.full_name}`
        : `Bienvenido, ${worker.full_name}`,

    subtitle:
      language === "en"
        ? "Manage your gratitude page, track earnings, and share your QR code."
        : "Administra tu página de agradecimiento, revisa tus ingresos y comparte tu código QR.",

    stripeStatus:
      language === "en"
        ? "Stripe Status"
        : "Estado de Stripe",

    ready:
      language === "en"
        ? "✅ Ready"
        : "✅ Listo",

    readyText:
      language === "en"
        ? "Ready to receive tips."
        : "Listo para recibir agradecimientos.",

    setupIncomplete:
      language === "en"
        ? "⚠️ Setup incomplete"
        : "⚠️ Configuración incompleta",

    finishStripe:
      language === "en"
        ? "Finish Stripe setup to receive payouts."
        : "Completa Stripe para recibir pagos.",

    today:
      language === "en"
        ? "Today"
        : "Hoy",

    week:
      language === "en"
        ? "This Week"
        : "Esta semana",

    month:
      language === "en"
        ? "This Month"
        : "Este mes",

    all:
      language === "en"
        ? "All Time"
        : "Todo",

    custom:
      language === "en"
        ? "Custom"
        : "Personalizado",

    from:
      language === "en"
        ? "From"
        : "Desde",

    to:
      language === "en"
        ? "To"
        : "Hasta",

    workerReceives:
      language === "en"
        ? "Worker Receives"
        : "Recibe",

    beforeTax:
      language === "en"
        ? "Before tax pocket"
        : "Antes de ahorro fiscal",

    totalVolume:
      language === "en"
      ? "Total Volume"
      : "Monto total",

    grossProcessed:
      language === "en"
        ? "Gross tips processed"
        : "Agradecimientos procesados",

    totalTips:
      language === "en"
        ? "Total Tips"
        : "Total",

    completedPayments:
      language === "en"
        ? "Completed payments"
        : "Pagos completados",

    avgTip:
      language === "en"
        ? "Avg. Tip"
        : "Promedio",

    perCustomer:
      language === "en"
        ? "Per customer"
        : "Por cliente",

    recentTransactions:
      language === "en"
        ? "Recent Transactions"
        : "Movimientos recientes",

    recentSubtitle:
      language === "en"
        ? "Latest completed tips and Thankly fee breakdown."
        : "Últimos agradecimientos completados y desglose de Thankly.",

    thanklyFees:
      language === "en"
        ? "Thankly Fees"
        : "Ingresos Thankly",

    noTransactions:
      language === "en"
        ? "No transactions for this period."
        : "No hay movimientos en este período.",

    date:
      language === "en"
        ? "Date"
        : "Fecha",

    tip:
      language === "en"
        ? "Tip"
        : "Agradecimiento",

    fee:
      language === "en"
        ? "Fee"
        : "Cargo",

    taxReserve:
      language === "en"
        ? "Estimated Tax Pocket"
        : "Reserva",

    available:
      language === "en"
        ? "Safe-to-Spend"
        : "Disponible",

    status:
      language === "en"
        ? "Status"
      : "Estado",
    
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) =>
      isInRange(tx.created_at, filter, customStartDate, customEndDate)
    );
  }, [transactions, filter, customStartDate, customEndDate]);

  const totalTips = filteredTransactions.length;

  const totalEarnedCents = filteredTransactions.reduce(
    (sum, tx) => sum + (tx.worker_receives ?? 0),
    0
  );

  const totalVolumeCents = filteredTransactions.reduce(
    (sum, tx) => sum + (tx.tip_amount ?? 0),
    0
  );

  const totalFeesCents = filteredTransactions.reduce(
    (sum, tx) => sum + (tx.fee_amount ?? 0),
    0
  );

  const avgTipCents =
    totalTips > 0 ? Math.round(totalVolumeCents / totalTips) : 0;

  const filters: { label: string; value: Filter }[] = [
    { label: t.today, value: "today" },
    { label: t.week, value: "week" },
    { label: t.month, value: "month" },
    { label: t.all, value: "all" },
    { label: t.custom, value: "custom" },
  ];

  return (
    <>
    <AppNav variant="app" />
    <div className="bg-[#00B4D8]/15 border-b border-[#00B4D8]/30 px-[5%] py-3 flex items-center justify-between gap-4">
      <p className="text-sm text-[#0F2347] font-medium">
        🎉 You're in early! The Thankly app is coming soon to the App Store and Google Play. Manage your account here in the meantime.
      </p>
    </div>
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-sky-800 to-blue-950 p-8 text-white shadow-2xl">
          <div className="mb-5 flex justify-end">
            <div className="rounded-full bg-white/10 p-1 text-xs font-semibold text-white backdrop-blur">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-full px-3 py-1 ${
                  language === "en"
                    ? "bg-white text-sky-700"
                    : "text-white/80"
                }`}
              >
                English
              </button>

              <button
                type="button"
                onClick={() => setLanguage("es")}
                className={`rounded-full px-3 py-1 ${
                  language === "es"
                    ? "bg-white text-sky-700"
                    : "text-white/80"
                }`}
              >
                Español
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-sky-100">
                {t.dashboard}
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                {t.welcome}
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-100">
                {t.subtitle}
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 px-5 py-4 shadow-lg backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-sky-100">
                {t.stripeStatus}
              </p>

              {worker.stripe_onboarded ? (
                <>
                  <p className="mt-1 text-lg font-semibold">{t.ready}</p>
                  <p className="mt-1 text-xs text-sky-100">
                    {t.readyText}
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-1 text-lg font-semibold">
                    {t.setupIncomplete}
                  </p>
                  <p className="mt-1 text-xs text-sky-100">
                    {t.finishStripe}
                  </p>

                  <ResumeStripeButton
                    accountId={worker.stripe_account_id}
                    authUserId={worker.auth_user_id}
                    email={worker.email}
                    fullName={worker.full_name}
                    slug={worker.profile_slug}
                  />
                </>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-4 shadow-xl">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  filter === item.value
                    ? "bg-sky-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {filter === "custom" && (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t.from}
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t.to}
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-emerald-100 border-l-4 border-l-emerald-500 bg-emerald-50 p-6 shadow-xl">
            <p className="text-sm font-semibold text-emerald-700">
              {t.workerReceives}
            </p>
            <p className="mt-2 text-4xl font-bold text-slate-900">
              {formatDollars(totalEarnedCents)}
            </p>
            <p className="mt-1 text-xs text-slate-600">{t.beforeTax}</p>
          </div>

          <div className="rounded-3xl border border-sky-100 border-l-4 border-l-sky-500 bg-sky-50 p-6 shadow-xl">
            <p className="text-sm font-semibold text-sky-700">{t.totalVolume}</p>
            <p className="mt-2 text-4xl font-bold text-slate-900">
              {formatDollars(totalVolumeCents)}
            </p>
            <p className="mt-1 text-xs text-slate-600">{t.grossProcessed}</p>
          </div>

          <div className="rounded-3xl border border-amber-100 border-l-4 border-l-amber-500 bg-amber-50 p-6 shadow-xl">
            <p className="text-sm font-semibold text-amber-700">{t.totalTips}</p>
            <p className="mt-2 text-4xl font-bold text-slate-900">
              {totalTips}
            </p>
            <p className="mt-1 text-xs text-slate-600">{t.completedPayments}</p>
          </div>

          <div className="rounded-3xl border border-violet-100 border-l-4 border-l-violet-500 bg-violet-50 p-6 shadow-xl">
            <p className="text-sm font-semibold text-violet-700">{t.avgTip}</p>
            <p className="mt-2 text-4xl font-bold text-slate-900">
              {formatDollars(avgTipCents)}
            </p>
            <p className="mt-1 text-xs text-slate-600">{t.perCustomer}</p>
          </div>
        </section>

        <WebPayoutCard
          stripeOnboarded={worker.stripe_onboarded}
          language={language}
        />

        <TaxWithholdingCard
          workerId={worker.id}
          initialRate={worker.tax_withholding_rate}
          totalEarnedCents={totalEarnedCents}
          language={language}
        />

        <ShareQrCard publicUrl={publicUrl} workerName={worker.full_name} language={language} />

        <EditWorkerProfile
          workerId={worker.id}
          initialName={worker.full_name}
          initialBio={worker.bio}
          initialBioEs={worker.bio_es}
          language={language}
        />

        <section className="rounded-3xl bg-white p-6 shadow-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {t.recentTransactions}
              </h2>
              <p className="text-sm text-slate-500">
                {t.recentSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
                {t.thanklyFees}: {formatDollars(totalFeesCents)}
              </div>

              <ExportEarningsButton
                workerName={worker.full_name}
                transactions={filteredTransactions}
                language={language}
              />
            </div>

          </div>

          {filteredTransactions.length === 0 ? (
            <p className="mt-6 text-slate-500">
              {t.noTransactions}
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">{t.date}</th>
                    <th className="px-4 py-3 font-semibold">{t.tip}</th>
                    <th className="px-4 py-3 font-semibold">{t.fee}</th>
                    <th className="px-4 py-3 font-semibold">{t.workerReceives}</th>
                    <th className="px-4 py-3 font-semibold">{t.taxReserve}</th>
                    <th className="px-4 py-3 font-semibold">{t.available}</th>
                    <th className="px-4 py-3 font-semibold">{t.status}</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-slate-100 bg-white even:bg-slate-50 hover:bg-sky-50 transition"
                    >
                      <td className="px-4 py-4 text-slate-600">
                        {formatDate(tx.created_at)}
                      </td>

                      <td className="px-4 py-4 font-bold text-slate-900">
                        {formatDollars(tx.tip_amount)}
                      </td>

                      <td className="px-4 py-4 font-semibold text-slate-700">
                        {formatDollars(tx.fee_amount)}
                      </td>

                      <td className="px-4 py-4 font-bold text-slate-900">
                        {formatDollars(tx.worker_receives)}
                      </td>

                      <td className="px-4 py-4 font-semibold text-amber-700">
                        {formatDollars(tx.tax_reserve_amount)}
                      </td>

                      <td className="px-4 py-4 font-bold text-emerald-700">
                        {formatDollars(tx.available_amount)}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                          {formatStatus(tx.status)}
                        </span>
                      </td>
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