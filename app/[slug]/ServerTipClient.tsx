"use client";

import { useMemo, useState } from "react";

type TipAmount = "preset1" | "preset2" | "preset3" | "custom";
type CustomMode = "amount" | "calculator";
type Language = "en" | "es";

type ServerTipClientProps = {
  displayName: string;
  bio?: string | null;
  pageUrl: string;
  avatarUrl?: string | null;
  tipAmount1?: number | null;
  tipAmount2?: number | null;
  tipAmount3?: number | null;
  stripeOnboarded?: boolean;
  success?: boolean;
  canceled?: boolean;
};
};

type ParticleData = {
  top: string;
  left: string;
  delay: string;
  duration: string;
};

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function fixedPercent(value: number) {
  return `${value.toFixed(3)}%`;
}

function fixedSeconds(value: number) {
  return `${value.toFixed(3)}s`;
}

function buildParticles(count: number, seedOffset: number): ParticleData[] {
  return Array.from({ length: count }, (_, i) => {
    const seed = i + seedOffset;

    const top = 8 + seededRandom(seed * 1.37) * 40;
    const left = 4 + seededRandom(seed * 2.11) * 92;
    const delay = seededRandom(seed * 3.73) * 8;
    const duration = 1.4 + seededRandom(seed * 4.91) * 1.4;

    return {
      top: fixedPercent(top),
      left: fixedPercent(left),
      delay: fixedSeconds(delay),
      duration: fixedSeconds(duration),
    };
  });
}

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ServerTipClient({
  displayName,
  bio,
  pageUrl,
  avatarUrl,
  tipAmount1,
  tipAmount2,
  tipAmount3,
  success,
  canceled,
  stripeOnboarded = true,
}: ServerTipClientProps) {
  const [language, setLanguage] = useState<Language>("en");
  const [selectedAmount, setSelectedAmount] = useState<TipAmount>("preset2");
  const [coverFee, setCoverFee] = useState(true);
  const [loading, setLoading] = useState(false);
  const preset1 = tipAmount1 ?? 500;
  const preset2 = tipAmount2 ?? 1000;
  const preset3 = tipAmount3 ?? 1500;
  const [customMode, setCustomMode] = useState<CustomMode>("amount");
  const [customAmount, setCustomAmount] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [tipPercent, setTipPercent] = useState("18");

  const t = {
    headline: language === "en" ? `Thank ${displayName}` : `Agradece a ${displayName}`,
    fallbackBio: language === "en" ? "Make a day in seconds" : "Muestra tu agradecimiento",
    successTitle: language === "en" ? "Tip sent successfully 🎉" : "Agradecimiento enviado 🎉",
    successSubtitle:
      language === "en"
        ? `Thank you for supporting ${displayName}`
        : `Gracias por reconocer a ${displayName}`,
    canceled: language === "en" ? "Payment canceled" : "Pago cancelado",
    custom: language === "en" ? "Custom" : "Otro",
    customTip: language === "en" ? "Custom tip" : "Agradecimiento personalizado",
    customDescription:
      language === "en"
        ? "Enter an amount directly or calculate from the bill."
        : "Ingresa un monto o calcúlalo según la cuenta.",
    enterAmount: language === "en" ? "Enter amount" : "Ingresar monto",
    calculateFromBill: language === "en" ? "Calculate from bill" : "Calcular con cuenta",
    tipAmount: language === "en" ? "Tip amount" : "Monto",
    billTotal: language === "en" ? "Bill total" : "Total de la cuenta",
    tipPercentage: language === "en" ? "Tip percentage" : "Porcentaje",
    customTipLabel: language === "en" ? "Custom tip" : "Agradecimiento",
    keepFull:
      language === "en"
        ? `Help ${displayName} keep 100% of your tip`
        : `Haz que ${displayName} reciba el 100% de tu agradecimiento`,
    feeExplanation:
      language === "en"
        ? `This covers payment processing so ${displayName} keeps the full tip.`
        : `Esto cubre el procesamiento para que ${displayName} reciba todo el monto.`,
    tip: language === "en" ? "Tip" : "Agradecimiento",
    processingFee: language === "en" ? "Processing fee" : "Cargo de procesamiento",
    youPay: language === "en" ? "You pay" : "Tu total",
    receives: language === "en" ? `${displayName} receives` : `${displayName} recibe`,
    minimum: language === "en" ? "Minimum tip is $5.00" : "Mínimo: $5.00",
    processing: language === "en" ? "Processing..." : "Procesando...",
    continue: language === "en" ? "Continue" : "Continuar",
    secure: language === "en" ? "Secure checkout with Stripe" : "Pago seguro con Stripe",
  };

  const slug = useMemo(() => {
    try {
      const url = new URL(pageUrl);
      return url.pathname.replace(/^\/+/, "");
    } catch {
      return "";
    }
  }, [pageUrl]);

  const customAmountCents = useMemo(() => {
    const amount = Number(customAmount);
    if (!amount || amount <= 0) return 0;
    return Math.round(amount * 100);
  }, [customAmount]);

  const calculatedTipCents = useMemo(() => {
    const bill = Number(billAmount);
    const percent = Number(tipPercent);

    if (!bill || bill <= 0 || !percent || percent <= 0) return 0;

    return Math.round(bill * 100 * (percent / 100));
  }, [billAmount, tipPercent]);

  const amountInCents = useMemo(() => {
    if (selectedAmount === "preset1") return preset1;
    if (selectedAmount === "preset2") return preset2;
    if (selectedAmount === "preset3") return preset3;

    if (selectedAmount === "custom") {
      if (customMode === "amount") return customAmountCents;
      return calculatedTipCents;
    }

    return preset2;
  }, [selectedAmount, preset1, preset2, preset3, customMode, customAmountCents, calculatedTipCents]);

  const feeBreakdown = useMemo(() => {
    const stripeRate = 0.029;
    const thanklyRate = 0.04;
    const fixedFee = 30;

    let totalCharge = amountInCents;
    let stripeFee = 0;
    let thanklyFee = 0;
    let workerReceives = 0;

    if (coverFee) {
      totalCharge = Math.ceil(
        (amountInCents + fixedFee) / (1 - stripeRate - thanklyRate)
      );

      stripeFee = Math.round(totalCharge * stripeRate) + fixedFee;
      thanklyFee = Math.round(totalCharge * thanklyRate);
      workerReceives = amountInCents;
    } else {
      totalCharge = amountInCents;

      stripeFee = Math.round(amountInCents * stripeRate) + fixedFee;
      thanklyFee = Math.round(amountInCents * thanklyRate);
      workerReceives = amountInCents - stripeFee - thanklyFee;
    }

    return {
      totalCharge,
      stripeFee,
      thanklyFee,
      workerReceives,
    };
  }, [amountInCents, coverFee]);

  const farParticles = useMemo(() => buildParticles(80, 100), []);
  const nearParticles = useMemo(() => buildParticles(50, 500), []);

  async function handleContinue() {
    if (amountInCents < 500) {
      alert(t.minimum);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInCents,
          slug,
          coverFee,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      alert(data.error || "Failed to create payment");
    } catch (error) {
      console.error("Payment redirect error:", error);
      alert("Something went wrong starting payment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
        <div className="relative overflow-hidden bg-[linear-gradient(180deg,#08183c_0%,#0c2e6f_42%,#0a63c9_100%)] px-6 pt-3 pb-3 text-center">
          <div className="pointer-events-none absolute inset-0">
            {farParticles.map((p, i) => (
              <span
                key={`f-${i}`}
                className="particle"
                style={{
                  top: p.top,
                  left: p.left,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                }}
              />
            ))}

            {nearParticles.map((p, i) => (
              <span
                key={`n-${i}`}
                className="particle-near"
                style={{
                  top: p.top,
                  left: p.left,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                }}
              />
            ))}
          </div>

          <div className="relative">
            <div className="mb-3 flex justify-center">
              <div className="rounded-full bg-white/10 p-1 text-xs font-semibold text-white backdrop-blur">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`rounded-full px-3 py-1 ${
                    language === "en" ? "bg-white text-sky-700" : "text-white/80"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("es")}
                  className={`rounded-full px-3 py-1 ${
                    language === "es" ? "bg-white text-sky-700" : "text-white/80"
                  }`}
                >
                  Español
                </button>
              </div>
            </div>

            <div className="mx-auto mb-1 flex h-10 items-center justify-center">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Thankly logo"
                  className="h-14 max-h-14 w-auto object-contain opacity-95 mix-blend-screen drop-shadow-[0_0_18px_rgba(56,189,248,1)]"
                />
                <div className="absolute inset-0 -z-10 blur-2xl opacity-60 bg-[radial-gradient(circle,rgba(56,189,248,0.6),transparent_70%)]" />
              </div>
            </div>

            <div className="mt-0 flex items-center justify-center gap-2">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-lg"
                />
              ) : null}

              <div className="text-left">
                <h1 className="text-xl font-bold text-white">
                  {t.headline}
                </h1>

                <p className="mt-1 text-sm text-white/80">
                  {bio || t.fallbackBio}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white px-6 pt-3 pb-5">
          {!stripeOnboarded && (
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-6 text-center">
              <p className="text-3xl">🌱</p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {language === "en"
                  ? `${displayName || "This worker"} isn't accepting tips just yet`
                  : `${displayName || "Esta persona"} aún no está recibiendo propinas`}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {language === "en"
                  ? "They're still setting up their account. Check back soon!"
                  : "Todavía está configurando su cuenta. ¡Vuelve pronto!"}
              </p>
            </div>
          )}

          {stripeOnboarded && (
          <>
          {success && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-center">
              <p className="text-sm font-semibold text-green-700">
                {t.successTitle}
              </p>
              <p className="mt-1 text-xs text-green-600">
                {t.successSubtitle}
              </p>
            </div>
          )}

          {canceled && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-center text-red-700 text-sm font-medium">
              {t.canceled}
            </div>
          )}

          <div className="mt-0 grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setSelectedAmount("preset1")}
              className={`rounded-2xl py-3 text-l font-bold text-slate-900 ${
                selectedAmount === "preset1"
                  ? "border border-sky-300 bg-sky-50 ring-2 ring-sky-200"
                  : "border border-sky-100 bg-white"
              }`}
            >
              ${(preset1 / 100).toFixed(0)}
            </button>

            <button
              onClick={() => setSelectedAmount("preset2")}
              className={`rounded-2xl py-3 text-l font-bold text-slate-900 ${
                selectedAmount === "preset2"
                  ? "border border-sky-300 bg-sky-50 ring-2 ring-sky-200"
                  : "border border-sky-100 bg-white"
              }`}
            >
              ${(preset2 / 100).toFixed(0)}
            </button>

            <button
              onClick={() => setSelectedAmount("preset3")}
              className={`rounded-2xl py-3 text-l font-bold text-slate-900 ${
                selectedAmount === "preset3"
                  ? "border border-sky-300 bg-sky-50 ring-2 ring-sky-200"
                  : "border border-sky-100 bg-white"
              }`}
            >
              ${(preset3 / 100).toFixed(0)}
            </button>

            <button
              onClick={() => {
                setSelectedAmount("custom");
                setCustomMode("amount");
              }}
              className={`rounded-2xl py-3 text-lg font-bold ${
                selectedAmount === "custom"
                  ? "border border-sky-300 bg-sky-50 ring-2 ring-sky-200"
                  : "border border-dashed border-slate-200 bg-white text-slate-500"
              }`}
            >
              {t.custom}
            </button>
          </div>

          {selectedAmount === "custom" && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                {t.customTip}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {t.customDescription}
              </p>

              <div className="mt-4 grid grid-cols-2 rounded-xl bg-white p-1 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setCustomMode("amount")}
                  className={`rounded-lg py-2 ${
                    customMode === "amount"
                      ? "bg-sky-600 text-white"
                      : "text-slate-600"
                  }`}
                >
                  {t.enterAmount}
                </button>

                <button
                  type="button"
                  onClick={() => setCustomMode("calculator")}
                  className={`rounded-lg py-2 ${
                    customMode === "calculator"
                      ? "bg-sky-600 text-white"
                      : "text-slate-600"
                  }`}
                >
                  {t.calculateFromBill}
                </button>
              </div>

              {customMode === "amount" ? (
                <div className="mt-4">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t.tipAmount}
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="5"
                    step="0.01"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Example: 50.00"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t.billTotal}
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      placeholder="Example: 80.00"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t.tipPercentage}
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="1"
                      step="0.1"
                      value={tipPercent}
                      onChange={(e) => setTipPercent(e.target.value)}
                      placeholder="Example: 25"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 rounded-xl bg-white p-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>{t.customTipLabel}</span>
                  <span className="font-semibold text-slate-900">
                    {formatMoney(amountInCents)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-2 rounded-2xl border border-sky-100 bg-sky-50 p-4">
            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={coverFee}
                onChange={(e) => setCoverFee(e.target.checked)}
                className="mt-1 h-4 w-4 accent-sky-600"
              />

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {t.keepFull}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {t.feeExplanation}
                </p>
              </div>
            </label>

            <div className="mt-3 rounded-xl bg-white p-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{t.tip}</span>
                <span>{formatMoney(amountInCents)}</span>
              </div>

              <div className="mt-1 flex justify-between">
                <span>{t.processingFee}</span>
                <span>
                  {formatMoney(
                    feeBreakdown.stripeFee + feeBreakdown.thanklyFee
                  )}
                </span>
              </div>

              <div className="mt-2 border-t border-slate-100 pt-2 flex justify-between font-semibold text-slate-900">
                <span>{t.youPay}</span>
                <span>{formatMoney(feeBreakdown.totalCharge)}</span>
              </div>

              <div className="mt-1 flex justify-between text-slate-500">
                <span>{t.receives}</span>
                <span>{formatMoney(feeBreakdown.workerReceives)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={loading || amountInCents < 500}
            className="mt-2 block w-full rounded-2xl bg-gradient-to-b from-sky-600 to-sky-500 py-4 text-center font-semibold text-white disabled:opacity-60"
          >
            {loading
              ? t.processing
              : amountInCents < 500
              ? t.minimum
              : `${t.continue} • ${formatMoney(feeBreakdown.totalCharge)}`}
          </button>

          <p className="mt-2 text-center text-xs text-slate-400">
            {t.secure}
          </p>
          </>
          )}
        </div>
      </div>
    </main>
  );
}