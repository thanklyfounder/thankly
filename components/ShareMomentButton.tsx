"use client";

import { useState } from "react";

type ShareMomentButtonProps = {
  caption: string;
  shareUrl?: string;
};

export default function ShareMomentButton({
  caption,
  shareUrl = "https://getthankly.com",
}: ShareMomentButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Thankly Moment",
          text: caption,
          url: shareUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(`${caption} ${shareUrl}`);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Share failed:", error);

      await navigator.clipboard.writeText(`${caption} ${shareUrl}`);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="mt-6 w-full rounded-2xl bg-sky-600 py-4 text-lg font-black text-white transition hover:bg-sky-700"
    >
      {copied ? "Copied to clipboard!" : "Share this moment →"}
    </button>
  );
}
