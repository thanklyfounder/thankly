import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import ServerTipClient from "./ServerTipClient";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    success?: string;
    canceled?: string;
  }>;
};

export default async function ServerPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  if (!slug) {
    notFound();
  }

  const supabase = await createServerClient();

  const { data: worker, error } = await supabase
    .from("public_worker_profiles")
    .select("*")
    .eq("profile_slug", slug)
    .single();

  if (error || !worker) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const pageUrl = `${baseUrl}/${worker.profile_slug}`;

  return (
    <ServerTipClient
      avatarUrl={worker.avatar_url}
      displayName={worker.full_name}
      bio={worker.bio}
      pageUrl={pageUrl}
      tipAmount1={worker.tip_amount_1}
      tipAmount2={worker.tip_amount_2}
      tipAmount3={worker.tip_amount_3}
      success={resolvedSearchParams.success === "true"}
      canceled={resolvedSearchParams.canceled === "true"}
    />
  );
}