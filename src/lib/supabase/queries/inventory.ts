"use server";

import { createClient } from "@/lib/supabase/server";
import {
  InventoryItem,
  InventoryInput,
  InventoryUpdate,
} from "@/types/inventory";

export async function getInventoryItems(filters?: {
  lowStockOnly?: string;
  search?: string;
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
    .from("inventory")
    .select("*", { count: "exact", head: true });

  // Build the query for data
  let query = supabase
    .from("inventory")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.search) {
    const searchFilter = `sku.ilike.%${filters.search}%,name.ilike.%${filters.search}%`;
    query = query.or(searchFilter);
    countQuery = countQuery.or(searchFilter);
  }

  // Get total count before filtering
  const { count, error: countError } = await countQuery;

  if (countError)
    return {
      error: "Failed To Fetch Inventory",
      details: countError.message,
      data: null,
    };

  // Apply pagination
  query = query.range(from, to);

  // Execute query
  const { data, error } = await query;

  if (error)
    return {
      error: "Failed To Fetch Inventory",
      details: error.message,
      data: null,
    };

  let filteredData = (data as InventoryItem[]) || [];

  // Filter low stock items client-side if requested
  // Low stock = quantity <= reorder_threshold
  // Note: We need to count after filtering for accurate pagination
  if (filters?.lowStockOnly) {
    filteredData = filteredData.filter(
      (item) => item.quantity <= item.reorder_threshold
    );
    // For low stock filtering, we need to fetch all and filter client-side
    // then apply pagination. This is a limitation of Supabase PostgREST.
    // For better performance with large datasets, consider adding a database view or function.
    const allData = await supabase
      .from("inventory")
      .select("*")
      .order("created_at", { ascending: false });

    if (allData.error) {
      return {
        error: "Failed To Fetch Inventory",
        details: allData.error.message,
        data: null,
      };
    }

    const allFiltered = (allData.data as InventoryItem[]).filter(
      (item) => item.quantity <= item.reorder_threshold
    );

    const totalItems = allFiltered.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedData = allFiltered.slice(from, to + 1);

    return {
      data: paginatedData,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
      error: null,
    };
  }

  const totalItems = count ?? 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    data: filteredData,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
    error: null,
  };
}

export async function getInventoryItemById(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not Authenticated", data: null };

  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("id", id)
    .single();

  if (error)
    return {
      error: "Failed to get inventory item",
      details: error.message,
      data: null,
    };

  return { data: data as InventoryItem, error: null };
}

export async function createInventoryItem(inventoryData: InventoryInput) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not Authenticated", data: null };

  const insertData = {
    ...inventoryData,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from("inventory")
    .insert(insertData)
    .select()
    .single();

  if (error)
    return {
      error: "Failed to insert inventory item",
      details: error.message,
      data: null,
    };

  return { data: data as InventoryItem, error: null };
}

export async function updateInventoryItem(
  id: string,
  updates: InventoryUpdate
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not Authenticated", data: null };

  const { data, error } = await supabase
    .from("inventory")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return {
      error: "Failed to update inventory item",
      details: error.message,
      data: null,
    };

  return { data: data as InventoryItem, error: null };
}

export async function deleteInventoryItem(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not Authenticated", data: null };

  const { data, error } = await supabase
    .from("inventory")
    .delete()
    .eq("id", id)
    .select("*")
    .single();

  if (error)
    return {
      error: "Failed to delete invetnory item",
      details: error.message,
      data: null,
    };

  return { data: data as InventoryItem, error: null };
}
