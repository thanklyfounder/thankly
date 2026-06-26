import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, authUserId } = body;

    if (!businessId || !authUserId) {
      return NextResponse.json(
        { error: "Missing businessId or authUserId" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: worker } = await supabase
      .from("workers")
      .select("id")
      .eq("auth_user_id", authUserId)
      .single();

    if (!worker) {
      return NextResponse.json(
        { error: "Worker not found" },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("business_workers")
      .delete()
      .eq("worker_id", worker.id)
      .eq("business_id", businessId);

    if (error) {
      console.error("Business leave error:", error);
      return NextResponse.json(
        { error: "Unable to remove workplace" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Business leave route error:", error);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}