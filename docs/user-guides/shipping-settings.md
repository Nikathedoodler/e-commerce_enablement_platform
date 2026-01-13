# Shipping Settings Guide

Learn how to configure automatic shipping label generation and manage your default package information.

## Table of Contents

1. [Overview](#overview)
2. [Accessing Settings](#accessing-settings)
3. [Automatic Label Generation](#automatic-label-generation)
4. [Default Package Information](#default-package-information)
5. [Warehouse/Shipper Information](#warehouseshipper-information)
6. [Best Practices](#best-practices)

---

## Overview

Shipping Settings allow you to configure automatic label generation and set default values that will be used when labels are generated automatically. This saves time and ensures consistency across your fulfillment process.

**Key Features:**
- Enable/disable automatic label generation
- Configure when labels should auto-generate
- Set default package weight and dimensions
- Store warehouse/shipper information
- Manage default service type

---

## Accessing Settings

1. **Navigate to Settings**
   - Click **Settings** in the sidebar
   - Select **Shipping** from the settings menu

2. **Settings Page**
   - All shipping automation settings are on one page
   - Changes are saved immediately when you click "Save Settings"

---

## Automatic Label Generation

### Enabling Auto-Generation

1. **Toggle Auto-Generation**
   - Check "Enable automatic label generation"
   - This enables the feature (rules are configured below)

2. **Configure Rules**
   Choose when labels should be generated automatically:

   **✅ Generate when order status changes to "processing"** (Recommended)
   - Most common use case
   - Labels generate when you mark orders as ready to ship
   - Best for standard fulfillment workflows

   **✅ Generate for Shopify orders when created**
   - Labels generate immediately when orders arrive from Shopify
   - Useful for high-volume stores
   - Orders are ready to ship right away

   **✅ Generate for manually created orders**
   - Labels generate when you create orders manually
   - Useful for quick fulfillment of manual orders

### How It Works

When auto-generation is enabled and a trigger occurs:

1. System checks your settings
2. Uses default package weight/dimensions
3. Uses default service type
4. Uses warehouse/shipper information
5. Generates label automatically
6. Label appears in order detail dialog
7. Entry is logged in Generation History

### Disabling Auto-Generation

- Uncheck "Enable automatic label generation"
- Click "Save Settings"
- Manual generation still works normally

---

## Default Package Information

These settings are used for automatically generated labels.

### Default Weight

- **Required**: Yes (when auto-generation is enabled)
- **Unit**: Kilograms (kg)
- **Format**: Decimal (e.g., "1.5" for 1.5 kg)
- **Tip**: Use your average package weight

**Example**: If most packages are 1.2 kg, set default to `1.2`

### Default Dimensions

- **Optional**: But recommended for accurate pricing
- **Unit**: Centimeters (cm)
- **Format**: Decimal (e.g., "30.5" for 30.5 cm)
- **Fields**: Length, Width, Height

**When to Set:**
- If all packages are similar size
- For consistent product types
- To get more accurate shipping costs

**When to Leave Empty:**
- Package sizes vary significantly
- You prefer to measure each package
- Dimensions aren't critical for your use case

### Default Service Type

- **Required**: Yes (when auto-generation is enabled)
- **Options**: 
  - Express Worldwide (recommended)
  - Express 12:00
  - Economy Select
  - Express Envelope
  - Express Worldwide Non-Documents

**Choosing a Service Type:**
- **Express Worldwide**: Best balance of speed and cost
- **Express 12:00**: Fastest, highest cost
- **Economy Select**: Slowest, lowest cost
- **Express Envelope**: For documents only

---

## Warehouse/Shipper Information

This is your warehouse address used as the origin for all shipping labels.

### Required Fields

- **Contact Name**: Person or department name
- **Address Line 1**: Street address
- **City**: City name
- **Postal Code**: ZIP/postal code
- **Country Code**: ISO country code (e.g., GE, US, GB)
- **Phone**: Contact phone number

### Optional Fields

- **Company Name**: Your company name
- **Address Line 2**: Suite, unit, building number
- **State/Province**: State or province name
- **Email**: Contact email address

### Country Codes

Use ISO 2-letter country codes:
- **GE**: Georgia
- **US**: United States
- **GB**: United Kingdom
- **DE**: Germany
- **FR**: France

[Full list of ISO country codes](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)

### Example Configuration

```
Contact Name: John Doe
Company Name: Acme Fulfillment
Address Line 1: 123 Warehouse Street
Address Line 2: Building A, Suite 100
City: Kutaisi
State/Province: Imereti
Postal Code: 4600
Country Code: GE
Phone: +995 XXX XXX XXX
Email: warehouse@acme.com
```

---

## Best Practices

### Auto-Generation Setup

1. **Start Conservative**
   - Enable only "status change to processing" initially
   - Test with a few orders
   - Add more rules as you get comfortable

2. **Use Accurate Defaults**
   - Set default weight to your average package weight
   - Include dimensions if packages are consistent
   - Update defaults if your products change

3. **Verify Shipper Information**
   - Double-check warehouse address
   - Ensure phone number is correct
   - Verify country code is correct

### Package Settings

1. **Weight Accuracy**
   - Use actual average weight, not a guess
   - Update if product mix changes
   - Consider seasonal variations

2. **Dimensions**
   - Only set if packages are consistent
   - Leave empty if sizes vary significantly
   - More accurate = better pricing

3. **Service Type**
   - Choose based on your typical delivery needs
   - Can always upgrade manually if needed
   - Consider customer expectations

### Troubleshooting

**Auto-generation not working?**
- Check that auto-generation is enabled
- Verify required shipper information is filled
- Ensure default weight is set
- Check Generation History for error messages

**Wrong default weight?**
- Update default weight in settings
- Future labels will use new weight
- Existing labels are not affected

**Need to change service type?**
- Update default service type in settings
- Or generate labels manually with different service
- Can generate multiple labels with different services

---

## Related Guides

- [Shipping Labels Guide](./shipping-labels.md) - How to generate and manage labels
- [Managing Orders](./managing-orders.md) - Order management workflow
- [Getting Started](./getting-started.md) - Platform overview

---

**Last Updated**: 2025-01-XX
