# Testing Screenshots

This folder contains screenshots from critical testing and pilot launch.

## Folder Structure

Organize screenshots by category:

- `auth/` - Authentication screenshots (signup, login, password reset)
- `orders/` - Order management screenshots
- `inventory/` - Inventory management screenshots
- `receiving/` - Receiving module screenshots
- `shipping/` - Shipping label screenshots
- `shopify/` - Shopify integration screenshots
- `billing/` - Billing and subscription screenshots
- `errors/` - Error screenshots
- `ui-issues/` - UI/UX issue screenshots

## Naming Convention

Use descriptive names with dates:

**Format**: `category-issue-description-YYYY-MM-DD.png`

**Examples:**

- `orders-label-generation-error-2025-01-15.png`
- `auth-password-reset-success-2025-01-15.png`
- `inventory-low-stock-badge-2025-01-15.png`
- `errors-500-internal-server-error-2025-01-15.png`

## Usage

1. Take screenshot when you find an issue
2. Save it in the appropriate category folder
3. Reference it in the testing checklist notes:
   ```
   Issue: Label generation fails
   Screenshot: shipping/label-generation-error-2025-01-15.png
   ```

## Notes

- Keep screenshots organized by category
- Delete old screenshots after issues are resolved (optional)
- Use descriptive names so you can find them later
