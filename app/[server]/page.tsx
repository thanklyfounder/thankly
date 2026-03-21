import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-sm items-center justify-center">
        <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
          <div className="bg-gradient-to-b from-sky-600 to-sky-700 px-6 py-8 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
              Thankly
            </p>

            <h1 className="mt-3 text-3xl font-semibold text-white">
              Tip directly
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/85">
              A simple way for service workers to receive tips without cash.
            </p>
          </div>

          <div className="bg-white px-6 py-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                    1
                  </div>
                  <p>Create your Thankly page</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                    2
                  </div>
                  <p>Share your QR code or personal link</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                    3
                  </div>
                  <p>Receive digital tips in seconds</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link
                href="/create"
                className="block w-full rounded-2xl bg-sky-600 py-4 text-center text-base font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-700"
              >
                Create your page
              </Link>

              <Link
                href="/maria"
                className="block w-full rounded-2xl border border-slate-200 bg-white py-4 text-center text-base font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                View example
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-slate-400">
              Built for servers, hospitality staff, and service workers
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}