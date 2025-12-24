# Shipping Labels Guide

Learn how to generate, manage, and download shipping labels for your orders.

## Table of Contents

1. [Overview](#overview)
2. [Generating Labels](#generating-labels)
3. [DHL Service Types](#dhl-service-types)
4. [Package Information](#package-information)
5. [Managing Labels](#managing-labels)
6. [Troubleshooting](#troubleshooting)

---

## Overview

Shipping labels are generated through DHL Express integration. Each label includes:
- **Tracking Number**: For tracking the shipment
- **Label PDF**: Printable shipping label
- **Shipping Cost**: Cost of the shipment
- **Estimated Delivery**: Expected delivery date

**Key Points:**
- Labels are generated manually when you're ready to ship
- Multiple labels can be generated for the same order (split shipments)
- Labels are automatically saved and linked to orders
- Tracking numbers are automatically added to orders

---

## Generating Labels

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

- [Managing Orders](./managing-orders.md)
- [Getting Started](./getting-started.md)
- [Shopify Integration](./shopify-integration.md)

---

**Last Updated**: 2025-01-XX

