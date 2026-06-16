"use client";

import QRCode from "react-qr-code";
import { useRef, useState } from "react";
import CopyLinkButton from "@/components/CopyLinkButton";

type Language = "en" | "es";

type ShareQrCardProps = {
  publicUrl: string;
  language?: Language;
};

export default function ShareQrCard({
  publicUrl,
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
    openPage: language === "en" ? "Open page" : "Abrir página",
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
    if (navigator.share) {
      await navigator.share({
        title: t.shareTitle,
        text: t.shareText,
        url: publicUrl,
      });
    } else {
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
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <QRCode value={publicUrl} size={180} />
          </div>
        </div>
      </div>
    </section>
  );
}