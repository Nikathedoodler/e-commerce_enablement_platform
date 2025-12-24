"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  ShippingLabel,
  ShippingLabelInput,
  ShippingLabelUpdate,
} from "@/types/shipping";

/**
 * Get shipping labels for the current user
 * Optionally filter by orderId or carrier
 */
export async function getShippingLabels(filters?: {
  orderId?: string;
  carrier?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  // Build the query
  let query = supabase
    .from("shipping_labels")
    .select("*")
    .order("generated_at", { ascending: false });

  // Apply filters if provided
  if (filters?.orderId) {
    query = query.eq("order_id", filters.orderId);
  }

  if (filters?.carrier) {
    query = query.eq("carrier", filters.carrier);
  }

  // Execute query
  const { data, error } = await query;

  if (error) {
    return { error: error.message, data: null };
  }

  return { data: data as ShippingLabel[], error: null };
}

/**
 * Get a single shipping label by ID
 */
export async function getShippingLabelById(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  // Query by ID - .single() returns one object, not an array
  const { data, error } = await supabase
    .from("shipping_labels")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return {
      error: "Failed to get shipping label",
      details: error.message,
      data: null,
    };
  }

  return { data: data as ShippingLabel, error: null };
}

/**
 * Get shipping labels for a specific order
 * Convenience function that wraps getShippingLabels with orderId filter
 */
export async function getShippingLabelsByOrderId(orderId: string) {
  return getShippingLabels({ orderId });
}

/**
 * Create a new shipping label
 */
export async function createShippingLabel(labelData: ShippingLabelInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  // Ensure user_id is set
  const dataToInsert = {
    ...labelData,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from("shipping_labels")
    .insert(dataToInsert)
    .select()
    .single();

  if (error) {
    return {
      error: "Failed to create shipping label",
      details: error.message,
      data: null,
    };
  }

  return { data: data as ShippingLabel, error: null };
}

/**
 * Update a shipping label
 * Useful for updating label URL if we need to re-upload, or updating cost
 */
export async function updateShippingLabel(
  id: string,
  updates: ShippingLabelUpdate
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
    .from("shipping_labels")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      error: "Failed to update shipping label",
      details: error.message,
      data: null,
    };
  }

  return { data: data as ShippingLabel, error: null };
}

/**
 * Delete a shipping label
 * Note: This will also delete the label file from storage if needed
 */
export async function deleteShippingLabel(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated", data: null };
  }

  const { data, error } = await supabase
    .from("shipping_labels")
    .delete()
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return {
      error: "Failed to delete shipping label",
      details: error.message,
      data: null,
    };
  }

  return { data: data as ShippingLabel, error: null };
}
