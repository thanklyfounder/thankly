"use client";

// components/WebPayoutCard.tsx
// Payout card for the web dashboard. Fetches balance and initiates payouts
// via /api/web/initiate-payout (cookie-session authenticated — no authUserId sent).

import { useEffect, useState } from "react";

type Language = "en" | "es";
type PayoutMethod = "standard" | "instant";

type Props = {
  stripeOnboarded: boolean;
  language?: Language;
};

function formatDollars(cents: number | null | undefined) {
  return `$${((cents ?? 0) / 100).toFixed(2)}`;
}

export default function WebPayoutCard({ stripeOnboarded, language = "en" }: Props) {
  const [availableBalance, setAvailableBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [initiating, setInitiating] = useState(false);
  const [method, setMethod] = useState<PayoutMethod>("standard");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const t = {
    title: language === "en" ? "Payouts" : "Pagos",

    subtitle:
      language === "en"
        ? "Transfer your available balance to your bank or debit card."
        : "Transfiere tu saldo disponible a tu banco o tarjeta de débito.",

    available:
      language === "en" ? "Available for payout" : "Disponible para retirar",

    pending: language === "en" ? "Pending" : "Pendiente",

    standard: language === "en" ? "Standard" : "Estándar",

    standardSub:
      language === "en" ? "1–2 business days · Free" : "1–2 días hábiles · Gratis",

    instant: language === "en" ? "Instant" : "Instantáneo",

    instantSub:
      language === "en"
        ? "Within minutes · Stripe fee applies"
        : "En minutos · Aplica cargo de Stripe",

    initiate: language === "en" ? "Initiate Payout" : "Iniciar retiro",

    processing: language === "en" ? "Processing..." : "Procesando...",

    connectFirst:
      language === "en"
        ? "Finish Stripe setup to enable payouts."
        : "Completa la configuración de Stripe para activar los retiros.",

    noBalance:
      language === "en"
        ? "No available balance to pay out yet."
        : "Aún no tienes saldo disponible para retirar.",

    confirmText: (amount: string) =>
      language === "en"
        ? `Initiate a ${method} payout of ${amount}?`
        : `¿Iniciar un retiro ${method === "instant" ? "instantáneo" : "estándar"} de ${amount}?`,

    successText: (amount: string) =>
      language === "en"
        ? `${amount} is on its way. Estimated arrival: ${
            method === "instant" ? "within minutes" : "1–2 business days"
          }.`
        : `${amount} está en camino. Llegada estimada: ${
            method === "instant" ? "en minutos" : "1–2 días hábiles"
          }.`,

    errorGeneric:
      language === "en"
        ? "Something went wrong. Please try again."
        : "Algo salió mal. Inténtalo de nuevo.",
  };

  async function loadBalance() {
    try {
      setLoadingBalance(true);
      const response = await fetch("/api/web/initiate-payout");

      if (!response.ok) return;

      const data = await response.json();
      setAvailableBalance(data.available?.[0]?.amount ?? 0);
      setPendingBalance(data.pending?.[0]?.amount ?? 0);
    } catch (error) {
      console.error("Balance load error:", error);
    } finally {
      setLoadingBalance(false);
    }
  }

  useEffect(() => {
    if (stripeOnboarded) {
      loadBalance();
    } else {
      setLoadingBalance(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripeOnboarded]);

  async function handleInitiatePayout() {
    setMessage(null);

    if (!window.confirm(t.confirmText(formatDollars(availableBalance)))) {
      return;
    }

    try {
      setInitiating(true);

      const response = await fetch("/api/web/initiate-payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: data.error ?? t.errorGeneric });
        return;
      }

      setMessage({ type: "success", text: t.successText(formatDollars(data.amount)) });
      await loadBalance();
    } catch (error) {
      console.error("Initiate payout error:", error);
      setMessage({ type: "error", text: t.errorGeneric });
    } finally {
      setInitiating(false);
    }
  }

  const canPayout = stripeOnboarded && availableBalance > 0 && !initiating;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.title}</h2>
          <p className="text-sm text-slate-500">{t.subtitle}</p>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t.available}
          </p>
          <p className="mt-1 text-4xl font-bold text-slate-900">
            {loadingBalance ? "—" : formatDollars(availableBalance)}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {t.pending}: {loadingBalance ? "—" : formatDollars(pendingBalance)}
          </p>
        </div>

        <div className="w-full md:w-72">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMethod("standard")}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                method === "standard"
                  ? "border-sky-600 bg-sky-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <p className="text-sm font-bold text-slate-900">{t.standard}</p>
              <p className="mt-1 text-xs text-slate-600">{t.standardSub}</p>
            </button>

            <button
              type="button"
              onClick={() => setMethod("instant")}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                method === "instant"
                  ? "border-sky-600 bg-sky-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <p className="text-sm font-bold text-slate-900">{t.instant}</p>
              <p className="mt-1 text-xs text-slate-600">{t.instantSub}</p>
            </button>
          </div>

          <button
            type="button"
            onClick={handleInitiatePayout}
            disabled={!canPayout}
            className={`mt-3 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              canPayout
                ? "bg-sky-600 text-white hover:bg-sky-700"
                : "cursor-not-allowed bg-slate-200 text-slate-500"
            }`}
          >
            {initiating ? t.processing : t.initiate}
          </button>

          {!stripeOnboarded && (
            <p className="mt-2 text-xs text-amber-700">{t.connectFirst}</p>
          )}

          {stripeOnboarded && !loadingBalance && availableBalance <= 0 && (
            <p className="mt-2 text-xs text-slate-500">{t.noBalance}</p>
          )}

          {message && (
            <p
              className={`mt-2 text-xs font-semibold ${
                message.type === "success" ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}