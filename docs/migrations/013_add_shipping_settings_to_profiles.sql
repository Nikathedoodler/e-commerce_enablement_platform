-- Migration: Add shipping settings to profiles table
-- Created: 2025-01-XX
-- Description: Adds shipping automation settings and default package info to user profiles

-- Step 1: Add shipping automation settings columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS auto_generate_labels BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS default_package_weight NUMERIC(5, 2) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS default_package_length NUMERIC(5, 2),
ADD COLUMN IF NOT EXISTS default_package_width NUMERIC(5, 2),
ADD COLUMN IF NOT EXISTS default_package_height NUMERIC(5, 2),
ADD COLUMN IF NOT EXISTS default_service_type TEXT DEFAULT 'EXPRESS_WORLDWIDE',
ADD COLUMN IF NOT EXISTS auto_generate_rules JSONB DEFAULT '{"shopify_orders": false, "manual_orders": false, "on_status_processing": true}'::jsonb;

-- Step 2: Add shipper/warehouse information columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS shipper_name TEXT,
ADD COLUMN IF NOT EXISTS shipper_company_name TEXT,
ADD COLUMN IF NOT EXISTS shipper_address1 TEXT,
ADD COLUMN IF NOT EXISTS shipper_address2 TEXT,
ADD COLUMN IF NOT EXISTS shipper_city TEXT,
ADD COLUMN IF NOT EXISTS shipper_state TEXT,
ADD COLUMN IF NOT EXISTS shipper_postal_code TEXT,
ADD COLUMN IF NOT EXISTS shipper_country TEXT DEFAULT 'GE',
ADD COLUMN IF NOT EXISTS shipper_phone TEXT,
ADD COLUMN IF NOT EXISTS shipper_email TEXT;

-- Step 3: Add comments for documentation
COMMENT ON COLUMN public.profiles.auto_generate_labels IS 'Enable automatic label generation when order status changes to processing';
COMMENT ON COLUMN public.profiles.default_package_weight IS 'Default package weight in kg for auto-generated labels';
COMMENT ON COLUMN public.profiles.default_package_length IS 'Default package length in cm';
COMMENT ON COLUMN public.profiles.default_package_width IS 'Default package width in cm';
COMMENT ON COLUMN public.profiles.default_package_height IS 'Default package height in cm';
COMMENT ON COLUMN public.profiles.default_service_type IS 'Default DHL service type for auto-generated labels';
COMMENT ON COLUMN public.profiles.auto_generate_rules IS 'JSON rules for when to auto-generate labels: {shopify_orders: bool, manual_orders: bool, on_status_processing: bool}';
COMMENT ON COLUMN public.profiles.shipper_name IS 'Warehouse/shipper contact name';
COMMENT ON COLUMN public.profiles.shipper_company_name IS 'Warehouse/shipper company name';
COMMENT ON COLUMN public.profiles.shipper_address1 IS 'Warehouse/shipper address line 1';
COMMENT ON COLUMN public.profiles.shipper_address2 IS 'Warehouse/shipper address line 2';
COMMENT ON COLUMN public.profiles.shipper_city IS 'Warehouse/shipper city';
COMMENT ON COLUMN public.profiles.shipper_state IS 'Warehouse/shipper state/province';
COMMENT ON COLUMN public.profiles.shipper_postal_code IS 'Warehouse/shipper postal code';
COMMENT ON COLUMN public.profiles.shipper_country IS 'Warehouse/shipper country code (ISO)';
COMMENT ON COLUMN public.profiles.shipper_phone IS 'Warehouse/shipper phone number';
COMMENT ON COLUMN public.profiles.shipper_email IS 'Warehouse/shipper email address';

-- Step 4: Add CHECK constraint for default_service_type
ALTER TABLE public.profiles
ADD CONSTRAINT check_default_service_type 
CHECK (
  default_service_type IS NULL OR 
  default_service_type IN (
    'EXPRESS_WORLDWIDE',
    'EXPRESS_12_00',
    'ECONOMY_SELECT',
    'EXPRESS_ENVELOPE',
    'EXPRESS_WORLDWIDE_NON_DOCUMENTS'
  )
);
