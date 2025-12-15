/**
 * Receiving Condition Type
 * Represents the condition of received items
 */
export type ReceivingCondition = "good" | "damaged" | "defective" | "returned";

/**
 * Receiving Log Item Type
 * Matches the receiving_log table schema exactly
 */
export interface ReceivingLogItem {
  id: string; // UUID
  user_id: string; // UUID
  client_id: string | null; // Optional client/supplier identifier
  sku: string;
  quantity: number;
  condition: ReceivingCondition;
  location: string | null;
  received_at: string; // TIMESTAMPTZ (ISO string)
  notes: string | null;
  created_at: string; // TIMESTAMPTZ (ISO string)
}

/**
 * Receiving Log Input Type (for creating receiving logs)
 * Omits auto-generated fields
 */
export type ReceivingLogInput = Omit<
  ReceivingLogItem,
  "id" | "user_id" | "created_at"
> & {
  user_id?: string; // Optional for updates, required for creates
  item_name?: string; // Optional: used when creating new inventory item (not stored in receiving_log)
};

/**
 * Receiving Log Update Type (partial updates)
 */
export type ReceivingLogUpdate = Partial<
  Pick<
    ReceivingLogItem,
    "client_id" | "sku" | "quantity" | "condition" | "location" | "received_at" | "notes"
  >
>;

