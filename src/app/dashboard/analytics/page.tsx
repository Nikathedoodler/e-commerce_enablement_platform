"use client";

import { useState } from "react";
import {
  DateRangeSelector,
  getDateRangeFromPreset,
} from "@/components/dashboard/analytics/date-range-selector";
import { MetricCard } from "@/components/dashboard/analytics/metric-card";
import { ChartAreaInteractive } from "@/components/dashboard/analytics/chart-area-interactive";
import { OrderStatusChart } from "@/components/dashboard/analytics/order-status-chart";
import { OrderSourceChart } from "@/components/dashboard/analytics/order-source-chart";
import { ReceivingConditionChart } from "@/components/dashboard/analytics/receiving-condition-chart";
import {
  useOrderStats,
  useOrderTrends,
  useOrderStatusBreakdown,
  useOrderSourceBreakdown,
  useInventoryStats,
  useTopSKUs,
  useReceivingStats,
  useReceivingTrends,
  useLabelStats,
  useLabelTrends,
} from "@/hooks/use-analytics";
import type { DateRangePreset } from "@/types/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsPage() {
  const [dateRangePreset, setDateRangePreset] =
    useState<DateRangePreset>("30d");
  const dateRange = getDateRangeFromPreset(dateRangePreset);

  // Fetch all analytics data
  const orderStats = useOrderStats(dateRange);
  const orderStatusBreakdown = useOrderStatusBreakdown(dateRange);
  const orderSourceBreakdown = useOrderSourceBreakdown(dateRange);
  const inventoryStats = useInventoryStats();
  const topSKUs = useTopSKUs(10);
  const receivingStats = useReceivingStats(dateRange);
  const labelStats = useLabelStats(dateRange);

  // Determine groupBy based on date range
  const getGroupBy = (): "day" | "week" | "month" => {
    switch (dateRangePreset) {
      case "7d":
      case "30d":
        return "day";
      case "90d":
      case "180d":
        return "week";
      case "1y":
        return "month";
      default:
        return "day";
    }
  };

  const groupBy = getGroupBy();
  const orderTrendsGrouped = useOrderTrends(dateRange, groupBy);
  const receivingTrendsGrouped = useReceivingTrends(dateRange, groupBy);
  const labelTrendsGrouped = useLabelTrends(dateRange, groupBy);

  // Calculate trend indicators
  const getTrend = (changePercent: number): "up" | "down" | "neutral" => {
    if (changePercent > 0) return "up";
    if (changePercent < 0) return "down";
    return "neutral";
  };

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 sm:gap-6 sm:py-6">
        {/* Header */}
        <div className="flex flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Analytics
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Insights into your fulfillment operations
            </p>
          </div>
          <DateRangeSelector
            value={dateRangePreset}
            onChange={setDateRangePreset}
          />
        </div>

        {/* Overview Cards */}
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
          <MetricCard
            title="Total Orders"
            value={orderStats.data?.data?.totalOrders || 0}
            change={orderStats.data?.data?.ordersChangePercent}
            subtitle="Orders in selected period"
            trend={getTrend(orderStats.data?.data?.ordersChangePercent || 0)}
            isLoading={orderStats.isLoading}
          />
          <MetricCard
            title="Total Revenue"
            value={`$${
              orderStats.data?.data?.totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || "0.00"
            }`}
            change={orderStats.data?.data?.revenueChangePercent}
            subtitle="Revenue in selected period"
            trend={getTrend(orderStats.data?.data?.revenueChangePercent || 0)}
            isLoading={orderStats.isLoading}
          />
          <MetricCard
            title="Pending Shipments"
            value={
              (orderStats.data?.data?.pendingCount || 0) +
              (orderStats.data?.data?.processingCount || 0)
            }
            subtitle="Orders awaiting fulfillment"
            isLoading={orderStats.isLoading}
          />
          <MetricCard
            title="Low Stock Items"
            value={inventoryStats.data?.data?.lowStockCount || 0}
            change={inventoryStats.data?.data?.lowStockChange}
            subtitle="Items needing restock"
            trend={
              inventoryStats.data?.data?.lowStockChange
                ? getTrend(inventoryStats.data.data.lowStockChange)
                : "neutral"
            }
            isLoading={inventoryStats.isLoading}
          />
        </div>

        {/* Order Analytics */}
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive
            title="Order Volume"
            description="Orders over time"
            data={orderTrendsGrouped.data?.data || []}
            isLoading={orderTrendsGrouped.isLoading}
            valueKey="value"
            defaultTimeRange="30d"
          />
        </div>

        <div className="grid gap-4 px-4 grid-cols-1 xl:grid-cols-2 lg:px-6">
          <OrderStatusChart
            data={orderStatusBreakdown.data?.data || []}
            isLoading={orderStatusBreakdown.isLoading}
          />
          <OrderSourceChart
            data={orderSourceBreakdown.data?.data || []}
            isLoading={orderSourceBreakdown.isLoading}
          />
        </div>

        <div className="px-4 lg:px-6">
          <ChartAreaInteractive
            title="Revenue"
            description="Revenue trends"
            data={orderTrendsGrouped.data?.data || []}
            isLoading={orderTrendsGrouped.isLoading}
            valueKey="revenue"
            showRevenue={true}
            defaultTimeRange="30d"
          />
        </div>

        {/* Inventory Analytics */}
        <Card className="mx-4 lg:mx-6">
          <CardHeader>
            <CardTitle>Inventory Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Total SKUs
                </p>
                <p className="text-xl font-bold sm:text-2xl">
                  {inventoryStats.data?.data?.totalSKUs || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Total Quantity
                </p>
                <p className="text-xl font-bold sm:text-2xl">
                  {inventoryStats.data?.data?.totalQuantity.toLocaleString() ||
                    0}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Low Stock
                </p>
                <p className="text-xl font-bold sm:text-2xl">
                  {inventoryStats.data?.data?.lowStockCount || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Average Quantity
                </p>
                <p className="text-xl font-bold sm:text-2xl">
                  {Math.round(inventoryStats.data?.data?.averageQuantity || 0)}
                </p>
              </div>
            </div>

            {topSKUs.data?.data && topSKUs.data.data.length > 0 && (
              <div className="mt-6">
                <h3 className="text-base font-semibold mb-4 sm:text-lg">
                  Top 10 SKUs by Quantity
                </h3>
                <div className="rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="h-10 min-w-[100px]">
                          SKU
                        </TableHead>
                        <TableHead className="h-10 min-w-[150px]">
                          Name
                        </TableHead>
                        <TableHead className="h-10 min-w-[100px]">
                          Quantity
                        </TableHead>
                        <TableHead className="h-10 min-w-[100px] hidden sm:table-cell">
                          Location
                        </TableHead>
                        <TableHead className="h-10 min-w-[100px]">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topSKUs.data.data.map((sku) => (
                        <TableRow key={sku.sku} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-xs sm:text-sm">
                            {sku.sku}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            {sku.name}
                          </TableCell>
                          <TableCell className="tabular-nums text-xs sm:text-sm">
                            {sku.quantity.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs sm:text-sm hidden sm:table-cell">
                            {sku.location || "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                sku.isLowStock ? "destructive" : "outline"
                              }
                              className="px-2 text-xs"
                            >
                              {sku.isLowStock ? "Low Stock" : "In Stock"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Receiving Analytics */}
        <div className="grid gap-4 px-4 grid-cols-1 xl:grid-cols-2 lg:px-6">
          <ChartAreaInteractive
            title="Receiving Trends"
            description="Items received over time"
            data={receivingTrendsGrouped.data?.data || []}
            isLoading={receivingTrendsGrouped.isLoading}
            valueKey="quantity"
            defaultTimeRange="30d"
          />
          <ReceivingConditionChart
            data={receivingStats.data?.data || null}
            isLoading={receivingStats.isLoading}
          />
        </div>

        {/* Shipping & Label Analytics */}
        <Card className="mx-4 lg:mx-6">
          <CardHeader>
            <CardTitle>Shipping & Label Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Total Labels
                </p>
                <p className="text-xl font-bold sm:text-2xl">
                  {labelStats.data?.data?.total || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Success Rate
                </p>
                <p className="text-xl font-bold sm:text-2xl">
                  {labelStats.data?.data?.successRate.toFixed(1) || 0}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Total Cost
                </p>
                <p className="text-xl font-bold sm:text-2xl">
                  $
                  {labelStats.data?.data?.totalCost.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || "0.00"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Avg Cost/Label
                </p>
                <p className="text-xl font-bold sm:text-2xl">
                  $
                  {labelStats.data?.data?.averageCost.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  ) || "0.00"}
                </p>
              </div>
            </div>

            <ChartAreaInteractive
              title="Label Generation"
              description="Labels generated over time"
              data={labelTrendsGrouped.data?.data || []}
              isLoading={labelTrendsGrouped.isLoading}
              valueKey="count"
              defaultTimeRange="30d"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
