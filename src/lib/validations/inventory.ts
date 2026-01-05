import { z } from "zod";

/**
 * Validation schema for creating/updating inventory items
 */
export const createInventorySchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Product name is required"),
  quantity: z
    .number()
    .int()
    .min(1, "Quantity must be at least 1 when creating a new item"),
  location: z.string().optional(),
  reorder_threshold: z
    .number()
    .int()
    .nonnegative("Reorder threshold must be 0 or greater"),
});
