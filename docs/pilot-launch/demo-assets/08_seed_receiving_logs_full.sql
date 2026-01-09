-- Demo Assets: Full Receiving Logs Set (4 entries total)
-- STEP 2: After testing with 2 entries, use this for the full demo set
-- 
-- HOW TO USE:
-- 1. Make sure 07_seed_receiving_logs_test.sql worked first
-- 2. Replace 'YOUR_USER_ID_HERE' below with your actual UUID
-- 3. Run this file in Supabase SQL Editor
-- 4. This will add 2 more entries (total 4 for demo)

-- Insert 4 demo receiving log entries
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
    NOW() - INTERVAL '7 days',
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
    NOW() - INTERVAL '5 days',
    'Restocking USB-C cables. Inventory updated automatically.'
  ),
  
  -- Entry 3: Damaged items (won't update inventory)
  (
    'YOUR_USER_ID_HERE',
    'SUPPLIER-002',
    'DEMO-004',
    10,
    'damaged',
    'Warehouse A - Shelf 5',
    NOW() - INTERVAL '2 days',
    'Received damaged items. Returned to supplier for replacement.'
  ),
  
  -- Entry 4: Good condition items with notes
  (
    'YOUR_USER_ID_HERE',
    'SUPPLIER-001',
    'DEMO-006',
    25,
    'good',
    'Warehouse A - Shelf 1',
    NOW() - INTERVAL '1 day',
    'Received gaming headsets. Quality check passed. Ready for sale.'
  );

-- Verify all demo receiving logs
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

-- Expected result: You should see 4 receiving log entries
-- Entry 1 (oldest): DEMO-001, 50 units, good, from SUPPLIER-001 (7 days ago)
-- Entry 2: DEMO-003, 100 units, good, no client (5 days ago)
-- Entry 3: DEMO-004, 10 units, damaged, from SUPPLIER-002 (2 days ago)
-- Entry 4 (newest): DEMO-006, 25 units, good, from SUPPLIER-001 (1 day ago)
-- 
-- Note: Only "good" condition items update inventory automatically
-- Check your inventory page to verify quantities for DEMO-001, DEMO-003, and DEMO-006 increased
-- DEMO-004 should NOT have increased (damaged condition)
