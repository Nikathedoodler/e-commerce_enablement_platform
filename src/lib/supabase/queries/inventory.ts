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
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not Authenticated", data: null };

  let query = supabase
    .from("inventory")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.search) {
    query = query.or(
      `sku.ilike.%${filters.search}%,name.ilike.%${filters.search}%`
    );
  }

  if (filters?.lowStockOnly) {
    query = query.filter("quantity", "lte", "reorder_threshold");
  }

  const { data, error } = await query;

  if (error)
    return {
      error: "Failed To Fetch Inventory",
      details: error.message,
      data: null,
    };

  return { data: data as InventoryItem[], error: null };
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
