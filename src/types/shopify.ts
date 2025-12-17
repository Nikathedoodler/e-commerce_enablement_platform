/**
 * Shopify Store Status Types
 * Matches the CHECK constraint in the database schema
 */
export type ShopifyStoreStatus = "active" | "inactive" | "disconnected";

/**
 * Shopify Store Type
 * Matches the shopify_stores table schema exactly
 */
export interface ShopifyStore {
  id: string; // UUID
  user_id: string; // UUID
  shop_domain: string; // e.g., "mystore.myshopify.com"
  access_token: string; // Encrypted OAuth access token
  scopes: string; // Comma-separated list of granted scopes
  status: ShopifyStoreStatus;
  connected_at: string; // TIMESTAMPTZ (ISO string)
  created_at: string; // TIMESTAMPTZ (ISO string)
  updated_at: string; // TIMESTAMPTZ (ISO string)
}

/**
 * Shopify Store Input Type (for creating stores)
 * Omits auto-generated fields
 */
export type ShopifyStoreInput = Omit<
  ShopifyStore,
  "id" | "user_id" | "created_at" | "updated_at" | "connected_at"
> & {
  user_id?: string; // Optional for updates, required for creates
};

/**
 * Shopify Store Update Type (partial updates)
 */
export type ShopifyStoreUpdate = Partial<
  Pick<ShopifyStore, "access_token" | "scopes" | "status">
>;

/**
 * Shopify OAuth Callback Query Parameters
 */
export interface ShopifyOAuthCallback {
  code: string;
  shop: string; // Shop domain
  state: string; // Nonce for CSRF protection
  hmac?: string; // HMAC for verification
  timestamp?: string;
}

/**
 * Shopify OAuth Initiation Response
 */
export interface ShopifyOAuthInitResponse {
  authUrl: string;
  state: string; // Nonce to verify on callback
}

/**
 * Shopify Webhook Order Payload
 * Based on Shopify Order API structure
 */
export interface ShopifyWebhookOrder {
  id: number;
  name: string; // Order name (e.g., "#1001")
  email: string;
  created_at: string;
  updated_at: string;
  number: number;
  note: string | null;
  token: string;
  gateway: string | null;
  test: boolean;
  total_price: string;
  subtotal_price: string;
  total_weight: number;
  total_tax: string;
  taxes_included: boolean;
  currency: string;
  financial_status: string;
  confirmed: boolean;
  total_discounts: string;
  buyer_accepts_marketing: boolean;
  referring_site: string | null;
  landing_site: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  total_line_items_price: string;
  total_duties: string;
  billing_address: ShopifyAddress | null;
  shipping_address: ShopifyAddress | null;
  customer: ShopifyCustomer | null;
  line_items: ShopifyLineItem[];
  shipping_lines: ShopifyShippingLine[];
  fulfillment_status: string | null;
  tags: string;
  note_attributes: Array<{ name: string; value: string }>;
}

/**
 * Shopify Address Structure
 */
export interface ShopifyAddress {
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  address1: string;
  address2: string | null;
  city: string;
  province: string | null;
  country: string;
  zip: string;
  phone: string | null;
  name: string;
  province_code: string | null;
  country_code: string;
  country_name: string;
}

/**
 * Shopify Customer Structure
 */
export interface ShopifyCustomer {
  id: number;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}

/**
 * Shopify Line Item Structure
 */
export interface ShopifyLineItem {
  id: number;
  variant_id: number | null;
  title: string;
  quantity: number;
  sku: string;
  variant_title: string | null;
  vendor: string | null;
  fulfillment_service: string;
  product_id: number | null;
  requires_shipping: boolean;
  taxable: boolean;
  gift_card: boolean;
  name: string;
  variant_inventory_management: string | null;
  properties: Array<{ name: string; value: string }>;
  product_exists: boolean;
  fulfillable_quantity: number;
  grams: number;
  price: string;
  total_discount: string;
  fulfillment_status: string | null;
  discount_allocations: Array<{
    amount: string;
    discount_application_index: number;
  }>;
  duties: Array<unknown>;
  admin_graphql_api_id: string;
}

/**
 * Shopify Shipping Line Structure
 */
export interface ShopifyShippingLine {
  id: number;
  title: string;
  price: string;
  code: string | null;
  source: string;
  phone: string | null;
  requested_fulfillment_service_id: string | null;
  delivery_category: string | null;
  carrier_identifier: string | null;
  discounted_price: string;
  tax_lines: Array<{
    title: string;
    price: string;
    rate: number;
  }>;
}
