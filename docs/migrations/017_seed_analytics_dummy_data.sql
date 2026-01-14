-- Migration: Seed Analytics Dummy Data
-- Created: 2025-01-XX
-- Description: Adds comprehensive dummy data for testing analytics page
-- 
-- HOW TO USE:
-- STEP 1: Get your user_id by running this query first:
--   SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 1;
--   Or use the helper script: 019_get_user_id_for_seeding.sql
--
-- STEP 2: Replace 'YOUR_USER_ID_HERE' below with your actual UUID (keep the quotes!)
--   Example: If your user_id is 'b24b8854-24cc-4483-8043-b9701f8365d9'
--   Replace: 'YOUR_USER_ID_HERE' → 'b24b8854-24cc-4483-8043-b9701f8365d9'
--
-- STEP 3: Run this entire file in Supabase SQL Editor
--
-- NOTE: 'YOUR_USER_ID_HERE' doesn't work in SQL Editor, so you must use your actual UUID

-- ============================================================================
-- PART 1: ORDERS (30 orders spread across last 90 days)
-- ============================================================================

INSERT INTO public.orders (
  user_id,
  shop_id,
  order_number,
  status,
  customer_email,
  shipping_address,
  items,
  financial_status,
  total,
  tracking_number,
  created_at
)
VALUES
  -- Shopify orders (shop_id set) - Last 30 days
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-001', 'fulfilled', 'customer1@example.com', 
   '{"name": "Alice Johnson", "address1": "123 Main St", "city": "New York", "state": "NY", "zip": "10001", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-001", "name": "Wireless Mouse", "quantity": 2, "price": 29.99, "total": 59.98}]'::jsonb,
   'paid', 59.98, 'TRACK001', NOW() - INTERVAL '2 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-002', 'fulfilled', 'customer2@example.com',
   '{"name": "Bob Smith", "address1": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "zip": "90001", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-002", "name": "Mechanical Keyboard", "quantity": 1, "price": 149.99, "total": 149.99}]'::jsonb,
   'paid', 149.99, 'TRACK002', NOW() - INTERVAL '5 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-003', 'processing', 'customer3@example.com',
   '{"name": "Carol White", "address1": "789 Pine Rd", "city": "Chicago", "state": "IL", "zip": "60601", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-003", "name": "USB-C Cable", "quantity": 5, "price": 12.99, "total": 64.95}]'::jsonb,
   'paid', 64.95, NULL, NOW() - INTERVAL '1 day'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-004', 'pending', 'customer4@example.com',
   '{"name": "David Brown", "address1": "321 Elm St", "city": "Houston", "state": "TX", "zip": "77001", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-004", "name": "Monitor Stand", "quantity": 1, "price": 89.99, "total": 89.99}]'::jsonb,
   'pending', 89.99, NULL, NOW() - INTERVAL '3 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-005', 'fulfilled', 'customer5@example.com',
   '{"name": "Emma Davis", "address1": "654 Maple Dr", "city": "Phoenix", "state": "AZ", "zip": "85001", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-005", "name": "Laptop Stand", "quantity": 1, "price": 69.99, "total": 69.99}, {"sku": "SKU-006", "name": "Gaming Headset", "quantity": 1, "price": 79.99, "total": 79.99}]'::jsonb,
   'paid', 149.98, 'TRACK003', NOW() - INTERVAL '7 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-006', 'cancelled', 'customer6@example.com',
   '{"name": "Frank Miller", "address1": "987 Cedar Ln", "city": "Philadelphia", "state": "PA", "zip": "19101", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-007", "name": "Webcam HD", "quantity": 1, "price": 99.99, "total": 99.99}]'::jsonb,
   'refunded', 99.99, NULL, NOW() - INTERVAL '10 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-007', 'fulfilled', 'customer7@example.com',
   '{"name": "Grace Lee", "address1": "147 Birch St", "city": "San Antonio", "state": "TX", "zip": "78201", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-008", "name": "USB Hub 4-Port", "quantity": 3, "price": 34.99, "total": 104.97}]'::jsonb,
   'paid', 104.97, 'TRACK004', NOW() - INTERVAL '12 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-008', 'processing', 'customer8@example.com',
   '{"name": "Henry Wilson", "address1": "258 Spruce Ave", "city": "San Diego", "state": "CA", "zip": "92101", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-009", "name": "Desk Mat Large", "quantity": 2, "price": 24.99, "total": 49.98}]'::jsonb,
   'paid', 49.98, NULL, NOW() - INTERVAL '15 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-009', 'fulfilled', 'customer9@example.com',
   '{"name": "Iris Chen", "address1": "369 Willow Way", "city": "Dallas", "state": "TX", "zip": "75201", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-010", "name": "Monitor Arm Single", "quantity": 1, "price": 129.99, "total": 129.99}]'::jsonb,
   'paid', 129.99, 'TRACK005', NOW() - INTERVAL '18 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-010', 'fulfilled', 'customer10@example.com',
   '{"name": "Jack Taylor", "address1": "741 Ash Blvd", "city": "San Jose", "state": "CA", "zip": "95101", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-011", "name": "HDMI Cable", "quantity": 4, "price": 14.99, "total": 59.96}, {"sku": "SKU-012", "name": "Ethernet Cable", "quantity": 2, "price": 9.99, "total": 19.98}]'::jsonb,
   'paid', 79.94, 'TRACK006', NOW() - INTERVAL '20 days'),

  -- Manual orders (shop_id NULL) - Last 30 days
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', NULL, 'MAN-001', 'fulfilled', 'manual1@example.com',
   '{"name": "Kevin Martinez", "address1": "852 Poplar St", "city": "Austin", "state": "TX", "zip": "73301", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-013", "name": "LED Desk Lamp", "quantity": 1, "price": 39.99, "total": 39.99}]'::jsonb,
   'paid', 39.99, 'TRACK007', NOW() - INTERVAL '4 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', NULL, 'MAN-002', 'pending', 'manual2@example.com',
   '{"name": "Lisa Anderson", "address1": "963 Hickory Dr", "city": "Jacksonville", "state": "FL", "zip": "32201", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-014", "name": "Cable Management Kit", "quantity": 2, "price": 19.99, "total": 39.98}]'::jsonb,
   'pending', 39.98, NULL, NOW() - INTERVAL '6 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', NULL, 'MAN-003', 'processing', 'manual3@example.com',
   '{"name": "Mike Thompson", "address1": "159 Sycamore Ln", "city": "Fort Worth", "state": "TX", "zip": "76101", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-001", "name": "Wireless Mouse", "quantity": 3, "price": 29.99, "total": 89.97}]'::jsonb,
   'paid', 89.97, NULL, NOW() - INTERVAL '8 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', NULL, 'MAN-004', 'fulfilled', 'manual4@example.com',
   '{"name": "Nancy Garcia", "address1": "357 Magnolia Ave", "city": "Columbus", "state": "OH", "zip": "43201", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-002", "name": "Mechanical Keyboard", "quantity": 1, "price": 149.99, "total": 149.99}, {"sku": "SKU-003", "name": "USB-C Cable", "quantity": 2, "price": 12.99, "total": 25.98}]'::jsonb,
   'paid', 175.97, 'TRACK008', NOW() - INTERVAL '11 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', NULL, 'MAN-005', 'cancelled', 'manual5@example.com',
   '{"name": "Oscar Rodriguez", "address1": "468 Redwood St", "city": "Charlotte", "state": "NC", "zip": "28201", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-004", "name": "Monitor Stand", "quantity": 1, "price": 89.99, "total": 89.99}]'::jsonb,
   'refunded', 89.99, NULL, NOW() - INTERVAL '13 days'),

  -- More orders spread across 30-60 days ago
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-011', 'fulfilled', 'customer11@example.com',
   '{"name": "Patricia Lewis", "address1": "579 Cypress Way", "city": "Seattle", "state": "WA", "zip": "98101", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-005", "name": "Laptop Stand", "quantity": 1, "price": 69.99, "total": 69.99}]'::jsonb,
   'paid', 69.99, 'TRACK009', NOW() - INTERVAL '25 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-012', 'fulfilled', 'customer12@example.com',
   '{"name": "Quinn Walker", "address1": "680 Fir Blvd", "city": "Denver", "state": "CO", "zip": "80201", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-006", "name": "Gaming Headset", "quantity": 2, "price": 79.99, "total": 159.98}]'::jsonb,
   'paid', 159.98, 'TRACK010', NOW() - INTERVAL '28 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', NULL, 'MAN-006', 'fulfilled', 'manual6@example.com',
   '{"name": "Rachel Hall", "address1": "791 Juniper St", "city": "Washington", "state": "DC", "zip": "20001", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-007", "name": "Webcam HD", "quantity": 1, "price": 99.99, "total": 99.99}]'::jsonb,
   'paid', 99.99, 'TRACK011', NOW() - INTERVAL '30 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-013', 'fulfilled', 'customer13@example.com',
   '{"name": "Steve Allen", "address1": "802 Hemlock Ave", "city": "Boston", "state": "MA", "zip": "02101", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-008", "name": "USB Hub 4-Port", "quantity": 2, "price": 34.99, "total": 69.98}]'::jsonb,
   'paid', 69.98, 'TRACK012', NOW() - INTERVAL '32 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-014', 'fulfilled', 'customer14@example.com',
   '{"name": "Tina Young", "address1": "913 Larch Dr", "city": "El Paso", "state": "TX", "zip": "79901", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-009", "name": "Desk Mat Large", "quantity": 1, "price": 24.99, "total": 24.99}, {"sku": "SKU-010", "name": "Monitor Arm Single", "quantity": 1, "price": 129.99, "total": 129.99}]'::jsonb,
   'paid', 154.98, 'TRACK013', NOW() - INTERVAL '35 days'),

  -- More orders spread across 60-90 days ago
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', NULL, 'MAN-007', 'fulfilled', 'manual7@example.com',
   '{"name": "Uma King", "address1": "124 Alder Ln", "city": "Detroit", "state": "MI", "zip": "48201", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-011", "name": "HDMI Cable", "quantity": 3, "price": 14.99, "total": 44.97}]'::jsonb,
   'paid', 44.97, 'TRACK014', NOW() - INTERVAL '45 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-015', 'fulfilled', 'customer15@example.com',
   '{"name": "Victor Wright", "address1": "235 Beech St", "city": "Nashville", "state": "TN", "zip": "37201", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-012", "name": "Ethernet Cable", "quantity": 5, "price": 9.99, "total": 49.95}]'::jsonb,
   'paid', 49.95, 'TRACK015', NOW() - INTERVAL '50 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-016', 'fulfilled', 'customer16@example.com',
   '{"name": "Wendy Lopez", "address1": "346 Chestnut Ave", "city": "Memphis", "state": "TN", "zip": "38101", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-013", "name": "LED Desk Lamp", "quantity": 2, "price": 39.99, "total": 79.98}]'::jsonb,
   'paid', 79.98, 'TRACK016', NOW() - INTERVAL '55 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', NULL, 'MAN-008', 'fulfilled', 'manual8@example.com',
   '{"name": "Xavier Hill", "address1": "457 Dogwood Way", "city": "Portland", "state": "OR", "zip": "97201", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-014", "name": "Cable Management Kit", "quantity": 1, "price": 19.99, "total": 19.99}]'::jsonb,
   'paid', 19.99, 'TRACK017', NOW() - INTERVAL '60 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-017', 'fulfilled', 'customer17@example.com',
   '{"name": "Yara Scott", "address1": "568 Elmwood Blvd", "city": "Oklahoma City", "state": "OK", "zip": "73101", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-001", "name": "Wireless Mouse", "quantity": 4, "price": 29.99, "total": 119.96}]'::jsonb,
   'paid', 119.96, 'TRACK018', NOW() - INTERVAL '65 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-018', 'fulfilled', 'customer18@example.com',
   '{"name": "Zach Green", "address1": "679 Maplewood Dr", "city": "Las Vegas", "state": "NV", "zip": "89101", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-002", "name": "Mechanical Keyboard", "quantity": 1, "price": 149.99, "total": 149.99}, {"sku": "SKU-003", "name": "USB-C Cable", "quantity": 3, "price": 12.99, "total": 38.97}]'::jsonb,
   'paid', 188.96, 'TRACK019', NOW() - INTERVAL '70 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', NULL, 'MAN-009', 'fulfilled', 'manual9@example.com',
   '{"name": "Amy Adams", "address1": "780 Oakwood St", "city": "Milwaukee", "state": "WI", "zip": "53201", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-004", "name": "Monitor Stand", "quantity": 1, "price": 89.99, "total": 89.99}]'::jsonb,
   'paid', 89.99, 'TRACK020', NOW() - INTERVAL '75 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-019', 'fulfilled', 'customer19@example.com',
   '{"name": "Ben Baker", "address1": "891 Pinewood Ave", "city": "Albuquerque", "state": "NM", "zip": "87101", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-005", "name": "Laptop Stand", "quantity": 2, "price": 69.99, "total": 139.98}]'::jsonb,
   'paid', 139.98, 'TRACK021', NOW() - INTERVAL '80 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', gen_random_uuid(), 'SHOP-020', 'fulfilled', 'customer20@example.com',
   '{"name": "Cathy Cooper", "address1": "902 Cedarwood Ln", "city": "Tucson", "state": "AZ", "zip": "85701", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-006", "name": "Gaming Headset", "quantity": 1, "price": 79.99, "total": 79.99}]'::jsonb,
   'paid', 79.99, 'TRACK022', NOW() - INTERVAL '85 days'),
  
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', NULL, 'MAN-010', 'fulfilled', 'manual10@example.com',
   '{"name": "Dan Evans", "address1": "103 Hickorywood Way", "city": "Fresno", "state": "CA", "zip": "93701", "country": "United States"}'::jsonb,
   '[{"sku": "SKU-007", "name": "Webcam HD", "quantity": 1, "price": 99.99, "total": 99.99}, {"sku": "SKU-008", "name": "USB Hub 4-Port", "quantity": 1, "price": 34.99, "total": 34.99}]'::jsonb,
   'paid', 134.98, 'TRACK023', NOW() - INTERVAL '88 days');

