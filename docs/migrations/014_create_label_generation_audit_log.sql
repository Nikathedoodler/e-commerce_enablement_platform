-- Migration: Create label generation audit log table
-- Created: 2025-01-XX
-- Description: Tracks all label generation attempts (successful and failed) for audit and debugging

-- Step 1: Create the label_generation_audit_log table
CREATE TABLE IF NOT EXISTS public.label_generation_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  label_id UUID REFERENCES public.shipping_labels(id) ON DELETE SET NULL,
  generation_type TEXT NOT NULL DEFAULT 'manual'
    CHECK (generation_type IN ('auto', 'manual')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'success', 'failed')),
  error_message TEXT,
  tracking_number TEXT,
  carrier TEXT,
  cost NUMERIC(10, 2),
  triggered_by TEXT, -- 'status_change', 'shopify_webhook', 'manual_click', etc.
  metadata JSONB DEFAULT '{}'::jsonb, -- Additional context (previous_status, rules_checked, etc.)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 2: Helpful indexes for queries
CREATE INDEX IF NOT EXISTS label_audit_user_id_idx ON public.label_generation_audit_log (user_id);
CREATE INDEX IF NOT EXISTS label_audit_order_id_idx ON public.label_generation_audit_log (order_id);
CREATE INDEX IF NOT EXISTS label_audit_label_id_idx ON public.label_generation_audit_log (label_id);
CREATE INDEX IF NOT EXISTS label_audit_status_idx ON public.label_generation_audit_log (status);
CREATE INDEX IF NOT EXISTS label_audit_generation_type_idx ON public.label_generation_audit_log (generation_type);
CREATE INDEX IF NOT EXISTS label_audit_created_at_idx ON public.label_generation_audit_log (created_at DESC);

-- Step 3: Enable Row-Level Security (RLS)
ALTER TABLE public.label_generation_audit_log ENABLE ROW LEVEL SECURITY;

-- Step 4: RLS policies (per-user data isolation)
DROP POLICY IF EXISTS "Users can view own audit logs" ON public.label_generation_audit_log;
DROP POLICY IF EXISTS "Users can insert own audit logs" ON public.label_generation_audit_log;

CREATE POLICY "Users can view own audit logs"
  ON public.label_generation_audit_log
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own audit logs"
  ON public.label_generation_audit_log
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Step 5: Comments for documentation
COMMENT ON TABLE public.label_generation_audit_log IS 'Audit log for all label generation attempts (successful and failed)';
COMMENT ON COLUMN public.label_generation_audit_log.generation_type IS 'How the label was generated: auto (automatic) or manual (user-initiated)';
COMMENT ON COLUMN public.label_generation_audit_log.status IS 'Generation status: pending (in progress), success (completed), failed (error occurred)';
COMMENT ON COLUMN public.label_generation_audit_log.triggered_by IS 'What triggered the generation: status_change, shopify_webhook, manual_click, etc.';
COMMENT ON COLUMN public.label_generation_audit_log.metadata IS 'Additional context: previous_status, rules_checked, settings_used, etc.';
