import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import BusinessInviteCard from "@/components/BusinessInviteCard";
import BusinessExportButton from "@/components/BusinessExportButton";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDollars(cents: number | null | undefined) {
  return `$${((cents ?? 0) / 100).toFixed(2)}`;
}

export default async function BusinessDashboardPage({ params }: PageProps) {
  const { slug } = await params;

  const supabase = await createServerClient();

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (businessError || !business) {
    notFound();
  }

  const { data: links } = await supabase
    .from("business_workers")
    .select("worker_id, role, status, joined_at")
    .eq("business_id", business.id)
    .order("joined_at", { ascending: false });

  const workerIds = links?.map((link) => link.worker_id) ?? [];

  const { data: workers } =
    workerIds.length > 0
      ? await supabase
          .from("workers")
          .select("id, full_name, email, profile_slug, stripe_onboarded")
          .in("id", workerIds)
      : { data: [] };

  const { data: transactions } =
    workerIds.length > 0
      ? await supabase
          .from("transactions")
          .select("*")
          .in("worker_id", workerIds)
      : { data: [] };

  const totalTips = transactions?.length ?? 0;

  const totalGrossTips =
    transactions?.reduce((sum, tx) => sum + (tx.tip_amount ?? 0), 0) ?? 0;

  const totalPayout =
    transactions?.reduce((sum, tx) => sum + (tx.worker_receives ?? 0), 0) ?? 0;

  const totalEstimatedTax =
    transactions?.reduce((sum, tx) => sum + (tx.tax_reserve_amount ?? 0), 0) ??
    0;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const inviteUrl = `${baseUrl}/business/${business.slug}/join`;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-sky-800 to-blue-950 p-8 text-white shadow-2xl">
          <p className="text-sm font-semibold text-sky-100">
            Thankly Business Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            {business.name}
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-100">
            View team gratitude activity, invite workers, and prepare business-level reports.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-sky-100 border-l-4 border-l-sky-500 bg-sky-50 p-6 shadow-xl">
            <p className="text-sm font-semibold text-sky-700">
              Total Gross Tips
            </p>
            <p className="mt-2 text-4xl font-bold text-slate-900">
              {formatDollars(totalGrossTips)}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Across linked workers
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-100 border-l-4 border-l-emerald-500 bg-emerald-50 p-6 shadow-xl">
            <p className="text-sm font-semibold text-emerald-700">
              Total Worker Payout
            </p>
            <p className="mt-2 text-4xl font-bold text-slate-900">
              {formatDollars(totalPayout)}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Before estimated Tax Savings Rate
            </p>
          </div>

          <div className="rounded-3xl border border-amber-100 border-l-4 border-l-amber-500 bg-amber-50 p-6 shadow-xl">
            <p className="text-sm font-semibold text-amber-700">
              Estimated Tax Pocket
            </p>
            <p className="mt-2 text-4xl font-bold text-slate-900">
              {formatDollars(totalEstimatedTax)}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Worker-level estimates
            </p>
          </div>

          <div className="rounded-3xl border border-violet-100 border-l-4 border-l-violet-500 bg-violet-50 p-6 shadow-xl">
            <p className="text-sm font-semibold text-violet-700">
              Linked Workers
            </p>
            <p className="mt-2 text-4xl font-bold text-slate-900">
              {workers?.length ?? 0}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Active team members
            </p>
          </div>
        </section>

        <BusinessInviteCard inviteUrl={inviteUrl} />

        <section className="rounded-3xl bg-white p-6 shadow-xl">
          <h2 className="text-xl font-bold text-slate-900">
            Linked workers
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Workers linked to this business for team reporting.
          </p>

          {!workers || workers.length === 0 ? (
            <p className="mt-6 text-slate-500">
              No workers linked yet. Share the invite QR to get started.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Slug</th>
                    <th className="px-4 py-3 font-semibold">Stripe</th>
                  </tr>
                </thead>

                <tbody>
                  {workers.map((worker) => (
                    <tr
                      key={worker.id}
                      className="border-b border-slate-100 bg-white even:bg-slate-50"
                    >
                      <td className="px-4 py-4 font-bold text-slate-900">
                        {worker.full_name}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {worker.email}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {worker.profile_slug}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            worker.stripe_onboarded
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {worker.stripe_onboarded ? "Ready" : "Incomplete"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Team reports
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Export combined team tip reports for bookkeeping, payroll, and records.
              </p>
            </div>

            <BusinessExportButton
              businessName={business.name}
              workers={workers ?? []}
              transactions={transactions ?? []}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
