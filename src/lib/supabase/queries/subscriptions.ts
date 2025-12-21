"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  Subscription,
  SubscriptionInput,
  SubscriptionUpdate,
} from "@/types/stripe";

/**
 * Get the current user's subscription
 */
export async function getSubscription() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    // If no subscription found, that's okay - return null
    if (error.code === "PGRST116") {
      return { data: null, error: null };
    }
    return {
      error: "Failed to get subscription",
      details: error.message,
      data: null,
    };
  }

  return { data: data as Subscription, error: null };
}

/**
 * Upsert a subscription (create or update)
 * Note: This is typically called by webhooks, not directly by users
 */
export async function upsertSubscription(subscription: SubscriptionInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  // Ensure user_id matches authenticated user
  const subscriptionWithUserId = {
    ...subscription,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from("subscriptions")
    .upsert(subscriptionWithUserId, {
      onConflict: "user_id",
    })
    .select()
    .single();

  if (error) {
    return {
      error: "Failed to upsert subscription",
      details: error.message,
      data: null,
    };
  }

  return { data: data as Subscription, error: null };
}

/**
 * Update subscription
 */
export async function updateSubscription(
  subscriptionId: string,
  updates: SubscriptionUpdate
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .update(updates)
    .eq("id", subscriptionId)
    .eq("user_id", user.id) // Ensure user owns this subscription
    .select()
    .single();

  if (error) {
    return {
      error: "Failed to update subscription",
      details: error.message,
      data: null,
    };
  }

  return { data: data as Subscription, error: null };
}
