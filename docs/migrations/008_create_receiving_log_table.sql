-- Migration: Create receiving_log table with RLS policies
-- Created: 2025-01-XX
-- Description: Tracks warehouse intake/receiving operations per user with multi-tenant isolation

-- Step 1: Create the receiving_log table
CREATE TABLE IF NOT EXISTS public.receiving_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id TEXT,
  sku TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  condition TEXT NOT NULL DEFAULT 'good'
    CHECK (condition IN ('good', 'damaged', 'defective', 'returned')),
  location TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 2: Helpful indexes for lookups and reporting
CREATE INDEX IF NOT EXISTS receiving_log_user_id_idx ON public.receiving_log (user_id);
CREATE INDEX IF NOT EXISTS receiving_log_sku_idx ON public.receiving_log (sku);
CREATE INDEX IF NOT EXISTS receiving_log_received_at_idx ON public.receiving_log (received_at DESC);
CREATE INDEX IF NOT EXISTS receiving_log_client_id_idx ON public.receiving_log (client_id);

-- Step 3: Enable Row-Level Security (RLS)
ALTER TABLE public.receiving_log ENABLE ROW LEVEL SECURITY;

-- Step 4: RLS policies (per-user data isolation)
CREATE POLICY "Users can view own receiving logs"
  ON public.receiving_log
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own receiving logs"
  ON public.receiving_log
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own receiving logs"
  ON public.receiving_log
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own receiving logs"
  ON public.receiving_log
  FOR DELETE
  USING (auth.uid() = user_id);

-- Step 5: Comments for clarity
COMMENT ON TABLE public.receiving_log IS 'Warehouse intake/receiving operations log with per-user isolation';
COMMENT ON COLUMN public.receiving_log.client_id IS 'Optional identifier for the client/supplier';
COMMENT ON COLUMN public.receiving_log.condition IS 'Condition of received items: good, damaged, defective, or returned';
COMMENT ON COLUMN public.receiving_log.received_at IS 'Timestamp when items were actually received (can differ from created_at)';

