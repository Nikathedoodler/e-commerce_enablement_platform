"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  LabelGenerationAuditLog,
  LabelGenerationAuditLogInput,
} from "@/types/shipping";

/**
 * Create a new audit log entry
 */
export async function createLabelAuditLogEntry(
  entry: LabelGenerationAuditLogInput
): Promise<{ data: LabelGenerationAuditLog | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Not Authenticated" };
  }

  const entryData = {
    ...entry,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from("label_generation_audit_log")
    .insert(entryData)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as LabelGenerationAuditLog, error: null };
}

/**
 * Get audit log entries for a specific order
 */
export async function getLabelAuditLogByOrderId(
  orderId: string
): Promise<{
  data: LabelGenerationAuditLog[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Not Authenticated" };
  }

  const { data, error } = await supabase
    .from("label_generation_audit_log")
    .select("*")
    .eq("order_id", orderId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as LabelGenerationAuditLog[], error: null };
}

/**
 * Get all audit log entries for the current user (with optional filters)
 */
export async function getLabelAuditLogs(filters?: {
  orderId?: string;
  status?: "pending" | "success" | "failed";
  generationType?: "auto" | "manual";
  limit?: number;
}): Promise<{
  data: LabelGenerationAuditLog[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Not Authenticated" };
  }

  let query = supabase
    .from("label_generation_audit_log")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (filters?.orderId) {
    query = query.eq("order_id", filters.orderId);
  }

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.generationType) {
    query = query.eq("generation_type", filters.generationType);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as LabelGenerationAuditLog[], error: null };
}

/**
 * Update an audit log entry (e.g., when generation completes)
 */
export async function updateLabelAuditLogEntry(
  id: string,
  updates: Partial<Pick<LabelGenerationAuditLog, "status" | "error_message" | "label_id" | "tracking_number" | "carrier" | "cost">>
): Promise<{ data: LabelGenerationAuditLog | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Not Authenticated" };
  }

  const { data, error } = await supabase
    .from("label_generation_audit_log")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as LabelGenerationAuditLog, error: null };
}
