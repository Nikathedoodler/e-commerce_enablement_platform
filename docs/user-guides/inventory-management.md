# Inventory Management Guide

Learn how to manage your product inventory, track stock levels, and set up low stock alerts.

## Table of Contents

1. [Overview](#overview)
2. [Adding Inventory Items](#adding-inventory-items)
3. [Viewing Inventory](#viewing-inventory)
4. [Editing Inventory](#editing-inventory)
5. [Low Stock Alerts](#low-stock-alerts)
6. [Searching and Filtering](#searching-and-filtering)
7. [Best Practices](#best-practices)

---

## Overview

The inventory management system helps you:
- ✅ Track product quantities
- ✅ Monitor stock levels
- ✅ Set reorder thresholds
- ✅ Organize by location
- ✅ Get low stock alerts

**Key Concepts:**
- **SKU**: Unique product identifier (Stock Keeping Unit)
- **Quantity**: Current stock level
- **Reorder Threshold**: Minimum stock before alert
- **Location**: Warehouse location for the item

---

## Adding Inventory Items

### Step-by-Step Process

1. **Navigate to Add New Item**
   - Go to **Inventory** → **Add New**
   - Or click "Add New" from inventory list

2. **Fill in Product Details**
   - **SKU** (required): Unique identifier (e.g., "PROD-001")
   - **Name** (required): Product name (e.g., "Blue T-Shirt")
   - **Quantity** (required): Current stock level (e.g., "100")
   - **Reorder Threshold** (required): Alert when stock falls below this (e.g., "20")
   - **Location** (optional): Warehouse location (e.g., "Aisle 3, Shelf B")

3. **Create Item**
   - Click "Create Item" button
   - Item is added to your inventory
   - You'll be redirected to inventory list

### SKU Best Practices

- Use consistent format (e.g., "CATEGORY-001")
- Make it unique and descriptive
- Avoid special characters that might cause issues
- Keep it short but meaningful

**Examples:**
- `TSHIRT-BLUE-M`
- `BOOK-ISBN-123456`
- `ELEC-PHONE-CASE`

---

## Viewing Inventory

### All Items Page

Navigate to **Inventory** → **All Items** to see all inventory:

**Information Displayed:**
- SKU
- Product Name
- Quantity
- Reorder Threshold
- Stock Status (In Stock / Low Stock)
- Location
- Last Updated

### Low Stock Page

Navigate to **Inventory** → **Low Stock** to see items needing restocking:

**What Shows:**
- Only items where quantity ≤ reorder threshold
- Helps you prioritize restocking
- Color-coded badges for quick identification

---

## Editing Inventory

### Quick Edit from List

1. Click on any inventory item in the list
2. Item detail dialog opens
3. Click any field to edit inline
4. Click "Save Changes" when done
5. Changes are saved immediately

### Editable Fields

- **SKU**: Product identifier
- **Name**: Product name
- **Quantity**: Current stock level
- **Reorder Threshold**: Alert threshold
- **Location**: Warehouse location

**Note**: All fields can be edited except timestamps (created/updated dates).

---

## Low Stock Alerts

### How It Works

- System compares **Quantity** to **Reorder Threshold**
- If quantity ≤ threshold, item shows as "Low Stock"
- Badge appears in red/orange color
- Item appears in "Low Stock" filtered view

### Setting Reorder Thresholds

**Best Practices:**
- Set based on your restocking lead time
- Consider sales velocity
- Account for safety stock

**Example:**
- If you sell 10 units/week
- Lead time is 2 weeks
- Set threshold to 25-30 units

### Monitoring Low Stock

1. **Check Low Stock Page Regularly**
   - Go to **Inventory** → **Low Stock**
   - Review items that need restocking

2. **Set Appropriate Thresholds**
   - Adjust thresholds based on experience
   - Different thresholds for different products

3. **Restock Promptly**
   - Use receiving module to log new inventory
   - Update quantities as items arrive

---

## Searching and Filtering

### Search Inventory

Use the search bar to find items by:
- **SKU**: Exact or partial match
- **Product Name**: Exact or partial match

**Example Searches:**
- "TSHIRT" - finds all items with "TSHIRT" in SKU or name
- "BLUE" - finds all blue products
- "PROD-001" - finds specific SKU

### Filter by Low Stock

- Toggle "Low Stock Only" filter
- Shows only items below reorder threshold
- Useful for restocking planning

---

## Best Practices

### Inventory Setup

1. **Add All Products**: Add all SKUs when setting up
2. **Set Realistic Thresholds**: Based on sales and lead times
3. **Use Consistent SKUs**: Follow a naming convention
4. **Include Locations**: Helps with warehouse organization

### Regular Maintenance

1. **Update Quantities**: Keep quantities current
2. **Review Low Stock**: Check low stock page regularly
3. **Adjust Thresholds**: Update based on experience
4. **Clean Up**: Remove discontinued items

### Integration with Receiving

- Use **Receiving** module to log new inventory
- Quantities update automatically when receiving "good" items
- New SKUs are created automatically if they don't exist

See [Receiving Workflow Guide](./receiving-workflow.md) for details.

---

## Troubleshooting

**Q: Item shows as "Low Stock" but I have plenty**
A: Check that quantity is greater than reorder threshold. Adjust threshold if needed.

**Q: Can't find an item in search**
A: Try searching by SKU or name separately. Check spelling.

**Q: Quantity not updating after receiving**
A: Verify receiving log was created with "good" condition. Check that SKU matches exactly.

**Q: Want to delete an item**
A: Click the item, then click "Delete" button. Confirm deletion.

---

## Related Guides

- [Getting Started](./getting-started.md)
- [Receiving Workflow](./receiving-workflow.md)
- [Managing Orders](./managing-orders.md)

---

**Last Updated**: 2025-01-XX

