"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  ShopifyStore,
  ShopifyStoreInput,
  ShopifyStoreUpdate,
} from "@/types/shopify";

export async function getShopifyStores() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  const query = supabase
    .from("shopify_stores")
    .select("*")
    .order("connected_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    return {
      error: "Failed to get stores",
      details: error.message,
      data: null,
    };
  }

  return { data: data as ShopifyStore[], error: null };
}

export async function getShopifyStoreById(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  const query = supabase
    .from("shopify_stores")
    .select("*")
    .eq("id", id)
    .single();

  const { data, error } = await query;

  if (error) {
    return {
      error: "Failed to get store",
      details: error.message,
      data: null,
    };
  }

  return { data: data as ShopifyStore, error: null };
}

export async function upsertShopifyStore(storeData: ShopifyStoreInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not Authenticated", data: null };

  const upsertData = {
    ...storeData,
    user_id: user.id,
    connected_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("shopify_stores")
    .upsert(upsertData, {
      onConflict: "user_id,shop_domain",
    })
    .select()
    .single();

  if (error) {
    return {
      error: "Failed to upsert shopify store",
      details: error.message,
      data: null,
    };
  }

  return { data: data as ShopifyStore, error: null };
}

export async function updateShopifyStore(
  id: string,
  updates: ShopifyStoreUpdate
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not Authenticated", data: null };

  const { data, error } = await supabase
    .from("shopify_stores")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      error: "Failed to update shopify store",
      details: error.message,
      data: null,
    };
  }

  return { data: data as ShopifyStore, error: null };
}

export async function deleteShopifyStore(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return { error: "Not Authenticated", data: null };

  const { data, error } = await supabase
    .from("shopify_stores")
    .delete()
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return {
      error: "Failed to delete shopify store",
      details: error.message,
      data: null,
    };
  }

  return { data: data as ShopifyStore, error: null };
}
