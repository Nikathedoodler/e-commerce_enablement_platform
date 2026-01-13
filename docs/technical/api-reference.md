# API Reference

Technical documentation for API endpoints and webhooks.

## Table of Contents

1. [Authentication](#authentication)
2. [API Endpoints](#api-endpoints)
3. [Webhooks](#webhooks)
4. [Error Handling](#error-handling)

---

## Authentication

All API endpoints require authentication via Supabase session cookies.

**Headers Required:**

```
Cookie: sb-<project-ref>-auth-token=<session-token>
```

**Unauthorized Response:**

```json
{
  "error": "Unauthorized"
}
```

Status: `401`

---

## API Endpoints

### Shipping

#### Calculate Shipping Rates

**POST** `/api/shipping/dhl/rate`

Calculate shipping rates for an order.

**Request Body:**

```json
{
  "origin": {
    "country": "GE",
    "city": "Kutaisi",
    "postalCode": "4600"
  },
  "destination": {
    "address1": "123 Main St",
    "city": "New York",
    "zip": "10001",
    "country": "US",
    "name": "John Doe",
    "phone": "+1234567890"
  },
  "package": {
    "weight": 1.5,
    "dimensions": {
      "length": 30,
      "width": 20,
      "height": 15
    }
  },
  "serviceType": "EXPRESS_WORLDWIDE"
}
```

**Response:**

```json
{
  "rates": [
    {
      "serviceType": "EXPRESS_WORLDWIDE",
      "serviceName": "DHL Express Worldwide",
      "totalPrice": 45.99,
      "currency": "EUR",
      "deliveryTime": {
        "min": 2,
        "max": 5
      },
      "estimatedDeliveryDate": "2025-01-15T12:00:00Z"
    }
  ]
}
```

**Errors:**

- `400`: Missing required fields
- `401`: Unauthorized
- `500`: DHL API error

---

#### Generate Shipping Label

**POST** `/api/shipping/dhl/label`

Generate a shipping label for an order. This endpoint supports both manual and automatic generation (via server-side function). All generation attempts are logged in the audit log.

**Note:** Labels can also be generated automatically when order status changes to "processing" (if auto-generation is enabled in settings). See [Shipping Settings Guide](../user-guides/shipping-settings.md) for configuration.

**Request Body:**

```json
{
  "orderId": "uuid",
  "orderNumber": "ORD-20250101-120000",
  "shipper": {
    "name": "Your Company",
    "companyName": "Your Company Inc",
    "address1": "Warehouse Address",
    "city": "Kutaisi",
    "postalCode": "4600",
    "country": "GE",
    "phone": "+995 XXX XXX XXX"
  },
  "recipient": {
    "address1": "123 Main St",
    "city": "New York",
    "zip": "10001",
    "country": "US"
  },
  "package": {
    "weight": 1.5,
    "dimensions": {
      "length": 30,
      "width": 20,
      "height": 15
    },
    "description": "Electronics"
  },
  "serviceType": "EXPRESS_WORLDWIDE",
  "options": {
    "insuranceValue": 100,
    "signatureRequired": false
  }
}
```

**Response:**

```json
{
  "label": {
    "id": "uuid",
    "trackingNumber": "1234567890",
    "labelUrl": "https://...",
    "cost": 45.99,
    "currency": "EUR",
    "estimatedDeliveryDate": "2025-01-15T12:00:00Z",
    "serviceType": "EXPRESS_WORLDWIDE",
    "generatedAt": "2025-01-10T10:00:00Z"
  }
}
```

**Errors:**

- `400`: Missing required fields or invalid order
- `401`: Unauthorized
- `404`: Order not found
- `500`: DHL API error

**Audit Logging:**
- All label generation attempts (manual and automatic) are logged
- Check Generation History in order detail dialog for audit trail
- Failed attempts include error messages for debugging

---

### Shipping Settings & Audit Log

**Note:** These are server actions, not HTTP endpoints. Access via query functions.

#### Shipping Settings
- `getShippingSettings()` - Get current user's shipping settings
- `updateShippingSettings(updates)` - Update shipping settings

#### Label Generation Audit Log
- `getLabelAuditLogByOrderId(orderId)` - Get audit log entries for an order
- `getLabelAuditLogs(filters?)` - Get all audit log entries with optional filters

**Audit Log Entry Structure:**
```typescript
{
  id: string;
  order_id: string;
  label_id: string | null;
  generation_type: "auto" | "manual";
  status: "pending" | "success" | "failed";
  error_message: string | null;
  tracking_number: string | null;
  carrier: string | null;
  cost: number | null;
  triggered_by: string | null; // "status_change" | "shopify_webhook" | "manual_click"
  metadata: Record<string, unknown>;
  created_at: string;
}
```

---

### Stripe

#### Create Checkout Session

**POST** `/api/stripe/checkout`

Create a Stripe Checkout session for subscription.

**Request Body:**

```json
{
  "planTier": "starter"
}
```

**Response:**

```json
{
  "url": "https://checkout.stripe.com/..."
}
```

**Errors:**

- `400`: Invalid plan tier
- `401`: Unauthorized
- `500`: Stripe API error

---

#### Create Customer Portal Session

**POST** `/api/stripe/portal`

Create a Stripe Customer Portal session.

**Response:**

```json
{
  "url": "https://billing.stripe.com/..."
}
```

**Errors:**

- `401`: Unauthorized
- `404`: No subscription found
- `500`: Stripe API error

---

## Webhooks

### Shopify Webhooks

#### Order Webhook

**POST** `/api/webhooks/shopify/orders`

Receives order webhooks from Shopify.

**Headers:**

- `X-Shopify-Topic`: Event type (e.g., "orders/create")
- `X-Shopify-Shop-Domain`: Shop domain
- `X-Shopify-Hmac-Sha256`: HMAC signature

**Security:**

- HMAC signature verification required
- Uses `SHOPIFY_WEBHOOK_SECRET` or `SHOPIFY_API_SECRET`

**Response:**

```json
{
  "received": true,
  "order_id": "uuid"
}
```

Always returns `200` to prevent retries (errors are logged).

---

### Stripe Webhooks

#### Stripe Webhook Handler

**POST** `/api/webhooks/stripe`

Handles Stripe webhook events.

**Headers:**

- `Stripe-Signature`: Webhook signature

**Security:**

- Signature verification required
- Uses `STRIPE_WEBHOOK_SECRET`

**Supported Events:**

- `checkout.session.completed`: Creates subscription
- `customer.subscription.updated`: Updates subscription
- `customer.subscription.deleted`: Cancels subscription

**Response:**

```json
{
  "received": true
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

### HTTP Status Codes

- `200`: Success
- `400`: Bad Request (validation error)
- `401`: Unauthorized (authentication required)
- `404`: Not Found
- `500`: Internal Server Error

### Common Errors

**Unauthorized:**

```json
{
  "error": "Unauthorized"
}
```

**Validation Error:**

```json
{
  "error": "Missing required fields: origin, destination, and package are required"
}
```

**Not Found:**

```json
{
  "error": "Order not found or access denied"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider implementing for production.

---

## Webhook Retries

- Shopify: Retries on non-200 responses
- Stripe: Retries on non-200 responses
- Always return `200` for webhooks to prevent infinite retries
- Log errors for debugging

---

**Last Updated**: 2025-01-XX
