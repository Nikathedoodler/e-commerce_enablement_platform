# Receiving Workflow Guide

Learn how to log incoming inventory, update stock levels, and maintain receiving history.

## Table of Contents

1. [Overview](#overview)
2. [Receiving Process](#receiving-process)
3. [Item Conditions](#item-conditions)
4. [New SKU Handling](#new-sku-handling)
5. [Receiving History](#receiving-history)
6. [Best Practices](#best-practices)

---

## Overview

The receiving module allows you to:
- ✅ Log incoming inventory
- ✅ Automatically update stock levels
- ✅ Track item conditions (good, damaged, etc.)
- ✅ Create new inventory items
- ✅ Maintain complete receiving history

**Key Features:**
- Automatic inventory updates for "good" items
- New SKU creation if item doesn't exist
- Condition tracking for quality control
- Complete audit trail

---

## Receiving Process

### Step-by-Step Receiving

1. **Navigate to Receiving**
   - Go to **Receiving** in the main menu
   - Receiving form is at the top of the page

2. **Fill in Receiving Form**
   - **SKU** (required): Product SKU
   - **Item Name** (optional): Product name (required for new SKUs)
   - **Quantity** (required): Number of items received
   - **Condition** (required): Good, Damaged, Defective, or Returned
   - **Received Date/Time** (required): When items were received
   - **Location** (optional): Warehouse location
   - **Client ID** (optional): Client or supplier identifier
   - **Notes** (optional): Additional information

3. **Submit Receiving Log**
   - Click "Log Receiving" button
   - Form is processed and saved
   - Inventory is updated automatically (if condition is "good")

4. **View Results**
   - Success message appears
   - Form resets for next entry
   - New entry appears in receiving history

### Automatic Inventory Updates

When you receive items with **"Good"** condition:
- ✅ Inventory quantity increases automatically
- ✅ If SKU exists: Quantity is added to existing stock
- ✅ If SKU is new: New inventory item is created
- ✅ No manual inventory update needed!

**Example:**
- Existing SKU "TSHIRT-001" has 50 units
- Receive 25 units with "Good" condition
- New quantity: 75 units (automatically updated)

---

## Item Conditions

### Condition Types

**Good**
- Items in perfect condition
- Ready for sale/fulfillment
- **Inventory is updated automatically**

**Damaged**
- Items with visible damage
- May need repair or discount
- **Inventory is NOT updated** (tracked separately)

**Defective**
- Items that don't work/function
- Need to be returned or disposed
- **Inventory is NOT updated** (tracked separately)

**Returned**
- Items returned by customers
- May need inspection/refurbishment
- **Inventory is NOT updated** (tracked separately)

### When to Use Each Condition

**Use "Good" when:**
- Items are in perfect condition
- Ready to add to sellable inventory
- Standard receiving process

**Use "Damaged" when:**
- Packaging is damaged but product is OK
- Minor cosmetic issues
- Items need inspection before sale

**Use "Defective" when:**
- Products don't function properly
- Manufacturing defects
- Items cannot be sold

**Use "Returned" when:**
- Customer returns
- Items need quality check
- May be restocked after inspection

---

## New SKU Handling

### Receiving New Products

When receiving a SKU that doesn't exist in inventory:

1. **Enter SKU**: Enter the new SKU code
2. **Enter Item Name**: **Required** for new SKUs
   - This becomes the product name in inventory
   - If not provided, SKU will be used as name
3. **Complete Form**: Fill in quantity, condition, etc.
4. **Submit**: New inventory item is created automatically

**Example:**
- SKU: "NEW-PROD-001" (doesn't exist)
- Item Name: "Red Hoodie"
- Quantity: 50, Condition: Good
- Result: New inventory item created with name "Red Hoodie" and quantity 50

### Item Name Best Practice

- Always provide item name for new SKUs
- Use descriptive names
- Match names used in other systems if possible

---

## Receiving History

### Viewing History

The receiving history table shows all receiving log entries:

**Information Displayed:**
- SKU
- Item Name
- Quantity
- Condition (with color-coded badges)
- Received Date/Time
- Location
- Client ID
- Notes

### Searching History

Use the search bar to find entries by:
- **SKU**: Find all entries for a specific SKU
- **Notes**: Search in notes field

**Example:**
- Search "TSHIRT" to see all t-shirt receiving entries
- Search "Supplier A" to see all entries from that supplier

### Filtering by Condition

Use the condition filter to show:
- All conditions
- Good only
- Damaged only
- Defective only
- Returned only

**Use Case**: Filter by "Damaged" to review all damaged items received.

---

## Best Practices

### Receiving Workflow

1. **Receive Immediately**: Log items as soon as they arrive
2. **Accurate Quantities**: Count carefully before logging
3. **Check Condition**: Inspect items and mark condition accurately
4. **Use Notes**: Add notes for special circumstances
5. **Verify Updates**: Check that inventory updated correctly

### Data Entry

1. **Consistent SKUs**: Use same SKU format as inventory
2. **Complete Information**: Fill in all relevant fields
3. **Accurate Dates**: Use actual receiving date/time
4. **Location Tracking**: Record location for organization

### Quality Control

1. **Inspect Items**: Check condition before logging
2. **Separate Issues**: Use appropriate condition for problems
3. **Document Issues**: Add notes for damaged/defective items
4. **Follow Up**: Process damaged/defective items appropriately

### Integration with Inventory

1. **Verify Updates**: Check inventory after receiving "good" items
2. **Monitor Stock**: Use receiving to maintain accurate stock levels
3. **New Products**: Create new SKUs through receiving when items arrive
4. **Reconciliation**: Periodically reconcile receiving logs with inventory

---

## Troubleshooting

**Q: Inventory didn't update after receiving**
A: Check that condition was set to "Good". Other conditions don't update inventory.

**Q: New SKU wasn't created**
A: Ensure "Item Name" was provided. Without it, creation may fail or use SKU as name.

**Q: Can't find receiving entry**
A: Use search by SKU or filter by condition. Check date range if applicable.

**Q: Wrong quantity in inventory**
A: Check receiving history for that SKU. Verify all "Good" condition entries were logged correctly.

**Q: Want to edit receiving entry**
A: Currently, entries cannot be edited after creation. Contact support if correction is needed.

---

## Related Guides

- [Getting Started](./getting-started.md)
- [Inventory Management](./inventory-management.md)
- [Managing Orders](./managing-orders.md)

---

**Last Updated**: 2025-01-XX

