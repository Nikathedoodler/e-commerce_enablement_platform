import { getSubscriptionPeriodOrderCount } from "../supabase/queries/orders";
import { getSubscription } from "../supabase/queries/subscriptions";
import { getPlanLimit } from "../constants/plans";
import type { PlanTier } from "@/types/stripe";

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
