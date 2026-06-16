"use client";

import { useState } from "react";

type SuccessFeedbackCardProps = {
  workerId: string;
  workerName: string;
  stripePaymentId?: string | null;
};

export default function SuccessFeedbackCard({
  workerId,
  workerName,
  stripePaymentId,
}: SuccessFeedbackCardProps) {
  const [rating, setRating] = useState(5);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  async function submitFeedback() {
    try {
      setLoading(true);

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workerId,
          stripePaymentId,
          rating,
          note,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save feedback");
      }

      setSubmitted(true);

      setTimeout(() => {
        setShowShare(true);
      }, 1200);
    } catch (error) {
      console.error("Feedback submit error:", error);
      alert("Unable to submit feedback.");
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    const message = `I just supported ${workerName} through Thankly ❤️`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Thankly",
          text: message,
          url: "https://getthankly.com",
        });
        return;
      }

      await navigator.clipboard.writeText(`${message} https://getthankly.com`);
      setCopied(true);
    } catch (error) {
      console.error("Share error:", error);
      await navigator.clipboard.writeText(`${message} https://getthankly.com`);
      setCopied(true);
    }
  }

  if (showShare) {
    return (
      <div className="mt-10 w-full rounded-[28px] border border-white/15 bg-white/10 p-8 text-center">
        <div className="text-5xl">💙</div>

        <h2 className="mt-5 text-3xl font-black text-white">
          Thanks for supporting {workerName}
        </h2>

        <p className="mt-4 text-lg leading-relaxed text-blue-100">
          Want to share this moment?
        </p>

        <button
          type="button"
          onClick={handleShare}
          className="mt-6 w-full rounded-3xl bg-white py-5 text-xl font-black text-[#173f73] transition hover:opacity-90"
        >
          {copied ? "Copied!" : "Share"}
        </button>

        <a
          href="/"
          className="mt-6 block text-sm font-bold text-blue-200/70"
        >
          Maybe later
        </a>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mt-10 w-full rounded-[28px] border border-white/15 bg-white/10 p-8 text-center">
        <div className="text-5xl">💙</div>

        <h2 className="mt-5 text-3xl font-black text-white">
          Thank you for the feedback
        </h2>

        <p className="mt-4 text-lg leading-relaxed text-blue-100">
          Your message was shared with {workerName}.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 w-full rounded-[28px] border border-white/15 bg-white/10 p-6 text-center">
      <p className="text-lg font-bold text-blue-100">
        How was your experience with {workerName}?
      </p>

      <div className="mt-6 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="text-5xl transition hover:scale-110"
          >
            {star <= rating ? "⭐" : "☆"}
          </button>
        ))}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={`Leave a note for ${workerName} (optional)...`}
        className="mt-6 min-h-[120px] w-full rounded-3xl border border-white/15 bg-white/10 px-5 py-5 text-white placeholder:text-blue-200/60 outline-none"
      />

      <button
        type="button"
        onClick={submitFeedback}
        disabled={loading}
        className="mt-6 w-full rounded-3xl bg-white py-5 text-xl font-black text-[#173f73] transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Done"}
      </button>

      <a
        href="/"
        className="mt-6 block text-sm font-bold text-blue-200/70"
      >
        Skip for now
      </a>
    </div>
  );
}
