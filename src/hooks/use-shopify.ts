"use client";

import {
  deleteShopifyStore,
  getShopifyStores,
} from "@/lib/supabase/queries/shopify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useShopifyStores() {
  return useQuery({
    queryKey: ["shopify-stores"],
    queryFn: async () => {
      const result = await getShopifyStores();

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });
}

export function useDeleteShopifyStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteShopifyStore(id);

      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopify-stores"] });
    },
  });
}
