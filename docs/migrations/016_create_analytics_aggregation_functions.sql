-- Migration: Create PostgreSQL functions for analytics aggregation
-- Created: 2025-01-XX
-- Description: Moves aggregation logic from client-side JavaScript to database
--              This dramatically reduces data transfer and improves performance

-- Step 1: Function to get order trends aggregated by period
-- Groups orders by day/week/month and calculates count and revenue
CREATE OR REPLACE FUNCTION get_order_trends(
  p_user_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ,
  p_group_by TEXT DEFAULT 'day'
)
RETURNS TABLE (
  date TEXT,
  value BIGINT,
  revenue NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  date_format TEXT;
BEGIN
  -- Determine date truncation based on group_by parameter
  IF p_group_by = 'day' THEN
    RETURN QUERY
    SELECT 
      TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') as date,
      COUNT(*)::BIGINT as value,
      COALESCE(SUM(total), 0) as revenue
    FROM public.orders
    WHERE user_id = p_user_id
      AND created_at >= p_start_date
      AND created_at <= p_end_date
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY DATE_TRUNC('day', created_at) ASC;
    
  ELSIF p_group_by = 'week' THEN
    RETURN QUERY
    SELECT 
      TO_CHAR(DATE_TRUNC('week', created_at), 'YYYY-MM-DD') as date,
      COUNT(*)::BIGINT as value,
      COALESCE(SUM(total), 0) as revenue
    FROM public.orders
    WHERE user_id = p_user_id
      AND created_at >= p_start_date
      AND created_at <= p_end_date
    GROUP BY DATE_TRUNC('week', created_at)
    ORDER BY DATE_TRUNC('week', created_at) ASC;
    
  ELSE -- month
    RETURN QUERY
    SELECT 
      TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as date,
      COUNT(*)::BIGINT as value,
      COALESCE(SUM(total), 0) as revenue
    FROM public.orders
    WHERE user_id = p_user_id
      AND created_at >= p_start_date
      AND created_at <= p_end_date
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY DATE_TRUNC('month', created_at) ASC;
  END IF;
END;
$$;

-- Step 2: Function to get receiving trends aggregated by period
-- Groups receiving logs by day/week/month with condition breakdown
CREATE OR REPLACE FUNCTION get_receiving_trends(
  p_user_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ,
  p_group_by TEXT DEFAULT 'day'
)
RETURNS TABLE (
  date TEXT,
  quantity BIGINT,
  good BIGINT,
  damaged BIGINT,
  defective BIGINT,
  returned BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_group_by = 'day' THEN
    RETURN QUERY
    SELECT 
      TO_CHAR(DATE_TRUNC('day', rl.received_at), 'YYYY-MM-DD') as date,
      COALESCE(SUM(rl.quantity), 0)::BIGINT as quantity,
      COALESCE(SUM(CASE WHEN rl.condition = 'good' THEN rl.quantity ELSE 0 END), 0)::BIGINT as good,
      COALESCE(SUM(CASE WHEN rl.condition = 'damaged' THEN rl.quantity ELSE 0 END), 0)::BIGINT as damaged,
      COALESCE(SUM(CASE WHEN rl.condition = 'defective' THEN rl.quantity ELSE 0 END), 0)::BIGINT as defective,
      COALESCE(SUM(CASE WHEN rl.condition = 'returned' THEN rl.quantity ELSE 0 END), 0)::BIGINT as returned
    FROM public.receiving_log rl
    WHERE rl.user_id = p_user_id
      AND rl.received_at >= p_start_date
      AND rl.received_at <= p_end_date
    GROUP BY DATE_TRUNC('day', rl.received_at)
    ORDER BY DATE_TRUNC('day', rl.received_at) ASC;
    
  ELSIF p_group_by = 'week' THEN
    RETURN QUERY
    SELECT 
      TO_CHAR(DATE_TRUNC('week', rl.received_at), 'YYYY-MM-DD') as date,
      COALESCE(SUM(rl.quantity), 0)::BIGINT as quantity,
      COALESCE(SUM(CASE WHEN rl.condition = 'good' THEN rl.quantity ELSE 0 END), 0)::BIGINT as good,
      COALESCE(SUM(CASE WHEN rl.condition = 'damaged' THEN rl.quantity ELSE 0 END), 0)::BIGINT as damaged,
      COALESCE(SUM(CASE WHEN rl.condition = 'defective' THEN rl.quantity ELSE 0 END), 0)::BIGINT as defective,
      COALESCE(SUM(CASE WHEN rl.condition = 'returned' THEN rl.quantity ELSE 0 END), 0)::BIGINT as returned
    FROM public.receiving_log rl
    WHERE rl.user_id = p_user_id
      AND rl.received_at >= p_start_date
      AND rl.received_at <= p_end_date
    GROUP BY DATE_TRUNC('week', rl.received_at)
    ORDER BY DATE_TRUNC('week', rl.received_at) ASC;
    
  ELSE -- month
    RETURN QUERY
    SELECT 
      TO_CHAR(DATE_TRUNC('month', rl.received_at), 'YYYY-MM') as date,
      COALESCE(SUM(rl.quantity), 0)::BIGINT as quantity,
      COALESCE(SUM(CASE WHEN rl.condition = 'good' THEN rl.quantity ELSE 0 END), 0)::BIGINT as good,
      COALESCE(SUM(CASE WHEN rl.condition = 'damaged' THEN rl.quantity ELSE 0 END), 0)::BIGINT as damaged,
      COALESCE(SUM(CASE WHEN rl.condition = 'defective' THEN rl.quantity ELSE 0 END), 0)::BIGINT as defective,
      COALESCE(SUM(CASE WHEN rl.condition = 'returned' THEN rl.quantity ELSE 0 END), 0)::BIGINT as returned
    FROM public.receiving_log rl
    WHERE rl.user_id = p_user_id
      AND rl.received_at >= p_start_date
      AND rl.received_at <= p_end_date
    GROUP BY DATE_TRUNC('month', rl.received_at)
    ORDER BY DATE_TRUNC('month', rl.received_at) ASC;
  END IF;
END;
$$;

-- Step 3: Function to get label generation trends aggregated by period
-- Groups label audit logs by day/week/month with success/failure counts
CREATE OR REPLACE FUNCTION get_label_trends(
  p_user_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ,
  p_group_by TEXT DEFAULT 'day'
)
RETURNS TABLE (
  date TEXT,
  count BIGINT,
  successful BIGINT,
  failed BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_group_by = 'day' THEN
    RETURN QUERY
    SELECT 
      TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') as date,
      COUNT(*)::BIGINT as count,
      COALESCE(SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END), 0)::BIGINT as successful,
      COALESCE(SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END), 0)::BIGINT as failed
    FROM public.label_generation_audit_log
    WHERE user_id = p_user_id
      AND created_at >= p_start_date
      AND created_at <= p_end_date
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY DATE_TRUNC('day', created_at) ASC;
    
  ELSIF p_group_by = 'week' THEN
    RETURN QUERY
    SELECT 
      TO_CHAR(DATE_TRUNC('week', created_at), 'YYYY-MM-DD') as date,
      COUNT(*)::BIGINT as count,
      COALESCE(SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END), 0)::BIGINT as successful,
      COALESCE(SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END), 0)::BIGINT as failed
    FROM public.label_generation_audit_log
    WHERE user_id = p_user_id
      AND created_at >= p_start_date
      AND created_at <= p_end_date
    GROUP BY DATE_TRUNC('week', created_at)
    ORDER BY DATE_TRUNC('week', created_at) ASC;
    
  ELSE -- month
    RETURN QUERY
    SELECT 
      TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as date,
      COUNT(*)::BIGINT as count,
      COALESCE(SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END), 0)::BIGINT as successful,
      COALESCE(SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END), 0)::BIGINT as failed
    FROM public.label_generation_audit_log
    WHERE user_id = p_user_id
      AND created_at >= p_start_date
      AND created_at <= p_end_date
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY DATE_TRUNC('month', created_at) ASC;
  END IF;
END;
$$;

-- Step 4: Grant execute permissions to authenticated users
-- These functions use SECURITY DEFINER, so they run with the function owner's privileges
-- but we still need to grant execute permission
GRANT EXECUTE ON FUNCTION get_order_trends(UUID, TIMESTAMPTZ, TIMESTAMPTZ, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_receiving_trends(UUID, TIMESTAMPTZ, TIMESTAMPTZ, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_label_trends(UUID, TIMESTAMPTZ, TIMESTAMPTZ, TEXT) TO authenticated;

-- Step 5: Comments for documentation
COMMENT ON FUNCTION get_order_trends IS 'Aggregates order data by time period (day/week/month) for trend analysis';
COMMENT ON FUNCTION get_receiving_trends IS 'Aggregates receiving log data by time period with condition breakdown';
COMMENT ON FUNCTION get_label_trends IS 'Aggregates label generation audit log data by time period with success/failure counts';
