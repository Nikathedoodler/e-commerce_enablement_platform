import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy initialization to avoid throwing errors during build time
// The client is created on first access, not at module load time
let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabasepublishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabasepublishableKey) {
      throw new Error(
        "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
      );
    }

    supabaseClient = createClient(supabaseUrl, supabasepublishableKey);
  }

  return supabaseClient;
}

// Export a proxy that lazily creates the client on first access
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = client[prop as keyof SupabaseClient];
    // If it's a function, bind it to the client to maintain 'this' context
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
