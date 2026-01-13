# Shipping Label Generation Flow

## Current Implementation (Manual + Automatic)

### Manual Generation Flow:
1. **Order Created** → Status: `pending`
   - Manually via dashboard, OR
   - Automatically via Shopify webhook

2. **Warehouse Staff** → Opens order detail dialog

3. **Generate Label** → Clicks "Generate Label" button
   - Fills in package details (weight, dimensions, service type)
   - Label is generated and saved

4. **Order Status** → Can be updated to `processing` or `fulfilled`

### Automatic Generation Flow:
1. **Order Created** → Status: `pending`

2. **Order Status Changed** → Status: `pending` → `processing`
   - System checks auto-generation settings
   - If enabled, automatically generates label using default settings
   - Label appears in order detail dialog

3. **Label Ready** → Tracking number added, ready to ship

### Benefits of Automatic Generation:
- ⚡ **Faster Fulfillment**: Labels ready when orders are processed
- 🔄 **Consistent Process**: Same settings used every time
- ⏱️ **Time Savings**: No manual label generation needed
- 📊 **Complete Tracking**: All attempts logged in audit history

### When to Use Manual vs Automatic:
- **Automatic**: Standard orders with consistent package sizes
- **Manual**: Custom packages, special handling, or when you need to verify details first

---

## When Automatic Generation Makes Sense

### Option 1: Auto-generate when status changes to "processing"
**Use Case**: Orders are ready to ship when status changes

**Flow:**
```
Order Status: pending → processing
  ↓
Automatically generate label
  ↓
Label saved, tracking number updated
```

**Pros:**
- Faster fulfillment
- Less manual work
- Consistent process

**Cons:**
- Need default package weight/dimensions
- Can't verify order details first
- Might generate labels for orders that get cancelled

### Option 2: Auto-generate on Shopify order creation
**Use Case**: Trust Shopify orders, auto-generate immediately

**Flow:**
```
Shopify Webhook → Order Created
  ↓
Automatically generate label
  ↓
Order ready to ship
```

**Pros:**
- Instant label generation
- Fully automated workflow

**Cons:**
- No verification step
- Requires default package info
- May generate unnecessary labels

### Option 3: Hybrid Approach (Recommended)
**Use Case**: Auto-generate for certain conditions, manual for others

**Flow:**
```
Order Created
  ↓
Check conditions:
  - Is order from Shopify? → Auto-generate
  - Is order status "processing"? → Auto-generate
  - Is order manual? → Manual generation
  - Is order high-value? → Manual (for verification)
```

**Pros:**
- Best of both worlds
- Flexible rules
- Can be configured per user/settings

**Cons:**
- More complex logic
- Need configuration UI

---

## Implementation Options

### Option A: Database Trigger (PostgreSQL)
Create a trigger that fires when order status changes:

```sql
CREATE OR REPLACE FUNCTION auto_generate_label()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'processing' AND OLD.status != 'processing' THEN
    -- Call API endpoint or queue job
    PERFORM pg_notify('generate_label', NEW.id::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_change
  AFTER UPDATE ON orders
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION auto_generate_label();
```

### Option B: Application Logic (Recommended)
Add logic to `updateOrder` function:

```typescript
export async function updateOrder(id: string, updates: OrderUpdate) {
  // ... existing update logic ...
  
  // If status changed to "processing", auto-generate label
  if (updates.status === "processing" && previousStatus !== "processing") {
    // Queue label generation (async, don't block)
    await queueLabelGeneration(order.id);
  }
  
  return { data, error: null };
}
```

### Option C: Webhook Handler Enhancement
Add label generation to Shopify webhook:

```typescript
// In /api/webhooks/shopify/orders/route.ts
// After creating order:
if (shouldAutoGenerateLabel(shopifyOrder)) {
  await generateLabelForOrder(order.id);
}
```

---

## Recommended Approach

**For MVP: Keep Manual Only**

**Reasons:**
1. ✅ Warehouse staff need to verify orders
2. ✅ Package weight/dimensions need to be measured
3. ✅ Service type selection requires judgment
4. ✅ Prevents errors from auto-generating cancelled orders

**Future Enhancement:**
- Add settings page: "Auto-generate labels when order status = processing"
- Add default package weight/dimensions per user
- Add "Generate Label" button that auto-fills defaults
- Add batch label generation for multiple orders

---

## Configuration Needed for Auto-Generation

If implementing automatic generation, you'll need:

1. **Default Package Info:**
   - Default weight (kg)
   - Default dimensions (cm)
   - Default service type

2. **Rules/Triggers:**
   - When to auto-generate (status change, webhook, etc.)
   - Which orders qualify (all, Shopify only, etc.)

3. **Error Handling:**
   - What if label generation fails?
   - Retry logic
   - Notification system

4. **Settings UI:**
   - Toggle auto-generation on/off
   - Configure defaults
   - Set rules

---

## Current State Summary

✅ **Manual Generation**: Fully implemented and working
✅ **Automatic Generation**: Fully implemented and working
✅ **Settings Configuration**: Complete UI for configuring auto-generation rules
✅ **Default Package Settings**: User-configurable defaults for auto-generation
✅ **Multiple Labels**: Supported (can generate multiple per order)
✅ **Label Management**: View, download, track all labels
✅ **Audit Log**: Complete history of all generation attempts (auto and manual)
✅ **Real-time Updates**: Audit log refreshes automatically, no page refresh needed

## Implementation Details

### Automatic Generation Implementation

**Status Change Trigger** (Implemented):
- When order status changes from `pending` to `processing`
- Checks user's auto-generation settings
- Uses default package weight/dimensions from settings
- Uses default service type from settings
- Uses warehouse/shipper information from settings
- Generates label asynchronously (doesn't block order update)
- Updates audit log with generation attempt

**Configuration**:
- Settings page: `/dashboard/settings/shipping`
- Toggle: Enable/disable auto-generation
- Rules: Configure which triggers to use
- Defaults: Set package weight, dimensions, service type
- Shipper Info: Warehouse address and contact details

**Audit Logging**:
- Every generation attempt is logged
- Tracks: type (auto/manual), status (pending/success/failed), errors, metadata
- Real-time updates when status changes
- Visible in order detail dialog under "Generation History"

### Error Handling

- If auto-generation fails, order update still succeeds
- Errors are logged in audit log with details
- User can still generate labels manually if auto-generation fails
- Failed attempts show error messages in audit log

