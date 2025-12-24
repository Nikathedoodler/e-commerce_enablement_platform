# Managing Orders Guide

Learn how to create, view, update, and fulfill orders in the platform.

## Table of Contents

1. [Viewing Orders](#viewing-orders)
2. [Creating Orders](#creating-orders)
3. [Order Details](#order-details)
4. [Updating Order Status](#updating-order-status)
5. [Generating Shipping Labels](#generating-shipping-labels)
6. [Filtering and Searching](#filtering-and-searching)

---

## Viewing Orders

### All Orders Page

Navigate to **Orders** → **All Orders** to see all your orders.

**Features:**
- Search by order number or customer email
- Filter by status (Pending, Processing, Fulfilled, Cancelled)
- View order summary (number, customer, total, status, date)
- Click any order to view full details

### Order Status Pages

- **Pending Orders**: Orders awaiting fulfillment
- **Fulfilled Orders**: Completed and shipped orders

These pages show filtered views of your orders by status.

---

## Creating Orders

### Manual Order Creation

1. Go to **Orders** → **Create Order**
2. Fill in **Order Basics**:
   - **Order Number**: Auto-generated if left empty (format: `ORD-YYYYMMDD-HHMMSS`)
   - **Customer Email**: Required
   - **Financial Status**: Pending, Paid, Refunded, or Partially Refunded

3. Fill in **Shipping Address**:
   - **Name**: Recipient name
   - **Address Line 1**: Required
   - **Address Line 2**: Optional
   - **City**: Required
   - **State/Province**: Optional
   - **ZIP/Postal Code**: Required
   - **Country**: Required
   - **Phone**: Optional

4. Add **Order Items**:
   - Click "Add Item" for each product
   - Enter **SKU**, **Product Name**, **Quantity**, and **Price**
   - Remove items with the "Remove" button
   - Total is calculated automatically

5. Review the **Order Total** and click "Create Order"

**Note**: Make sure you have sufficient order capacity in your subscription plan. You'll see a warning if you're approaching your limit.

---

## Order Details

Click any order to view full details in a dialog:

### Information Displayed

- **Order Number & Status**: Current order status and financial status
- **Customer Information**: Email and name
- **Order Items**: Table with SKU, product name, quantity, price, and totals
- **Shipping Address**: Full delivery address
- **Order Summary**: Subtotal and total
- **Shipping Labels**: All generated labels for this order
- **Tracking Information**: Tracking numbers from labels

### Actions Available

- **Update Status**: Change order status (Pending → Processing → Fulfilled)
- **Generate Label**: Create a shipping label (see below)
- **View Labels**: Download and view all shipping labels

---

## Updating Order Status

Order statuses represent the fulfillment stage:

- **Pending**: Order received, not yet processed
- **Processing**: Order is being prepared for shipment
- **Fulfilled**: Order has been shipped
- **Cancelled**: Order was cancelled

### How to Update Status

1. Open the order detail dialog
2. Scroll to "Update Status" section
3. Select new status from dropdown
4. Click "Update Status"

**Tip**: Update status to "Processing" when you start preparing the order, and "Fulfilled" when it's shipped.

---

## Generating Shipping Labels

### When to Generate Labels

Generate labels when you're ready to ship an order. You can generate multiple labels for the same order (e.g., split shipments).

### Steps to Generate a Label

1. Open the order detail dialog
2. Click "Generate Label" (or "Generate Another Label" if labels exist)
3. Fill in the label form:
   - **Service Type**: Choose DHL service (Express Worldwide, Economy Select, etc.)
   - **Package Weight**: Enter weight in kilograms (required)
   - **Package Dimensions**: Length, width, height in centimeters (optional but recommended)
   - **Package Description**: Optional description of contents
4. Review shipping address (pre-filled from order)
5. Click "Generate Label"

### After Generation

- Label is automatically saved
- Tracking number is added to the order
- Label PDF is available for download
- Label appears in the "Shipping Labels" section

### Downloading Labels

1. In the order detail dialog, find the "Shipping Labels" section
2. Click "Download Label" next to any label
3. Print the label and attach to your package

---

## Filtering and Searching

### Search Orders

Use the search bar at the top of the orders table to find orders by:
- Order number (e.g., "ORD-20250101")
- Customer email (e.g., "customer@example.com")

### Filter by Status

Use the status filter dropdown to show only:
- All orders
- Pending orders
- Processing orders
- Fulfilled orders
- Cancelled orders

**Tip**: Use the status filter pages (Pending, Fulfilled) for quick access to specific order types.

---

## Best Practices

### Order Management

1. **Review orders daily**: Check pending orders regularly
2. **Update status promptly**: Keep status current as orders move through fulfillment
3. **Generate labels when ready**: Don't generate labels too early (they may expire)
4. **Track everything**: Use the tracking numbers from labels to monitor shipments

### Order Limits

- Monitor your order usage on the Billing page
- Upgrade your plan if you're approaching limits
- Orders from Shopify count toward your limit
- Limits reset at the start of each billing period

---

## Troubleshooting

**Q: I can't create an order - getting an error about limits**
A: Check your subscription plan limits on the Billing page. Upgrade if needed.

**Q: Order from Shopify didn't appear**
A: Check that your Shopify store is connected and webhook is configured. See [Shopify Integration Guide](./shopify-integration.md).

**Q: Can't generate label - missing shipping address**
A: Make sure the order has a complete shipping address. Edit the order if needed.

**Q: Label generation failed**
A: Check that package weight is greater than 0 and all required fields are filled. Verify DHL API credentials if using production.

---

## Related Guides

- [Getting Started](./getting-started.md)
- [Shipping Labels](./shipping-labels.md)
- [Shopify Integration](./shopify-integration.md)
- [Inventory Management](./inventory-management.md)

---

**Last Updated**: 2025-01-XX