-- ============================================================================
-- PART 2: RECEIVING LOGS (20 entries spread across last 90 days)
-- ============================================================================

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
  -- Good condition entries
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-001', 'SKU-001', 50, 'good', 'Warehouse A - Shelf 3', NOW() - INTERVAL '5 days', 'Received new shipment from main supplier'),
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-001', 'SKU-002', 30, 'good', 'Warehouse A - Shelf 5', NOW() - INTERVAL '8 days', 'Restocking keyboards'),
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', NULL, 'SKU-003', 100, 'good', 'Warehouse B - Bin 12', NOW() - INTERVAL '12 days', 'Direct restock'),
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-002', 'SKU-004', 25, 'good', 'Warehouse A - Shelf 7', NOW() - INTERVAL '15 days', 'Monitor stands received'),
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-001', 'SKU-005', 40, 'good', 'Warehouse B - Shelf 2', NOW() - INTERVAL '18 days', 'Laptop stands shipment'),
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-003', 'SKU-006', 20, 'good', 'Warehouse A - Shelf 1', NOW() - INTERVAL '22 days', 'Gaming headsets'),
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-001', 'SKU-007', 15, 'good', 'Warehouse B - Shelf 4', NOW() - INTERVAL '25 days', 'Webcams received'),
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', NULL, 'SKU-008', 60, 'good', 'Warehouse A - Bin 5', NOW() - INTERVAL '28 days', 'USB hubs restock'),
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-002', 'SKU-009', 35, 'good', 'Warehouse B - Shelf 8', NOW() - INTERVAL '32 days', 'Desk mats'),
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-001', 'SKU-010', 10, 'good', 'Warehouse A - Shelf 9', NOW() - INTERVAL '35 days', 'Monitor arms'),
  
  -- Damaged entries
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-002', 'SKU-001', 5, 'damaged', 'Warehouse A - Shelf 3', NOW() - INTERVAL '7 days', 'Damaged in transit'),
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-003', 'SKU-002', 3, 'damaged', 'Warehouse A - Shelf 5', NOW() - INTERVAL '20 days', 'Packaging damaged'),
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-001', 'SKU-004', 2, 'damaged', 'Warehouse A - Shelf 7', NOW() - INTERVAL '30 days', 'Items damaged'),
  
  -- Defective entries
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-002', 'SKU-003', 8, 'defective', 'Warehouse B - Bin 12', NOW() - INTERVAL '10 days', 'Manufacturing defect'),
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-001', 'SKU-005', 4, 'defective', 'Warehouse B - Shelf 2', NOW() - INTERVAL '24 days', 'Quality control failed'),
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-003', 'SKU-007', 2, 'defective', 'Warehouse B - Shelf 4', NOW() - INTERVAL '38 days', 'Defective units'),
  
  -- Returned entries
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-001', 'SKU-006', 6, 'returned', 'Warehouse A - Shelf 1', NOW() - INTERVAL '14 days', 'Customer returns'),
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', NULL, 'SKU-008', 4, 'returned', 'Warehouse A - Bin 5', NOW() - INTERVAL '26 days', 'Returned items'),
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-002', 'SKU-010', 1, 'returned', 'Warehouse A - Shelf 9', NOW() - INTERVAL '40 days', 'Customer return'),
  
  -- More good entries for better trends
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-001', 'SKU-011', 80, 'good', 'Warehouse B - Bin 15', NOW() - INTERVAL '42 days', 'HDMI cables'),
  ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', 'SUPPLIER-002', 'SKU-012', 70, 'good', 'Warehouse A - Bin 20', NOW() - INTERVAL '50 days', 'Ethernet cables');

