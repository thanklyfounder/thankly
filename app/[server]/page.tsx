import QRCode from "react-qr-code";

type PageProps = {
  params: Promise<{
    server: string;
  }>;
};

const tipLinks = {
  five: "https://buy.stripe.com/test_9B66oBbVCdZzdM2ge08g000",
  ten: "https://buy.stripe.com/test_bJe7sFf7Og7H0Zg8Ly8g001",
  fifteen: "https://buy.stripe.com/test_8x2dR3e3KbRrdM22na8g002",
};

function formatServerName(name: string) {
  if (!name) return "Server";

  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function ServerTipPage({ params }: PageProps) {
  const { server } = await params;
  const displayName = formatServerName(server);
  const pageUrl = `https://thankly-jade.vercel.app/${server}`;

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lg shadow-black/5 border border-black/5">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
            Thankly
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900">
            Tip {displayName}
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            A simple way to say thank you.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <div className="flex justify-center rounded-xl bg-white p-4">
            <QRCode value={pageUrl} size={170} />
          </div>

          <p className="mt-3 text-center text-xs text-neutral-500">
            Scan to open this tip page on your phone
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <a
            href={tipLinks.five}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-neutral-200 bg-white py-3 text-center text-lg font-semibold text-neutral-900 transition hover:bg-neutral-50"
          >
            $5
          </a>

          <a
            href={tipLinks.ten}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-neutral-200 bg-white py-3 text-center text-lg font-semibold text-neutral-900 transition hover:bg-neutral-50"
          >
            $10
          </a>

          <a
            href={tipLinks.fifteen}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-neutral-200 bg-white py-3 text-center text-lg font-semibold text-neutral-900 transition hover:bg-neutral-50"
          >
            $15
          </a>

          <button className="rounded-2xl border border-neutral-200 bg-white py-3 text-center text-lg font-semibold text-neutral-400">
            Custom
          </button>
        </div>

        <a
          href={tipLinks.ten}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block w-full rounded-2xl bg-black py-3.5 text-center text-base font-semibold text-white transition hover:opacity-90"
        >
          Tip now
        </a>

        <p className="mt-4 text-center text-xs text-neutral-400">
          No cash needed • Secure checkout with Stripe
        </p>
      </div>
    </main>
  );
}