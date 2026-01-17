"use server";

import { createClient } from "@/lib/supabase/server";
import { generateDHLLabel } from "@/lib/shipping/dhl";
import { createShippingLabel } from "@/lib/supabase/queries/shipping";
import {
  createLabelAuditLogEntry,
  updateLabelAuditLogEntry,
} from "@/lib/supabase/queries/label-audit-log";
import type { DHLLabelRequest } from "@/types/shipping";
import { EmailService } from "@/lib/email/service";
import {
  getLabelSuccessEmailTemplate,
  getLabelFailureEmailTemplate,
} from "@/lib/email/templates/label-generation";
import { getUserEmail } from "@/lib/email/helpers";
import { getOrderUrl } from "@/lib/email/url-helpers";

/**
 * Server-side function to generate a shipping label
 * This can be called from server actions without HTTP requests
 */
export async function generateLabelServer(
  labelRequest: DHLLabelRequest,
  options?: {
    generationType?: "auto" | "manual";
    triggeredBy?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<{ success: boolean; error?: string; trackingNumber?: string; auditLogId?: string }> {
  let auditLogId: string | undefined;
  
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify the order belongs to the user and get order details for email
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, user_id, order_number, tracking_number")
      .eq("id", labelRequest.orderId)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      return { success: false, error: "Order not found or access denied" };
    }

    // Create audit log entry (pending status)
    const auditEntry = await createLabelAuditLogEntry({
      order_id: labelRequest.orderId,
      label_id: null,
      generation_type: options?.generationType || "manual",
      status: "pending",
      error_message: null,
      tracking_number: null,
      carrier: null,
      cost: null,
      triggered_by: options?.triggeredBy || "manual_click",
      metadata: options?.metadata || {},
    });

    if (auditEntry.data) {
      auditLogId = auditEntry.data.id;
    }

    // Generate label using DHL API wrapper
    const { label, error: labelError } = await generateDHLLabel(labelRequest);

    if (labelError) {
      // Update audit log with failure
      if (auditLogId) {
        await updateLabelAuditLogEntry(auditLogId, {
          status: "failed",
          error_message: labelError,
        });
      }

      // Send failure email notification (non-blocking)
      try {
        const userEmail = await getUserEmail(user.id);
        if (userEmail) {
          const orderUrl = getOrderUrl(order.id);
          const emailTemplate = getLabelFailureEmailTemplate({
            orderNumber: order.order_number,
            errorMessage: labelError,
            orderUrl,
          });

          EmailService.sendEmail({
            to: userEmail,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text,
          }).then((result) => {
            if (result.success) {
              console.log(`Failure email sent for order ${order.order_number}`);
            } else {
              console.error(`Failed to send failure email: ${result.error}`);
            }
          });
        }
      } catch (emailError) {
        console.error("Error sending failure email:", emailError);
      }

      return { success: false, error: labelError, auditLogId };
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
      // Update audit log with failure
      if (auditLogId) {
        await updateLabelAuditLogEntry(auditLogId, {
          status: "failed",
          error_message: `Label generated but failed to save: ${saveError}`,
        });
      }
      // Still return success if label was generated, even if save fails
      return {
        success: true,
        trackingNumber: label.trackingNumber,
        error: "Label generated but failed to save to database",
        auditLogId,
      };
    }

    // Update audit log with success
    if (auditLogId) {
      await updateLabelAuditLogEntry(auditLogId, {
        status: "success",
        label_id: savedLabel.id,
        tracking_number: label.trackingNumber,
        carrier: "DHL",
        cost: label.cost,
      });
    }

    // Update order tracking number if not already set
    if (order.tracking_number !== label.trackingNumber) {
      await supabase
        .from("orders")
        .update({ tracking_number: label.trackingNumber })
        .eq("id", labelRequest.orderId);
    }

    // Send success email notification (non-blocking)
    try {
      const userEmail = await getUserEmail(user.id);
      if (userEmail) {
        const orderUrl = getOrderUrl(order.id);
        const emailTemplate = getLabelSuccessEmailTemplate({
          orderNumber: order.order_number,
          trackingNumber: label.trackingNumber,
          carrier: "DHL",
          cost: label.cost,
          orderUrl,
        });

        EmailService.sendEmail({
          to: userEmail,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        }).then((result) => {
          if (result.success) {
            console.log(`Success email sent for order ${order.order_number}`);
          } else {
            console.error(`Failed to send success email: ${result.error}`);
          }
        });
      }
    } catch (emailError) {
      console.error("Error sending success email:", emailError);
    }

    return { success: true, trackingNumber: label.trackingNumber, auditLogId };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error generating label:", errorMessage, error);
    return { success: false, error: errorMessage };
  }
}
