-- Helper: Get Your User ID
-- Run this FIRST in Supabase SQL Editor to get your user_id
-- Then copy the UUID and use it in the seed files

SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- After running this, copy the UUID from the 'user_id' column
-- and use it in the seed files below
