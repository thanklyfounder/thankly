import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

console.log("Stripe key:", secretKey);

if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY is missing from .env.local");
}

export const stripe = new Stripe(secretKey, {
  apiVersion: "2024-06-20",
});