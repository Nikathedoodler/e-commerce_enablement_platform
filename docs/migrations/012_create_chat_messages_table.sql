-- Migration: Create chat_messages table with RLS policies
-- Created: 2025-01-XX
-- Description: Stores chat messages for the AI assistant chatbot

-- Step 1: Create the chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  message_id TEXT, -- Store the message ID from useChat hook for reference
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 2: Helpful indexes for queries
CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON public.chat_messages (user_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON public.chat_messages (user_id, created_at DESC);

-- Step 3: Enable Row-Level Security (RLS)
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Step 4: RLS policies (per-user data isolation)
-- Drop policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can insert own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can delete own chat messages" ON public.chat_messages;

CREATE POLICY "Users can view own chat messages"
  ON public.chat_messages
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON public.chat_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat messages"
  ON public.chat_messages
  FOR DELETE
  USING (auth.uid() = user_id);

-- Step 5: Comments for clarity
COMMENT ON TABLE public.chat_messages IS 'Stores chat messages for AI assistant chatbot, scoped by user_id';
COMMENT ON COLUMN public.chat_messages.message_id IS 'Optional message ID from useChat hook for reference';