import { z } from "zod";

/**
 * Validation schema for creating/updating inventory items
 */
export const createInventorySchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Product name is required"),
  quantity: z.number().int().nonnegative("Quantity must be 0 or greater"),
  location: z.string().optional(),
  reorder_threshold: z
    .number()
    .int()
    .nonnegative("Reorder threshold must be 0 or greater"),
});
