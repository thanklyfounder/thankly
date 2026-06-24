import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { authUserId } = body;

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

    const { data: shift, error } = await supabase
      .from("work_shifts")
      .update({ ended_at: new Date().toISOString() })
      .eq("worker_id", worker.id)
      .is("ended_at", null)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: "No active shift found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, shift });
  } catch (error) {
    console.error("Shift end error:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}