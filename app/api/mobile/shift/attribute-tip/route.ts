import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { authUserId, transactionId, shiftId, businessId } = body;

    if (!authUserId || !transactionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

    // Get current attribution for audit log
    const { data: tx } = await supabase
      .from("transactions")
      .select("shift_id, business_id")
      .eq("id", transactionId)
      .single();

    // Update transaction attribution
    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        shift_id: shiftId ?? null,
        business_id: businessId ?? null,
      })
      .eq("id", transactionId)
      .eq("worker_id", worker.id); // Safety: worker can only attribute their own

    if (updateError) {
      return NextResponse.json({ error: "Failed to attribute tip" }, { status: 500 });
    }

    // Write audit log
    await supabase.from("transaction_reclassifications").insert({
      transaction_id: transactionId,
      worker_id: worker.id,
      original_shift_id: tx?.shift_id ?? null,
      original_business_id: tx?.business_id ?? null,
      new_shift_id: shiftId ?? null,
      new_business_id: businessId ?? null,
      reason: "worker_attributed_on_tip_received",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tip attribution error:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}