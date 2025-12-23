import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { checkOrderLimitForUser } from "@/lib/utils/usage-limits";
import type {
  ShopifyWebhookOrder,
  ShopifyAddress,
  ShopifyLineItem,
} from "@/types/shopify";
import type { OrderInput, ShippingAddress, OrderItem } from "@/types/orders";

/**
 * Verifies the HMAC signature from Shopify webhook
 * This ensures the request is authentic and hasn't been tampered with
 */
function verifyHmac(
  rawBody: string,
  hmacHeader: string | null,
  secret: string
): boolean {
  if (!hmacHeader) {
    return false;
  }

  // Calculate HMAC using the secret and raw body
  const calculatedHmac = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  // Compare with the header (use timing-safe comparison in production)
  return calculatedHmac === hmacHeader;
}

/**
 * Transforms Shopify address to our ShippingAddress format
 */
function transformAddress(
  shopifyAddress: ShopifyAddress | null
): ShippingAddress {
  if (!shopifyAddress) {
    throw new Error("Shipping address is required");
  }

  return {
    name: shopifyAddress.name || undefined,
    address1: shopifyAddress.address1,
    address2: shopifyAddress.address2 || undefined,
    city: shopifyAddress.city,
    state: shopifyAddress.province || undefined,
    zip: shopifyAddress.zip,
    country: shopifyAddress.country,
    phone: shopifyAddress.phone || undefined,
  };
}

/**
 * Transforms Shopify line items to our OrderItem format
 */
function transformLineItems(shopifyItems: ShopifyLineItem[]): OrderItem[] {
  return shopifyItems.map((item) => ({
    sku: item.sku || `SHOPIFY-${item.id}`, // Fallback if no SKU
    name: item.name || item.title,
    quantity: item.quantity,
    price: parseFloat(item.price) || 0,
    total: item.quantity * (parseFloat(item.price) || 0),
  }));
}

/**
 * Maps Shopify financial status to our FinancialStatus type
 */
function mapFinancialStatus(
  shopifyStatus: string
): "pending" | "paid" | "refunded" | "partially_refunded" {
  const status = shopifyStatus.toLowerCase();
  if (status === "paid") return "paid";
  if (status === "refunded") return "refunded";
  if (status === "partially_refunded") return "partially_refunded";
  return "pending";
}

/**
 * Maps Shopify fulfillment status to our OrderStatus type
 */
function mapOrderStatus(
  fulfillmentStatus: string | null,
  cancelledAt: string | null
): "pending" | "processing" | "fulfilled" | "cancelled" {
  if (cancelledAt) return "cancelled";
  if (fulfillmentStatus === "fulfilled") return "fulfilled";
  if (fulfillmentStatus === "partial") return "processing";
  return "pending";
}

/**
 * Transforms Shopify webhook order to our OrderInput format
 */
function transformShopifyOrder(
  shopifyOrder: ShopifyWebhookOrder,
  shopId: string
): OrderInput {
  const items = transformLineItems(shopifyOrder.line_items);
  const shippingAddress = transformAddress(shopifyOrder.shipping_address);
  const total = parseFloat(shopifyOrder.total_price) || 0;

  return {
    shop_id: shopId,
    order_number: shopifyOrder.name, // e.g., "#1001"
    status: mapOrderStatus(
      shopifyOrder.fulfillment_status,
      shopifyOrder.cancelled_at
    ),
    customer_email: shopifyOrder.email || "",
    shipping_address: shippingAddress,
    items: items,
    financial_status: mapFinancialStatus(shopifyOrder.financial_status),
    total: total,
    tracking_number: null, // Will be updated when order is fulfilled
  };
}

/**
 * POST /api/webhooks/shopify/orders
 * Handles incoming order webhooks from Shopify
 *
 * Headers from Shopify:
 * - X-Shopify-Topic: orders/create (or orders/updated, etc.)
 * - X-Shopify-Shop-Domain: shop.myshopify.com
 * - X-Shopify-Hmac-Sha256: HMAC signature
 */
