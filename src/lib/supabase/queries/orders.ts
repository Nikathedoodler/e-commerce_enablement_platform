"use server";

import { createClient } from "@/lib/supabase/server";
import type { Order, OrderInput, OrderUpdate } from "@/types/orders";

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

// Generate order number: ORD-YYYYMMDD-HHMMSS
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `ORD-${year}${month}${day}-${hours}${minutes}${seconds}`;
}

export async function createOrder(orderData: OrderInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not Authenticated", data: null };

  // Auto-generate order_number if not provided or empty
  const orderNumber =
    orderData.order_number?.trim() || generateOrderNumber();

  const dataToInsert = {
    ...orderData,
    order_number: orderNumber,
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

export async function updateOrder(id: string, updates: OrderUpdate) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not Authenticated", data: null };

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return { error: "Failed To Update", details: error.message, data: null };

  return { data: data as Order, error: null };
}

export async function deleteOrder(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not authenticated", data: null };

  const { data, error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id)
    .select("*")
    .single();

  if (error)
    return { error: "Failed To Delete", details: error.message, data: null };

  return { data: data as Order, error: null };
}
