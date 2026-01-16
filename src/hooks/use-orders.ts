"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from "@/lib/supabase/queries/orders";
import type { OrderInput, OrderUpdate } from "@/types/orders";

type OrdersFilters = {
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export function useOrders(filters?: OrdersFilters) {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: async () => {
      const result = await getOrders(filters);
      if (result.error) {
        throw new Error(result.error);
      }
      return {
        data: result.data,
        pagination: result.pagination,
      };
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const result = await getOrderById(id);

      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: OrderInput) => {
      const result = await createOrder(orderData);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // Invalidate usage limits so billing page updates immediately
      queryClient.invalidateQueries({ queryKey: ["usage-limits"] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: OrderUpdate;
    }) => {
      const result = await updateOrder(id, updates);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
      
      // If status changed to "processing", auto-generation might have happened
      // Invalidate shipping labels and audit log after a short delay to allow auto-generation to complete
      if (variables.updates.status === "processing") {
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["shipping_labels"] });
          queryClient.invalidateQueries({ 
            queryKey: ["shipping_labels", "order", variables.id] 
          });
          queryClient.invalidateQueries({
            queryKey: ["label-audit-log", "order", variables.id],
          });
        }, 2000); // 2 second delay to allow auto-generation to complete
      }
    },
  });
}

export function useOrderDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteOrder(id);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // Invalidate usage limits so billing page updates immediately
      queryClient.invalidateQueries({ queryKey: ["usage-limits"] });
    },
  });
}
