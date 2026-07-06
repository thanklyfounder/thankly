import { createServerClient as createSSRClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerClient() {
  const cookieStore = await cookies();

  return createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://gqkbiqibyzdhzijkxbkk.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxa2JpcWlieXpkaHppamt4YmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3ODQxODQsImV4cCI6MjA4OTM2MDE4NH0.2tgMygzQyUeLDVJmh_voIUBH1Ou1vLuv_GTBc3dVGdM",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component — safe to ignore,
            // the browser client keeps the session refreshed.
          }
        },
      },
    }
  );
}