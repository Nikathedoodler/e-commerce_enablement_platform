-- Migration: Create orders table with RLS policies
-- Created: 2025-11-27
-- Description: Sets up multi-tenant orders storage with policy enforcement

-- Step 1: Create the orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_id UUID,
  order_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'fulfilled', 'cancelled')),
  customer_email TEXT NOT NULL,
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  financial_status TEXT NOT NULL DEFAULT 'pending',
  total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tracking_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 2: Helpful indexes for dashboard queries
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders (status);

-- Step 3: Enable Row-Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Step 4: RLS policies (per-user data isolation)
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON public.orders
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own orders"
  ON public.orders
  FOR DELETE
  USING (auth.uid() = user_id);

-- Step 5: Keep updated_at current on changes
CREATE OR REPLACE TRIGGER orders_set_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Step 6: Comments for future developers
COMMENT ON TABLE public.orders IS 'Multi-tenant orders table scoped by user_id';
COMMENT ON COLUMN public.orders.shop_id IS 'Future reference to connected storefront (nullable pre-Shopify integration)';
COMMENT ON COLUMN public.orders.items IS 'JSONB payload describing line items';
COMMENT ON COLUMN public.orders.shipping_address IS 'JSONB payload for shipping details';

