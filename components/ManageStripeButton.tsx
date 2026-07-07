"use client";

import { useState } from "react";

export default function ManageStripeButton({ language = "en" }: { language?: "en" | "es" }) {
  const [loading, setLoading] = useState(false);

  const label = language === "en" ? "Manage payout account" : "Administrar cuenta de pagos";
  const loadingLabel = language === "en" ? "Opening…" : "Abriendo…";

  async function handleManage() {
    try {
      setLoading(true);
      const res = await fetch("/api/web/stripe-login-link", { method: "POST" });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Unable to open Stripe dashboard.");
        setLoading(false);
      }
    } catch {
      alert("Unable to open Stripe dashboard.");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleManage}
      disabled={loading}
      className="mt-3 rounded-2xl bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25 transition disabled:opacity-60"
    >
      {loading ? loadingLabel : label}
    </button>
  );
}