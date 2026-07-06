"use client";

import QRCode from "react-qr-code";
import { useRef, useState } from "react";
import CopyLinkButton from "@/components/CopyLinkButton";

type Language = "en" | "es";

type ShareQrCardProps = {
  publicUrl: string;
  workerName?: string;
  language?: Language;
};

export default function ShareQrCard({
  publicUrl,
  workerName = "Thankly Worker",
  language = "en",
}: ShareQrCardProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const t = {
    title: language === "en" ? "Share your page" : "Comparte tu QR",
    description:
      language === "en"
        ? "Copy your link, open your page, or download your QR code."
        : "Copia tu enlace, abre tu página o descarga tu código QR.",
    publicLink: language === "en" ? "Public Link" : "Enlace público",
    openPage: language === "en" ? "View Tip Page" : "Ver página de propinas",
    downloadQr: language === "en" ? "Download QR" : "Descargar QR",
    share: language === "en" ? "Share" : "Compartir",
    copied: language === "en" ? "Copied!" : "¡Copiado!",
    linkHint:
      language === "en"
        ? "This link opens your public tip page — share it anywhere your customers can tap or scan."
        : "Este enlace abre tu página pública de propinas — compártelo donde tus clientes puedan verlo.",
    shareTitle:
      language === "en"
        ? "My Thankly page"
        : "Mi página de Thankly",
    shareText:
      language === "en"
        ? "Show your appreciation on Thankly"
        : "Muestra tu agradecimiento en Thankly",
  };

  async function renderBrandedCardPng(): Promise<Blob | null> {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return null;

    // Clone with explicit dimensions so the SVG has an intrinsic size
    // when rasterized (Firefox requires this for drawImage).
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("width", "160");
    clone.setAttribute("height", "160");

    const svgData = new XMLSerializer().serializeToString(clone);
    const svgUrl =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);

    const qrImage = new Image();
    await new Promise<void>((resolve, reject) => {
      qrImage.onload = () => resolve();
      qrImage.onerror = () => reject(new Error("QR image failed to load"));
      qrImage.src = svgUrl;
    });

    // Layout in logical px matching the on-screen 220px card, scaled 3x for export quality.
    const S = 3;
    const W = 220;
    const H = 320;

    const canvas = document.createElement("canvas");
    canvas.width = W * S;
    canvas.height = H * S;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.scale(S, S);

    function roundedRect(x: number, y: number, w: number, h: number, r: number) {
      ctx!.beginPath();
      ctx!.moveTo(x + r, y);
      ctx!.arcTo(x + w, y, x + w, y + h, r);
      ctx!.arcTo(x + w, y + h, x, y + h, r);
      ctx!.arcTo(x, y + h, x, y, r);
      ctx!.arcTo(x, y, x + w, y, r);
      ctx!.closePath();
    }

    // Navy card background
    roundedRect(0, 0, W, H, 16);
    ctx.fillStyle = "#0f3f73";
    ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    // Wordmark
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 18px system-ui, -apple-system, 'Segoe UI', sans-serif";
    ctx.fillText("Thankly", W / 2, 24);

    // Subtitle
    ctx.fillStyle = "#bfdbfe";
    ctx.font = "400 11px system-ui, -apple-system, 'Segoe UI', sans-serif";
    ctx.fillText("Worker Finance Platform", W / 2, 48);

    // White QR panel
    const panelSize = 184;
    const panelX = (W - panelSize) / 2;
    const panelY = 71;
    roundedRect(panelX, panelY, panelSize, panelSize, 12);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // QR code
    ctx.drawImage(qrImage, panelX + 12, panelY + 12, 160, 160);

    // Worker name
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 12px system-ui, -apple-system, 'Segoe UI', sans-serif";
    ctx.fillText(workerName, W / 2, panelY + panelSize + 12);

    // Domain
    ctx.fillStyle = "#93c5fd";
    ctx.font = "400 10px system-ui, -apple-system, 'Segoe UI', sans-serif";
    ctx.fillText("getthankly.com", W / 2, panelY + panelSize + 30);

    return new Promise<Blob | null>((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/png")
    );
  }

  async function downloadQrCard() {
    try {
      const blob = await renderBrandedCardPng();

      if (!blob) {
        alert("QR code not ready yet.");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "thankly-qr-card.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("QR download error:", error);
      alert("Could not generate the QR card. Please try again.");
    }
  }

  async function shareCard() {
    try {
      const blob = await renderBrandedCardPng();
      if (!blob) return;

      const file = new File([blob], "thankly-qr-card.png", { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: t.shareTitle,
          text: t.shareText,
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "thankly-qr-card.png";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      // User cancelling the native share sheet is not an error
      if ((error as any)?.name === "AbortError") return;

      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{t.title}</h2>
        <p className="mt-1 text-sm text-slate-500">{t.description}</p>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_220px] lg:items-center">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {t.publicLink}
          </p>

          <p className="mt-1 break-all text-lg font-semibold text-slate-900">
            {publicUrl}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <CopyLinkButton 
              value={publicUrl}
              language={language}
            />

            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 transition"
            >
              {t.openPage}
            </a>

            <button
              type="button"
              onClick={downloadQrCard}
              className="rounded-2xl border border-sky-300 bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 transition"
            >
              {t.downloadQr}
            </button>

            <button
              type="button"
              onClick={shareCard}
              className="rounded-2xl border border-violet-300 bg-white px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50 transition"
            >
              {copied ? t.copied : t.share}
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-400">{t.linkHint}</p>
        </div>

        <div className="flex justify-center">
          <div
            ref={qrRef}
            className="rounded-2xl overflow-hidden"
            style={{ background: "#0f3f73", padding: "24px", textAlign: "center", width: "220px" }}
          >
            <p style={{ color: "#ffffff", fontWeight: 900, fontSize: "18px", margin: "0 0 4px", letterSpacing: "0.5px" }}>Thankly</p>
            <p style={{ color: "#bfdbfe", fontSize: "11px", margin: "0 0 14px" }}>Worker Finance Platform</p>
            <div style={{ background: "#ffffff", borderRadius: "12px", padding: "12px", display: "inline-block" }}>
              <QRCode value={publicUrl} size={160} />
            </div>
            <p style={{ color: "#ffffff", fontSize: "12px", fontWeight: 700, margin: "12px 0 2px" }}>{workerName}</p>
            <p style={{ color: "#93c5fd", fontSize: "10px", margin: "0" }}>getthankly.com</p>
          </div>
        </div>
      </div>
    </section>
  );
}