import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import ManageDashboardClient from "@/components/ManageDashboardClient";

export default async function ManagePage() {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: workers, error: workerError } = await supabase
    .from("workers")
    .select("*")
    .eq("auth_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  let worker = workers?.[0];

  // Self-heal: a logged-in user with no worker row (orphaned auth user, or
  // created before deferred-Stripe provisioning) gets a row created now.
  // Stripe stays deferred — stripe_onboarded: false.
  if (!workerError && !worker) {
    const admin = createAdminClient();
    const email = user.email ?? "";
    const baseSlug =
      email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "worker";
    const generatedSlug = `${baseSlug}-${user.id.slice(0, 8)}`;

    const { data: created } = await admin
      .from("workers")
      .insert({
        auth_user_id: user.id,
        email,
        full_name: (user.user_metadata?.full_name as string) ?? "",
        profile_slug: generatedSlug,
        bio: "Thank you for joining",
        stripe_onboarded: false,
      })
      .select("*")
      .single();

    worker = created ?? undefined;
  }

  if (workerError || !worker) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-slate-900">No worker found</h1>
          <p className="mt-2 text-slate-500">Create a worker profile first.</p>
        </div>
      </main>
    );
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("worker_id", worker.id)
    .order("created_at", { ascending: false });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const publicUrl = `${baseUrl}/${worker.profile_slug}`;

  return (
    <ManageDashboardClient
      worker={worker}
      transactions={transactions ?? []}
      publicUrl={publicUrl}
    />
  );
}