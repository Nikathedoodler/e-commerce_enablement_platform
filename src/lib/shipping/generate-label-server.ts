"use server";

import { createClient } from "@/lib/supabase/server";
import { generateDHLLabel } from "@/lib/shipping/dhl";
import { createShippingLabel } from "@/lib/supabase/queries/shipping";
import type { DHLLabelRequest } from "@/types/shipping";

/**
 * Server-side function to generate a shipping label
 * This can be called from server actions without HTTP requests
 */
export async function generateLabelServer(
  labelRequest: DHLLabelRequest
): Promise<{ success: boolean; error?: string; trackingNumber?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify the order belongs to the user
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, user_id, tracking_number")
      .eq("id", labelRequest.orderId)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      return { success: false, error: "Order not found or access denied" };
    }

    // Generate label using DHL API wrapper
    const { label, error: labelError } = await generateDHLLabel(labelRequest);

    if (labelError) {
      return { success: false, error: labelError };
    }

    // Save label metadata to shipping_labels table
    const labelInput = {
      order_id: labelRequest.orderId,
      carrier: "DHL" as const,
      label_url: label.labelUrl,
      tracking_number: label.trackingNumber,
      cost: label.cost,
      generated_at: new Date().toISOString(),
    };

    const { data: savedLabel, error: saveError } = await createShippingLabel(
      labelInput
    );

    if (saveError || !savedLabel) {
      console.error("Failed to save shipping label:", saveError);
      // Still return success if label was generated, even if save fails
      return {
        success: true,
        trackingNumber: label.trackingNumber,
        error: "Label generated but failed to save to database",
      };
    }

    // Update order tracking number if not already set
    if (order.tracking_number !== label.trackingNumber) {
      await supabase
        .from("orders")
        .update({ tracking_number: label.trackingNumber })
        .eq("id", labelRequest.orderId);
    }

    return { success: true, trackingNumber: label.trackingNumber };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error generating label:", errorMessage, error);
    return { success: false, error: errorMessage };
  }
}
