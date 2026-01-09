-- Demo Assets: Full Inventory Items (10 items)
-- STEP 2: After testing with 3 items, use this for the full demo set
-- 
-- HOW TO USE:
-- 1. Make sure 02_seed_inventory_test.sql worked first
-- 2. Replace 'YOUR_USER_ID_HERE' below with your actual UUID
-- 3. Run this file in Supabase SQL Editor
-- 4. This will add 7 more items (total 10 for demo)

-- Insert 10 demo inventory items
-- Replace 'YOUR_USER_ID_HERE' with your actual UUID

INSERT INTO public.inventory (user_id, sku, name, quantity, location, reorder_threshold)
VALUES
  -- Items with adequate stock (green status)
  ('YOUR_USER_ID_HERE', 'DEMO-001', 'Wireless Mouse', 150, 'Warehouse A - Shelf 3', 20),
  ('YOUR_USER_ID_HERE', 'DEMO-002', 'Mechanical Keyboard', 85, 'Warehouse A - Shelf 5', 15),
  ('YOUR_USER_ID_HERE', 'DEMO-003', 'USB-C Cable', 200, 'Warehouse B - Bin 12', 30),
  ('YOUR_USER_ID_HERE', 'DEMO-004', 'Monitor Stand', 45, 'Warehouse A - Shelf 7', 10),
  ('YOUR_USER_ID_HERE', 'DEMO-005', 'Laptop Stand', 60, 'Warehouse B - Shelf 2', 12),
  
  -- Items with low stock (red status - quantity <= reorder_threshold)
  ('YOUR_USER_ID_HERE', 'DEMO-006', 'Gaming Headset', 8, 'Warehouse A - Shelf 1', 10),
  ('YOUR_USER_ID_HERE', 'DEMO-007', 'Webcam HD', 5, 'Warehouse B - Shelf 4', 10),
  ('YOUR_USER_ID_HERE', 'DEMO-008', 'USB Hub 4-Port', 12, 'Warehouse A - Bin 5', 15),
  ('YOUR_USER_ID_HERE', 'DEMO-009', 'Desk Mat Large', 3, 'Warehouse B - Shelf 8', 5),
  ('YOUR_USER_ID_HERE', 'DEMO-010', 'Monitor Arm Single', 2, 'Warehouse A - Shelf 9', 5);

-- Verify the data was inserted
SELECT 
  sku,
  name,
  quantity,
  reorder_threshold,
  quantity <= reorder_threshold as is_low_stock,
  location
FROM public.inventory
WHERE user_id = 'YOUR_USER_ID_HERE'
ORDER BY 
  quantity <= reorder_threshold DESC, -- Low stock items first
  created_at DESC;

-- Expected result: You should see 10 items
-- 5 items with green status (adequate stock)
-- 5 items with red status (low stock alerts)
