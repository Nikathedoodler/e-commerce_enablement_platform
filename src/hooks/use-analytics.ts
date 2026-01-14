"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getOrderStats,
  getOrderTrends,
  getOrderStatusBreakdown,
  getOrderSourceBreakdown,
  getInventoryStats,
  getTopSKUs,
  getReceivingStats,
  getReceivingTrends,
  getLabelStats,
  getLabelTrends,
} from "@/lib/supabase/queries/analytics";
import type {
  DateRange,
  GroupByPeriod,
} from "@/types/analytics";

/**
 * Hook to get order statistics
 */
export function useOrderStats(dateRange: DateRange) {
  return useQuery({
    queryKey: ["analytics", "order-stats", dateRange.startDate, dateRange.endDate],
    queryFn: () => getOrderStats(dateRange.startDate, dateRange.endDate),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to get order trends over time
 */
export function useOrderTrends(
  dateRange: DateRange,
  groupBy: GroupByPeriod = "day"
) {
  return useQuery({
    queryKey: [
      "analytics",
      "order-trends",
      dateRange.startDate,
      dateRange.endDate,
      groupBy,
    ],
    queryFn: () => getOrderTrends(dateRange.startDate, dateRange.endDate, groupBy),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to get order status breakdown
 */
export function useOrderStatusBreakdown(dateRange: DateRange) {
  return useQuery({
    queryKey: [
      "analytics",
      "order-status-breakdown",
      dateRange.startDate,
      dateRange.endDate,
    ],
    queryFn: () =>
      getOrderStatusBreakdown(dateRange.startDate, dateRange.endDate),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to get order source breakdown
 */
export function useOrderSourceBreakdown(dateRange: DateRange) {
  return useQuery({
    queryKey: [
      "analytics",
      "order-source-breakdown",
      dateRange.startDate,
      dateRange.endDate,
    ],
    queryFn: () =>
      getOrderSourceBreakdown(dateRange.startDate, dateRange.endDate),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to get inventory statistics
 */
export function useInventoryStats() {
  return useQuery({
    queryKey: ["analytics", "inventory-stats"],
    queryFn: () => getInventoryStats(),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to get top SKUs
 */
export function useTopSKUs(limit: number = 10) {
  return useQuery({
    queryKey: ["analytics", "top-skus", limit],
    queryFn: () => getTopSKUs(limit),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to get receiving statistics
 */
export function useReceivingStats(dateRange: DateRange) {
  return useQuery({
    queryKey: [
      "analytics",
      "receiving-stats",
      dateRange.startDate,
      dateRange.endDate,
    ],
    queryFn: () => getReceivingStats(dateRange.startDate, dateRange.endDate),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to get receiving trends over time
 */
export function useReceivingTrends(
  dateRange: DateRange,
  groupBy: GroupByPeriod = "day"
) {
  return useQuery({
    queryKey: [
      "analytics",
      "receiving-trends",
      dateRange.startDate,
      dateRange.endDate,
      groupBy,
    ],
    queryFn: () =>
      getReceivingTrends(dateRange.startDate, dateRange.endDate, groupBy),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to get label generation statistics
 */
export function useLabelStats(dateRange: DateRange) {
  return useQuery({
    queryKey: [
      "analytics",
      "label-stats",
      dateRange.startDate,
      dateRange.endDate,
    ],
    queryFn: () => getLabelStats(dateRange.startDate, dateRange.endDate),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to get label generation trends over time
 */
export function useLabelTrends(
  dateRange: DateRange,
  groupBy: GroupByPeriod = "day"
) {
  return useQuery({
    queryKey: [
      "analytics",
      "label-trends",
      dateRange.startDate,
      dateRange.endDate,
      groupBy,
    ],
    queryFn: () =>
      getLabelTrends(dateRange.startDate, dateRange.endDate, groupBy),
    staleTime: 1000 * 60 * 5,
  });
}
