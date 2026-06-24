import type { ReactNode } from "react";

type Props = {
  docNumber: string;
  audience: string;
  title: string;
  effectiveDate: string;
  version: string;
  summary: string;
  children: ReactNode;
};

export default function LegalLayout({
  docNumber,
  audience,
  title,
  effectiveDate,
  version,
  summary,
  children,
}: Props) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-sky-800 to-blue-950 px-8 py-8 text-white">
          <p className="text-xs font-bold tracking-widest uppercase text-sky-300">
            Document {docNumber} — {audience}
          </p>
          <h1 className="mt-2 text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-white/70">
            Effective {effectiveDate} · Version {version}
          </p>
          <p className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/90">
            {summary}
          </p>
        </div>

        <div className="prose prose-slate max-w-none rounded-3xl bg-white px-8 py-8 shadow-sm">
          {children}
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Thankly LLC · getthankly.com
        </p>
      </div>
    </main>
  );
}