"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Update user profile with full name and company name
 * This is called after user signs up to populate their profile
 */
export async function updateProfile({
  fullName,
  companyName,
}: {
  fullName: string;
  companyName?: string;
}) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "User not authenticated" };
  }

  // Update the profile
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      company_name: companyName || null,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

