"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  OrderStats,
  TrendDataPoint,
  StatusBreakdown,
  SourceBreakdown,
  InventoryStats,
  TopSKU,
  ReceivingStats,
  ReceivingTrendDataPoint,
  LabelStats,
  LabelTrendDataPoint,
  GroupByPeriod,
} from "@/types/analytics";

/**
 * Batched order analytics - combines stats, status breakdown, and source breakdown
 * This reduces 3 separate queries to 1, improving performance
 */
export async function getOrderAnalyticsBatched(
  startDate: Date,
  endDate: Date
): Promise<{
  data: {
    stats: OrderStats;
    statusBreakdown: StatusBreakdown[];
    sourceBreakdown: SourceBreakdown[];
  } | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  try {
    // Fetch current period orders with all needed fields in one query
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("status, total, shop_id")
      .eq("user_id", user.id)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (ordersError) {
      return { error: ordersError.message, data: null };
    }

    // Fetch previous period orders for comparison
    const periodDuration = endDate.getTime() - startDate.getTime();
    const previousStartDate = new Date(startDate.getTime() - periodDuration);
    const previousEndDate = startDate;

    const { data: previousOrders, error: prevError } = await supabase
      .from("orders")
      .select("total")
      .eq("user_id", user.id)
      .gte("created_at", previousStartDate.toISOString())
      .lte("created_at", previousEndDate.toISOString());

    if (prevError) {
      console.warn("Failed to fetch previous period:", prevError.message);
    }

    const orderList = orders || [];
    const previousOrderList = previousOrders || [];

    // Calculate stats
    const totalOrders = orderList.length;
    const totalRevenue = orderList.reduce(
      (sum, o) => sum + Number(o.total || 0),
      0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const statusCounts = {
      pending: 0,
      processing: 0,
      fulfilled: 0,
      cancelled: 0,
    };

    // Calculate status breakdown
    const statusBreakdownMap = new Map<string, number>();

    // Calculate source breakdown
    let shopifyCount = 0;
    let manualCount = 0;

    // Process all orders in one loop
    orderList.forEach((order) => {
      // Status counts for stats
      const status = order.status as keyof typeof statusCounts;
      if (status in statusCounts) {
        statusCounts[status]++;
      }

      // Status breakdown
      const orderStatus = order.status || "unknown";
      statusBreakdownMap.set(
        orderStatus,
        (statusBreakdownMap.get(orderStatus) || 0) + 1
      );

      // Source breakdown
      if (order.shop_id) {
        shopifyCount++;
      } else {
        manualCount++;
      }
    });

    const previousPeriodOrders = previousOrderList.length;
    const previousPeriodRevenue = previousOrderList.reduce(
      (sum, o) => sum + Number(o.total || 0),
      0
    );

    const ordersChangePercent =
      previousPeriodOrders > 0
        ? ((totalOrders - previousPeriodOrders) / previousPeriodOrders) * 100
        : totalOrders > 0
        ? 100
        : 0;

    const revenueChangePercent =
      previousPeriodRevenue > 0
        ? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
        : totalRevenue > 0
        ? 100
        : 0;

    // Build status breakdown array
    const statusBreakdown: StatusBreakdown[] = Array.from(
      statusBreakdownMap.entries()
    ).map(([status, count]) => ({
      status,
      count,
      percentage: totalOrders > 0 ? (count / totalOrders) * 100 : 0,
    }));

    // Build source breakdown array
    const total = shopifyCount + manualCount;
    const sourceBreakdown: SourceBreakdown[] = [
      {
        source: "shopify",
        count: shopifyCount,
        percentage: total > 0 ? (shopifyCount / total) * 100 : 0,
      },
      {
        source: "manual",
        count: manualCount,
        percentage: total > 0 ? (manualCount / total) * 100 : 0,
      },
    ];

    return {
      data: {
        stats: {
          totalOrders,
          totalRevenue,
          averageOrderValue,
          pendingCount: statusCounts.pending,
          processingCount: statusCounts.processing,
          fulfilledCount: statusCounts.fulfilled,
          cancelledCount: statusCounts.cancelled,
          previousPeriodOrders,
          previousPeriodRevenue,
          ordersChangePercent,
          revenueChangePercent,
        },
        statusBreakdown,
        sourceBreakdown,
      },
      error: null,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

/**
 * Get order statistics for a date range
 */
export async function getOrderStats(
  startDate: Date,
  endDate: Date
): Promise<{ data: OrderStats | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  try {
    // Current period orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("status, total, shop_id")
      .eq("user_id", user.id)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (ordersError) {
      return { error: ordersError.message, data: null };
    }

    // Previous period (same duration before startDate)
    const periodDuration = endDate.getTime() - startDate.getTime();
    const previousStartDate = new Date(startDate.getTime() - periodDuration);
    const previousEndDate = startDate;

    const { data: previousOrders, error: prevError } = await supabase
      .from("orders")
      .select("total")
      .eq("user_id", user.id)
      .gte("created_at", previousStartDate.toISOString())
      .lte("created_at", previousEndDate.toISOString());

    if (prevError) {
      // Don't fail if previous period has no data
      console.warn("Failed to fetch previous period:", prevError.message);
    }

    const orderList = orders || [];
    const previousOrderList = previousOrders || [];

    // Calculate stats
    const totalOrders = orderList.length;
    const totalRevenue = orderList.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const statusCounts = {
      pending: 0,
      processing: 0,
      fulfilled: 0,
      cancelled: 0,
    };

    orderList.forEach((order) => {
      const status = order.status as keyof typeof statusCounts;
      if (status in statusCounts) {
        statusCounts[status]++;
      }
    });

    const previousPeriodOrders = previousOrderList.length;
    const previousPeriodRevenue = previousOrderList.reduce(
      (sum, o) => sum + Number(o.total || 0),
      0
    );

    const ordersChangePercent =
      previousPeriodOrders > 0
        ? ((totalOrders - previousPeriodOrders) / previousPeriodOrders) * 100
        : totalOrders > 0
        ? 100
        : 0;

    const revenueChangePercent =
      previousPeriodRevenue > 0
        ? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
        : totalRevenue > 0
        ? 100
        : 0;

    return {
      data: {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        pendingCount: statusCounts.pending,
        processingCount: statusCounts.processing,
        fulfilledCount: statusCounts.fulfilled,
        cancelledCount: statusCounts.cancelled,
        previousPeriodOrders,
        previousPeriodRevenue,
        ordersChangePercent,
        revenueChangePercent,
      },
      error: null,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

/**
 * Get order trends over time
 * Uses SQL aggregation for better performance
 */
export async function getOrderTrends(
  startDate: Date,
  endDate: Date,
  groupBy: GroupByPeriod = "day"
): Promise<{ data: TrendDataPoint[] | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  try {
    // Use SQL aggregation function instead of client-side grouping
    const { data, error } = await supabase.rpc("get_order_trends", {
      p_user_id: user.id,
      p_start_date: startDate.toISOString(),
      p_end_date: endDate.toISOString(),
      p_group_by: groupBy,
    });

    if (error) {
      return { error: error.message, data: null };
    }

    // Map the database result to our TrendDataPoint format
    const trends: TrendDataPoint[] =
      data?.map((row: { date: string; value: number; revenue: number }) => ({
        date: row.date,
        value: Number(row.value),
        revenue: Number(row.revenue),
      })) || [];

    return { data: trends, error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

/**
 * Get order status breakdown
 */
export async function getOrderStatusBreakdown(
  startDate: Date,
  endDate: Date
): Promise<{ data: StatusBreakdown[] | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("status")
      .eq("user_id", user.id)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (error) {
      return { error: error.message, data: null };
    }

    const statusCounts = new Map<string, number>();
    let total = 0;

    orders?.forEach((order) => {
      const status = order.status || "unknown";
      statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
      total++;
    });

    const breakdown: StatusBreakdown[] = Array.from(statusCounts.entries()).map(
      ([status, count]) => ({
        status,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      })
    );

    return { data: breakdown, error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

/**
 * Get order source breakdown (Shopify vs Manual)
 */
export async function getOrderSourceBreakdown(
  startDate: Date,
  endDate: Date
): Promise<{ data: SourceBreakdown[] | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("shop_id")
      .eq("user_id", user.id)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (error) {
      return { error: error.message, data: null };
    }

    let shopifyCount = 0;
    let manualCount = 0;

    orders?.forEach((order) => {
      if (order.shop_id) {
        shopifyCount++;
      } else {
        manualCount++;
      }
    });

    const total = shopifyCount + manualCount;

    const breakdown: SourceBreakdown[] = [
      {
        source: "shopify",
        count: shopifyCount,
        percentage: total > 0 ? (shopifyCount / total) * 100 : 0,
      },
      {
        source: "manual",
        count: manualCount,
        percentage: total > 0 ? (manualCount / total) * 100 : 0,
      },
    ];

    return { data: breakdown, error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

/**
 * Get inventory statistics
 */
export async function getInventoryStats(): Promise<{
  data: InventoryStats | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  try {
    const { data: inventory, error } = await supabase
      .from("inventory")
      .select("quantity, reorder_threshold")
      .eq("user_id", user.id);

    if (error) {
      return { error: error.message, data: null };
    }

    const items = inventory || [];
    const totalSKUs = items.length;
    const lowStockCount = items.filter(
      (item) => item.quantity <= item.reorder_threshold
    ).length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const averageQuantity =
      totalSKUs > 0 ? totalQuantity / totalSKUs : 0;

    // For previous period comparison, we'd need historical data
    // For now, we'll set to 0 (can be enhanced later)
    const previousLowStockCount = 0;
    const lowStockChange = lowStockCount - previousLowStockCount;

    return {
      data: {
        totalSKUs,
        lowStockCount,
        totalQuantity,
        averageQuantity,
        previousLowStockCount,
        lowStockChange,
      },
      error: null,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

/**
 * Get top SKUs by quantity
 */
export async function getTopSKUs(
  limit: number = 10
): Promise<{ data: TopSKU[] | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  try {
    const { data: inventory, error } = await supabase
      .from("inventory")
      .select("sku, name, quantity, location, reorder_threshold")
      .eq("user_id", user.id)
      .order("quantity", { ascending: false })
      .limit(limit);

    if (error) {
      return { error: error.message, data: null };
    }

    const topSKUs: TopSKU[] =
      inventory?.map((item) => ({
        sku: item.sku,
        name: item.name,
        quantity: item.quantity,
        location: item.location,
        isLowStock: item.quantity <= item.reorder_threshold,
      })) || [];

    return { data: topSKUs, error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

/**
 * Get receiving statistics
 */
export async function getReceivingStats(
  startDate: Date,
  endDate: Date
): Promise<{ data: ReceivingStats | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  try {
    const { data: logs, error } = await supabase
      .from("receiving_log")
      .select("quantity, condition, received_at")
      .eq("user_id", user.id)
      .gte("received_at", startDate.toISOString())
      .lte("received_at", endDate.toISOString());

    if (error) {
      return { error: error.message, data: null };
    }

    // Previous period
    const periodDuration = endDate.getTime() - startDate.getTime();
    const previousStartDate = new Date(startDate.getTime() - periodDuration);
    const previousEndDate = startDate;

    const { data: previousLogs } = await supabase
      .from("receiving_log")
      .select("quantity")
      .eq("user_id", user.id)
      .gte("received_at", previousStartDate.toISOString())
      .lte("received_at", previousEndDate.toISOString());

    const logList = logs || [];
    const previousLogList = previousLogs || [];

    let good = 0;
    let damaged = 0;
    let defective = 0;
    let returned = 0;

    logList.forEach((log) => {
      const qty = log.quantity || 0;
      switch (log.condition) {
        case "good":
          good += qty;
          break;
        case "damaged":
          damaged += qty;
          break;
        case "defective":
          defective += qty;
          break;
        case "returned":
          returned += qty;
          break;
      }
    });

    const totalReceived = good + damaged + defective + returned;
    const previousPeriodTotal = previousLogList.reduce(
      (sum, log) => sum + (log.quantity || 0),
      0
    );

    const changePercent =
      previousPeriodTotal > 0
        ? ((totalReceived - previousPeriodTotal) / previousPeriodTotal) * 100
        : totalReceived > 0
        ? 100
        : 0;

    return {
      data: {
        totalReceived,
        good,
        damaged,
        defective,
        returned,
        previousPeriodTotal,
        changePercent,
      },
      error: null,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

/**
 * Get receiving trends over time
 * Uses SQL aggregation for better performance
 */
export async function getReceivingTrends(
  startDate: Date,
  endDate: Date,
  groupBy: GroupByPeriod = "day"
): Promise<{ data: ReceivingTrendDataPoint[] | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  try {
    // Use SQL aggregation function instead of client-side grouping
    const { data, error } = await supabase.rpc("get_receiving_trends", {
      p_user_id: user.id,
      p_start_date: startDate.toISOString(),
      p_end_date: endDate.toISOString(),
      p_group_by: groupBy,
    });

    if (error) {
      return { error: error.message, data: null };
    }

    // Map the database result to our ReceivingTrendDataPoint format
    const trends: ReceivingTrendDataPoint[] =
      data?.map(
        (row: {
          date: string;
          quantity: number;
          good: number;
          damaged: number;
          defective: number;
          returned: number;
        }) => ({
          date: row.date,
          quantity: Number(row.quantity),
          good: Number(row.good),
          damaged: Number(row.damaged),
          defective: Number(row.defective),
          returned: Number(row.returned),
        })
      ) || [];

    return { data: trends, error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

/**
 * Get label generation statistics
 */
export async function getLabelStats(
  startDate: Date,
  endDate: Date
): Promise<{ data: LabelStats | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  try {
    // Get orders with labels in date range
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id, created_at")
      .eq("user_id", user.id)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (ordersError) {
      return { error: ordersError.message, data: null };
    }

    const orderIds = orders?.map((o) => o.id) || [];

    if (orderIds.length === 0) {
      return {
        data: {
          total: 0,
          successful: 0,
          failed: 0,
          successRate: 0,
          totalCost: 0,
          averageCost: 0,
          previousPeriodTotal: 0,
          changePercent: 0,
        },
        error: null,
      };
    }

    // Get audit logs for these orders
    const { data: auditLogs, error: auditError } = await supabase
      .from("label_generation_audit_log")
      .select("status, error_message, metadata")
      .in("order_id", orderIds);

    if (auditError) {
      return { error: auditError.message, data: null };
    }

    // Previous period
    const periodDuration = endDate.getTime() - startDate.getTime();
    const previousStartDate = new Date(startDate.getTime() - periodDuration);
    const previousEndDate = startDate;

    const { data: previousOrders } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", user.id)
      .gte("created_at", previousStartDate.toISOString())
      .lte("created_at", previousEndDate.toISOString());

    const previousOrderIds = previousOrders?.map((o) => o.id) || [];
    const { data: previousAuditLogs } = await supabase
      .from("label_generation_audit_log")
      .select("id")
      .in("order_id", previousOrderIds);

    const logs = auditLogs || [];
    const total = logs.length;
    const successful = logs.filter((log) => log.status === "success").length;
    const failed = logs.filter((log) => log.status === "failed").length;
    const successRate = total > 0 ? (successful / total) * 100 : 0;

    // Calculate costs from metadata if available
    let totalCost = 0;
    logs.forEach((log) => {
      if (log.metadata && typeof log.metadata === "object") {
        const metadata = log.metadata as Record<string, unknown>;
        const cost = metadata.cost;
        if (typeof cost === "number") {
          totalCost += cost;
        }
      }
    });

    const averageCost = total > 0 ? totalCost / total : 0;
    const previousPeriodTotal = previousAuditLogs?.length || 0;

    const changePercent =
      previousPeriodTotal > 0
        ? ((total - previousPeriodTotal) / previousPeriodTotal) * 100
        : total > 0
        ? 100
        : 0;

    return {
      data: {
        total,
        successful,
        failed,
        successRate,
        totalCost,
        averageCost,
        previousPeriodTotal,
        changePercent,
      },
      error: null,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

/**
 * Get label generation trends over time
 * Uses SQL aggregation for better performance
 */
export async function getLabelTrends(
  startDate: Date,
  endDate: Date,
  groupBy: GroupByPeriod = "day"
): Promise<{ data: LabelTrendDataPoint[] | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not Authenticated", data: null };
  }

  try {
    // Use SQL aggregation function instead of client-side grouping
    // This is much more efficient as it filters directly by user_id on the audit log table
    const { data, error } = await supabase.rpc("get_label_trends", {
      p_user_id: user.id,
      p_start_date: startDate.toISOString(),
      p_end_date: endDate.toISOString(),
      p_group_by: groupBy,
    });

    if (error) {
      return { error: error.message, data: null };
    }

    // Map the database result to our LabelTrendDataPoint format
    const trends: LabelTrendDataPoint[] =
      data?.map(
        (row: {
          date: string;
          count: number;
          successful: number;
          failed: number;
        }) => ({
          date: row.date,
          count: Number(row.count),
          successful: Number(row.successful),
          failed: Number(row.failed),
        })
      ) || [];

    return { data: trends, error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}
