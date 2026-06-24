import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const authUserId = searchParams.get("authUserId");

    if (!authUserId) {
      return NextResponse.json({ error: "Missing authUserId" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: worker } = await supabase
      .from("workers")
      .select("id")
      .eq("auth_user_id", authUserId)
      .single();

    if (!worker) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    const { data: shift } = await supabase
      .from("work_shifts")
      .select("*, businesses(name)")
      .eq("worker_id", worker.id)
      .is("ended_at", null)
      .order("started_at", { ascending: false })
      .maybeSingle();

    return NextResponse.json({ shift: shift ?? null });
  } catch (error) {
    console.error("Active shift fetch error:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}