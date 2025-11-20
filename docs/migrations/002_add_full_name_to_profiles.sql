-- Migration: Add full_name column to profiles table
-- Run this if you already ran 001_create_profiles_table.sql before full_name was added

-- Add full_name column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Add comment
COMMENT ON COLUMN public.profiles.full_name IS 'Full name of the contact person';

