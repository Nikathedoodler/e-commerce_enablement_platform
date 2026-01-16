"use server";

import { createClient } from "@/lib/supabase/server";
import {
  ReceivingLogItem,
  ReceivingLogInput,
  ReceivingLogUpdate,
} from "@/types/receiving";

export async function getReceivingLogs(filters?: {
  search?: string;
  sku?: string;
  client_id?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not Authenticated", data: null };

  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Build the base query for counting
  let countQuery = supabase
    .from("receiving_log")
    .select("*", { count: "exact", head: true });

  // Build the query for data
  let query = supabase
    .from("receiving_log")
    .select("*")
    .order("received_at", { ascending: false });

  if (filters?.search) {
    const searchFilter = `sku.ilike.%${filters.search}%,notes.ilike.%${filters.search}%`;
    query = query.or(searchFilter);
    countQuery = countQuery.or(searchFilter);
  }

  if (filters?.sku) {
    query = query.eq("sku", filters.sku);
    countQuery = countQuery.eq("sku", filters.sku);
  }

  if (filters?.client_id) {
    query = query.eq("client_id", filters.client_id);
    countQuery = countQuery.eq("client_id", filters.client_id);
  }

  if (filters?.startDate) {
    query = query.gte("received_at", filters.startDate);
    countQuery = countQuery.gte("received_at", filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte("received_at", filters.endDate);
    countQuery = countQuery.lte("received_at", filters.endDate);
  }

  // Get total count
  const { count, error: countError } = await countQuery;

  if (countError)
    return {
      error: "Failed to fetch receiving logs",
      details: countError.message,
      data: null,
    };

  // Apply pagination
  query = query.range(from, to);

  const { data, error } = await query;

  if (error)
    return {
      error: "Failed to fetch receiving logs",
      details: error.message,
      data: null,
    };

  const totalItems = count ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    data: data as ReceivingLogItem[],
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
    error: null,
  };
}

export async function getReceivingLogById(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not Authenticated", data: null };

  const { data, error } = await supabase
    .from("receiving_log")
    .select("*")
    .eq("id", id)
    .single();

  if (error)
    return {
      error: "Failed to get receiving log",
      details: error.message,
      data: null,
    };

  return { data: data as ReceivingLogItem, error: null };
}

/**
 * Creates a receiving log entry and updates inventory quantity
 * Only updates inventory for items in "good" condition
 */
export async function createReceivingLog(receivingData: ReceivingLogInput) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not Authenticated", data: null };

  // Step 1: Insert the receiving log entry
  const insertData = {
    ...receivingData,
    user_id: user.id,
  };

  const { data: logData, error: logError } = await supabase
    .from("receiving_log")
    .insert(insertData)
    .select()
    .single();

  if (logError)
    return {
      error: "Failed to create receiving log",
      details: logError.message,
      data: null,
    };

  // Step 2: Update inventory quantity if condition is "good"
  // Only add to inventory if items are in good condition
  if (receivingData.condition === "good" && receivingData.quantity > 0) {
    // Check if inventory item exists for this SKU
    const { data: inventoryItem, error: inventoryCheckError } = await supabase
      .from("inventory")
      .select("*")
      .eq("user_id", user.id)
      .eq("sku", receivingData.sku)
      .single();

    if (inventoryCheckError && inventoryCheckError.code !== "PGRST116") {
      // PGRST116 is "not found" - that's okay, we'll create it
      // Other errors are real problems
      return {
        error: "Failed to check inventory",
        details: inventoryCheckError.message,
        data: null,
      };
    }

    if (inventoryItem) {
      // Update existing inventory item
      const newQuantity = inventoryItem.quantity + receivingData.quantity;
      const { error: updateError } = await supabase
        .from("inventory")
        .update({ quantity: newQuantity })
        .eq("id", inventoryItem.id);

      if (updateError) {
        return {
          error: "Failed to update inventory",
          details: updateError.message,
          data: null,
        };
      }
    } else {
      // Create new inventory item if it doesn't exist
      // Use item_name if provided, otherwise use SKU as name
      const { error: createError } = await supabase.from("inventory").insert({
        user_id: user.id,
        sku: receivingData.sku,
        name: receivingData.item_name || receivingData.sku, // Use provided name or SKU as fallback
        quantity: receivingData.quantity,
        location: receivingData.location || null,
        reorder_threshold: 0, // Default, can be updated later
      });

      if (createError) {
        return {
          error: "Failed to create inventory item",
          details: createError.message,
          data: null,
        };
      }
    }
  }

  return { data: logData as ReceivingLogItem, error: null };
}

export async function updateReceivingLog(
  id: string,
  updates: ReceivingLogUpdate
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not Authenticated", data: null };

  const { data, error } = await supabase
    .from("receiving_log")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return {
      error: "Failed to update receiving log",
      details: error.message,
      data: null,
    };

  return { data: data as ReceivingLogItem, error: null };
}

export async function deleteReceivingLog(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not Authenticated", data: null };

  const { data, error } = await supabase
    .from("receiving_log")
    .delete()
    .eq("id", id)
    .select("*")
    .single();

  if (error)
    return {
      error: "Failed to delete receiving log",
      details: error.message,
      data: null,
    };

  return { data: data as ReceivingLogItem, error: null };
}

