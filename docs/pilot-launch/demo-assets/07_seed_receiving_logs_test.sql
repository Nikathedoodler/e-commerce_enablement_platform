-- Demo Assets: Test Receiving Logs (2 entries)
-- STEP 1: Test with just 2 receiving log entries first
-- 
-- HOW TO USE:
-- 1. Make sure you have your user_id from 01_get_user_id.sql
-- 2. Replace 'YOUR_USER_ID_HERE' below with your actual UUID
-- 3. Run this file in Supabase SQL Editor
-- 4. Check your receiving page to see the logs
-- 5. If it works, proceed to 08_seed_receiving_logs_full.sql for more entries

-- Get your user_id first (uncomment and run):
-- SELECT id, email FROM auth.users;

-- Insert 2 test receiving log entries
-- Replace 'YOUR_USER_ID_HERE' with your actual UUID

INSERT INTO public.receiving_log (
  user_id,
  client_id,
  sku,
  quantity,
  condition,
  location,
  received_at,
  notes
)
VALUES
  -- Entry 1: Good condition items received from supplier
  (
    'YOUR_USER_ID_HERE',
    'SUPPLIER-001',
    'DEMO-001',
    50,
    'good',
    'Warehouse A - Shelf 3',
    NOW() - INTERVAL '3 days',
    'Received new shipment from main supplier. All items in good condition.'
  ),
  
  -- Entry 2: Good condition items, no client_id
  (
    'YOUR_USER_ID_HERE',
    NULL,
    'DEMO-003',
    100,
    'good',
    'Warehouse B - Bin 12',
    NOW() - INTERVAL '1 day',
    'Restocking USB-C cables. Inventory updated automatically.'
  );

-- Verify the data was inserted
SELECT 
  sku,
  quantity,
  condition,
  client_id,
  location,
  received_at,
  notes,
  created_at
FROM public.receiving_log
WHERE user_id = 'YOUR_USER_ID_HERE'
ORDER BY received_at DESC;

-- Expected result: You should see 2 receiving log entries
-- Entry 1: DEMO-001, 50 units, good condition, from SUPPLIER-001
-- Entry 2: DEMO-003, 100 units, good condition, no client_id
-- 
-- Note: Since both are "good" condition, inventory quantities should have been updated automatically
-- Check your inventory page to verify DEMO-001 and DEMO-003 quantities increased
