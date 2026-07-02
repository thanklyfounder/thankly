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
    shareTitle:
      language === "en"
        ? "My Thankly page"
        : "Mi página de Thankly",
    shareText:
      language === "en"
        ? "Show your appreciation on Thankly"
        : "Muestra tu agradecimiento en Thankly",
  };

  function downloadSvg() {
    const svg = qrRef.current?.querySelector("svg");

    if (!svg) {
      alert("QR code not ready yet.");
      return;
    }

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const blob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "thankly-qr-code.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  async function shareLink() {
    try {
      const card = qrRef.current;
      if (!card) return;

      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(card, { backgroundColor: "#0f3f73", scale: 2 });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.share && navigator.canShare?.({ files: [new File([blob], "thankly-qr.png", { type: "image/png" })] })) {
          await navigator.share({
            title: t.shareTitle,
            text: t.shareText,
            files: [new File([blob], "thankly-qr.png", { type: "image/png" })],
          });
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "thankly-qr.png";
          a.click();
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch {
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
              onClick={downloadSvg}
              className="rounded-2xl border border-sky-300 bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 transition"
            >
              {t.downloadQr}
            </button>

            <button
              type="button"
              onClick={shareLink}
              className="rounded-2xl border border-violet-300 bg-white px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50 transition"
            >
              {copied ? t.copied : t.share}
            </button>
          </div>
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