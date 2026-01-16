"use server";

import { createClient } from "@/lib/supabase/server";
import type { Order, OrderInput, OrderUpdate } from "@/types/orders";
import { getSubscription } from "./subscriptions";

export async function getOrders(filters?: {
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Valid sort columns for orders
  const validSortColumns = [
    "order_number",
    "customer_email",
    "status",
    "total",
    "created_at",
  ];
  const sortBy = filters?.sortBy && validSortColumns.includes(filters.sortBy)
    ? filters.sortBy
    : "created_at";
  const sortOrder = filters?.sortOrder === "asc" ? "asc" : "desc";

  // Build the base query for counting
  let countQuery = supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  // Build the query for data
  let query = supabase
    .from("orders")
    .select("*")
    .order(sortBy, { ascending: sortOrder === "asc" });

  // Apply filters if provided
  if (filters?.status) {
    query = query.eq("status", filters.status);
    countQuery = countQuery.eq("status", filters.status);
  }

  if (filters?.search) {
    const searchFilter = `order_number.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%`;
    query = query.or(searchFilter);
    countQuery = countQuery.or(searchFilter);
  }

  // Get total count
  const { count, error: countError } = await countQuery;

  if (countError) {
    return { error: countError.message, data: null };
  }

  // Apply pagination
  query = query.range(from, to);

  // Execute query
  const { data, error } = await query;

  if (error) {
    return { error: error.message, data: null };
  }

  const totalItems = count ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    data: data as Order[],
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
    error: null,
  };
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
  const orderNumber = orderData.order_number?.trim() || generateOrderNumber();

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

  // Get previous order status before update (for auto-label generation)
  const { data: previousOrder } = await getOrderById(id);
  const previousStatus = previousOrder?.status;

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return { error: "Failed To Update", details: error.message, data: null };

  // Trigger auto-label generation if status changed to "processing"
  // Do this asynchronously so it doesn't block the order update
  if (
    updates.status === "processing" &&
    previousStatus !== "processing"
  ) {
    console.log(
      `[AUTO-LABEL] Order ${id} status changed from "${previousStatus}" to "processing" - triggering auto-generation`
    );
    // Import and call auto-generation (fire and forget)
    import("@/lib/shipping/auto-generate")
      .then(({ triggerAutoLabelGeneration }) => {
        console.log(`[AUTO-LABEL] Calling triggerAutoLabelGeneration for order ${id}`);
        return triggerAutoLabelGeneration(id, previousStatus);
      })
      .then((result) => {
        if (result.success) {
          console.log(`[AUTO-LABEL] Successfully auto-generated label for order ${id}`);
        } else {
          console.error(`[AUTO-LABEL] Failed to auto-generate label for order ${id}:`, result.error);
        }
      })
      .catch((error) => {
        console.error("[AUTO-LABEL] Error triggering auto-label generation:", error);
        // Don't fail the order update if auto-generation fails
      });
  }

  return { data: data as Order, error: null };
}

export async function deleteOrder(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated", data: null };
  }

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

export async function getSubscriptionPeriodOrderCount() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  const { data, error } = await getSubscription();

  if (error) {
    return { error: error, data: null };
  }

  if (!data) {
    return { data: 0, error: null };
  }

  // Query orders within the subscription period
  const { count, error: countError } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", data.current_period_start)
    .lt("created_at", data.current_period_end);

  if (countError) {
    return {
      error: "Failed to count orders",
      details: countError.message,
      data: null,
    };
  }

  return { data: count ?? 0, error: null };
}
