import { createClient } from "@supabase/supabase-js";

export async function createServerClient() {
  return createClient(
    "https://gqkbiqibyzdhzijkxbkk.supabase.co",
    "sb_publishable_kBCzIqfbCSZ5Z8qxIBIwYA__gZ7FwVc"
  );
}