import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import AppNav from "@/components/AppNav";

export default async function StripeReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ account?: string }>;
}) {
  const { account: accountId } = await searchParams;

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (accountId) {
    console.log("STRIPE RETURN ACCOUNT:", accountId);

    const account = await stripe.accounts.retrieve(accountId);

    console.log("STRIPE ACCOUNT STATUS:", {
      details_submitted: account.details_submitted,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
    });

    const stripeOnboarded =
      Boolean(account.details_submitted);
      //Boolean(account.charges_enabled) &&
      //Boolean(account.payouts_enabled);

    const { error } = await supabase
      .from("workers")
      .update({
        stripe_onboarded: stripeOnboarded,
        stripe_charges_enabled: account.charges_enabled,
        stripe_payouts_enabled: account.payouts_enabled,
        stripe_details_submitted: account.details_submitted,
      })
      .eq("stripe_account_id", accountId);

    if (error) {
      console.error("STRIPE RETURN SUPABASE UPDATE ERROR:", error);
    } else {
      console.log("STRIPE RETURN SUPABASE UPDATE SUCCESS:", stripeOnboarded);
    }
  }

  return (
    <>
    <AppNav variant="app" />
    <main style={{ padding: 32, fontFamily: "system-ui" }}>
      <h1>Stripe setup complete</h1>
      <p>You can now return to the Thankly app.</p>
    </main>
    </>
  );
}