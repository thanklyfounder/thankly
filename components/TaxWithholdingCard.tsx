"use client";

import { useState } from "react";
import InfoTooltip from "@/components/InfoTooltip";

type Language = "en" | "es";

type TaxWithholdingCardProps = {
  workerId: string;
  initialRate: number | null;
  totalEarnedCents: number;
  language?: Language;
};

function formatDollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function TaxWithholdingCard({
  workerId,
  initialRate,
  totalEarnedCents,
  language = "en",
}: TaxWithholdingCardProps) {
  const [ratePercent, setRatePercent] = useState(
    Math.round((initialRate ?? 0.25) * 100)
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const t = {
    title:
      language === "en"
        ? "Estimated Tax Pocket"
        : "Bolsillo estimado para impuestos",

    description:
      language === "en"
        ? "Estimate how much to set aside from tips for taxes."
        : "Estima cuánto separar de tus ingresos para impuestos.",

    infoTitle:
      language === "en"
        ? "Your money stays under your control"
        : "Tu dinero siempre está bajo tu control",

    infoMessage:
      language === "en"
        ? "This amount is a suggested savings goal based on your income. The money remains in your account; remember to set it aside for your taxes."
        : "Este monto es una meta sugerida de ahorro basada en tus ingresos. El dinero permanece en tu cuenta; recuerda separarlo para tus impuestos.",

    disclaimer:
      language === "en"
        ? "Thankly only provides estimates to help you organize your finances. You are responsible for saving and paying your own taxes. Thankly does not withhold or transfer funds to any government entity."
        : "Thankly solo proporciona estimados para ayudarte a organizar tus finanzas. Tú eres responsable de ahorrar y pagar tus propios impuestos. Thankly no retiene ni transfiere fondos a ninguna entidad gubernamental.",

    rate:
      language === "en"
        ? "Tax Savings Rate"
        : "Porcentaje de ahorro para impuestos",

    pocket:
      language === "en"
        ? "Estimated Tax Pocket"
        : "Bolsillo estimado",

    safeToSpend:
      language === "en"
        ? "Safe-to-Spend Balance"
        : "Saldo seguro para gastar",

    save:
      language === "en"
        ? "Save tax setting"
        : "Guardar configuración",

    saving:
      language === "en"
        ? "Saving..."
        : "Guardando...",

    saved:
      language === "en"
        ? "Tax setting saved."
        : "Configuración guardada.",

    error:
      language === "en"
        ? "Unable to save tax setting."
        : "No se pudo guardar la configuración.",
  };

  const rate = ratePercent / 100;
  const estimatedTaxPocket = Math.round(totalEarnedCents * rate);
  const safeToSpendBalance = totalEarnedCents - estimatedTaxPocket;

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/update-tax-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workerId,
        rate,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || t.error);
      setSaving(false);
      return;
    }

    setMessage(t.saved);
    setSaving(false);
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              {t.title}
            </h2>

            <InfoTooltip
              title={t.infoTitle}
              message={`${t.infoMessage} ${t.disclaimer}`}
            />
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {t.description}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {t.rate}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="50"
              value={ratePercent}
              onChange={(e) =>
                setRatePercent(Number(e.target.value))
              }
              className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />

            <span className="text-sm font-semibold text-slate-700">
              %
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-xs uppercase tracking-wide text-amber-700">
            {t.pocket}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatDollars(estimatedTaxPocket)}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-xs uppercase tracking-wide text-emerald-700">
            {t.safeToSpend}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatDollars(safeToSpendBalance)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {saving ? t.saving : t.save}
        </button>

        {message ? (
          <p className="text-sm font-medium text-slate-600">
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
