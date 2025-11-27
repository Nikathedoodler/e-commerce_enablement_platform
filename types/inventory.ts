/**
 * Inventory Item Type
 * Matches the inventory table schema exactly
 */
export interface InventoryItem {
  id: string; // UUID
  user_id: string; // UUID
  sku: string;
  name: string;
  quantity: number;
  location: string | null;
  reorder_threshold: number;
  created_at: string; // TIMESTAMPTZ (ISO string)
  updated_at: string; // TIMESTAMPTZ (ISO string)
}

/**
 * Inventory Input Type (for creating/updating inventory)
 * Omits auto-generated fields
 */
export type InventoryInput = Omit<
  InventoryItem,
  "id" | "user_id" | "created_at" | "updated_at"
> & {
  user_id?: string; // Optional for updates, required for creates
};

/**
 * Inventory Update Type (partial updates)
 */
export type InventoryUpdate = Partial<
  Pick<
    InventoryItem,
    "sku" | "name" | "quantity" | "location" | "reorder_threshold"
  >
>;
