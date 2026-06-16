import { supabase } from "../lib/supabase";

export async function getCurrentWorker(authUserId: string) {
  const { data, error } = await supabase
    .from("workers")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getWorkerTransactions(workerId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("worker_id", workerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function updateWorkerPushToken(
  authUserId: string,
  expoPushToken: string
) {
  const { error } = await supabase
    .from("workers")
    .update({
      expo_push_token: expoPushToken,
    })
    .eq("auth_user_id", authUserId);

  if (error) {
    throw error;
  }
}

export async function createWorkerProfileIfMissing(
  authUserId: string,
  email: string
) {
  const existingWorker = await getCurrentWorker(authUserId);

  if (existingWorker) {
    return existingWorker;
  }

  const baseSlug =
    email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "worker";

  const generatedSlug = `${baseSlug}-${authUserId.slice(0, 8)}`;

  const { data, error } = await supabase
    .from("workers")
    .insert({
      auth_user_id: authUserId,
      email,
      full_name: "",
      profile_slug: generatedSlug,
      bio: "Thank you for joining",
      stripe_onboarded: false,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
export async function getWorkerFeedback(workerId: string) {
  const { data, error } = await supabase
    .from("worker_feedback")
    .select("*")
    .eq("worker_id", workerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}
export async function updateWorkerProfile({
  workerId,
  fullName,
  bio,
  bioEs,
  profileSlug,
  workplace,
  avatar_url,
  tipAmount1,
  tipAmount2,
  tipAmount3,
}: {
  workerId: string;
  fullName: string;
  bio: string;
  bioEs: string;
  profileSlug: string;
  workplace?: string;
  avatar_url?: string | null;
  tip_amount_1?: number | null;
  tip_amount_2?: number | null;
  tip_amount_3?: number | null;

}) {
  const { data, error } = await supabase
    .from("workers")
    .update({
      full_name: fullName,
      bio,
      bio_es: bioEs,
      profile_slug: profileSlug,
      workplace: workplace ?? "",
      tip_amount_1: tipAmount1,
      tip_amount_2: tipAmount2,
      tip_amount_3: tipAmount3,
    })
    .eq("id", workerId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}