-- ============================================================================
-- PART 3: LABEL GENERATION AUDIT LOGS (25 entries spread across last 90 days)
-- ============================================================================
-- Note: These reference orders created above, so we use subqueries to get order IDs

-- Helper function to insert label audit log entry
DO $$
DECLARE
  order_id_val UUID;
BEGIN
  -- Label 1: SHOP-001
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'SHOP-001' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'auto', 'success', 'TRACK001', 'USPS', 5.50, 'status_change', '{"previous_status": "processing"}'::jsonb, NOW() - INTERVAL '2 days');
  END IF;

  -- Label 2: SHOP-002
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'SHOP-002' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'auto', 'success', 'TRACK002', 'FedEx', 8.25, 'status_change', '{"previous_status": "processing"}'::jsonb, NOW() - INTERVAL '5 days');
  END IF;

  -- Label 3: SHOP-003 (failed)
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'SHOP-003' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, error_message, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'manual', 'failed', 'Invalid shipping address', 'manual_click', '{}'::jsonb, NOW() - INTERVAL '1 day');
  END IF;

  -- Label 4: SHOP-005
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'SHOP-005' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'auto', 'success', 'TRACK003', 'UPS', 6.75, 'status_change', '{"previous_status": "processing"}'::jsonb, NOW() - INTERVAL '7 days');
  END IF;

  -- Label 5: SHOP-007
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'SHOP-007' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'manual', 'success', 'TRACK004', 'USPS', 4.50, 'manual_click', '{}'::jsonb, NOW() - INTERVAL '12 days');
  END IF;

  -- Label 6: SHOP-009
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'SHOP-009' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'auto', 'success', 'TRACK005', 'FedEx', 9.00, 'status_change', '{"previous_status": "processing"}'::jsonb, NOW() - INTERVAL '18 days');
  END IF;

  -- Label 7: SHOP-010
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'SHOP-010' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'auto', 'success', 'TRACK006', 'UPS', 7.25, 'status_change', '{"previous_status": "processing"}'::jsonb, NOW() - INTERVAL '20 days');
  END IF;

  -- Label 8: MAN-001
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'MAN-001' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'manual', 'success', 'TRACK007', 'USPS', 5.00, 'manual_click', '{}'::jsonb, NOW() - INTERVAL '4 days');
  END IF;

  -- Label 9: MAN-002 (failed)
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'MAN-002' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, error_message, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'manual', 'failed', 'Carrier API timeout', 'manual_click', '{}'::jsonb, NOW() - INTERVAL '6 days');
  END IF;

  -- Label 10: MAN-004
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'MAN-004' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'auto', 'success', 'TRACK008', 'FedEx', 8.50, 'status_change', '{"previous_status": "processing"}'::jsonb, NOW() - INTERVAL '11 days');
  END IF;

  -- Label 11: SHOP-011
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'SHOP-011' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'auto', 'success', 'TRACK009', 'UPS', 6.50, 'status_change', '{"previous_status": "processing"}'::jsonb, NOW() - INTERVAL '25 days');
  END IF;

  -- Label 12: SHOP-012
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'SHOP-012' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'auto', 'success', 'TRACK010', 'USPS', 5.75, 'status_change', '{"previous_status": "processing"}'::jsonb, NOW() - INTERVAL '28 days');
  END IF;

  -- Label 13: MAN-006
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'MAN-006' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'manual', 'success', 'TRACK011', 'FedEx', 7.75, 'manual_click', '{}'::jsonb, NOW() - INTERVAL '30 days');
  END IF;

  -- Label 14: SHOP-013
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'SHOP-013' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'auto', 'success', 'TRACK012', 'UPS', 6.00, 'status_change', '{"previous_status": "processing"}'::jsonb, NOW() - INTERVAL '32 days');
  END IF;

  -- Label 15: SHOP-014
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'SHOP-014' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'auto', 'success', 'TRACK013', 'USPS', 5.25, 'status_change', '{"previous_status": "processing"}'::jsonb, NOW() - INTERVAL '35 days');
  END IF;

  -- Label 16: MAN-007
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'MAN-007' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'manual', 'success', 'TRACK014', 'FedEx', 8.00, 'manual_click', '{}'::jsonb, NOW() - INTERVAL '45 days');
  END IF;

  -- Label 17: SHOP-015
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'SHOP-015' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'auto', 'success', 'TRACK015', 'UPS', 6.25, 'status_change', '{"previous_status": "processing"}'::jsonb, NOW() - INTERVAL '50 days');
  END IF;

  -- Label 18: SHOP-016
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'SHOP-016' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'auto', 'success', 'TRACK016', 'USPS', 5.50, 'status_change', '{"previous_status": "processing"}'::jsonb, NOW() - INTERVAL '55 days');
  END IF;

  -- Label 19: MAN-008
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'MAN-008' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'manual', 'success', 'TRACK017', 'FedEx', 7.50, 'manual_click', '{}'::jsonb, NOW() - INTERVAL '60 days');
  END IF;

  -- Label 20: SHOP-017
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'SHOP-017' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'auto', 'success', 'TRACK018', 'UPS', 6.75, 'status_change', '{"previous_status": "processing"}'::jsonb, NOW() - INTERVAL '65 days');
  END IF;

  -- Label 21: SHOP-018
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'SHOP-018' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'auto', 'success', 'TRACK019', 'USPS', 5.00, 'status_change', '{"previous_status": "processing"}'::jsonb, NOW() - INTERVAL '70 days');
  END IF;

  -- Label 22: MAN-009
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'MAN-009' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'manual', 'success', 'TRACK020', 'FedEx', 8.25, 'manual_click', '{}'::jsonb, NOW() - INTERVAL '75 days');
  END IF;

  -- Label 23: SHOP-019
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'SHOP-019' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'auto', 'success', 'TRACK021', 'UPS', 7.00, 'status_change', '{"previous_status": "processing"}'::jsonb, NOW() - INTERVAL '80 days');
  END IF;

  -- Label 24: SHOP-020
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'SHOP-020' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'auto', 'success', 'TRACK022', 'USPS', 5.25, 'status_change', '{"previous_status": "processing"}'::jsonb, NOW() - INTERVAL '85 days');
  END IF;

  -- Label 25: MAN-010
  SELECT id INTO order_id_val FROM public.orders WHERE order_number = 'MAN-010' AND user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf' LIMIT 1;
  IF order_id_val IS NOT NULL THEN
    INSERT INTO public.label_generation_audit_log (user_id, order_id, label_id, generation_type, status, tracking_number, carrier, cost, triggered_by, metadata, created_at)
    VALUES ('bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf', order_id_val, NULL, 'manual', 'success', 'TRACK023', 'FedEx', 9.50, 'manual_click', '{}'::jsonb, NOW() - INTERVAL '88 days');
  END IF;
