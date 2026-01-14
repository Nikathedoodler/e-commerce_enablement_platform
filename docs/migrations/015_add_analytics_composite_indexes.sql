-- Migration: Add composite indexes for analytics queries
-- Created: 2025-01-XX
-- Description: Optimizes analytics queries by adding composite indexes on (user_id, date_column)
--              These indexes dramatically improve performance for date-range queries filtered by user

-- Step 1: Composite index for orders analytics queries
-- Used by: getOrderStats, getOrderTrends, getOrderStatusBreakdown, getOrderSourceBreakdown
-- Query pattern: WHERE user_id = X AND created_at >= Y AND created_at <= Z
CREATE INDEX IF NOT EXISTS orders_user_created_idx 
  ON public.orders (user_id, created_at DESC);

-- Step 2: Composite index for receiving_log analytics queries
-- Used by: getReceivingStats, getReceivingTrends
-- Query pattern: WHERE user_id = X AND received_at >= Y AND received_at <= Z
CREATE INDEX IF NOT EXISTS receiving_log_user_received_idx 
  ON public.receiving_log (user_id, received_at DESC);

-- Step 3: Composite index for label_generation_audit_log analytics queries
-- Used by: getLabelStats, getLabelTrends
-- Query pattern: WHERE user_id = X AND created_at >= Y AND created_at <= Z
CREATE INDEX IF NOT EXISTS label_audit_user_created_idx 
  ON public.label_generation_audit_log (user_id, created_at DESC);

-- Step 4: Composite index for orders status filtering
-- Used by: getOrderStatusBreakdown (filters by status after date range)
-- Query pattern: WHERE user_id = X AND created_at >= Y AND created_at <= Z AND status = W
CREATE INDEX IF NOT EXISTS orders_user_status_created_idx 
  ON public.orders (user_id, status, created_at DESC);

-- Step 5: Comments for documentation
COMMENT ON INDEX orders_user_created_idx IS 'Composite index for analytics queries filtering orders by user and date range';
COMMENT ON INDEX receiving_log_user_received_idx IS 'Composite index for analytics queries filtering receiving logs by user and date range';
COMMENT ON INDEX label_audit_user_created_idx IS 'Composite index for analytics queries filtering label audit logs by user and date range';
COMMENT ON INDEX orders_user_status_created_idx IS 'Composite index for order status breakdown queries';
