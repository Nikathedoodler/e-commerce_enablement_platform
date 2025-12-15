import { z } from "zod";

/**
 * Validation schema for creating/updating receiving log entries
 */
export const createReceivingLogSchema = z.object({
  client_id: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
  condition: z.enum(["good", "damaged", "defective", "returned"], {
    required_error: "Condition is required",
  }),
  location: z.string().optional(),
  received_at: z.preprocess(
    (val) => {
      // Convert empty string to undefined for optional field
      if (typeof val === "string" && val.trim() === "") return undefined;
      return val;
    },
    z
      .string()
      .refine(
        (val) => {
          // Accept datetime-local format (YYYY-MM-DDTHH:mm) or any valid date string
          const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
          return datetimeLocalRegex.test(val) || !isNaN(Date.parse(val));
        },
        {
          message: "Invalid date format",
        }
      )
      .optional()
  ),
  notes: z.string().optional(),
});
