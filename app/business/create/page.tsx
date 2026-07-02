"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Language = "en" | "es";
type Step = "name" | "account";

export default function CreateBusinessPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [step, setStep] = useState<Step>("name");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setAuthChecking(false);
    }
    checkAuth();
  }, []);

  const t = {
    title: language === "en" ? "Create your business" : "Crea tu negocio",
    subtitle: language === "en"
      ? "Set up a business profile to manage team reporting."
      : "Configura un perfil de negocio para administrar reportes del equipo.",
    namePlaceholder: language === "en"
      ? "Business name, e.g. Blue Lagoon"
      : "Nombre del negocio, ej. Blue Lagoon",
    next: language === "en" ? "Continue" : "Continuar",
    createAccount: language === "en" ? "Create account & business" : "Crear cuenta y negocio",
    createBusiness: language === "en" ? "Create business" : "Crear negocio",
    loading: language === "en" ? "Creating..." : "Creando...",
    emailPlaceholder: language === "en" ? "Email address" : "Correo electrónico",
    passwordPlaceholder: language === "en" ? "Create a password" : "Crea una contraseña",
    alreadyHaveAccount: language === "en" ? "Already have an account?" : "¿Ya tienes cuenta?",
    signIn: language === "en" ? "Sign in" : "Inicia sesión",
    missingName: language === "en" ? "Please enter a business name." : "Ingresa el nombre del negocio.",
    missingEmail: language === "en" ? "Please enter your email." : "Ingresa tu correo.",
    missingPassword: language === "en" ? "Please create a password." : "Crea una contraseña.",
    step1of2: language === "en" ? "Step 1 of 2 — Business info" : "Paso 1 de 2 — Info del negocio",
    step2of2: language === "en" ? "Step 2 of 2 — Your account" : "Paso 2 de 2 — Tu cuenta",
  };

  async function handleNameNext() {
    setErrorMessage("");
    if (!businessName.trim()) {
      setErrorMessage(t.missingName);
      return;
    }
    setStep("account");
  }

  async function createBusiness(userId?: string) {
    setLoading(true);
    setErrorMessage("");

    let ownerAuthUserId = userId;

    if (!ownerAuthUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      ownerAuthUserId = user?.id;
    }

    if (!ownerAuthUserId) {
      setLoading(false);
      setErrorMessage("Unable to verify your account. Please try again.");
      return;
    }

    const response = await fetch("/api/business/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: businessName.trim(),
        ownerAuthUserId,
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

  async function handleCreateAccountAndBusiness() {
    setErrorMessage("");

    if (!email.trim()) { setErrorMessage(t.missingEmail); return; }
    if (!password.trim()) { setErrorMessage(t.missingPassword); return; }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);
      setErrorMessage(error.message);
      return;
    }

    await createBusiness(data.user?.id);
  }

  async function handleSignInAndBusiness() {
    setErrorMessage("");

    if (!email.trim()) { setErrorMessage(t.missingEmail); return; }
    if (!password.trim()) { setErrorMessage(t.missingPassword); return; }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);
      setErrorMessage(error.message);
      return;
    }

    await createBusiness(data.user?.id);
  }

  if (authChecking) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

        {/* Header */}
        <div className="bg-gradient-to-b from-teal-700 to-blue-950 px-6 py-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-white/10 p-1 text-xs font-semibold text-white">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-full px-3 py-1 ${language === "en" ? "bg-white text-sky-700" : "text-white/80"}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("es")}
                className={`rounded-full px-3 py-1 ${language === "es" ? "bg-white text-sky-700" : "text-white/80"}`}
              >
                Español
              </button>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">{t.title}</h1>
          <p className="mt-1 text-sm text-white/80">{t.subtitle}</p>
          <p className="mt-3 text-xs text-white/60">
            {step === "name" ? t.step1of2 : t.step2of2}
          </p>
        </div>

        {/* Step 1 — Business name */}
        {step === "name" && (
          <div className="p-6">
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={t.namePlaceholder}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              onKeyDown={(e) => e.key === "Enter" && handleNameNext()}
            />

            {errorMessage ? (
              <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
            ) : null}

            <button
              type="button"
              onClick={handleNameNext}
              disabled={loading}
              className="mt-5 w-full rounded-2xl bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
            >
              {loading ? t.loading : t.next}
            </button>
          </div>
        )}

        {/* Step 2 — Account creation (only if not authenticated) */}
        {step === "account" && (
          <div className="p-6">
            <button
              type="button"
              onClick={() => { setStep("name"); setErrorMessage(""); }}
              className="mb-4 text-sm text-slate-400 hover:text-slate-600"
            >
              ← {businessName}
            </button>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />

            {errorMessage ? (
              <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
            ) : null}

            <button
              type="button"
              onClick={handleCreateAccountAndBusiness}
              disabled={loading}
              className="mt-5 w-full rounded-2xl bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
            >
              {loading ? t.loading : t.createAccount}
            </button>

            <div className="mt-4 flex items-center justify-center gap-1 text-sm text-slate-500">
              <span>{t.alreadyHaveAccount}</span>
              <button
                type="button"
                onClick={() => window.location.href = "/auth"}
                disabled={loading}
                className="font-semibold text-sky-600 hover:underline disabled:opacity-60"
              >
                {t.signIn}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}