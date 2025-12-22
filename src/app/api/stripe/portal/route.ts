import { getSubscription } from "@/lib/supabase/queries/subscriptions";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await getSubscription();

    if (subscription.error || !subscription.data) {
      return NextResponse.json(
        { error: "No Subscription found" },
        { status: 401 }
      );
    }

    if (!subscription.data.stripe_customer_id) {
      return NextResponse.json(
        { error: "No stripe customer ID found" },
        { status: 401 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Missing Stripe secret key" },
        { status: 500 }
      );
    }

    // Initialaize stripe client
    const stripe = new Stripe(stripeSecretKey);

    // Create Stripe Billing Portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.data.stripe_customer_id,
      return_url: `${req.nextUrl.origin}/dashboard/settings/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe portal error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to create portal session" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
