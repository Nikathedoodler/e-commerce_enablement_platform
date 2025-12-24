-- Migration: Create shipping_labels table with RLS policies
-- Created: 2025-01-XX
-- Description: Stores shipping label metadata for orders (DHL, FedEx, etc.)

-- Step 1: Create the shipping_labels table
CREATE TABLE IF NOT EXISTS public.shipping_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  carrier TEXT NOT NULL DEFAULT 'DHL'
    CHECK (carrier IN ('DHL', 'FedEx', 'UPS', 'Georgian Post')),
  label_url TEXT NOT NULL,
  tracking_number TEXT NOT NULL,
  cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 2: Helpful indexes for queries
CREATE INDEX IF NOT EXISTS shipping_labels_user_id_idx ON public.shipping_labels (user_id);
CREATE INDEX IF NOT EXISTS shipping_labels_order_id_idx ON public.shipping_labels (order_id);
CREATE INDEX IF NOT EXISTS shipping_labels_tracking_number_idx ON public.shipping_labels (tracking_number);
CREATE INDEX IF NOT EXISTS shipping_labels_carrier_idx ON public.shipping_labels (carrier);
CREATE INDEX IF NOT EXISTS shipping_labels_generated_at_idx ON public.shipping_labels (generated_at DESC);

-- Step 3: Enable Row-Level Security (RLS)
ALTER TABLE public.shipping_labels ENABLE ROW LEVEL SECURITY;

-- Step 4: RLS policies (per-user data isolation)
-- Drop policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own shipping labels" ON public.shipping_labels;
DROP POLICY IF EXISTS "Users can insert own shipping labels" ON public.shipping_labels;
DROP POLICY IF EXISTS "Users can update own shipping labels" ON public.shipping_labels;
DROP POLICY IF EXISTS "Users can delete own shipping labels" ON public.shipping_labels;

CREATE POLICY "Users can view own shipping labels"
  ON public.shipping_labels
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shipping labels"
  ON public.shipping_labels
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shipping labels"
  ON public.shipping_labels
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shipping labels"
  ON public.shipping_labels
  FOR DELETE
  USING (auth.uid() = user_id);

-- Step 5: Keep updated_at current on changes
DROP TRIGGER IF EXISTS shipping_labels_set_updated_at ON public.shipping_labels;
CREATE TRIGGER shipping_labels_set_updated_at
  BEFORE UPDATE ON public.shipping_labels
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Step 6: Comments for future developers
COMMENT ON TABLE public.shipping_labels IS 'Shipping label metadata for orders (multi-carrier support)';
COMMENT ON COLUMN public.shipping_labels.order_id IS 'Reference to the order this label belongs to';
COMMENT ON COLUMN public.shipping_labels.carrier IS 'Shipping carrier (DHL, FedEx, UPS, Georgian Post)';
COMMENT ON COLUMN public.shipping_labels.label_url IS 'URL to the shipping label PDF (stored in Supabase Storage)';
COMMENT ON COLUMN public.shipping_labels.tracking_number IS 'Carrier tracking number';
COMMENT ON COLUMN public.shipping_labels.cost IS 'Shipping cost in the order currency';
COMMENT ON COLUMN public.shipping_labels.generated_at IS 'When the label was generated (may differ from created_at)';

