import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { PlanTier, SubscriptionStatus } from "@/types/stripe";

/**
 * Verifies the Stripe webhook signature
 * This ensures the request is authentic and hasn't been tampered with
 */
async function verifyStripeWebhook(
  request: NextRequest,
  webhookSecret: string
): Promise<Stripe.Event | null> {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("Missing Stripe signature header");
      return null;
    }

    // Use Stripe SDK to verify webhook signature
    // Note: We need a Stripe instance, but constructEvent only needs the webhook secret
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error("Missing STRIPE_SECRET_KEY for webhook verification");
      return null;
    }

    const stripe = new Stripe(stripeSecretKey);
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    return event;
  } catch (error) {
    console.error("Stripe webhook verification failed:", error);
    return null;
  }
}

/**
 * Maps Stripe subscription status to our SubscriptionStatus type
 */
function mapSubscriptionStatus(status: string): SubscriptionStatus {
  const validStatuses: SubscriptionStatus[] = [
    "active",
    "canceled",
    "past_due",
    "unpaid",
    "trialing",
    "incomplete",
    "incomplete_expired",
    "paused",
  ];

  if (validStatuses.includes(status as SubscriptionStatus)) {
    return status as SubscriptionStatus;
  }

  // Default to active if unknown status
  console.warn(`Unknown subscription status: ${status}, defaulting to active`);
  return "active";
}

/**
 * Maps Stripe price ID to plan tier
 */
function mapPriceIdToPlanTier(priceId: string): PlanTier {
  const priceIdMap: Record<string, PlanTier> = {
    price_1SgmBrIiIEvGEgNOPfAhx33y: "starter",
    price_1SgmEtIiIEvGEgNOweC4ls3t: "professional",
    price_1SgmFgIiIEvGEgNOni4GQAfC: "enterprise",
  };

  return priceIdMap[priceId] || "starter";
}

/**
 * Handles checkout.session.completed event
 * Creates a new subscription record when payment succeeds
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createServiceRoleClient>
) {
  try {
    // Get user_id from metadata (we set this in checkout route)
    const userId = session.metadata?.user_id;
    if (!userId) {
      console.error("Missing user_id in checkout session metadata");
      return { success: false, error: "Missing user_id" };
    }

    // Get customer and subscription from session
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    if (!customerId || !subscriptionId) {
      console.error("Missing customer or subscription ID in checkout session");
      return { success: false, error: "Missing customer or subscription ID" };
    }

    // Fetch subscription details from Stripe to get full information
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Get subscription item (contains period timestamps in newer Stripe API)
    const subscriptionItem = subscription.items.data[0];
    if (!subscriptionItem) {
      console.error("Missing subscription item");
      return { success: false, error: "Missing subscription item" };
    }

    // Get plan tier from price ID
    const priceId = subscriptionItem.price.id;
    if (!priceId) {
      console.error("Missing price ID in subscription");
      return { success: false, error: "Missing price ID" };
    }

    const planTier = mapPriceIdToPlanTier(priceId);
    const status = mapSubscriptionStatus(subscription.status);

    // Get period timestamps from subscription item (newer Stripe API versions store them here)
    // Fall back to subscription level if not available in item
    const subWithPeriods = subscription as Stripe.Subscription & {
      current_period_start?: number;
      current_period_end?: number;
    };
    const subscriptionItemWithPeriods =
      subscriptionItem as Stripe.SubscriptionItem & {
        current_period_start?: number;
        current_period_end?: number;
      };
    const currentPeriodStartNum =
      subscriptionItemWithPeriods.current_period_start ??
      subWithPeriods.current_period_start ??
      subscription.start_date;
    const currentPeriodEndNum =
      subscriptionItemWithPeriods.current_period_end ??
      subWithPeriods.current_period_end;

    if (
      !currentPeriodStartNum ||
      !currentPeriodEndNum ||
      typeof currentPeriodStartNum !== "number" ||
      typeof currentPeriodEndNum !== "number"
    ) {
      console.error("Invalid period timestamps in subscription:", {
        item_current_period_start:
          subscriptionItemWithPeriods.current_period_start,
        item_current_period_end: subscriptionItemWithPeriods.current_period_end,
        subscription_current_period_start: subWithPeriods.current_period_start,
        subscription_current_period_end: subWithPeriods.current_period_end,
        start_date: subscription.start_date,
      });
      return {
        success: false,
        error: "Invalid subscription period timestamps",
      };
    }

    const currentPeriodStart = new Date(
      currentPeriodStartNum * 1000
    ).toISOString();
    const currentPeriodEnd = new Date(currentPeriodEndNum * 1000).toISOString();

    // Insert subscription into database
    const { error } = await supabase.from("subscriptions").upsert(
      {
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        plan_tier: planTier,
        status: status,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: subscription.cancel_at_period_end || false,
      },
      {
        onConflict: "user_id", // Update if subscription already exists for user
      }
    );

    if (error) {
      console.error("Error upserting subscription:", error);
      return { success: false, error: error.message };
    }

    console.log(`Subscription created/updated for user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error handling checkout.session.completed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Handles customer.subscription.updated event
 * Updates subscription status and period information
 */
