import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with service role key
 * This bypasses RLS and should ONLY be used for server-to-server operations
 * like webhooks, background jobs, etc.
 *
 * WARNING: Never expose the service role key to the client!
 */
export function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Use new Secret key (sb_secret_...) or fall back to legacy service role key
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase service role credentials. Required for webhook operations. Set SUPABASE_SECRET_KEY."
    );
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
