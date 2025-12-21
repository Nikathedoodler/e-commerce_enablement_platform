import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import type { PlanTier } from "@/types/stripe";

/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout session for subscription
 *
 * Body:
 * - planTier: "starter" | "professional" | "enterprise"
 */
export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { planTier } = body;

    // Validate plan tier
    const validTiers: PlanTier[] = ["starter", "professional", "enterprise"];
    if (!planTier || !validTiers.includes(planTier)) {
      return NextResponse.json({ error: "Invalid plan tier" }, { status: 400 });
    }

    // Get Stripe secret key from environment
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error("Missing Stripe secret key");
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    // Validate API key format (should be sk_test_... or sk_live_...)
    const isTestMode = stripeSecretKey.startsWith("sk_test_");
    const isLiveMode = stripeSecretKey.startsWith("sk_live_");

    if (!isTestMode && !isLiveMode) {
      console.error("Invalid Stripe secret key format");
      return NextResponse.json(
        {
          error:
            "Invalid Stripe API key format. Must start with sk_test_ or sk_live_",
        },
        { status: 500 }
      );
    }

    console.log(`Using Stripe ${isTestMode ? "TEST" : "LIVE"} mode`);

    // Initialize Stripe client
    const stripe = new Stripe(stripeSecretKey);

    // Map plan tier to Stripe Price ID
    const priceIdMap: Record<PlanTier, string> = {
      starter: "price_1SgmBrIiIEvGEgNOPfAhx33y",
      professional: "price_1SgmEtIiIEvGEgNOweC4ls3t",
      enterprise: "price_1SgmFgIiIEvGEgNOni4GQAfC",
    };
    const priceId = priceIdMap[planTier as PlanTier];

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.nextUrl.origin}/dashboard/settings/billing?success=true`,
      cancel_url: `${req.nextUrl.origin}/dashboard/settings/billing?canceled=true`,
      metadata: {
        user_id: user.id,
        plan_tier: planTier,
      },
    });

    // Return checkout session URL
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    // Return more detailed error message
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to create checkout session" },
        { status: 500 }
      );
    }

    // Handle Stripe-specific errors
    if (typeof error === "object" && error !== null && "type" in error) {
      const stripeError = error as { type?: string; message?: string };
      return NextResponse.json(
        {
          error: stripeError.message || "Stripe API error",
          type: stripeError.type,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
