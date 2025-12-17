-- Migration: Create shopify_stores table with RLS policies
-- Created: 2025-01-XX
-- Description: Stores connected Shopify storefront credentials with OAuth tokens

-- Step 1: Create the shopify_stores table
CREATE TABLE IF NOT EXISTS public.shopify_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_domain TEXT NOT NULL,
  access_token TEXT NOT NULL, -- Encrypted at application level or via pgcrypto
  scopes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'disconnected')),
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, shop_domain) -- One connection per user per shop domain
);

-- Step 2: Helpful indexes for queries
CREATE INDEX IF NOT EXISTS shopify_stores_user_id_idx ON public.shopify_stores (user_id);
CREATE INDEX IF NOT EXISTS shopify_stores_shop_domain_idx ON public.shopify_stores (shop_domain);
CREATE INDEX IF NOT EXISTS shopify_stores_status_idx ON public.shopify_stores (status);

-- Step 3: Enable Row-Level Security (RLS)
ALTER TABLE public.shopify_stores ENABLE ROW LEVEL SECURITY;

-- Step 4: RLS policies (per-user data isolation)
-- Drop policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own shopify stores" ON public.shopify_stores;
DROP POLICY IF EXISTS "Users can insert own shopify stores" ON public.shopify_stores;
DROP POLICY IF EXISTS "Users can update own shopify stores" ON public.shopify_stores;
DROP POLICY IF EXISTS "Users can delete own shopify stores" ON public.shopify_stores;

CREATE POLICY "Users can view own shopify stores"
  ON public.shopify_stores
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shopify stores"
  ON public.shopify_stores
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shopify stores"
  ON public.shopify_stores
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shopify stores"
  ON public.shopify_stores
  FOR DELETE
  USING (auth.uid() = user_id);

-- Step 5: Keep updated_at current on changes
DROP TRIGGER IF EXISTS shopify_stores_set_updated_at ON public.shopify_stores;
CREATE TRIGGER shopify_stores_set_updated_at
  BEFORE UPDATE ON public.shopify_stores
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Step 6: Comments for future developers
COMMENT ON TABLE public.shopify_stores IS 'Connected Shopify storefront credentials with OAuth tokens';
COMMENT ON COLUMN public.shopify_stores.access_token IS 'Shopify OAuth access token (should be encrypted at application level)';
COMMENT ON COLUMN public.shopify_stores.scopes IS 'Comma-separated list of granted OAuth scopes';
COMMENT ON COLUMN public.shopify_stores.shop_domain IS 'Shopify shop domain (e.g., mystore.myshopify.com)';
