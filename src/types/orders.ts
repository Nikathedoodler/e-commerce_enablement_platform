/**
 * Order Status Types
 * Matches the CHECK constraint in the database schema
 */
export type OrderStatus = "pending" | "processing" | "fulfilled" | "cancelled";

/**
 * Financial Status Types
 * Common e-commerce financial statuses
 */
export type FinancialStatus =
  | "pending"
  | "paid"
  | "refunded"
  | "partially_refunded";

/**
 * Shipping Address Structure
 * JSONB field in orders table
 */
export interface ShippingAddress {
  name?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
  phone?: string;
}

/**
 * Order Item Structure
 * JSONB array item in orders.items
 */
export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  price: number; // Price per unit
  total?: number; // quantity * price (can be calculated)
}

/**
 * Order Type
 * Matches the orders table schema exactly
 */
export interface Order {
  id: string; // UUID
  user_id: string; // UUID
  shop_id: string | null; // UUID, nullable for future Shopify integration
  order_number: string;
  status: OrderStatus;
  customer_email: string;
  shipping_address: ShippingAddress; // JSONB
  items: OrderItem[]; // JSONB array
  financial_status: FinancialStatus;
  total: number; // NUMERIC(12, 2)
  tracking_number: string | null;
  created_at: string; // TIMESTAMPTZ (ISO string)
  updated_at: string; // TIMESTAMPTZ (ISO string)
}

/**
 * Order Input Type (for creating/updating orders)
 * Omits auto-generated fields
 */
export type OrderInput = Omit<
  Order,
  "id" | "user_id" | "created_at" | "updated_at"
> & {
  user_id?: string; // Optional for updates, required for creates
};

/**
 * Order Update Type (partial updates)
 */
export type OrderUpdate = Partial<
  Pick<
    Order,
    | "status"
    | "customer_email"
    | "shipping_address"
    | "items"
    | "financial_status"
    | "total"
    | "tracking_number"
  >
>;
