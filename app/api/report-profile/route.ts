import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

const VALID_REASONS = [
  "inappropriate_content",
  "impersonation",
  "spam",
  "harassment",
  "not_a_real_worker",
  "other",
] as const;

export async function POST(req: NextRequest) {
  try {
    const { slug, reason, details, reporterEmail } = await req.json();

    if (!slug || !VALID_REASONS.includes(reason)) {
      return NextResponse.json({ error: "Invalid report." }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: worker, error: workerError } = await supabase
      .from("workers")
      .select("id")
      .eq("profile_slug", slug)
      .single();

    if (workerError || !worker) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const { error: insertError } = await supabase
      .from("profile_reports")
      .insert({
        reported_worker_id: worker.id,
        reason,
        details: typeof details === "string" ? details.slice(0, 1000) : null,
        reporter_email: typeof reporterEmail === "string" ? reporterEmail.slice(0, 255) : null,
      });

    if (insertError) {
      console.error("Report insert error:", insertError);
      return NextResponse.json({ error: "Could not file report." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Report profile error:", e);
    return NextResponse.json({ error: "Could not file report." }, { status: 500 });
  }
}