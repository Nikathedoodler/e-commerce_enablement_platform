-- Helper: Get Your User ID for Seeding
-- Run this FIRST in Supabase SQL Editor to get your user_id
-- Then copy the UUID and use it in the seed files

SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- After running this, copy the UUID from the 'user_id' column
-- and replace all instances of 'YOUR_USER_ID_HERE' in 017_seed_analytics_dummy_data.sql
-- with your actual UUID (keep the quotes, e.g., 'b24b8854-24cc-4483-8043-b9701f8365d9')
