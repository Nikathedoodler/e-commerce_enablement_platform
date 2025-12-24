# Shopify Integration Guide

Connect your Shopify store to automatically sync orders to the platform.

## Table of Contents

1. [Overview](#overview)
2. [Connecting Your Store](#connecting-your-store)
3. [Setting Up Webhooks](#setting-up-webhooks)
4. [Managing Connections](#managing-connections)
5. [Order Syncing](#order-syncing)
6. [Troubleshooting](#troubleshooting)

---

## Overview

The Shopify integration allows you to:
- ✅ Automatically sync orders from Shopify
- ✅ Connect multiple Shopify stores
- ✅ View all orders in one dashboard
- ✅ Fulfill orders and generate shipping labels

**How It Works:**
1. Connect your Shopify store via OAuth
2. Set up webhook to receive new orders
3. Orders automatically appear in your dashboard
4. Fulfill orders and generate labels as usual

---

## Connecting Your Store

### Prerequisites

- Active Shopify store
- Admin access to your Shopify store
- Account on this platform

### Step-by-Step Connection

1. **Navigate to Integrations**
   - Go to **Settings** → **Integrations**
   - Find the "Shopify" section

2. **Click "Connect Store"**
   - Click the "Connect Store" button
   - A dialog will appear

3. **Enter Store Domain**
   - Enter your Shopify store domain
   - Format: `yourstore.myshopify.com` (without `https://`)
   - Example: `mystore.myshopify.com`

4. **Authorize Connection**
   - You'll be redirected to Shopify
   - Log in to your Shopify admin if needed
   - Review the permissions requested
   - Click "Install app" or "Authorize"

5. **Confirmation**
   - You'll be redirected back to the platform
   - Your store will appear in the "Connected Stores" section
   - Connection is now active!

### Permissions Requested

The integration requests these permissions:
- **Read Customers**: To sync customer information
- **Read Inventory**: To check product availability
- **Read Orders**: To sync orders
- **Write Orders**: To update order status (future feature)

---

## Setting Up Webhooks

After connecting your store, you need to set up a webhook in Shopify to receive new orders automatically.

### Step 1: Access Shopify Admin

1. Log in to your Shopify admin panel
2. Go to **Settings** → **Notifications**
3. Scroll down to **Webhooks** section

### Step 2: Create Webhook

1. Click **Create webhook**
2. Configure the webhook:
   - **Event**: Select "Order creation" or "Order updated"
   - **Format**: JSON
   - **URL**: Enter your webhook URL
     ```
     https://yourdomain.com/api/webhooks/shopify/orders
     ```
   - **API version**: Use latest stable version

3. Click **Save webhook**

### Step 3: Verify Webhook

- Test by creating a test order in Shopify
- Check your dashboard - order should appear within seconds
- If order doesn't appear, see [Troubleshooting](#troubleshooting)

**Note**: You may need to contact support to get your webhook URL if it's not provided in the integration settings.

---

## Managing Connections

### View Connected Stores

Go to **Settings** → **Integrations** to see all connected stores:

**Information Displayed:**
- Store domain
- Connection date
- Status (Connected/Disconnected)
- Actions (Disconnect)

### Disconnecting a Store

1. Go to **Settings** → **Integrations**
2. Find the store you want to disconnect
3. Click "Disconnect" button
4. Confirm the disconnection

**Note**: Disconnecting a store:
- Stops new orders from syncing
- Does NOT delete existing orders
- Can be reconnected later

### Connecting Multiple Stores

You can connect multiple Shopify stores:

1. Follow the connection process for each store
2. All stores appear in the "Connected Stores" section
3. Orders from all stores appear in your dashboard
4. Orders are tagged with their source store

**Use Case**: If you manage multiple brands or stores, connect them all to manage everything from one dashboard.

---

## Order Syncing

### How Orders Sync

**Automatic Sync:**
- New orders appear automatically when created in Shopify
- Sync happens within seconds via webhook
- No manual action required

**Order Information Synced:**
- Order number
- Customer email
- Shipping address
- Order items (SKU, name, quantity, price)
- Order total
- Financial status
- Order status

### Order Status Mapping

Shopify order statuses are mapped as follows:

| Shopify Status | Platform Status |
|----------------|-----------------|
| Unfulfilled | Pending |
| Partially Fulfilled | Processing |
| Fulfilled | Fulfilled |
| Cancelled | Cancelled |

### Order Identification

Orders from Shopify include:
- **Order Number**: Shopify order name (e.g., "#1001")
- **Shop ID**: Links to your connected store
- **Source**: Identified as Shopify order

You can filter or search for Shopify orders by looking for orders with Shopify order numbers.

---

## Best Practices

### Connection Management

1. **Verify Connection**: Test connection by creating a test order
2. **Monitor Webhooks**: Check webhook status in Shopify admin
3. **Keep Connected**: Don't disconnect unless necessary
4. **Multiple Stores**: Connect all stores you manage

### Order Management

1. **Review Synced Orders**: Check that orders are syncing correctly
2. **Monitor Limits**: Shopify orders count toward your subscription limits
3. **Fulfill Promptly**: Process and fulfill orders as they arrive
4. **Update Status**: Keep order status current in both systems

### Webhook Maintenance

1. **Test Regularly**: Create test orders to verify webhook works
2. **Check Logs**: Monitor for webhook errors in Shopify
3. **Update URL**: If platform URL changes, update webhook URL
4. **API Version**: Keep Shopify API version current

---

## Troubleshooting

### Connection Issues

**Can't connect store - "Invalid domain"**
- **Solution**: 
  - Ensure format is `store.myshopify.com` (no https://)
  - Check that store domain is correct
  - Verify store is active

**OAuth authorization fails**
- **Solution**: 
  - Clear browser cache and cookies
  - Try in incognito/private window
  - Check that you have admin access to store
  - Contact support if issue persists

### Webhook Issues

**Orders not syncing automatically**
- **Solution**: 
  - Verify webhook is created in Shopify
  - Check webhook URL is correct
  - Test webhook delivery in Shopify admin
  - Check webhook secret is configured (contact support)

**Webhook returns errors**
- **Solution**: 
  - Check webhook format is JSON
  - Verify API version is supported
  - Check webhook URL is accessible
  - Review error logs in Shopify

### Order Sync Issues

**Order appears but information is missing**
- **Solution**: 
  - Check that order has required information in Shopify
  - Verify webhook payload includes all fields
  - Contact support if specific fields are missing

**Duplicate orders**
- **Solution**: 
  - System prevents duplicates automatically
  - If duplicates appear, contact support
  - Check webhook isn't firing multiple times

**Orders from wrong store**
- **Solution**: 
  - Verify store connection is correct
  - Check webhook is configured for correct store
  - Disconnect and reconnect if needed

---

## Advanced Features (Future)

These features may be available in future updates:

- **Order Status Updates**: Update Shopify when order is fulfilled
- **Product Sync**: Sync products from Shopify to inventory
- **Inventory Sync**: Two-way inventory synchronization
- **Automated Fulfillment**: Auto-generate labels for Shopify orders

---

## Related Guides

- [Getting Started](./getting-started.md)
- [Managing Orders](./managing-orders.md)
- [Shipping Labels](./shipping-labels.md)

---

## Support

If you need help with Shopify integration:

- **Email**: support@yourplatform.com
- **Documentation**: Check other guides
- **Shopify Support**: For Shopify-specific issues

---

**Last Updated**: 2025-01-XX

