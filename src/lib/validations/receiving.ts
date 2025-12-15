import { z } from "zod";

/**
 * Validation schema for creating/updating receiving log entries
 */
export const createReceivingLogSchema = z.object({
  client_id: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  item_name: z.string().optional(), // Optional: used when creating new inventory item
  quantity: z.number().int().positive("Quantity must be greater than 0"),
  condition: z.enum(["good", "damaged", "defective", "returned"], {
    required_error: "Condition is required",
  }),
  location: z.string().optional(),
  received_at: z
    .string()
    .refine(
      (val) => {
        // Handle empty string (optional field)
        if (!val || val.trim() === "") return true;
        // Accept datetime-local format (YYYY-MM-DDTHH:mm) or any valid date string
        const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        return datetimeLocalRegex.test(val) || !isNaN(Date.parse(val));
      },
      {
        message: "Invalid date format",
      }
    )
    .optional()
    .or(z.literal("")),
  notes: z.string().optional(),
});
