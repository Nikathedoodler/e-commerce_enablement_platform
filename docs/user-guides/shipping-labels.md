# Shipping Labels Guide

Learn how to generate, manage, and download shipping labels for your orders.

## Table of Contents

1. [Overview](#overview)
2. [Automatic Label Generation](#automatic-label-generation)
3. [Manual Label Generation](#manual-label-generation)
4. [DHL Service Types](#dhl-service-types)
5. [Package Information](#package-information)
6. [Managing Labels](#managing-labels)
7. [Generation History](#generation-history)
8. [Troubleshooting](#troubleshooting)

---

## Overview

Shipping labels are generated through DHL Express integration. Each label includes:
- **Tracking Number**: For tracking the shipment
- **Label PDF**: Printable shipping label
- **Shipping Cost**: Cost of the shipment
- **Estimated Delivery**: Expected delivery date

**Key Points:**
- **Automatic Generation**: Labels can be auto-generated when order status changes to "processing"
- **Manual Generation**: Generate labels manually when ready to ship
- Multiple labels can be generated for the same order (split shipments)
- Labels are automatically saved and linked to orders
- Tracking numbers are automatically added to orders
- Complete audit log tracks all generation attempts

---

## Automatic Label Generation

### Overview

Automatic label generation saves time by creating shipping labels automatically when orders are ready to ship. This feature can be configured in **Settings → Shipping**.

### How It Works

1. **Configure Settings**: Set up auto-generation rules and default package information
2. **Trigger Events**: Labels generate automatically when:
   - Order status changes to "processing" (default)
   - Shopify orders are created (optional)
   - Manual orders are created (optional)
3. **Automatic Process**: System uses your default package settings to generate labels
4. **Result**: Label appears in order detail dialog automatically

### Setting Up Auto-Generation

1. **Go to Settings → Shipping**
2. **Enable Auto-Generation**:
   - Check "Enable automatic label generation"
   - Select which rules to use:
     - ✅ Generate when order status changes to "processing" (recommended)
     - ✅ Generate for Shopify orders when created
     - ✅ Generate for manually created orders

3. **Configure Default Package Information**:
   - **Default Weight**: Enter typical package weight (kg)
   - **Dimensions**: Optional length, width, height (cm)
   - **Default Service Type**: Choose DHL service (e.g., Express Worldwide)

4. **Enter Warehouse/Shipper Information** (required):
   - Contact name, address, city, postal code, country, phone
   - This is used as the origin address for all labels

5. **Save Settings**

### When Auto-Generation Triggers

**Status Change Trigger** (Recommended):
- Order status: `pending` → `processing`
- Label generates automatically
- No manual action needed

**Shopify Order Trigger**:
- New order arrives from Shopify
- Label generates immediately (if enabled)
- Order is ready to ship right away

**Manual Order Trigger**:
- You create an order manually
- Label generates automatically (if enabled)
- Useful for quick fulfillment

### Benefits

- ⚡ **Faster Fulfillment**: Labels ready when orders are processed
- 🔄 **Consistent Process**: Same settings used every time
- ⏱️ **Time Savings**: No manual label generation needed
- 📊 **Complete Tracking**: All attempts logged in audit history

### Important Notes

- Auto-generation uses your **default package settings**
- Ensure default weight matches your typical packages
- Shipper information must be complete for auto-generation to work
- If auto-generation fails, you can still generate labels manually
- All generation attempts are logged in the audit history

---

## Manual Label Generation

### Prerequisites

Before generating a label, ensure:
- Order has a complete shipping address
- You know the package weight
- You're ready to ship (labels may have expiration dates)

### Step-by-Step Process

1. **Open Order Details**
   - Go to **Orders** → **All Orders**
   - Click on the order you want to ship

2. **Click Generate Label**
   - In the order detail dialog, find "Shipping Labels" section
   - Click "Generate Label" (or "Generate Another Label" if labels exist)

3. **Fill in Label Form**
   - **Service Type**: Select DHL service (see [Service Types](#dhl-service-types))
   - **Package Weight**: Enter weight in kilograms (required, e.g., "1.5")
   - **Package Dimensions**: Optional but recommended
     - Length (cm)
     - Width (cm)
     - Height (cm)
   - **Package Description**: Optional description of contents

4. **Review Shipping Address**
   - Address is pre-filled from the order
   - Verify it's correct before generating

5. **Generate Label**
   - Click "Generate Label" button
   - Wait for processing (usually a few seconds)
   - Label will appear in the "Shipping Labels" section

### After Generation

- ✅ Label is saved to your account
- ✅ Tracking number is added to the order
- ✅ Label PDF is available for download
- ✅ Cost is recorded for your records

---

## DHL Service Types

Choose the service type based on delivery speed and cost:

### Express Worldwide
- **Best for**: Standard international shipping
- **Speed**: 2-5 business days
- **Cost**: Moderate
- **Use when**: Standard delivery is acceptable

### Express 12:00
- **Best for**: Urgent deliveries
- **Speed**: 1-2 business days (by noon)
- **Cost**: Higher
- **Use when**: Time-sensitive shipments

### Economy Select
- **Best for**: Cost-effective shipping
- **Speed**: 5-10 business days
- **Cost**: Lower
- **Use when**: Speed is not critical

### Express Envelope
- **Best for**: Documents and small items
- **Speed**: 1-3 business days
- **Cost**: Lower (for small items)
- **Use when**: Shipping documents or very light items

### Express Worldwide (Non-Documents)
- **Best for**: Non-document shipments
- **Speed**: 2-5 business days
- **Cost**: Moderate
- **Use when**: Shipping products (not documents)

---

## Package Information

### Weight

- **Required**: Yes
- **Unit**: Kilograms (kg)
- **Format**: Decimal (e.g., "1.5" for 1.5 kg)
- **Minimum**: 0.1 kg
- **Tip**: Weigh the actual package for accuracy

### Dimensions

- **Required**: No, but recommended
- **Unit**: Centimeters (cm)
- **Format**: Decimal (e.g., "30.5" for 30.5 cm)
- **Why Important**: 
  - More accurate pricing
  - Better delivery estimates
  - Required for some service types

**How to Measure:**
1. Measure length (longest side)
2. Measure width (second longest side)
3. Measure height (shortest side)
4. Enter in cm (1 inch = 2.54 cm)

### Description

- **Required**: No
- **Purpose**: Describe package contents
- **Examples**: "Electronics", "Clothing", "Books"
- **Use when**: Helps with customs or special handling

---

## Generation History

### Overview

Every label generation attempt (automatic or manual) is recorded in the **Generation History** audit log. This provides complete visibility into all label generation activity.

### Viewing History

1. **Open Order Detail Dialog**
   - Go to **Orders** → Click any order
   - Scroll to "Generation History" section

2. **Review Entries**
   - Each entry shows:
     - **Status**: Pending, Success, or Failed
     - **Type**: Auto or Manual
     - **Timestamp**: When the attempt occurred
     - **Trigger**: What caused the generation
     - **Tracking Number**: If successful
     - **Cost**: Shipping cost
     - **Error Message**: If generation failed

### Status Meanings

**Pending** ⏳:
- Label generation is in progress
- System is waiting for DHL API response
- Will update to Success or Failed automatically
- Icon pulses to indicate active status

**Success** ✅:
- Label generated successfully
- Tracking number available
- Cost recorded
- Label ready to download

**Failed** ❌:
- Generation encountered an error
- Error message explains what went wrong
- Can retry by generating manually
- Common causes: missing information, API errors, network issues

### Generation Types

**Auto** ⚡:
- Generated automatically by system
- Triggered by configured rules
- Uses default package settings
- Faster workflow

**Manual** 👋:
- Generated by user clicking "Generate Label"
- User provides package details
- More control over service type and dimensions

### Audit Log Details

Each entry includes:
- **Trigger Information**: What caused the generation
  - `status_change`: Order status changed to processing
  - `shopify_webhook`: Order came from Shopify
  - `manual_click`: User clicked generate button
- **Metadata**: Additional context (expandable)
  - Previous order status
  - Rules that were checked
  - Settings used
  - Package information

### Using History for Troubleshooting

If a label fails to generate:
1. Check the Generation History
2. Look for "Failed" entries
3. Review error message
4. Check if required information is missing
5. Try generating manually with corrected information

---

## Managing Labels

### Viewing Labels

All labels for an order are displayed in the order detail dialog:

- **Carrier**: DHL (or other carriers if added)
- **Tracking Number**: Click to track on carrier website
- **Cost**: Shipping cost in EUR
- **Generated Date**: When the label was created
- **Download Link**: Click to download PDF

### Downloading Labels

1. Open the order detail dialog
2. Find the "Shipping Labels" section
3. Click "Download Label" next to the label you need
4. Print the label
5. Attach to your package

**Printing Tips:**
- Use 4x6 inch label paper if available
- Ensure barcode is clear and scannable
- Print at 100% scale (no scaling)

### Multiple Labels

You can generate multiple labels for the same order:
- **Split Shipments**: Different items ship separately
- **Replacement Labels**: If original is lost or damaged
- **Service Upgrades**: Generate new label with faster service

The label count is shown in the section title: "Shipping Labels (2)"

---

## Tracking Shipments

### Using Tracking Numbers

1. **From Order Detail**: Tracking number is displayed in the order
2. **From Label**: Each label shows its tracking number
3. **Track Online**: Visit DHL website and enter tracking number

### Tracking Updates

- DHL provides tracking updates automatically
- Check DHL website for real-time status
- Updates include: picked up, in transit, out for delivery, delivered

---

## Best Practices

### Label Generation

1. **Generate When Ready**: Don't generate labels too early (they may expire)
2. **Accurate Weight**: Weigh packages for correct pricing
3. **Complete Dimensions**: Include dimensions for better accuracy
4. **Verify Address**: Double-check shipping address before generating

### Label Management

1. **Download Immediately**: Download labels right after generation
2. **Print Clearly**: Ensure barcode is scannable
3. **Store Securely**: Keep label PDFs for records
4. **Track Shipments**: Monitor tracking numbers for delivery confirmation

### Cost Management

1. **Compare Services**: Choose service type based on urgency vs. cost
2. **Review Costs**: Check label costs in the order detail
3. **Optimize Packaging**: Smaller, lighter packages cost less

---

## Troubleshooting

### Label Generation Fails

**Error: "Missing shipping address"**
- **Solution**: Ensure order has complete shipping address
- Edit order if address is incomplete

**Error: "Package weight must be greater than 0"**
- **Solution**: Enter a valid weight (minimum 0.1 kg)
- Check that weight field is not empty

**Error: "Failed to generate shipping label"**
- **Solution**: 
  - Check internet connection
  - Verify DHL API credentials (if using production)
  - Try again in a few moments
  - Contact support if issue persists

### Label Download Issues

**PDF won't download**
- **Solution**: 
  - Check browser pop-up blocker
  - Try right-click → "Save As"
  - Try different browser

**Label PDF is blank or corrupted**
- **Solution**: 
  - Regenerate the label
  - Try downloading again
  - Contact support if issue persists

### Tracking Issues

**Tracking number not working**
- **Solution**: 
  - Wait a few hours (may take time to activate)
  - Verify tracking number is correct
  - Check DHL website directly
  - Contact DHL support if needed

---

## Related Guides

- [Shipping Settings Guide](./shipping-settings.md) - Configure automatic generation
- [Managing Orders](./managing-orders.md)
- [Getting Started](./getting-started.md)
- [Shopify Integration](./shopify-integration.md)

---

## Quick Reference

### Automatic Generation Checklist

- [ ] Shipping settings configured
- [ ] Auto-generation enabled
- [ ] Rules selected (status change, Shopify, manual)
- [ ] Default package weight set
- [ ] Warehouse/shipper information complete
- [ ] Test with order status change

### Manual Generation Checklist

- [ ] Order has complete shipping address
- [ ] Package weight known
- [ ] Service type selected
- [ ] Dimensions measured (optional)
- [ ] Ready to ship

### Troubleshooting Checklist

- [ ] Check Generation History for errors
- [ ] Verify shipping settings are saved
- [ ] Ensure order has complete address
- [ ] Check default package weight is set
- [ ] Verify warehouse information is complete

---

**Last Updated**: 2025-01-XX

