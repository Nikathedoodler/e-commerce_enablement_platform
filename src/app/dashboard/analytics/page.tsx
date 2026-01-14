"use client";

import { useState } from "react";
import { DateRangeSelector, getDateRangeFromPreset } from "@/components/dashboard/analytics/date-range-selector";
import { MetricCard } from "@/components/dashboard/analytics/metric-card";
import { OrderVolumeChart } from "@/components/dashboard/analytics/order-volume-chart";
import { OrderStatusChart } from "@/components/dashboard/analytics/order-status-chart";
import { OrderSourceChart } from "@/components/dashboard/analytics/order-source-chart";
import { RevenueChart } from "@/components/dashboard/analytics/revenue-chart";
import { ReceivingConditionChart } from "@/components/dashboard/analytics/receiving-condition-chart";
import { ReceivingTrendsChart } from "@/components/dashboard/analytics/receiving-trends-chart";
import { LabelTrendsChart } from "@/components/dashboard/analytics/label-trends-chart";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsPage() {
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>("30d");
  const dateRange = getDateRangeFromPreset(dateRangePreset);

  // Fetch all analytics data
  const orderStats = useOrderStats(dateRange);
  const orderTrends = useOrderTrends(dateRange, "day");
  const orderStatusBreakdown = useOrderStatusBreakdown(dateRange);
  const orderSourceBreakdown = useOrderSourceBreakdown(dateRange);
  const inventoryStats = useInventoryStats();
  const topSKUs = useTopSKUs(10);
  const receivingStats = useReceivingStats(dateRange);
  const receivingTrends = useReceivingTrends(dateRange, "day");
  const labelStats = useLabelStats(dateRange);
  const labelTrends = useLabelTrends(dateRange, "day");

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Insights into your fulfillment operations
          </p>
        </div>
        <DateRangeSelector value={dateRangePreset} onChange={setDateRangePreset} />
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          value={`$${orderStats.data?.data?.totalRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || "0.00"}`}
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
      <div className="grid gap-4 md:grid-cols-2">
        <OrderVolumeChart
          data={orderTrendsGrouped.data?.data || []}
          isLoading={orderTrendsGrouped.isLoading}
        />
        <OrderStatusChart
          data={orderStatusBreakdown.data?.data || []}
          isLoading={orderStatusBreakdown.isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <OrderSourceChart
          data={orderSourceBreakdown.data?.data || []}
          isLoading={orderSourceBreakdown.isLoading}
        />
        <RevenueChart
          data={orderTrendsGrouped.data?.data || []}
          isLoading={orderTrendsGrouped.isLoading}
        />
      </div>

      {/* Inventory Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Total SKUs</p>
              <p className="text-2xl font-bold">
                {inventoryStats.data?.data?.totalSKUs || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Quantity</p>
              <p className="text-2xl font-bold">
                {inventoryStats.data?.data?.totalQuantity.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold">
                {inventoryStats.data?.data?.lowStockCount || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Quantity</p>
              <p className="text-2xl font-bold">
                {Math.round(inventoryStats.data?.data?.averageQuantity || 0)}
              </p>
            </div>
          </div>

          {topSKUs.data?.data && topSKUs.data.data.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Top 10 SKUs by Quantity</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topSKUs.data.data.map((sku) => (
                    <TableRow key={sku.sku}>
                      <TableCell className="font-mono">{sku.sku}</TableCell>
                      <TableCell>{sku.name}</TableCell>
                      <TableCell>{sku.quantity.toLocaleString()}</TableCell>
                      <TableCell>{sku.location || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={sku.isLowStock ? "destructive" : "default"}
                        >
                          {sku.isLowStock ? "Low Stock" : "In Stock"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Receiving Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <ReceivingTrendsChart
          data={receivingTrendsGrouped.data?.data || []}
          isLoading={receivingTrendsGrouped.isLoading}
        />
        <ReceivingConditionChart
          data={receivingStats.data?.data || null}
          isLoading={receivingStats.isLoading}
        />
      </div>

      {/* Shipping & Label Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping & Label Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Labels</p>
              <p className="text-2xl font-bold">
                {labelStats.data?.data?.total || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">
                {labelStats.data?.data?.successRate.toFixed(1) || 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-bold">
                ${labelStats.data?.data?.totalCost.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || "0.00"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Cost/Label</p>
              <p className="text-2xl font-bold">
                ${labelStats.data?.data?.averageCost.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || "0.00"}
              </p>
            </div>
          </div>

          <LabelTrendsChart
            data={labelTrendsGrouped.data?.data || []}
            isLoading={labelTrendsGrouped.isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
