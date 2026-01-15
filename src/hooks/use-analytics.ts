"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getOrderStats,
  getOrderTrends,
  getOrderStatusBreakdown,
  getOrderSourceBreakdown,
  getOrderAnalyticsBatched,
  getInventoryStats,
  getTopSKUs,
  getReceivingStats,
  getReceivingTrends,
  getLabelStats,
  getLabelTrends,
} from "@/lib/supabase/queries/analytics";
import type { DateRange, GroupByPeriod } from "@/types/analytics";

/**
 * Hook to get order statistics
 */
export function useOrderStats(dateRange: DateRange) {
  return useQuery({
    queryKey: [
      "analytics",
      "order-stats",
      dateRange.startDate,
      dateRange.endDate,
    ],
    queryFn: () => getOrderStats(dateRange.startDate, dateRange.endDate),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to get batched order analytics (stats, status breakdown, source breakdown)
 * This is more efficient than calling the three hooks separately
 */
export function useOrderAnalyticsBatched(
  dateRange: DateRange,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [
      "analytics",
      "order-analytics-batched",
      dateRange.startDate,
      dateRange.endDate,
    ],
    queryFn: () =>
      getOrderAnalyticsBatched(dateRange.startDate, dateRange.endDate),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: options?.enabled !== false,
  });
}

/**
 * Hook to get order trends over time
 * Can be enabled conditionally for progressive loading
 */
export function useOrderTrends(
  dateRange: DateRange,
  groupBy: GroupByPeriod = "day",
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [
      "analytics",
      "order-trends",
      dateRange.startDate,
      dateRange.endDate,
      groupBy,
    ],
    queryFn: () =>
      getOrderTrends(dateRange.startDate, dateRange.endDate, groupBy),
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled !== false,
  });
}

/**
 * Hook to get order status breakdown
 * Can be enabled conditionally for progressive loading
 */
export function useOrderStatusBreakdown(
  dateRange: DateRange,
  options?: { enabled?: boolean }
) {
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
    enabled: options?.enabled !== false,
  });
}

/**
 * Hook to get order source breakdown
 * Can be enabled conditionally for progressive loading
 */
export function useOrderSourceBreakdown(
  dateRange: DateRange,
  options?: { enabled?: boolean }
) {
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
    enabled: options?.enabled !== false,
  });
}

/**
 * Hook to get inventory statistics
 * Increased stale time since inventory changes less frequently than orders
 */
export function useInventoryStats(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["analytics", "inventory-stats"],
    queryFn: () => getInventoryStats(),
    staleTime: 1000 * 60 * 15, // 15 minutes (inventory changes less frequently)
    enabled: options?.enabled !== false,
  });
}

/**
 * Hook to get top SKUs
 * Increased stale time since top SKUs don't change frequently
 */
export function useTopSKUs(
  limit: number = 10,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["analytics", "top-skus", limit],
    queryFn: () => getTopSKUs(limit),
    staleTime: 1000 * 60 * 30, // 30 minutes (top SKUs are relatively stable)
    enabled: options?.enabled !== false,
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
 * Can be enabled conditionally for progressive loading
 */
export function useReceivingTrends(
  dateRange: DateRange,
  groupBy: GroupByPeriod = "day",
  options?: { enabled?: boolean }
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
    enabled: options?.enabled !== false,
  });
}

/**
 * Hook to get label generation statistics
 * Can be enabled conditionally for progressive loading
 */
export function useLabelStats(
  dateRange: DateRange,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [
      "analytics",
      "label-stats",
      dateRange.startDate,
      dateRange.endDate,
    ],
    queryFn: () => getLabelStats(dateRange.startDate, dateRange.endDate),
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled !== false,
  });
}

/**
 * Hook to get label generation trends over time
 * Can be enabled conditionally for progressive loading
 */
export function useLabelTrends(
  dateRange: DateRange,
  groupBy: GroupByPeriod = "day",
  options?: { enabled?: boolean }
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
    enabled: options?.enabled !== false,
  });
}
