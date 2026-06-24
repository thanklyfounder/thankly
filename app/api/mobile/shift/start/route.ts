import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { authUserId, businessId, isPersonal } = body;

    if (!authUserId) {
      return NextResponse.json({ error: "Missing authUserId" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Get worker
    const { data: worker, error: workerError } = await supabase
      .from("workers")
      .select("id")
      .eq("auth_user_id", authUserId)
      .single();

    if (workerError || !worker) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    // Auto-end any active shift first
    await supabase
      .from("work_shifts")
      .update({ ended_at: new Date().toISOString(), auto_ended: true })
      .eq("worker_id", worker.id)
      .is("ended_at", null);

    // Start new shift
    const { data: shift, error: shiftError } = await supabase
      .from("work_shifts")
      .insert({
        worker_id: worker.id,
        business_id: isPersonal ? null : (businessId ?? null),
        is_personal: isPersonal ?? false,
        started_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (shiftError) {
      return NextResponse.json({ error: "Failed to start shift" }, { status: 500 });
    }

    return NextResponse.json({ success: true, shift });
  } catch (error) {
    console.error("Shift start error:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}