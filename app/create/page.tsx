"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AppNav from "@/components/AppNav";

type Language = "en" | "es";

export default function CreatePage() {
  const [language, setLanguage] = useState<Language>("en");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const t = {
    title:
      language === "en"
        ? "Set up your Thankly"
        : "Configura tu Thankly",

    subtitle:
      language === "en"
        ? "Step 1 of 3 — Create your profile"
        : "Paso 1 de 3 — Crea tu perfil",

    profile:
      language === "en" ? "1 Profile" : "1 Perfil",

    payouts:
      language === "en" ? "2 Payouts" : "2 Pagos",

    ready:
      language === "en" ? "3 Ready" : "3 Listo",

    placeholder:
      language === "en"
        ? "Your name (e.g. Maria)"
        : "Tu nombre (ej. María)",

    continue:
      language === "en"
        ? "Continue to payouts"
        : "Continuar a pagos",

    processing:
      language === "en"
        ? "Processing..."
        : "Procesando...",

    secure:
      language === "en"
        ? "Secure Stripe onboarding"
        : "Conexión segura con Stripe",

    missingName:
      language === "en"
        ? "Please enter your name."
        : "Ingresa tu nombre.",

    loginRequired:
      language === "en"
        ? "You must be logged in first."
        : "Debes iniciar sesión primero.",
  };

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setUserEmail(user.email);

        const suggestedName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email.split("@")[0];

        setName(suggestedName ?? "");
      }
    }

    loadUser();
  }, []);

  async function handleContinue() {
    setErrorMessage("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage(t.missingName);
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      setLoading(false);
      setErrorMessage(t.loginRequired);
      return;
    }

    const response = await fetch("/api/create-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authUserId: user.id,
        email: user.email ?? "",
        fullName: trimmedName,
      }),
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    setLoading(false);
    setErrorMessage(data.error || "Unable to continue.");

  }

  return (
    <>
    <AppNav variant="app" />
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
        <div className="bg-gradient-to-b from-sky-700 to-sky-900 px-6 py-6 text-center">
          <div className="mb-4 flex justify-center">
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

          <h1 className="mt-2 text-2xl font-semibold text-white">
            {t.title}
          </h1>

          <p className="mt-1 text-xs text-white/80">
            {t.subtitle}
          </p>

          <div className="mt-4 flex justify-center gap-2 text-[10px] text-white/80">
            <span className="rounded-full bg-white/30 px-2 py-1">
              {t.profile}
            </span>

            <span className="rounded-full bg-white/10 px-2 py-1">
              {t.payouts}
            </span>

            <span className="rounded-full bg-white/10 px-2 py-1">
              {t.ready}
            </span>
          </div>
        </div>

        <div className="bg-white px-6 py-6">
          <input
            type="text"
            placeholder={t.placeholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          {userEmail ? (
            <p className="mt-3 text-xs text-slate-400">
              {userEmail}
            </p>
          ) : null}

          {errorMessage ? (
            <p className="mt-3 text-sm text-red-600">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="button"
            onClick={handleContinue}
            disabled={loading}
            className="mt-5 w-full rounded-2xl bg-emerald-600 py-3 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {loading ? t.processing : t.continue}
          </button>

          <p className="mt-3 text-center text-xs text-slate-400">
            {t.secure}
          </p>
        </div>
      </div>
    </main>
    </>
  );
}