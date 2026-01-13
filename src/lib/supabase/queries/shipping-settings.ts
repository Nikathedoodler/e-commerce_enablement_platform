"use server";

import { createClient } from "@/lib/supabase/server";
import type { ShippingSettings, ShippingSettingsUpdate } from "@/types/shipping";

/**
 * Get shipping settings for the current user
 */
export async function getShippingSettings(): Promise<{
  data: ShippingSettings | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Not Authenticated" };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      auto_generate_labels,
      default_package_weight,
      default_package_length,
      default_package_width,
      default_package_height,
      default_service_type,
      auto_generate_rules,
      shipper_name,
      shipper_company_name,
      shipper_address1,
      shipper_address2,
      shipper_city,
      shipper_state,
      shipper_postal_code,
      shipper_country,
      shipper_phone,
      shipper_email
    `
    )
    .eq("id", user.id)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  if (!data) {
    return { data: null, error: "Profile not found" };
  }

  // Transform database format to ShippingSettings type
  const settings: ShippingSettings = {
    auto_generate_labels: data.auto_generate_labels ?? false,
    default_package_weight: Number(data.default_package_weight) || 1.0,
    default_package_length: data.default_package_length
      ? Number(data.default_package_length)
      : undefined,
    default_package_width: data.default_package_width
      ? Number(data.default_package_width)
      : undefined,
    default_package_height: data.default_package_height
      ? Number(data.default_package_height)
      : undefined,
    default_service_type:
      (data.default_service_type as ShippingSettings["default_service_type"]) ||
      "EXPRESS_WORLDWIDE",
    auto_generate_rules: (data.auto_generate_rules as ShippingSettings["auto_generate_rules"]) || {
      shopify_orders: false,
      manual_orders: false,
      on_status_processing: true,
    },
    shipper_name: data.shipper_name || undefined,
    shipper_company_name: data.shipper_company_name || undefined,
    shipper_address1: data.shipper_address1 || undefined,
    shipper_address2: data.shipper_address2 || undefined,
    shipper_city: data.shipper_city || undefined,
    shipper_state: data.shipper_state || undefined,
    shipper_postal_code: data.shipper_postal_code || undefined,
    shipper_country: data.shipper_country || "GE",
    shipper_phone: data.shipper_phone || undefined,
    shipper_email: data.shipper_email || undefined,
  };

  return { data: settings, error: null };
}

/**
 * Update shipping settings for the current user
 */
export async function updateShippingSettings(
  updates: ShippingSettingsUpdate
): Promise<{ data: ShippingSettings | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Not Authenticated" };
  }

  // Prepare update object (only include defined fields)
  const updateData: Record<string, unknown> = {};

  if (updates.auto_generate_labels !== undefined) {
    updateData.auto_generate_labels = updates.auto_generate_labels;
  }
  if (updates.default_package_weight !== undefined) {
    updateData.default_package_weight = updates.default_package_weight;
  }
  if (updates.default_package_length !== undefined) {
    updateData.default_package_length = updates.default_package_length;
  }
  if (updates.default_package_width !== undefined) {
    updateData.default_package_width = updates.default_package_width;
  }
  if (updates.default_package_height !== undefined) {
    updateData.default_package_height = updates.default_package_height;
  }
  if (updates.default_service_type !== undefined) {
    updateData.default_service_type = updates.default_service_type;
  }
  if (updates.auto_generate_rules !== undefined) {
    updateData.auto_generate_rules = updates.auto_generate_rules;
  }
  if (updates.shipper_name !== undefined) {
    updateData.shipper_name = updates.shipper_name || null;
  }
  if (updates.shipper_company_name !== undefined) {
    updateData.shipper_company_name = updates.shipper_company_name || null;
  }
  if (updates.shipper_address1 !== undefined) {
    updateData.shipper_address1 = updates.shipper_address1 || null;
  }
  if (updates.shipper_address2 !== undefined) {
    updateData.shipper_address2 = updates.shipper_address2 || null;
  }
  if (updates.shipper_city !== undefined) {
    updateData.shipper_city = updates.shipper_city || null;
  }
  if (updates.shipper_state !== undefined) {
    updateData.shipper_state = updates.shipper_state || null;
  }
  if (updates.shipper_postal_code !== undefined) {
    updateData.shipper_postal_code = updates.shipper_postal_code || null;
  }
  if (updates.shipper_country !== undefined) {
    updateData.shipper_country = updates.shipper_country || null;
  }
  if (updates.shipper_phone !== undefined) {
    updateData.shipper_phone = updates.shipper_phone || null;
  }
  if (updates.shipper_email !== undefined) {
    updateData.shipper_email = updates.shipper_email || null;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    return { data: null, error: error.message };
  }

  // Return updated settings
  return getShippingSettings();
}
