import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const accountId = searchParams.get("account");
    const authUserId = searchParams.get("authUserId") ?? "";
    const email = searchParams.get("email") ?? "";
    const fullName = searchParams.get("fullName") ?? "Thankly User";
    const slug = searchParams.get("slug") ?? "user";

    if (!accountId) {
      return NextResponse.redirect(new URL("/create?error=missing_account", req.url));
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

    const refreshUrl = `${baseUrl}/api/create-account/refresh?account=${accountId}&authUserId=${encodeURIComponent(authUserId)}&email=${encodeURIComponent(email)}&fullName=${encodeURIComponent(fullName)}&slug=${encodeURIComponent(slug)}`;

    const returnUrl = `${baseUrl}/api/create-account/complete?account=${accountId}&authUserId=${encodeURIComponent(authUserId)}&email=${encodeURIComponent(email)}&fullName=${encodeURIComponent(fullName)}&slug=${encodeURIComponent(slug)}`;

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: "account_onboarding",
    });

    return NextResponse.redirect(accountLink.url);
  } catch (error) {
    console.error("Stripe onboarding refresh route error:", error);
    return NextResponse.redirect(new URL("/create?error=refresh_failed", req.url));
  }
}