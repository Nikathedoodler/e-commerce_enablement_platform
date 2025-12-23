import { checkOrderLimit } from "@/lib/utils/usage-limits";
import { useQuery } from "@tanstack/react-query";

export function useUsageLimits() {
  return useQuery({
    queryKey: ["usage-limits"],
    queryFn: async () => {
      const result = await checkOrderLimit();

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
    refetchInterval: 5 * 60 * 1000,
  });
}
