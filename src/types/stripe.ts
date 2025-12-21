import type Stripe from "stripe";

/**
 * Subscription Plan Tier Types
 * Matches the CHECK constraint in the database schema
 * Maps to pricing: Starter, Growth (Professional), Scale Pro (Enterprise)
 */
export type PlanTier = "starter" | "professional" | "enterprise";

/**
 * Stripe Subscription Status Types
 * Matches Stripe's subscription status values
 */
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "unpaid"
  | "trialing"
  | "incomplete"
  | "incomplete_expired"
  | "paused";

/**
 * Subscription Type
 * Matches the subscriptions table schema exactly
 */
export interface Subscription {
  id: string; // UUID
  user_id: string; // UUID
  stripe_customer_id: string; // Stripe customer ID (cus_...)
  stripe_subscription_id: string; // Stripe subscription ID (sub_...)
  plan_tier: PlanTier;
  status: SubscriptionStatus;
  current_period_start: string; // TIMESTAMPTZ (ISO string)
  current_period_end: string; // TIMESTAMPTZ (ISO string)
  cancel_at_period_end: boolean;
  created_at: string; // TIMESTAMPTZ (ISO string)
  updated_at: string; // TIMESTAMPTZ (ISO string)
}

/**
 * Subscription Input Type (for creating subscriptions)
 * Omits auto-generated fields
 */
export type SubscriptionInput = Omit<
  Subscription,
  "id" | "user_id" | "created_at" | "updated_at"
> & {
  user_id?: string; // Optional for updates, required for creates
};

/**
 * Subscription Update Type (partial updates)
 */
export type SubscriptionUpdate = Partial<
  Pick<
    Subscription,
    | "plan_tier"
    | "status"
    | "current_period_start"
    | "current_period_end"
    | "cancel_at_period_end"
  >
>;

/**
 * Stripe Checkout Session Response
 */
export interface StripeCheckoutSession {
  id: string;
  url: string | null;
  customer: string | null;
  subscription: string | null;
}

/**
 * Stripe Price/Product Configuration
 * For mapping plan tiers to Stripe price IDs
 */
export interface StripePriceConfig {
  planTier: PlanTier;
  priceId: string; // Stripe Price ID (price_...)
  productId?: string; // Stripe Product ID (prod_...)
  amount: number; // Amount in cents (e.g., 19900 for €199)
  currency: string; // e.g., "eur"
  interval: "month" | "year"; // Billing interval
}

/**
 * Pricing Plan Configuration
 * Maps to your pricing component plans
 */
export interface PricingPlan {
  name: string;
  tier: PlanTier;
  monthlyFee: number; // Amount in cents
  stripePriceId: string; // Stripe Price ID
  features: string[];
}

/**
 * Stripe Webhook Event Types
 * Common events we'll handle
 */
export type StripeWebhookEventType =
  | "checkout.session.completed"
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted"
  | "invoice.payment_succeeded"
  | "invoice.payment_failed";

/**
 * Stripe Webhook Event Payload (simplified)
 */
export interface StripeWebhookEvent {
  id: string;
  type: StripeWebhookEventType;
  data: {
    object: Stripe.Checkout.Session | Stripe.Subscription | Stripe.Invoice | Record<string, unknown>; // Stripe object (subscription, checkout session, etc.)
  };
  created: number; // Unix timestamp
}
