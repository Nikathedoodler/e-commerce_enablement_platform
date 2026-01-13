import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getShippingSettings,
  updateShippingSettings,
} from "@/lib/supabase/queries/shipping-settings";
import type { ShippingSettings, ShippingSettingsUpdate } from "@/types/shipping";

/**
 * Hook to get shipping settings
 */
export function useShippingSettings() {
  return useQuery({
    queryKey: ["shipping-settings"],
    queryFn: async () => {
      const result = await getShippingSettings();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

/**
 * Hook to update shipping settings
 */
export function useUpdateShippingSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: ShippingSettingsUpdate) => {
      const result = await updateShippingSettings(updates);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-settings"] });
    },
  });
}
