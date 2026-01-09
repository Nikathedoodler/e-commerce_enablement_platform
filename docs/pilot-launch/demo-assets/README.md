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

**Once inventory is complete, we'll create sample orders next.**

---

## 🗑️ How to Clear Demo Data

If you need to remove demo data and start over:

```sql
-- Delete all demo inventory items
DELETE FROM public.inventory
WHERE user_id = 'YOUR_USER_ID_HERE'
AND sku LIKE 'DEMO-%';

-- Verify deletion
SELECT COUNT(*) FROM public.inventory
WHERE user_id = 'YOUR_USER_ID_HERE'
AND sku LIKE 'DEMO-%';
-- Should return 0
```

---

## 📝 Files in This Folder

- `01_get_user_id.sql` - Helper to get your user ID
- `02_seed_inventory_test.sql` - Test with 3 items (START HERE)
- `00_cleanup_non_demo.sql` - Delete all non-DEMO items (optional)
- `04_add_remaining_demo_items.sql` - Add 7 more items (complete to 10)
- `03_seed_inventory_full.sql` - Full set of 10 items (alternative - use if starting fresh)
- `README.md` - This file

**Coming Next:**

- `04_seed_orders_test.sql` - Test with 2 sample orders
- `05_seed_orders_full.sql` - Full set of 5 sample orders
- `06_seed_receiving_logs.sql` - Sample receiving log entries
- `07_demo_walkthrough_script.md` - Demo presentation script

---

## ✅ Testing Checklist

After each step, verify:

- [ ] Items appear in Inventory page
- [ ] Low stock items show red status
- [ ] Items with locations display correctly
- [ ] Items without locations (NULL) display correctly
- [ ] Search/filter works with demo data
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

**Next Step**: After inventory works, we'll create sample orders!
