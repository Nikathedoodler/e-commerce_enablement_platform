"use client";

import { useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  useOrderAnalyticsBatched,
  useInventoryStats,
} from "@/hooks/use-analytics";
import { useOrders } from "@/hooks/use-orders";
import { useRealtimeOrders } from "@/hooks/use-realtime-orders";
import type { DateRange } from "@/types/analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Package, Warehouse, ArrowRight, TrendingUp } from "lucide-react";

/**
 * Get today's date range (start of today to end of today)
 */
function getTodayDateRange(): DateRange {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999); // End of today

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0); // Start of today

  return { startDate, endDate };
}

export default function DashboardPage() {
  // Get today's date range for "Orders Today" metric
  const todayDateRange = useMemo(() => getTodayDateRange(), []);

  // Fetch order analytics for today
  const todayOrderAnalytics = useOrderAnalyticsBatched(todayDateRange);

  // Fetch all orders analytics (for pending shipments - includes all orders regardless of date)
  // We'll use a very wide date range (10 years) to capture all pending/processing orders
  const allOrdersDateRange = useMemo(() => {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 10); // 10 years to capture all pending orders
    startDate.setHours(0, 0, 0, 0);
    return { startDate, endDate };
  }, []);

  const allOrdersAnalytics = useOrderAnalyticsBatched(allOrdersDateRange);

  // Fetch inventory stats for low stock items
  const inventoryStats = useInventoryStats();

  // Use Supabase Realtime for instant order notifications (event-driven, no polling)
  // Falls back to adaptive polling if Realtime is unavailable
  const { realtimeAvailable } = useRealtimeOrders();

  // Fetch recent orders (last 5) - only poll if Realtime is unavailable
  // Falls back to 30-second polling if Realtime subscription fails
  const { data: recentOrdersData, isLoading: isLoadingRecentOrders } =
    useOrders(
      {
        page: 1,
        pageSize: 5,
        sortBy: "created_at",
        sortOrder: "desc",
      },
      {
        // Only poll if Realtime is unavailable
        refetchInterval: realtimeAvailable ? undefined : 30000, // 30s fallback polling
      }
    );

  // Extract metrics
  const ordersToday = todayOrderAnalytics.data?.data?.stats?.totalOrders || 0;
  const revenueToday = todayOrderAnalytics.data?.data?.stats?.totalRevenue || 0;
  const pendingShipments =
    (allOrdersAnalytics.data?.data?.stats?.pendingCount || 0) +
    (allOrdersAnalytics.data?.data?.stats?.processingCount || 0);
  const lowStockItems = inventoryStats.data?.data?.lowStockCount || 0;

  // Order status breakdown
  const orderStatusBreakdown = {
    pending: allOrdersAnalytics.data?.data?.stats?.pendingCount || 0,
    processing: allOrdersAnalytics.data?.data?.stats?.processingCount || 0,
    fulfilled: allOrdersAnalytics.data?.data?.stats?.fulfilledCount || 0,
    cancelled: allOrdersAnalytics.data?.data?.stats?.cancelledCount || 0,
  };

  const recentOrders = recentOrdersData?.data || [];

  // Loading state
  const isLoading =
    todayOrderAnalytics.isLoading ||
    allOrdersAnalytics.isLoading ||
    inventoryStats.isLoading;

  function getStatusColor(status: string) {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "fulfilled":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Welcome to your fulfillment dashboard
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Orders Today</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {isLoading ? (
                <span className="text-muted-foreground">...</span>
              ) : (
                ordersToday
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Revenue Today</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {isLoading ? (
                <span className="text-muted-foreground">...</span>
              ) : (
                `$${revenueToday.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Pending Shipments</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {isLoading ? (
                <span className="text-muted-foreground">...</span>
              ) : (
                pendingShipments
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Low Stock Items</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {isLoading ? (
                <span className="text-muted-foreground">...</span>
              ) : (
                lowStockItems
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/dashboard/orders/create-order">
                <Plus className="mr-2 h-4 w-4" />
                Create Order
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/dashboard/inventory/add-new">
                <Warehouse className="mr-2 h-4 w-4" />
                Add Inventory Item
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/dashboard/orders/all-orders">
                <Package className="mr-2 h-4 w-4" />
                View All Orders
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/dashboard/analytics">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col 2xl:flex-row gap-6 lg:items-stretch">
        {/* Order Status Breakdown */}
        <Card className="lg:flex-[0.3] min-w-0 w-full flex flex-col lg:self-stretch">
          <CardHeader className="flex-shrink-0">
            <CardTitle>Order Status Breakdown</CardTitle>
            <CardDescription>Current order status distribution</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 w-full bg-muted animate-pulse rounded"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs sm:text-sm">
                      Pending
                    </Badge>
                  </div>
                  <span className="text-base sm:text-lg font-semibold">
                    {orderStatusBreakdown.pending}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs sm:text-sm">
                      Processing
                    </Badge>
                  </div>
                  <span className="text-base sm:text-lg font-semibold">
                    {orderStatusBreakdown.processing}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs sm:text-sm">
                      Fulfilled
                    </Badge>
                  </div>
                  <span className="text-base sm:text-lg font-semibold">
                    {orderStatusBreakdown.fulfilled}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs sm:text-sm">
                      Cancelled
                    </Badge>
                  </div>
                  <span className="text-base sm:text-lg font-semibold">
                    {orderStatusBreakdown.cancelled}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="lg:flex-[0.7] min-w-0 w-full flex flex-col lg:self-stretch">
          <CardHeader className="flex-shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest 5 orders</CardDescription>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="self-start sm:self-auto"
              >
                <Link href="/dashboard/orders/all-orders">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            {isLoadingRecentOrders ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 w-full bg-muted animate-pulse rounded"
                  />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>No orders yet</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/dashboard/orders/create-order">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Order
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6 flex-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">
                        Order #
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Customer
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Status
                      </TableHead>
                      <TableHead className="whitespace-nowrap">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {order.order_number}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {order.customer_email}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge
                            className={`${getStatusColor(
                              order.status
                            )} text-xs`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          ${order.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
