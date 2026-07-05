// app/success/page.tsx
// Fix: removed duplicate Done + Skip for now buttons that were rendering outside SuccessFeedbackCard.
// Also adds avatar_url pass-through from session metadata for worker photo display.

import { stripe } from "@/lib/stripe";
import SuccessFeedbackCard from "@/components/SuccessFeedbackCard";

type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

function formatDollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <main className="min-h-screen bg-[#173f73] flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-[32px] bg-white/10 p-8 text-center shadow-xl">
          <h1 className="text-3xl font-black text-white">Payment received</h1>
          <p className="mt-3 text-blue-100">
            Thank you for showing appreciation through Thankly.
          </p>
        </div>
      </main>
    );
  }

  const session = await stripe.checkout.sessions.retrieve(session_id);

  const workerName = session.metadata?.worker_name || "your server";
  const tipAmount = Number(session.metadata?.tip_amount ?? 0);
  const workerReceives = Number(session.metadata?.worker_receives ?? 0);
  const customerCoveredFee = session.metadata?.customer_covered_fee === "true";
  const avatarUrl = session.metadata?.avatar_url ?? null;
  const workerInitial = workerName.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-[#173f73] px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col items-center rounded-[36px] border border-white/10 bg-[#1f4b82] px-7 py-10 shadow-2xl">

        {/* Worker avatar — shows photo if available, falls back to initial */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={workerName}
            className="h-28 w-28 rounded-full border-4 border-blue-200 object-cover shadow-xl"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-blue-200 bg-blue-400 text-5xl font-black text-white shadow-xl">
            {workerInitial}
          </div>
        )}

        <div className="mt-12 text-5xl">🎉</div>

        <h1 className="mt-8 text-center text-5xl font-black leading-tight">
          You just made {workerName}&apos;s{" "}
          <span className="text-sky-300">day!</span>
        </h1>

        <p className="mt-8 text-center text-2xl font-bold leading-relaxed text-blue-100">
          {customerCoveredFee ? (
            <>
              They received your full {formatDollars(tipAmount)}.
              <br />
              Zero fees deducted.
            </>
          ) : (
            <>
              They received {formatDollars(workerReceives)} from your {formatDollars(tipAmount)} tip.
            </>
          )}
        </p>

        <div className="my-10 h-1 w-20 rounded-full bg-white/20" />

        {/*
          SuccessFeedbackCard already contains its own Done button and Skip for now link.
          Do NOT add another Done/Skip outside this component — that was the source of the duplicate.
        */}
        <SuccessFeedbackCard
          workerId={session.metadata?.worker_id ?? ""}
          workerName={workerName}
          stripePaymentId={
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : null
          }
        />
      </div>
    </main>
  );
}
