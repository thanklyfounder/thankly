import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const workerId = body?.workerId;
    const stripePaymentId = body?.stripePaymentId ?? null;
    const rating = Number(body?.rating);
    const note = body?.note?.trim() || null;

    if (!workerId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Missing or invalid feedback." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("worker_feedback").insert({
      worker_id: workerId,
      stripe_payment_id: stripePaymentId,
      rating,
      note,
    });

    if (error) {
      console.error("Feedback insert error:", error);
      return NextResponse.json(
        { error: "Unable to save feedback." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback route error:", error);

    return NextResponse.json(
      { error: "Unexpected feedback error." },
      { status: 500 }
    );
  }
}
