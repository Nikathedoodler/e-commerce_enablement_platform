-- Migration: Create inventory table with RLS policies
-- Created: 2025-11-27
-- Description: Tracks SKU quantities per user with multi-tenant isolation

-- Step 1: Create the inventory table
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  location TEXT,
  reorder_threshold INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, sku)
);

-- Step 2: Helpful indexes for lookups
CREATE INDEX IF NOT EXISTS inventory_user_id_idx ON public.inventory (user_id);
CREATE INDEX IF NOT EXISTS inventory_sku_idx ON public.inventory (sku);

-- Step 3: Enable Row-Level Security (RLS)
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Step 4: RLS policies
CREATE POLICY "Users can view own inventory"
  ON public.inventory
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory"
  ON public.inventory
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory"
  ON public.inventory
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventory"
  ON public.inventory
  FOR DELETE
  USING (auth.uid() = user_id);

-- Step 5: Keep updated_at current on changes
CREATE OR REPLACE TRIGGER inventory_set_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Step 6: Comments for clarity
COMMENT ON TABLE public.inventory IS 'Per-user SKU tracking supporting low-stock alerts and receiving flows';
COMMENT ON COLUMN public.inventory.reorder_threshold IS 'Threshold at which low-stock warnings should fire';

