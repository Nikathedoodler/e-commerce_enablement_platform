"use client";

import {
  createReceivingLog,
  deleteReceivingLog,
  getReceivingLogById,
  getReceivingLogs,
  updateReceivingLog,
} from "@/lib/supabase/queries/receiving";
import { ReceivingLogInput, ReceivingLogUpdate } from "@/types/receiving";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ReceivingFilters = {
  search?: string;
  sku?: string;
  client_id?: string;
  startDate?: string;
  endDate?: string;
};

export function useReceivingLogs(filters?: ReceivingFilters) {
  return useQuery({
    queryKey: ["receiving_logs", filters],
    queryFn: async () => {
      const result = await getReceivingLogs(filters);
      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });
}

export function useReceivingLog(id: string) {
  return useQuery({
    queryKey: ["receiving_log", id],
    queryFn: async () => {
      const result = await getReceivingLogById(id);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });
}

export function useCreateReceivingLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (receivingData: ReceivingLogInput) => {
      const result = await createReceivingLog(receivingData);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: () => {
      // Invalidate receiving logs to refresh the list
      queryClient.invalidateQueries({ queryKey: ["receiving_logs"] });
      // Also invalidate inventories since we update inventory quantities
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });
}

export function useUpdateReceivingLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: ReceivingLogUpdate;
    }) => {
      const result = await updateReceivingLog(id, updates);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["receiving_logs"] });
      queryClient.invalidateQueries({ queryKey: ["receiving_log", variables.id] });
      // May have updated inventory if quantity/condition changed
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });
}

export function useReceivingLogDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteReceivingLog(id);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receiving_logs"] });
      // May need to update inventory if we're deleting a log
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });
}

