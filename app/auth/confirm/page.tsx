"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AppNav from "@/components/AppNav";

function ConfirmContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const webHref = "/auth";

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
          Your Thankly account is now active. Choose how you'd like to continue.
        </p>
        <a href={webHref} style={{ display: "inline-block" as const, backgroundColor: "#0f3f73", color: "#ffffff", padding: "14px 32px", borderRadius: "12px", textDecoration: "none", fontWeight: "700", fontSize: "15px", width: "100%", boxSizing: "border-box" as const, marginBottom: "12px" }}>
          Continue on web →
        </a>
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