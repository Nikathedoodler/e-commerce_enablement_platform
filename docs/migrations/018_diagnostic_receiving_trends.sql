-- Diagnostic Query: Check Receiving Trends Data
-- Run this in Supabase SQL Editor to diagnose why receiving trends show no data
-- 
-- This will help you identify:
-- 1. If you have any receiving logs
-- 2. If the data is within the date range
-- 3. If there's a user_id mismatch

-- Step 1: Check your current user_id
SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users
WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
LIMIT 1;

-- Step 2: Check if you have any receiving logs
SELECT 
  COUNT(*) as total_receiving_logs,
  MIN(received_at) as earliest_receipt,
  MAX(received_at) as latest_receipt,
  SUM(quantity) as total_quantity_received
FROM public.receiving_log
WHERE user_id = auth.uid();

-- Step 3: Check receiving logs by date (last 90 days)
SELECT 
  DATE_TRUNC('day', received_at)::date as date,
  COUNT(*) as entry_count,
  SUM(quantity) as total_quantity,
  SUM(CASE WHEN condition = 'good' THEN quantity ELSE 0 END) as good_quantity,
  SUM(CASE WHEN condition = 'damaged' THEN quantity ELSE 0 END) as damaged_quantity,
  SUM(CASE WHEN condition = 'defective' THEN quantity ELSE 0 END) as defective_quantity,
  SUM(CASE WHEN condition = 'returned' THEN quantity ELSE 0 END) as returned_quantity
FROM public.receiving_log
WHERE user_id = auth.uid()
  AND received_at >= NOW() - INTERVAL '90 days'
GROUP BY DATE_TRUNC('day', received_at)
ORDER BY date DESC;

-- Step 4: Test the receiving trends function directly
-- This simulates what the analytics page does
SELECT * FROM get_receiving_trends(
  auth.uid(),
  (NOW() - INTERVAL '30 days')::timestamptz,
  NOW()::timestamptz,
  'day'
);

-- Step 5: Check if receiving logs exist in the last 30 days (default date range)
SELECT 
  COUNT(*) as logs_in_last_30_days,
  SUM(quantity) as total_quantity_in_last_30_days
FROM public.receiving_log
WHERE user_id = auth.uid()
  AND received_at >= NOW() - INTERVAL '30 days'
  AND received_at <= NOW();

-- If the above query returns 0 rows, you need to:
-- 1. Run the seed script (017_seed_analytics_dummy_data.sql) with your user_id
-- 2. Or manually add receiving logs through your application
-- 3. Or update existing receiving logs to have recent dates
