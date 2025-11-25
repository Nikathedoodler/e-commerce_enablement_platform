-- Migration: Sync existing users with profiles
-- Created: 2024
-- Description: Creates profiles for all existing auth.users who don't have a profile yet
-- This fixes cases where profiles were manually deleted or the trigger didn't fire

-- Create profiles for all auth.users who don't have one
INSERT INTO public.profiles (id, role, full_name, company_name, timezone)
SELECT 
  au.id,
  'user',
  COALESCE(au.raw_user_meta_data->>'full_name', NULL),
  COALESCE(au.raw_user_meta_data->>'company_name', NULL),
  'UTC'
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

COMMENT ON TABLE public.profiles IS 'Extended user metadata linked to auth.users - synced with 004_sync_existing_users_profiles.sql';

