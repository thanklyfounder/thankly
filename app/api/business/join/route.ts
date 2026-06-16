import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const businessId = body?.businessId;
    const authUserId = body?.authUserId;

    if (!businessId || !authUserId) {
      return NextResponse.json(
        { error: "Missing business or auth user ID" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: worker, error: workerError } = await supabase
      .from("workers")
      .select("id")
      .eq("auth_user_id", authUserId)
      .single();

    if (workerError || !worker) {
      return NextResponse.json(
        { error: "Worker profile not found" },
        { status: 404 }
      );
    }

    const { error: linkError } = await supabase
      .from("business_workers")
      .insert({
        business_id: businessId,
        worker_id: worker.id,
        role: "worker",
        status: "active",
      });

    if (linkError) {
      const message = linkError.message?.toLowerCase() ?? "";

      if (message.includes("duplicate") || message.includes("unique")) {
        return NextResponse.json({
          success: true,
          alreadyJoined: true,
        });
      }

      console.error("Business join error:", linkError);

      return NextResponse.json(
        { error: "Unable to join business" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Business join route error:", error);

    return NextResponse.json(
      { error: "Unexpected join error" },
      { status: 500 }
    );
  }
}
