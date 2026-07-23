"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import AppNav from "@/components/AppNav";
import { supabase } from "@/lib/supabase";

type Status = "confirming" | "ready" | "signin_required";

function ConfirmContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const code = searchParams.get("code");
  const [status, setStatus] = useState<Status>("confirming");
  const [continuing, setContinuing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function establishSession() {
      // Already signed in (e.g. revisiting this page)?
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (!cancelled) setStatus("ready");
        return;
      }

      if (!code) {
        if (!cancelled) setStatus("signin_required");
        return;
      }

      // Exchange the email-confirmation code for a session (PKCE).
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (cancelled) return;

      if (error) {
        // The client's auto-detection may have already consumed the code —
        // check again before concluding we have no session.
        const { data: { session: retry } } = await supabase.auth.getSession();
        setStatus(retry ? "ready" : "signin_required");
      } else {
        setStatus("ready");
      }
    }

    establishSession();
    return () => {
      cancelled = true;
    };
  }, [code]);

  async function handleContinueWeb() {
    // If no session could be established here (link opened in a different
    // browser/incognito, or the code exchange failed), route to sign-in, which
    // provisions the correct entity on login. Applies to BOTH worker & business.
    if (status === "signin_required") {
      sessionStorage.setItem("authView", "signin");
      window.location.href = "/auth";
      return;
    }

    // Business owners: the session now exists (exchange completed on load).
    // Send them to /business/create, which reads business_name from metadata,
    // pre-fills it, and creates the businesses row on submit.
    if (next === "business") {
      window.location.href = "/business/create";
      return;
    }

    // Affiliates: provision via the invite-gated ensure route, then go to the
    // affiliate dashboard. NO worker row is created for affiliates.
    if (next === "affiliate") {
      try {
        setContinuing(true);
        const res = await fetch("/api/affiliates/ensure", { method: "POST" });
        window.location.href = res.ok
          ? "/affiliates/dashboard"
          : "/affiliates/join";
      } catch {
        window.location.href = "/auth";
      }
      return;
    }

    // Workers: provision the row now (Stripe deferred), then go to the dashboard.
    try {
      setContinuing(true);
      await fetch("/api/ensure-worker", { method: "POST" });
      window.location.href = "/manage";
    } catch {
      window.location.href = "/auth";
    }
  }

  const buttonLabel =
    status === "confirming"
      ? "Confirming…"
      : status === "signin_required"
      ? "Sign in to continue →"
      : continuing
      ? "Setting up…"
      : "Continue on web →";

  const bodyText =
    status === "signin_required"
      ? "Your email is confirmed. Sign in to finish setting up your account."
      : "Your Thankly account is now active. Choose how you'd like to continue.";

  return (
    <>
    <AppNav variant="public" backLabel="← Back to home" backHref="/" />
    <main style={{
      minHeight: "100vh",
      backgroundColor: "#0f3f73",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        padding: "40px 32px",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
        <h1 style={{ color: "#0f3f73", fontSize: "22px", fontWeight: "900", margin: "0 0 12px" }}>
          Email confirmed!
        </h1>
        <p style={{ color: "#475569", fontSize: "15px", lineHeight: "1.6", margin: "0 0 24px" }}>
          {bodyText}
        </p>
        <button onClick={handleContinueWeb} disabled={continuing || status === "confirming"} style={{ display: "inline-block" as const, backgroundColor: "#0f3f73", color: "#ffffff", padding: "14px 32px", borderRadius: "12px", border: "none", cursor: continuing || status === "confirming" ? "default" : "pointer", fontWeight: "700", fontSize: "15px", width: "100%", boxSizing: "border-box" as const, marginBottom: "12px", opacity: continuing || status === "confirming" ? 0.7 : 1 }}>
          {buttonLabel}
        </button>
        <a href="thanklymobile://auth" style={{ display: "inline-block" as const, backgroundColor: "#f1f5f9", color: "#0f3f73", padding: "14px 32px", borderRadius: "12px", textDecoration: "none", fontWeight: "700", fontSize: "15px", width: "100%", boxSizing: "border-box" as const }}>
          Open Thankly App
        </a>
      </div>
    </main>
    </>
  );
}

export default function EmailConfirmedPage() {
  return (
    <Suspense>
      <ConfirmContent />
    </Suspense>
  );
}