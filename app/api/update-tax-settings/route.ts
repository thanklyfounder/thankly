import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const workerId = body?.workerId;
    const rate = Number(body?.rate);

    if (!workerId || Number.isNaN(rate) || rate < 0 || rate > 0.5) {
      return NextResponse.json(
        { error: "Invalid worker ID or tax rate" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("workers")
      .update({
        tax_withholding_rate: rate,
      })
      .eq("id", workerId);

    if (error) {
      console.error("Update tax settings error:", error);
      return NextResponse.json(
        { error: "Unable to update tax settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tax settings route error:", error);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}