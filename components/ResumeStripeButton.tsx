"use client";

type ResumeStripeButtonProps = {
  accountId: string | null;
  authUserId: string;
  email: string;
  fullName: string;
  slug: string;
};

export default function ResumeStripeButton({
  accountId,
  authUserId,
  email,
  fullName,
  slug,
}: ResumeStripeButtonProps) {
  async function handleResume() {
    if (!accountId) {
      alert("No Stripe account found. Please restart onboarding.");
      return;
    }

    const url = `/api/create-account/refresh?account=${encodeURIComponent(
      accountId
    )}&authUserId=${encodeURIComponent(authUserId)}&email=${encodeURIComponent(
      email
    )}&fullName=${encodeURIComponent(fullName)}&slug=${encodeURIComponent(
      slug
    )}`;

    window.location.href = url;
  }

  return (
    <button
      type="button"
      onClick={handleResume}
      className="mt-3 rounded-2xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition"
    >
      Complete Stripe setup
    </button>
  );
}