END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify orders count
SELECT 
  COUNT(*) as total_orders,
  COUNT(CASE WHEN shop_id IS NOT NULL THEN 1 END) as shopify_orders,
  COUNT(CASE WHEN shop_id IS NULL THEN 1 END) as manual_orders,
  COUNT(CASE WHEN status = 'fulfilled' THEN 1 END) as fulfilled,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
  COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled
FROM public.orders
WHERE user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf'
AND (order_number LIKE 'SHOP-%' OR order_number LIKE 'MAN-%');

-- Verify receiving logs count
SELECT 
  condition,
  COUNT(*) as count,
  SUM(quantity) as total_quantity
FROM public.receiving_log
WHERE user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf'
GROUP BY condition
ORDER BY condition;

-- Verify label audit logs count
SELECT 
  status,
  generation_type,
  COUNT(*) as count,
  SUM(cost) as total_cost
FROM public.label_generation_audit_log
WHERE user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf'
GROUP BY status, generation_type
ORDER BY status, generation_type;

-- Diagnostic: Check receiving trends data for last 30 days
SELECT 
  TO_CHAR(DATE_TRUNC('day', received_at), 'YYYY-MM-DD') as date,
  SUM(quantity) as total_quantity,
  COUNT(*) as entry_count
FROM public.receiving_log
WHERE user_id = 'bacc4370-22ed-4dc1-b8ea-acc7f9bc74bf'
  AND received_at >= NOW() - INTERVAL '30 days'
  AND received_at <= NOW()
GROUP BY DATE_TRUNC('day', received_at)
ORDER BY DATE_TRUNC('day', received_at) DESC;
