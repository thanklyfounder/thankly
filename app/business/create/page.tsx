"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Language = "en" | "es";

export default function CreateBusinessPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const t = {
    title: language === "en" ? "Create your business" : "Crea tu negocio",
    subtitle:
      language === "en"
        ? "Set up a business profile to manage team reporting."
        : "Configura un perfil de negocio para administrar reportes del equipo.",
    placeholder:
      language === "en"
        ? "Business name, e.g. Blue Lagoon"
        : "Nombre del negocio, ej. Blue Lagoon",
    button: language === "en" ? "Create business" : "Crear negocio",
    loading: language === "en" ? "Creating..." : "Creando...",
    loginRequired:
      language === "en"
        ? "You must be logged in first."
        : "Debes iniciar sesión primero.",
    missingName:
      language === "en"
        ? "Please enter a business name."
        : "Ingresa el nombre del negocio.",
  };

  async function handleCreate() {
    setErrorMessage("");

    const trimmedName = businessName.trim();

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

    const response = await fetch("/api/business/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: trimmedName,
        ownerAuthUserId: user.id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setLoading(false);
      setErrorMessage(data.error || "Unable to create business.");
      return;
    }

    window.location.href = `/business/${data.slug}`;
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="bg-gradient-to-b from-teal-700 to-blue-950 px-6 py-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-white/10 p-1 text-xs font-semibold text-white">
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

          <h1 className="text-2xl font-bold text-white">{t.title}</h1>
          <p className="mt-2 text-sm text-white/80">{t.subtitle}</p>
        </div>

        <div className="p-6">
          <input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder={t.placeholder}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          {errorMessage ? (
            <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
          ) : null}

          <button
            type="button"
            onClick={handleCreate}
            disabled={loading}
            className="mt-5 w-full rounded-2xl bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {loading ? t.loading : t.button}
          </button>
        </div>
      </div>
    </main>
  );
}
