-- Demo Assets: Full Orders Set (5 orders total)
-- STEP 2: After testing with 2 orders, use this for the full demo set
-- 
-- HOW TO USE:
-- 1. Make sure 05_seed_orders_test.sql worked first
-- 2. Replace 'YOUR_USER_ID_HERE' below with your actual UUID
-- 3. Run this file in Supabase SQL Editor
-- 4. This will add 3 more orders (total 5 for demo)

-- Insert 5 demo orders (includes the 2 from test, adds 3 more)
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
  ),
  
  -- Order 3: Processing order (being prepared)
  (
    'YOUR_USER_ID_HERE',
    'DEMO-ORD-003',
    'processing',
    'customer3@example.com',
    '{
      "name": "Michael Chen",
      "address1": "789 Pine Road",
      "city": "Chicago",
      "state": "IL",
      "zip": "60601",
      "country": "United States"
    }'::jsonb,
    '[
      {
        "sku": "DEMO-004",
        "name": "Mechanical Keyboard",
        "quantity": 1,
        "price": 149.99,
        "total": 149.99
      },
      {
        "sku": "DEMO-005",
        "name": "Monitor Stand",
        "quantity": 1,
        "price": 89.99,
        "total": 89.99
      },
      {
        "sku": "DEMO-006",
        "name": "Laptop Stand",
        "quantity": 1,
        "price": 69.99,
        "total": 69.99
      }
    ]'::jsonb,
    'paid',
    309.97,
    NULL
  ),
  
  -- Order 4: Pending order with pending payment
  (
    'YOUR_USER_ID_HERE',
    'DEMO-ORD-004',
    'pending',
    'customer4@example.com',
    '{
      "name": "Emily Davis",
      "address1": "321 Elm Street",
      "address2": "Suite 200",
      "city": "Houston",
      "state": "TX",
      "zip": "77001",
      "country": "United States",
      "phone": "+1-555-0404"
    }'::jsonb,
    '[
      {
        "sku": "DEMO-007",
        "name": "Webcam HD",
        "quantity": 1,
        "price": 99.99,
        "total": 99.99
      }
    ]'::jsonb,
    'pending',
    99.99,
    NULL
  ),
  
  -- Order 5: Cancelled order
  (
    'YOUR_USER_ID_HERE',
    'DEMO-ORD-005',
    'cancelled',
    'customer5@example.com',
    '{
      "name": "Robert Wilson",
      "address1": "654 Maple Drive",
      "city": "Phoenix",
      "state": "AZ",
      "zip": "85001",
      "country": "United States"
    }'::jsonb,
    '[
      {
        "sku": "DEMO-008",
        "name": "USB Hub 4-Port",
        "quantity": 2,
        "price": 34.99,
        "total": 69.98
      }
    ]'::jsonb,
    'refunded',
    69.98,
    NULL
  );

-- Verify all demo orders
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
ORDER BY 
  CASE status
    WHEN 'pending' THEN 1
    WHEN 'processing' THEN 2
    WHEN 'fulfilled' THEN 3
    WHEN 'cancelled' THEN 4
  END,
  created_at DESC;

-- Expected result: You should see 5 orders
-- DEMO-ORD-001: Pending, Paid, $139.97, 2 items
-- DEMO-ORD-004: Pending, Pending payment, $99.99, 1 item
-- DEMO-ORD-003: Processing, Paid, $309.97, 3 items
-- DEMO-ORD-002: Fulfilled, Paid, $64.95, 1 item, has tracking
-- DEMO-ORD-005: Cancelled, Refunded, $69.98, 1 item
