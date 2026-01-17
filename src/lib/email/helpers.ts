"use server";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getBillingUrl } from "./url-helpers";

/**
 * Get user email address from user_id
 * Uses service role client to bypass RLS
 */
export async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const supabase = createServiceRoleClient();
    
    // Query auth.users table directly (requires service role)
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    
    if (error || !data?.user) {
      console.error("Failed to get user email:", error);
      return null;
    }
    
    return data.user.email || null;
  } catch (error) {
    console.error("Error getting user email:", error);
    return null;
  }
}

// Re-export getBillingUrl from url-helpers for convenience
export { getBillingUrl };
