import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = body?.name?.trim();
    const ownerAuthUserId = body?.ownerAuthUserId;

    if (!name || !ownerAuthUserId) {
      return NextResponse.json(
        { error: "Missing business name or owner ID" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const baseSlug = slugify(name);
    let finalSlug = baseSlug || "business";
    let attempt = 1;

    while (true) {
      const { data, error } = await supabase
        .from("businesses")
        .insert({
          name,
          slug: finalSlug,
          owner_auth_user_id: ownerAuthUserId,
          type: "restaurant",
        })
        .select("id, name, slug")
        .single();

      if (!error && data) {
        return NextResponse.json({
          business: data,
          slug: data.slug,
        });
      }

      const message = error?.message?.toLowerCase() ?? "";

      if (message.includes("duplicate") || message.includes("unique")) {
        attempt += 1;
        finalSlug = `${baseSlug}-${attempt}`;
        continue;
      }

      console.error("Business creation error:", error);

      return NextResponse.json(
        { error: "Unable to create business" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Business create route error:", error);

    return NextResponse.json(
      { error: "Unexpected error creating business" },
      { status: 500 }
    );
  }
}
