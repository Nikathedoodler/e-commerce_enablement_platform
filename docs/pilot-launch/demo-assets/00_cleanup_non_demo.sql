  -- Cleanup: Delete All Non-DEMO Inventory Items
  -- Run this BEFORE adding more demo items
  -- 
  -- HOW TO USE:
  -- 1. Replace 'YOUR_USER_ID_HERE' with your actual UUID
  -- 2. Run this in Supabase SQL Editor
  -- 3. This will delete all items that DON'T start with 'DEMO-'
  -- 4. Your 3 existing DEMO items (DEMO-001, DEMO-002, DEMO-003) will be kept

  -- Replace 'YOUR_USER_ID_HERE' with your actual UUID
  DELETE FROM public.inventory 
  WHERE user_id = 'YOUR_USER_ID_HERE' 
  AND sku NOT LIKE 'DEMO-%';

  -- Verify cleanup - should only show DEMO items
  SELECT 
    sku,
    name,
    quantity,
    reorder_threshold,
    location
  FROM public.inventory
  WHERE user_id = 'YOUR_USER_ID_HERE'
  ORDER BY sku;

  -- Expected result: You should only see 3 items (DEMO-001, DEMO-002, DEMO-003)
