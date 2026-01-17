-- Enable Supabase Realtime for orders table
-- This allows real-time subscriptions to INSERT, UPDATE, DELETE events on the orders table
-- Run this in the Supabase SQL Editor

-- Add orders table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Verify it was added (optional - run this to check)
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'orders';
