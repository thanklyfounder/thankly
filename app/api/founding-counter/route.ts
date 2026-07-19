import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export const revalidate = 30; // cache 30s — counter stays near-live without hammering DB

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("founding_program_counter")
      .select("claimed_count, cap, spots_remaining")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Unavailable." }, { status: 500 });
    }

    return NextResponse.json({
      claimed: data.claimed_count,
      cap: data.cap,
      remaining: data.spots_remaining,
    });
  } catch {
    return NextResponse.json({ error: "Unavailable." }, { status: 500 });
  }
}