# Demo Assets Setup Guide

This folder contains SQL seed files to populate your database with demo data for pilot testing.

## 🎯 Purpose

Demo assets help you:

- Show the platform to pilot users with realistic data
- Test features without manually entering everything
- Demonstrate workflows (low stock alerts, order management, etc.)

## 📋 Setup Steps (Do This Incrementally)

### Step 1: Get Your User ID

1. Open Supabase Dashboard → SQL Editor
2. Run `01_get_user_id.sql`
3. Copy the UUID from the `user_id` column
4. Keep it handy - you'll need it for all seed files

### Step 2: Test with 3 Inventory Items

1. Open `02_seed_inventory_test.sql`
2. Replace `'YOUR_USER_ID_HERE'` with your actual UUID (from Step 1)
3. Run the file in Supabase SQL Editor
4. **Test it**: Go to your app → Inventory page
5. You should see 3 items:
   - DEMO-001: Green status (in stock)
   - DEMO-002: Red status (low stock)
   - DEMO-003: Green status (no location)

**If this works, continue to Step 3. If not, check for errors.**

### Step 3: Clean Up Old Items (Optional)

If you have old inventory items that aren't demo items:

1. Open `00_cleanup_non_demo.sql`
2. Replace `'YOUR_USER_ID_HERE'` with your actual UUID
3. Run the file in Supabase SQL Editor
4. This will delete all items that DON'T start with 'DEMO-'
5. Your 3 existing DEMO items will be kept

### Step 4: Add Remaining 7 Items (Complete to 10 items)

1. Open `04_add_remaining_demo_items.sql`
2. Replace `'YOUR_USER_ID_HERE'` with your actual UUID
3. Run the file in Supabase SQL Editor
4. **Test it**: Check your Inventory page - you should now have 10 items total
5. Verify low stock alerts are working (5 items should show red status)

**Once inventory is complete, continue to orders below.**

---

## 📦 Sample Orders Setup

### Step 5: Test with 2 Orders

1. Open `05_seed_orders_test.sql`
2. Replace `'YOUR_USER_ID_HERE'` with your actual UUID
3. Run the file in Supabase SQL Editor
4. **Test it**: Go to your app → Orders page
5. You should see 2 orders:
   - DEMO-ORD-001: Pending order, $139.97, 2 items
   - DEMO-ORD-002: Fulfilled order, $64.95, 1 item, has tracking

**If this works, continue to Step 6. If not, check for errors.**

### Step 6: Add Full Orders Set (5 orders total)

1. Open `06_seed_orders_full.sql`
2. Replace `'YOUR_USER_ID_HERE'` with your actual UUID
3. Run the file in Supabase SQL Editor
4. **Test it**: Check your Orders page - you should now have 5 orders total
5. Verify different statuses are showing correctly:
   - 2 Pending orders
   - 1 Processing order
   - 1 Fulfilled order
   - 1 Cancelled order

**Once orders work, continue to receiving logs below.**

---

## 📦 Receiving Logs Setup

### Step 7: Test with 2 Receiving Log Entries

1. Open `07_seed_receiving_logs_test.sql`
2. Replace `'YOUR_USER_ID_HERE'` with your actual UUID
3. Run the file in Supabase SQL Editor
4. **Test it**: Go to your app → Receiving page
5. You should see 2 receiving log entries:
   - DEMO-001: 50 units, good condition, from SUPPLIER-001
   - DEMO-003: 100 units, good condition, no supplier
6. **Important**: Check your inventory page - quantities should have increased automatically (because condition is "good")

**If this works, continue to Step 8. If not, check for errors.**

### Step 8: Add Full Receiving Logs Set (4 entries total)

1. Open `08_seed_receiving_logs_full.sql`
2. Replace `'YOUR_USER_ID_HERE'` with your actual UUID
3. Run the file in Supabase SQL Editor
4. **Test it**: Check your Receiving page - you should now have 4 entries total
5. Verify different conditions are showing correctly:
   - 3 entries with "good" condition (inventory updated)
   - 1 entry with "damaged" condition (inventory NOT updated)

**Once receiving logs work, we'll create the demo walkthrough script next.**

---

## 🗑️ How to Clear Demo Data

If you need to remove demo data and start over:

```sql
-- Delete all demo inventory items
DELETE FROM public.inventory
WHERE user_id = 'YOUR_USER_ID_HERE'
AND sku LIKE 'DEMO-%';

-- Delete all demo orders
DELETE FROM public.orders
WHERE user_id = 'YOUR_USER_ID_HERE'
AND order_number LIKE 'DEMO-%';

-- Delete all demo receiving logs
DELETE FROM public.receiving_log
WHERE user_id = 'YOUR_USER_ID_HERE'
AND sku LIKE 'DEMO-%';

-- Verify deletion
SELECT 
  (SELECT COUNT(*) FROM public.inventory WHERE user_id = 'YOUR_USER_ID_HERE' AND sku LIKE 'DEMO-%') as inventory_count,
  (SELECT COUNT(*) FROM public.orders WHERE user_id = 'YOUR_USER_ID_HERE' AND order_number LIKE 'DEMO-%') as orders_count,
  (SELECT COUNT(*) FROM public.receiving_log WHERE user_id = 'YOUR_USER_ID_HERE' AND sku LIKE 'DEMO-%') as receiving_logs_count;
-- All should return 0
```

---

## 📝 Files in This Folder

- `01_get_user_id.sql` - Helper to get your user ID
- `02_seed_inventory_test.sql` - Test with 3 items (START HERE)
- `00_cleanup_non_demo.sql` - Delete all non-DEMO items (optional)
- `04_add_remaining_demo_items.sql` - Add 7 more items (complete to 10)
- `03_seed_inventory_full.sql` - Full set of 10 items (alternative - use if starting fresh)
- `README.md` - This file

**Orders:**

- `05_seed_orders_test.sql` - Test with 2 sample orders (START HERE)
- `06_seed_orders_full.sql` - Full set of 5 sample orders

**Coming Next:**

- `07_seed_receiving_logs.sql` - Sample receiving log entries
- `08_demo_walkthrough_script.md` - Demo presentation script

---

## ✅ Testing Checklist

**After Inventory Setup:**

- [ ] Items appear in Inventory page
- [ ] Low stock items show red status
- [ ] Items with locations display correctly
- [ ] Items without locations (NULL) display correctly
- [ ] Search/filter works with demo data

**After Orders Setup:**

- [ ] Orders appear in Orders page
- [ ] Different statuses display correctly (pending, processing, fulfilled, cancelled)
- [ ] Order details show correct items and totals
- [ ] Shipping addresses display correctly
- [ ] Search/filter works with demo orders

**After Receiving Logs Setup:**

- [ ] Receiving logs appear in Receiving page
- [ ] Different conditions display correctly (good, damaged, defective, returned)
- [ ] Inventory quantities updated automatically for "good" condition items
- [ ] Client/supplier IDs display correctly
- [ ] Notes and locations display correctly
- [ ] No errors in browser console

---

## 🚨 Troubleshooting

**Problem: "permission denied" error**

- Solution: Make sure you're using the correct user_id from your auth.users table

**Problem: Items don't appear**

- Solution: Check that user_id matches your logged-in user
- Solution: Verify RLS policies are working (items should only show for your user)

**Problem: Duplicate SKU error**

- Solution: You already have items with those SKUs. Either delete them first or use different SKUs.

---

**Next Step**: After receiving logs work, we'll create the demo walkthrough script!