export async function POST(req: NextRequest) {
  console.log("=== Webhook received ===");
  try {
    // Get the raw body as text (needed for HMAC verification)
    // Note: In Next.js, we need to read the body before parsing JSON
    const rawBody = await req.text();
    console.log("Raw body length:", rawBody.length);

    // Get HMAC signature from header
    const hmacHeader = req.headers.get("X-Shopify-Hmac-Sha256");
    const shopDomain = req.headers.get("X-Shopify-Shop-Domain");
    // topic header is available for future use if needed to handle different webhook types

    // Validate required headers
    if (!hmacHeader || !shopDomain) {
      console.error("Missing required webhook headers");
      return NextResponse.json(
        { error: "Missing required headers" },
        { status: 400 }
      );
    }

    // Verify HMAC signature
    // For manually created webhooks, use SHOPIFY_WEBHOOK_SECRET (store's webhook secret)
    // For API-registered webhooks, use SHOPIFY_API_SECRET (app's client secret)
    const webhookSecret =
      process.env.SHOPIFY_WEBHOOK_SECRET || process.env.SHOPIFY_API_SECRET;
    if (!webhookSecret) {
      console.error("Missing Shopify webhook secret");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!verifyHmac(rawBody, hmacHeader, webhookSecret)) {
      console.error("Invalid HMAC signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    console.log("HMAC signature verified successfully");

    // Parse the order data
    let shopifyOrder: ShopifyWebhookOrder;
    try {
      shopifyOrder = JSON.parse(rawBody);
      console.log("Order parsed:", shopifyOrder.name, "from", shopDomain);
    } catch (error) {
      console.error("Failed to parse webhook body:", error);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Find the shop by domain to get user_id and shop_id
    // Use service role client to bypass RLS (webhooks don't have user sessions)
    const supabase = createServiceRoleClient();
    const { data: shop, error: shopError } = await supabase
      .from("shopify_stores")
      .select("id, user_id, shop_domain")
      .eq("shop_domain", shopDomain)
      .eq("status", "active")
      .single();

    if (shopError || !shop) {
      console.error(
        "Shop not found or inactive:",
        shopDomain,
        shopError?.message
      );
      // Return 200 to prevent Shopify from retrying
      // (this might be a test webhook or shop was disconnected)
      return NextResponse.json(
        { received: true, message: "Shop not found" },
        { status: 200 }
      );
    }
    console.log("Shop found:", shop.id, "user_id:", shop.user_id);

    // Check usage limits before creating order
    const usageCheck = await checkOrderLimitForUser(shop.user_id);
    if (usageCheck.error) {
      console.error("Failed to check usage limits:", usageCheck.error);
      // Continue anyway - don't block orders if we can't check limits
    } else if (usageCheck.data && !usageCheck.data.allowed) {
      console.warn(
        `Order limit exceeded for user ${shop.user_id}. Current: ${usageCheck.data.current}/${usageCheck.data.limit}`
      );
      // Return 200 to prevent Shopify from retrying, but don't create the order
      return NextResponse.json(
        {
          received: true,
          error: "Order limit exceeded",
          message: `Order limit of ${usageCheck.data.limit} orders has been reached. Please upgrade your plan to continue processing orders.`,
          current: usageCheck.data.current,
          limit: usageCheck.data.limit,
        },
        { status: 200 }
      );
    }

    // Check if order already exists (idempotency)
    // Use shopify order name (e.g., "#1001") as unique identifier
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("order_number", shopifyOrder.name)
      .eq("shop_id", shop.id)
      .single();

    if (existingOrder) {
      console.log(
        `Order ${shopifyOrder.name} already exists, skipping duplicate`
      );
      return NextResponse.json(
        { received: true, message: "Order already exists" },
        { status: 200 }
      );
    }

    // Transform Shopify order to our format
    let orderInput: OrderInput;
    try {
      orderInput = transformShopifyOrder(shopifyOrder, shop.id);
      console.log(
        "Order transformed:",
        orderInput.order_number,
        "Total:",
        orderInput.total
      );
    } catch (error) {
      console.error("Failed to transform order:", error);
      return NextResponse.json(
        { received: true, error: "Failed to transform order" },
        { status: 200 }
      );
    }

    // Create order in database
    // Note: We need to bypass RLS since we're creating on behalf of the shop owner
    // We'll use the user_id from the shop record
    console.log(
      "Inserting order with user_id:",
      shop.user_id,
      "shop_id:",
      shop.id
    );
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        ...orderInput,
        user_id: shop.user_id, // Set user_id from shop record
      })
      .select()
      .single();

    if (orderError) {
      console.error("Failed to create order:", orderError);
      console.error("Order data:", JSON.stringify(orderInput, null, 2));
      // Return 200 to prevent infinite retries, but log the error
      return NextResponse.json(
        { received: true, error: "Failed to create order" },
        { status: 200 }
      );
    }

    console.log(
      `Successfully created order ${shopifyOrder.name} from ${shopDomain}`
    );

    // Return 200 OK to Shopify
    return NextResponse.json(
      { received: true, order_id: order.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Return 200 to prevent Shopify from retrying on unexpected errors
    // In production, you might want to return 500 for retryable errors
    return NextResponse.json(
      { received: true, error: "Internal server error" },
      { status: 200 }
    );
  }
}
