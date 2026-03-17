"use client";

import { use, useMemo, useState } from "react";
import QRCode from "react-qr-code";

type PageProps = {
  params: Promise<{
    server: string;
  }>;
};

const tipLinks = {
  five: "https://buy.stripe.com/test_9B66oBbVCdZzdM2ge08g000",
  ten: "https://buy.stripe.com/test_bJe7sFf7Og7H0Zg8Ly8g001",
  fifteen: "https://buy.stripe.com/test_8x2dR3e3KbRrdM22na8g002",
};

type TipAmount = "five" | "ten" | "fifteen";

function formatServerName(name: string) {
  if (!name) return "Server";

  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function ServerTipPage({ params }: PageProps) {
  const { server } = use(params);

  const displayName = formatServerName(server);
  const pageUrl = `https://thankly-jade.vercel.app/${server}`;
  const [selectedAmount, setSelectedAmount] = useState<TipAmount>("ten");

  const continueLink = useMemo(() => {
    return tipLinks[selectedAmount];
  }, [selectedAmount]);

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
        <div className="bg-gradient-to-b from-sky-600 to-sky-700 px-6 py-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
            Thankly sync test
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-white">
            Thank {displayName}
          </h1>

          <p className="mt-1 text-xs text-white/80">
            Make their day in seconds
          </p>
        </div>

        <div className="bg-white px-6 py-6">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
            <div className="flex justify-center rounded-xl bg-white p-4 shadow-sm">
              <QRCode value={pageUrl} size={150} />
            </div>

            <p className="mt-3 text-center text-xs text-slate-500">
              Scan to open on your phone
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedAmount("five")}
              className={`rounded-2xl py-4 text-center text-lg font-semibold shadow-sm transition ${
                selectedAmount === "five"
                  ? "border border-sky-300 bg-sky-50 text-sky-900 ring-2 ring-sky-200"
                  : "border border-sky-100 bg-white text-slate-900 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:shadow-md"
              }`}
            >
              $5
            </button>

            <button
              type="button"
              onClick={() => setSelectedAmount("ten")}
              className={`rounded-2xl py-4 text-center text-lg font-semibold shadow-sm transition ${
                selectedAmount === "ten"
                  ? "border border-sky-300 bg-sky-50 text-sky-900 ring-2 ring-sky-200"
                  : "border border-sky-100 bg-white text-slate-900 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:shadow-md"
              }`}
            >
              $10
            </button>

            <button
              type="button"
              onClick={() => setSelectedAmount("fifteen")}
              className={`rounded-2xl py-4 text-center text-lg font-semibold shadow-sm transition ${
                selectedAmount === "fifteen"
                  ? "border border-sky-300 bg-sky-50 text-sky-900 ring-2 ring-sky-200"
                  : "border border-sky-100 bg-white text-slate-900 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:shadow-md"
              }`}
            >
              $15
            </button>

            <button
              type="button"
              className="rounded-2xl border border-dashed border-slate-200 bg-white py-4 text-center text-lg font-semibold text-slate-400"
            >
              Custom
            </button>
          </div>

          <a
            href={continueLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block w-full rounded-2xl bg-gradient-to-b from-sky-600 to-sky-500 py-4 text-center text-base font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:from-sky-700 hover:to-sky-600"
          >
            Continue
          </a>

          <p className="mt-3 text-center text-xs text-slate-400">
            Secure checkout with Stripe
          </p>
        </div>
      </div>
    </main>
  );
}