async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createServiceRoleClient>
) {
  try {
    const subscriptionId = subscription.id;

    // Get plan tier from price ID
    const priceId = subscription.items.data[0]?.price.id;
    if (!priceId) {
      console.error("Missing price ID in subscription");
      return { success: false, error: "Missing price ID" };
    }

    const planTier = mapPriceIdToPlanTier(priceId);
    const status = mapSubscriptionStatus(subscription.status);

    // Convert Unix timestamps to ISO strings
    // Type assertion needed because Stripe Response type may not expose these directly
    const sub = subscription as unknown as Stripe.Subscription & {
      current_period_start: number;
      current_period_end: number;
    };
    const currentPeriodStart = new Date(
      sub.current_period_start * 1000
    ).toISOString();
    const currentPeriodEnd = new Date(
      sub.current_period_end * 1000
    ).toISOString();

    // Update subscription in database
    const { error } = await supabase
      .from("subscriptions")
      .update({
        plan_tier: planTier,
        status: status,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: subscription.cancel_at_period_end || false,
      })
      .eq("stripe_subscription_id", subscriptionId);

    if (error) {
      console.error("Error updating subscription:", error);
      return { success: false, error: error.message };
    }

    console.log(`Subscription updated: ${subscriptionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error handling subscription.updated:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Handles customer.subscription.deleted event
 * Updates subscription status to canceled
 */
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createServiceRoleClient>
) {
  try {
    const subscriptionId = subscription.id;

    // Update subscription status to canceled
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: "canceled",
        cancel_at_period_end: false,
      })
      .eq("stripe_subscription_id", subscriptionId);

    if (error) {
      console.error("Error updating deleted subscription:", error);
      return { success: false, error: error.message };
    }

    console.log(`Subscription marked as canceled: ${subscriptionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error handling subscription.deleted:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events
 */
export async function POST(req: NextRequest) {
  console.log("=== Stripe webhook received ===");
  try {
    // Get webhook secret from environment
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Get Stripe secret key for API calls
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error("Missing STRIPE_SECRET_KEY");
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    // Verify webhook signature
    console.log("Verifying webhook signature...");
    const event = await verifyStripeWebhook(req, webhookSecret);
    if (!event) {
      console.error("Webhook signature verification failed");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }
    console.log(`Webhook event verified: ${event.type}`);

    // Create Supabase service role client (bypasses RLS)
    const supabase = createServiceRoleClient();

    // Handle different event types
    console.log(`Handling event type: ${event.type}`);
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Processing checkout session: ${session.id}`);
        const result = await handleCheckoutSessionCompleted(session, supabase);
        if (!result.success) {
          console.error("Failed to handle checkout session:", result.error);
          return NextResponse.json({ error: result.error }, { status: 500 });
        }
        console.log("Checkout session processed successfully");
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const result = await handleSubscriptionUpdated(subscription, supabase);
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 500 });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const result = await handleSubscriptionDeleted(subscription, supabase);
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 500 });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return 200 to acknowledge receipt
    console.log("Webhook processed successfully");
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

// Disable body parsing for webhook routes to get raw body
export const runtime = "nodejs";
