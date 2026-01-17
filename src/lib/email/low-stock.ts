"use server";

import { EmailService } from "@/lib/email/service";
import { getLowStockEmailTemplate } from "@/lib/email/templates/low-stock";
import { getUserEmail } from "@/lib/email/helpers";
import { getInventoryUrl } from "@/lib/email/url-helpers";
import type { InventoryItem } from "@/types/inventory";

/**
 * Check if item is low stock and send email notification if needed
 * Only sends email if:
 * 1. Current quantity <= reorder_threshold
 * 2. Previous quantity was > reorder_threshold (to avoid duplicate emails)
 */
export async function checkAndNotifyLowStock({
  currentItem,
  previousQuantity,
}: {
  currentItem: InventoryItem;
  previousQuantity?: number;
}): Promise<void> {
  // Only send notification if quantity is at or below threshold
  if (currentItem.quantity > currentItem.reorder_threshold) {
    return;
  }

  // If previous quantity was also low, don't send duplicate email
  // (only notify when it crosses the threshold)
  if (previousQuantity !== undefined && previousQuantity <= currentItem.reorder_threshold) {
    return;
  }

  // Send email notification (non-blocking)
  try {
    const userEmail = await getUserEmail(currentItem.user_id);
    if (!userEmail) {
      console.warn(`Could not get user email for user_id: ${currentItem.user_id}`);
      return;
    }

    const inventoryUrl = getInventoryUrl();
    const emailTemplate = getLowStockEmailTemplate({
      sku: currentItem.sku,
      itemName: currentItem.name,
      currentQuantity: currentItem.quantity,
      reorderThreshold: currentItem.reorder_threshold,
      location: currentItem.location,
      inventoryUrl,
    });

    EmailService.sendEmail({
      to: userEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    }).then((result) => {
      if (result.success) {
        console.log(`Low stock email sent for SKU: ${currentItem.sku}`);
      } else {
        console.error(`Failed to send low stock email: ${result.error}`);
      }
    });
  } catch (error) {
    console.error("Error sending low stock email:", error);
  }
}
