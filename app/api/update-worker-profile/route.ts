import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const workerId = body?.workerId;
    const fullName = body?.fullName?.trim();
    const bio = body?.bio?.trim();
    const bioEs = body?.bioEs?.trim();

    if (!workerId || !fullName) {
      return NextResponse.json(
        { error: "Missing worker ID or name" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("workers")
      .update({
        full_name: fullName,
        bio: bio || null,
        bio_es: bioEs || null,
      })
      .eq("id", workerId);

    if (error) {
      console.error("Update worker profile error:", error);
      return NextResponse.json(
        { error: "Unable to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update worker profile route error:", error);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}