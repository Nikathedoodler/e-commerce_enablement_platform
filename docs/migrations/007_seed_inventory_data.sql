-- Seed Data: Dummy Inventory Items
-- Created: Current Session
-- Description: Inserts sample inventory data for testing the inventory table UI
-- 
-- HOW TO USE:
-- 1. Run this in Supabase SQL Editor
-- 2. Replace 'YOUR_USER_ID_HERE' with your actual user_id (from auth.users table)
--    OR use this query to get your user_id:
--    SELECT id FROM auth.users WHERE email = 'your-email@example.com';
--
-- 3. Run the INSERT statements below

-- Example: Get your user_id first (uncomment and run):
-- SELECT id, email FROM auth.users;

-- INSERT dummy inventory items
-- Replace 'YOUR_USER_ID_HERE' with your actual UUID from auth.users

INSERT INTO public.inventory (user_id, sku, name, quantity, location, reorder_threshold)
VALUES
  -- Items with adequate stock (green status)
  ('YOUR_USER_ID_HERE', 'SKU-001', 'Wireless Mouse', 150, 'Warehouse A - Shelf 3', 20),
  ('YOUR_USER_ID_HERE', 'SKU-002', 'Mechanical Keyboard', 85, 'Warehouse A - Shelf 5', 15),
  ('YOUR_USER_ID_HERE', 'SKU-003', 'USB-C Cable', 200, 'Warehouse B - Bin 12', 30),
  ('YOUR_USER_ID_HERE', 'SKU-004', 'Monitor Stand', 45, 'Warehouse A - Shelf 7', 10),
  ('YOUR_USER_ID_HERE', 'SKU-005', 'Laptop Stand', 60, 'Warehouse B - Shelf 2', 12),
  
  -- Items with low stock (red status - quantity <= reorder_threshold)
  ('YOUR_USER_ID_HERE', 'SKU-006', 'Gaming Headset', 8, 'Warehouse A - Shelf 1', 10),
  ('YOUR_USER_ID_HERE', 'SKU-007', 'Webcam HD', 5, 'Warehouse B - Shelf 4', 10),
  ('YOUR_USER_ID_HERE', 'SKU-008', 'USB Hub 4-Port', 12, 'Warehouse A - Bin 5', 15),
  ('YOUR_USER_ID_HERE', 'SKU-009', 'Desk Mat Large', 3, 'Warehouse B - Shelf 8', 5),
  ('YOUR_USER_ID_HERE', 'SKU-010', 'Monitor Arm Single', 2, 'Warehouse A - Shelf 9', 5),
  
  -- Items with location null (testing null handling)
  ('YOUR_USER_ID_HERE', 'SKU-011', 'HDMI Cable', 75, NULL, 20),
  ('YOUR_USER_ID_HERE', 'SKU-012', 'Ethernet Cable', 90, NULL, 25),
  
  -- More items for variety
  ('YOUR_USER_ID_HERE', 'SKU-013', 'LED Desk Lamp', 35, 'Warehouse B - Shelf 6', 8),
  ('YOUR_USER_ID_HERE', 'SKU-014', 'Cable Management Kit', 42, 'Warehouse A - Bin 8', 10),
  ('YOUR_USER_ID_HERE', 'SKU-015', 'Laptop Cooling Pad', 28, 'Warehouse B - Shelf 3', 7);

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
ORDER BY created_at DESC;

