import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

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
    const authUserId = body?.authUserId;
    const email = body?.email ?? "";
    const fullName = body?.fullName ?? "Thankly User";

    if (!authUserId) {
      return NextResponse.json(
        { error: "Missing auth user id" },
        { status: 400 }
      );
    }

    const account = await stripe.accounts.create({
      type: "express",
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const baseSlug = slugify(fullName || "user");
    const generatedSlug = `${baseSlug || "user"}-${authUserId.slice(0, 8)}`;

    const refreshUrl = `${baseUrl}/api/create-account/refresh?account=${
      account.id
    }&authUserId=${encodeURIComponent(authUserId)}&email=${encodeURIComponent(
      email
    )}&fullName=${encodeURIComponent(fullName)}&slug=${encodeURIComponent(
      generatedSlug
    )}`;

    const returnUrl = `${baseUrl}/api/create-account/complete?account=${
      account.id
    }&authUserId=${encodeURIComponent(authUserId)}&email=${encodeURIComponent(
      email
    )}&fullName=${encodeURIComponent(fullName)}&slug=${encodeURIComponent(
      generatedSlug
    )}`;

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: "account_onboarding",
    });

    return NextResponse.json({
      url: accountLink.url,
      accountId: account.id,
      slug: generatedSlug,
    });
  } catch (error) {
    console.error("Stripe account creation error:", error);
    return NextResponse.json(
      { error: "Unable to create Stripe account" },
      { status: 500 }
    );
  }
}