-- Demo Assets: Test Orders (2 orders)
-- STEP 1: Test with just 2 orders first
-- 
-- HOW TO USE:
-- 1. Make sure you have your user_id from 01_get_user_id.sql
-- 2. Replace 'YOUR_USER_ID_HERE' below with your actual UUID
-- 3. Run this file in Supabase SQL Editor
-- 4. Check your orders page to see the orders
-- 5. If it works, proceed to 06_seed_orders_full.sql for more orders

-- Get your user_id first (uncomment and run):
-- SELECT id, email FROM auth.users;

-- Insert 2 test orders
-- Replace 'YOUR_USER_ID_HERE' with your actual UUID

INSERT INTO public.orders (
  user_id,
  order_number,
  status,
  customer_email,
  shipping_address,
  items,
  financial_status,
  total,
  tracking_number
)
VALUES
  -- Order 1: Pending order (not yet processed)
  (
    'YOUR_USER_ID_HERE',
    'DEMO-ORD-001',
    'pending',
    'customer1@example.com',
    '{
      "name": "John Smith",
      "address1": "123 Main Street",
      "address2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "United States",
      "phone": "+1-555-0101"
    }'::jsonb,
    '[
      {
        "sku": "DEMO-001",
        "name": "Wireless Mouse",
        "quantity": 2,
        "price": 29.99,
        "total": 59.98
      },
      {
        "sku": "DEMO-002",
        "name": "Gaming Headset",
        "quantity": 1,
        "price": 79.99,
        "total": 79.99
      }
    ]'::jsonb,
    'paid',
    139.97,
    NULL
  ),
  
  -- Order 2: Fulfilled order (already shipped)
  (
    'YOUR_USER_ID_HERE',
    'DEMO-ORD-002',
    'fulfilled',
    'customer2@example.com',
    '{
      "name": "Sarah Johnson",
      "address1": "456 Oak Avenue",
      "city": "Los Angeles",
      "state": "CA",
      "zip": "90001",
      "country": "United States",
      "phone": "+1-555-0202"
    }'::jsonb,
    '[
      {
        "sku": "DEMO-003",
        "name": "USB-C Cable",
        "quantity": 5,
        "price": 12.99,
        "total": 64.95
      }
    ]'::jsonb,
    'paid',
    64.95,
    'TRACK123456789'
  );

-- Verify the data was inserted
SELECT 
  order_number,
  status,
  customer_email,
  financial_status,
  total,
  tracking_number,
  jsonb_array_length(items) as item_count,
  created_at
FROM public.orders
WHERE user_id = 'YOUR_USER_ID_HERE'
AND order_number LIKE 'DEMO-%'
ORDER BY created_at DESC;

-- Expected result: You should see 2 orders
-- DEMO-ORD-001: Pending, $139.97, 2 items, no tracking
-- DEMO-ORD-002: Fulfilled, $64.95, 1 item, has tracking number
