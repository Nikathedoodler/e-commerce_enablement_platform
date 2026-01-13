"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createShippingLabel,
  deleteShippingLabel,
  getShippingLabelById,
  getShippingLabels,
  getShippingLabelsByOrderId,
  updateShippingLabel,
} from "@/lib/supabase/queries/shipping";
import type {
  ShippingLabelInput,
  ShippingLabelUpdate,
  DHLRateRequest,
  DHLLabelRequest,
} from "@/types/shipping";
import type { DHLRate } from "@/types/shipping";

type ShippingLabelsFilters = {
  orderId?: string;
  carrier?: string;
};

/**
 * Hook to get shipping labels with optional filters
 */
export function useShippingLabels(filters?: ShippingLabelsFilters) {
  return useQuery({
    queryKey: ["shipping_labels", filters],
    queryFn: async () => {
      const result = await getShippingLabels(filters);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

/**
 * Hook to get a single shipping label by ID
 */
export function useShippingLabel(id: string) {
  return useQuery({
    queryKey: ["shipping_label", id],
    queryFn: async () => {
      const result = await getShippingLabelById(id);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

/**
 * Hook to get shipping labels for a specific order
 */
export function useShippingLabelsByOrderId(orderId: string) {
  return useQuery({
    queryKey: ["shipping_labels", "order", orderId],
    queryFn: async () => {
      const result = await getShippingLabelsByOrderId(orderId);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    // Refetch every 2 seconds when dialog is open (for auto-generated labels)
    refetchInterval: (query) => {
      // Only refetch if we have an orderId and no labels yet (waiting for auto-generation)
      return query.state.data && query.state.data.length === 0 ? 2000 : false;
    },
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to calculate DHL shipping rates
 * Calls the API endpoint /api/shipping/dhl/rate
 */
export function useCalculateDHLRates() {
  return useMutation({
    mutationFn: async (request: DHLRateRequest) => {
      const response = await fetch("/api/shipping/dhl/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to calculate shipping rates");
      }

      const data = await response.json();
      return data.rates as DHLRate[];
    },
  });
}

/**
 * Hook to generate a DHL shipping label
 * Calls the API endpoint /api/shipping/dhl/label
 */
export function useGenerateDHLLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: DHLLabelRequest) => {
      const response = await fetch("/api/shipping/dhl/label", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate shipping label");
      }

      const data = await response.json();
      return data.label;
    },
    onSuccess: (data, variables) => {
      // Invalidate shipping labels to refresh the list
      queryClient.invalidateQueries({ queryKey: ["shipping_labels"] });
      // Invalidate labels for this specific order
      queryClient.invalidateQueries({
        queryKey: ["shipping_labels", "order", variables.orderId],
      });
      // Invalidate audit log to show new entry
      queryClient.invalidateQueries({
        queryKey: ["label-audit-log", "order", variables.orderId],
      });
      // Invalidate the order to update tracking number
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
      // Invalidate orders list to show updated tracking
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

/**
 * Hook to create a shipping label directly (using query helper)
 * Note: Usually you'd use useGenerateDHLLabel instead, which calls the API
 * This is for edge cases where you need to save a label manually
 */
export function useCreateShippingLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (labelData: ShippingLabelInput) => {
      const result = await createShippingLabel(labelData);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: ["shipping_labels"] });
      queryClient.invalidateQueries({
        queryKey: ["shipping_labels", "order", data.order_id],
      });
      queryClient.invalidateQueries({ queryKey: ["order", data.order_id] });
    },
  });
}

/**
 * Hook to update a shipping label
 */
export function useUpdateShippingLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: ShippingLabelUpdate;
    }) => {
      const result = await updateShippingLabel(id, updates);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shipping_labels"] });
      queryClient.invalidateQueries({
        queryKey: ["shipping_label", variables.id],
      });
      if (data) {
        queryClient.invalidateQueries({
          queryKey: ["shipping_labels", "order", data.order_id],
        });
      }
    },
  });
}

/**
 * Hook to delete a shipping label
 */
export function useDeleteShippingLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteShippingLabel(id);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: ["shipping_labels"] });
      queryClient.invalidateQueries({
        queryKey: ["shipping_labels", "order", data.order_id],
      });
    },
  });
}
