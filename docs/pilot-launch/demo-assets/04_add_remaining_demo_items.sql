-- Demo Assets: Add Remaining 7 Inventory Items
-- STEP 3: Add 7 more items to complete the 10-item demo set
-- 
-- HOW TO USE:
-- 1. Run 00_cleanup_non_demo.sql first to remove old items
-- 2. Replace 'YOUR_USER_ID_HERE' below with your actual UUID
-- 3. Run this file in Supabase SQL Editor
-- 4. This will add DEMO-004 through DEMO-010 (7 items)
-- 5. Total will be 10 items (your existing 3 + these 7)

-- Insert 7 additional demo inventory items
-- Replace 'YOUR_USER_ID_HERE' with your actual UUID

INSERT INTO public.inventory (user_id, sku, name, quantity, location, reorder_threshold)
VALUES
  -- Items with adequate stock (green status)
  ('YOUR_USER_ID_HERE', 'DEMO-004', 'Mechanical Keyboard', 85, 'Warehouse A - Shelf 5', 15),
  ('YOUR_USER_ID_HERE', 'DEMO-005', 'Monitor Stand', 45, 'Warehouse A - Shelf 7', 10),
  ('YOUR_USER_ID_HERE', 'DEMO-006', 'Laptop Stand', 60, 'Warehouse B - Shelf 2', 12),
  
  -- Items with low stock (red status - quantity <= reorder_threshold)
  ('YOUR_USER_ID_HERE', 'DEMO-007', 'Webcam HD', 5, 'Warehouse B - Shelf 4', 10),
  ('YOUR_USER_ID_HERE', 'DEMO-008', 'USB Hub 4-Port', 12, 'Warehouse A - Bin 5', 15),
  ('YOUR_USER_ID_HERE', 'DEMO-009', 'Desk Mat Large', 3, 'Warehouse B - Shelf 8', 5),
  ('YOUR_USER_ID_HERE', 'DEMO-010', 'Monitor Arm Single', 2, 'Warehouse A - Shelf 9', 5);

-- Verify all demo items (should be 10 total)
SELECT 
  sku,
  name,
  quantity,
  reorder_threshold,
  quantity <= reorder_threshold as is_low_stock,
  location
FROM public.inventory
WHERE user_id = 'YOUR_USER_ID_HERE'
AND sku LIKE 'DEMO-%'
ORDER BY 
  quantity <= reorder_threshold DESC, -- Low stock items first
  sku;

-- Expected result: You should see 10 items total
-- Existing: DEMO-001, DEMO-002, DEMO-003
-- New: DEMO-004, DEMO-005, DEMO-006, DEMO-007, DEMO-008, DEMO-009, DEMO-010
-- 
-- Status breakdown:
-- In Stock (green): DEMO-001, DEMO-003, DEMO-004, DEMO-005, DEMO-006 (5 items)
-- Low Stock (red): DEMO-002, DEMO-007, DEMO-008, DEMO-009, DEMO-010 (5 items)
