"use server";

import { createClient } from "@/lib/supabase/server";
import type { Order, OrderInput, OrderUpdate } from "@/types/orders";

/*
 * Fetch all orders for the authenticated user
 * Optional filters: status, search term
 */

export async function getOrders(filters?: {
  status?: string;
  search?: string;
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
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  // Apply filters if provided
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.search) {
    query = query.or(
      `order_number.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%`
    );
  }

  // Execute query
  const { data, error } = await query;

  if (error) {
    return { error: error.message, data: null };
  }

  return { data: data as Order[], error: null };
}

export async function getOrderById(id: string) {
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
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error)
    return {
      error: "Failed To Get The Order",
      detailes: error.message,
      data: null,
    };

  return { data: data as Order, error: null };
}

export async function createOrder(orderData: OrderInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not Authenticated", data: null };

  const dataToInsert = {
    ...orderData,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from("orders")
    .insert(dataToInsert)
    .select()
    .single();

  if (error)
    return {
      error: "Failed To Create Order",
      detailes: error.message,
      data: null,
    };

  return { data: data as Order, error: null };
}
