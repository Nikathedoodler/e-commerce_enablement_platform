"use server";

import { getShippingSettings } from "@/lib/supabase/queries/shipping-settings";
import { getOrderById } from "@/lib/supabase/queries/orders";
import type { Order } from "@/types/orders";
import type { ShippingAddress } from "@/types/orders";
import type { DHLLabelRequest } from "@/types/shipping";

/**
 * Check if auto-generation should be triggered for an order
 */
async function shouldAutoGenerate(
  order: Order,
  previousStatus?: string
): Promise<{ shouldGenerate: boolean; reason?: string }> {
  console.log(`[AUTO-LABEL] Checking if should auto-generate for order ${order.order_number}, status: ${order.status}, previousStatus: ${previousStatus}`);
  const { data: settings, error } = await getShippingSettings();

  if (error || !settings) {
    console.log(`[AUTO-LABEL] Settings check failed: ${error || "Settings not found"}`);
    return { shouldGenerate: false, reason: "Settings not found" };
  }

  console.log(`[AUTO-LABEL] Settings loaded - auto_generate_labels: ${settings.auto_generate_labels}, rules:`, settings.auto_generate_rules);

  // Check if auto-generation is enabled
  if (!settings.auto_generate_labels) {
    console.log(`[AUTO-LABEL] Auto-generation is disabled in settings`);
    return { shouldGenerate: false, reason: "Auto-generation disabled" };
  }

  // Check if status changed to "processing"
  if (
    order.status === "processing" &&
    previousStatus !== "processing" &&
    settings.auto_generate_rules?.on_status_processing
  ) {
    return { shouldGenerate: true, reason: "Status changed to processing" };
  }

  // Check if order is from Shopify and Shopify auto-generation is enabled
  if (
    order.shop_id &&
    settings.auto_generate_rules?.shopify_orders &&
    order.status === "pending"
  ) {
    return { shouldGenerate: true, reason: "Shopify order with auto-generation enabled" };
  }

  // Check if manual order auto-generation is enabled
  if (
    !order.shop_id &&
    settings.auto_generate_rules?.manual_orders &&
    order.status === "pending"
  ) {
    return { shouldGenerate: true, reason: "Manual order with auto-generation enabled" };
  }

  return { shouldGenerate: false, reason: "No matching auto-generation rule" };
}

/**
 * Build label request from order and settings
 */
async function buildLabelRequest(
  order: Order,
  settings: Awaited<ReturnType<typeof getShippingSettings>>["data"]
): Promise<DHLLabelRequest | null> {
  if (!settings) {
    return null;
  }

  // Validate required shipper information
  if (
    !settings.shipper_name ||
    !settings.shipper_address1 ||
    !settings.shipper_city ||
    !settings.shipper_postal_code ||
    !settings.shipper_country ||
    !settings.shipper_phone
  ) {
    console.error("Missing required shipper information in settings");
    return null;
  }

  // Validate order has shipping address
  const shippingAddress = order.shipping_address as ShippingAddress | null;
  if (
    !shippingAddress ||
    !shippingAddress.address1 ||
    !shippingAddress.city ||
    !shippingAddress.zip ||
    !shippingAddress.country
  ) {
    console.error("Order missing required shipping address");
    return null;
  }

  // Build package dimensions if all are provided
  const dimensions =
    settings.default_package_length &&
    settings.default_package_width &&
    settings.default_package_height
      ? {
          length: settings.default_package_length,
          width: settings.default_package_width,
          height: settings.default_package_height,
        }
      : undefined;

  const labelRequest: DHLLabelRequest = {
    orderId: order.id,
    orderNumber: order.order_number,
    shipper: {
      name: settings.shipper_name,
      companyName: settings.shipper_company_name,
      address1: settings.shipper_address1,
      address2: settings.shipper_address2,
      city: settings.shipper_city,
      state: settings.shipper_state,
      postalCode: settings.shipper_postal_code,
      country: settings.shipper_country,
      phone: settings.shipper_phone,
      email: settings.shipper_email,
    },
    recipient: shippingAddress,
    package: {
      weight: settings.default_package_weight,
      dimensions,
      description: `Order ${order.order_number}`,
    },
    serviceType: settings.default_service_type,
  };

  return labelRequest;
}

/**
 * Trigger automatic label generation for an order
 * This is called asynchronously and errors are logged but don't block the order update
 */
export async function triggerAutoLabelGeneration(
  orderId: string,
  previousStatus?: string
): Promise<{ success: boolean; error?: string }> {
  console.log(`[AUTO-LABEL] triggerAutoLabelGeneration called for order ${orderId}, previousStatus: ${previousStatus}`);
  try {
    // Get the order
    const { data: order, error: orderError } = await getOrderById(orderId);

    if (orderError || !order) {
      return {
        success: false,
        error: `Order not found: ${orderError || "Unknown error"}`,
      };
    }

    // Check if auto-generation should be triggered
    const { shouldGenerate, reason } = await shouldAutoGenerate(
      order,
      previousStatus
    );

    if (!shouldGenerate) {
      console.log(
        `Skipping auto-generation for order ${order.order_number}: ${reason}`
      );
      return { success: false, error: reason };
    }

    console.log(
      `Auto-generating label for order ${order.order_number}: ${reason}`
    );

    // Get shipping settings
    const { data: settings, error: settingsError } = await getShippingSettings();

    if (settingsError || !settings) {
      return {
        success: false,
        error: `Settings error: ${settingsError || "Settings not found"}`,
      };
    }

    // Build label request
    const labelRequest = await buildLabelRequest(order, settings);

    if (!labelRequest) {
      return {
        success: false,
        error: "Failed to build label request (missing required information)",
      };
    }

    // Call the server-side label generation function
    const { generateLabelServer } = await import("./generate-label-server");
    const result = await generateLabelServer(labelRequest);

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Label generation failed",
      };
    }

    console.log(
      `Successfully auto-generated label for order ${order.order_number}${result.trackingNumber ? ` (Tracking: ${result.trackingNumber})` : ""}`
    );
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error in auto-label generation:", errorMessage, error);
    return { success: false, error: errorMessage };
  }
}
