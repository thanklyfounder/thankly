"use client";

import { useState } from "react";

type CopyLinkButtonProps = {
  value: string;
  language?: "en" | "es";
};
export default function CopyLinkButton({
  value,
  language = "en",
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  
  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition"
    >
      {copied
        ? language === "es"
          ? "¡Copiado!"
          : "Copied!"
        : language === "es"
        ? "Copiar link"
        : "Copy link"}
    </button>
  );
}

