-- Demo Assets: Test Inventory Items (3 items)
-- STEP 1: Test with just 3 items first
-- 
-- HOW TO USE:
-- 1. Run 01_get_user_id.sql first to get your user_id
-- 2. Replace 'YOUR_USER_ID_HERE' below with your actual UUID
-- 3. Run this file in Supabase SQL Editor
-- 4. Check your inventory page to see the items
-- 5. If it works, proceed to 03_seed_inventory_full.sql for more items

-- Get your user_id first (uncomment and run):
-- SELECT id, email FROM auth.users;

-- Insert 3 test inventory items
-- Replace 'YOUR_USER_ID_HERE' with your actual UUID

INSERT INTO public.inventory (user_id, sku, name, quantity, location, reorder_threshold)
VALUES
  -- Item 1: In stock (green status)
  ('YOUR_USER_ID_HERE', 'DEMO-001', 'Wireless Mouse', 150, 'Warehouse A - Shelf 3', 20),
  
  -- Item 2: Low stock (red status - quantity <= reorder_threshold)
  ('YOUR_USER_ID_HERE', 'DEMO-002', 'Gaming Headset', 8, 'Warehouse A - Shelf 1', 10),
  
  -- Item 3: In stock with no location (testing null handling)
  ('YOUR_USER_ID_HERE', 'DEMO-003', 'USB-C Cable', 200, NULL, 30);

-- Verify the data was inserted
SELECT 
  sku,
  name,
  quantity,
  reorder_threshold,
  quantity <= reorder_threshold as is_low_stock,
  location,
  created_at
FROM public.inventory
WHERE user_id = 'YOUR_USER_ID_HERE'
ORDER BY created_at DESC;

-- Expected result: You should see 3 items
-- - DEMO-001: Green status (150 > 20 threshold)
-- - DEMO-002: Red status (8 <= 10 threshold) 
-- - DEMO-003: Green status (200 > 30 threshold), no location
