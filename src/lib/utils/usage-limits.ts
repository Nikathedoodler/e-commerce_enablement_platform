import { getSubscriptionPeriodOrderCount } from "../supabase/queries/orders";
import { getSubscription } from "../supabase/queries/subscriptions";
import { getPlanLimit } from "../constants/plans";
import { createServiceRoleClient } from "../supabase/server";
import type { Subscription } from "@/types/stripe";

export interface UsageLimitResult {
  allowed: boolean;
  current: number;
  limit: number;
  remaining: number;
  planTier: string | null;
  isUnlimited: boolean;
}

export async function checkOrderLimit(): Promise<{
  data: UsageLimitResult | null;
  error: string | null;
}> {
  // Step 1: Get subscription
  const subscription = await getSubscription();

  if (subscription.error) {
    return { error: subscription.error, data: null };
  }

  if (!subscription.data) {
    // No subscription - return default result
    return {
      data: {
        allowed: false,
        current: 0,
        limit: 0,
        remaining: 0,
        planTier: null,
        isUnlimited: false,
      },
      error: null,
    };
  }

  // Step 2: Get order count
  const { data: countData, error: countError } =
    await getSubscriptionPeriodOrderCount();

  if (countError) {
    return { error: countError, data: null };
  }

  const current = countData ?? 0;
  const planTier = subscription.data.plan_tier;

  // Step 3: Get plan limit
  const limit = getPlanLimit(planTier);

  // Step 4: Calculate remaining and determine if unlimited
  const isUnlimited = planTier === "enterprise";
  const remaining = isUnlimited ? 999999 : Math.max(0, limit - current);

  // Step 5: Determine if allowed
  const allowed = isUnlimited || current < limit;

  // Step 6: Return result
  return {
    data: {
      allowed,
      current,
      limit,
      remaining,
      planTier,
      isUnlimited,
    },
    error: null,
  };
}

/**
 * Server-side function to check order limit for a specific user_id
 * Used in webhooks where there's no authenticated user session
 */
export async function checkOrderLimitForUser(userId: string): Promise<{
  data: UsageLimitResult | null;
  error: string | null;
}> {
  const supabase = createServiceRoleClient();

  // Get subscription for the user
  const { data: subscription, error: subError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (subError) {
    // If no subscription found, that's okay - return default result
    if (subError.code === "PGRST116") {
      return {
        data: {
          allowed: false,
          current: 0,
          limit: 0,
          remaining: 0,
          planTier: null,
          isUnlimited: false,
        },
        error: null,
      };
    }
    return { error: "Failed to get subscription", data: null };
  }

  if (!subscription) {
    return {
      data: {
        allowed: false,
        current: 0,
        limit: 0,
        remaining: 0,
        planTier: null,
        isUnlimited: false,
      },
      error: null,
    };
  }

  // Count orders in subscription period
  const { count, error: countError } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", subscription.current_period_start)
    .lt("created_at", subscription.current_period_end);

  if (countError) {
    return { error: "Failed to count orders", data: null };
  }

  const current = count ?? 0;
  const planTier = subscription.plan_tier;
  const limit = getPlanLimit(planTier);
  const isUnlimited = planTier === "enterprise";
  const remaining = isUnlimited ? 999999 : Math.max(0, limit - current);
  const allowed = isUnlimited || current < limit;

  return {
    data: {
      allowed,
      current,
      limit,
      remaining,
      planTier,
      isUnlimited,
    },
    error: null,
  };
}
