import { useQuery } from "@tanstack/react-query";
import {
  getLabelAuditLogByOrderId,
  getLabelAuditLogs,
} from "@/lib/supabase/queries/label-audit-log";

/**
 * Hook to get audit log entries for a specific order
 */
export function useLabelAuditLogByOrderId(orderId: string) {
  return useQuery({
    queryKey: ["label-audit-log", "order", orderId],
    queryFn: async () => {
      const result = await getLabelAuditLogByOrderId(orderId);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!orderId,
    // Refetch every 2 seconds if there are pending entries (for auto-generation)
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && data.some((entry) => entry.status === "pending")) {
        return 2000; // Poll every 2 seconds if pending entries exist
      }
      return false;
    },
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to get all audit log entries with optional filters
 */
export function useLabelAuditLogs(filters?: {
  orderId?: string;
  status?: "pending" | "success" | "failed";
  generationType?: "auto" | "manual";
  limit?: number;
}) {
  return useQuery({
    queryKey: ["label-audit-log", filters],
    queryFn: async () => {
      const result = await getLabelAuditLogs(filters);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}
