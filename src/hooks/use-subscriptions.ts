"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubscription } from "@/lib/supabase/queries/subscriptions";

/**
 * Hook to fetch the current user's subscription
 */
export function useSubscription() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const result = await getSubscription();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    // Refetch subscription data every 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });
}
