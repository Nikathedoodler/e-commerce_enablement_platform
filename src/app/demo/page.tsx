"use client";

import Link from "next/link";
import { motion } from "motion/react";
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
import { Plus, Package, Warehouse, ArrowRight, TrendingUp, Lock } from "lucide-react";

// Demo data - sample values to show
const demoData = {
  ordersToday: 12,
  revenueToday: 2847.50,
  pendingShipments: 8,
  lowStockItems: 5,
  orderStatusBreakdown: {
    pending: 3,
    processing: 5,
    fulfilled: 24,
    cancelled: 1,
  },
  recentOrders: [
    { id: "ORD-001", customer: "John Doe", status: "pending", total: "$125.00" },
    { id: "ORD-002", customer: "Jane Smith", status: "processing", total: "$89.50" },
    { id: "ORD-003", customer: "Acme Corp", status: "fulfilled", total: "$450.00" },
    { id: "ORD-004", customer: "Tech Store", status: "processing", total: "$234.99" },
    { id: "ORD-005", customer: "Retail Co", status: "pending", total: "$67.25" },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DemoDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 text-center text-sm">
        <div className="flex items-center justify-center gap-2">
          <Lock className="h-4 w-4" />
          <span>
            This is a <strong>demo dashboard</strong> with sample data.{" "}
            <Link href="/auth/signup" className="underline font-semibold">
              Get an invite code
            </Link>{" "}
            to access the full platform.
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome to your fulfillment dashboard (Demo Mode)
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardDescription>Orders Today</CardDescription>
                <CardTitle className="text-2xl font-bold">
                  {demoData.ordersToday}
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardDescription>Revenue Today</CardDescription>
                <CardTitle className="text-2xl font-bold">
                  ${demoData.revenueToday.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardDescription>Pending Shipments</CardDescription>
                <CardTitle className="text-2xl font-bold">
                  {demoData.pendingShipments}
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardDescription>Low Stock Items</CardDescription>
                <CardTitle className="text-2xl font-bold">
                  {demoData.lowStockItems}
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <Button disabled className="w-full sm:w-auto opacity-50 cursor-not-allowed">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Order
                </Button>
                <Button disabled variant="outline" className="w-full sm:w-auto opacity-50 cursor-not-allowed">
                  <Warehouse className="mr-2 h-4 w-4" />
                  Add Inventory Item
                </Button>
                <Button disabled variant="outline" className="w-full sm:w-auto opacity-50 cursor-not-allowed">
                  <Package className="mr-2 h-4 w-4" />
                  View All Orders
                </Button>
                <Button disabled variant="outline" className="w-full sm:w-auto opacity-50 cursor-not-allowed">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                <Lock className="h-3 w-3 inline mr-1" />
                Actions are disabled in demo mode. Sign up to access full features.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex flex-col 2xl:flex-row gap-6 lg:items-stretch">
          {/* Order Status Breakdown */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:flex-[0.3] min-w-0 w-full"
          >
            <Card className="flex flex-col lg:self-stretch">
              <CardHeader className="flex-shrink-0">
                <CardTitle>Order Status Breakdown</CardTitle>
                <CardDescription>
                  Current order status distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2 sm:space-y-3"
                >
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between p-2 sm:p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        Pending
                      </Badge>
                    </div>
                    <span className="text-base sm:text-lg font-semibold">
                      {demoData.orderStatusBreakdown.pending}
                    </span>
                  </motion.div>
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between p-2 sm:p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        Processing
                      </Badge>
                    </div>
                    <span className="text-base sm:text-lg font-semibold">
                      {demoData.orderStatusBreakdown.processing}
                    </span>
                  </motion.div>
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between p-2 sm:p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Fulfilled
                      </Badge>
                    </div>
                    <span className="text-base sm:text-lg font-semibold">
                      {demoData.orderStatusBreakdown.fulfilled}
                    </span>
                  </motion.div>
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between p-2 sm:p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        Cancelled
                      </Badge>
                    </div>
                    <span className="text-base sm:text-lg font-semibold">
                      {demoData.orderStatusBreakdown.cancelled}
                    </span>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:flex-[0.7] min-w-0 w-full"
          >
            <Card className="flex flex-col lg:self-stretch">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>
                      Latest orders in your system
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" disabled className="opacity-50">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {demoData.recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "fulfilled"
                                  ? "default"
                                  : order.status === "processing"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{order.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Ready to get started?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  This demo shows a preview of your dashboard. To access the full platform with real data,
                  order management, inventory tracking, and integrations, you&apos;ll need an invite code.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg">
                    <Link href="/auth/signup">
                      Get Started with Invite Code
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/auth/login">Already have an account? Sign In</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
