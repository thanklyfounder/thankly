import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gqkbiqibyzdhzijkxbkk.supabase.co";
const supabaseAnonKey = "sb_publishable_kBCzIqfbCSZ5Z8qxIBIwYA__gZ7FwVc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);