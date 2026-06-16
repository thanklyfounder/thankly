"use client";

import QRCode from "react-qr-code";
import { useRef, useState } from "react";

type Props = {
  inviteUrl: string;
};

export default function BusinessInviteCard({ inviteUrl }: Props) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  async function copyInvite() {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadQr() {
    const svg = qrRef.current?.querySelector("svg");

    if (!svg) {
      alert("QR code not ready yet.");
      return;
    }

    const source = new XMLSerializer().serializeToString(svg);

    const blob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "thankly-business-invite-qr.svg";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-xl">
      <h2 className="text-xl font-bold text-slate-900">
        Invite workers
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Share this link or QR code so workers can join this business for team reporting.
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_220px] lg:items-center">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Invite Link
          </p>

          <p className="mt-1 break-all text-lg font-semibold text-slate-900">
            {inviteUrl}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyInvite}
              className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition"
            >
              {copied ? "Copied!" : "Copy invite link"}
            </button>

            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 transition"
            >
              Open invite page
            </a>

            <button
              type="button"
              onClick={downloadQr}
              className="rounded-2xl border border-violet-300 bg-white px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50 transition"
            >
              Download QR
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <div
            ref={qrRef}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <QRCode value={inviteUrl} size={180} />
          </div>
        </div>
      </div>
    </section>
  );
}
