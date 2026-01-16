"use client";

import {
  createInventoryItem,
  deleteInventoryItem,
  getInventoryItemById,
  getInventoryItems,
  updateInventoryItem,
} from "@/lib/supabase/queries/inventory";
import { InventoryInput, InventoryUpdate } from "@/types/inventory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type InventoryFilters = {
  search?: string;
  lowStockOnly?: string;
  page?: number;
  pageSize?: number;
};

export function useInventories(filters?: InventoryFilters) {
  return useQuery({
    queryKey: ["inventories", filters],
    queryFn: async () => {
      const result = await getInventoryItems(filters);
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

export function useInventory(id: string) {
  return useQuery({
    queryKey: ["inventory", id],
    queryFn: async () => {
      const result = await getInventoryItemById(id);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });
}

export function useCreateInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inventoryData: InventoryInput) => {
      const result = await createInventoryItem(inventoryData);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });
}

export function useUpdateInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: InventoryUpdate;
    }) => {
      const result = await updateInventoryItem(id, updates);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      queryClient.invalidateQueries({ queryKey: ["inventory", variables.id] });
    },
  });
}

export function useInventoryDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteInventoryItem(id);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });
}
