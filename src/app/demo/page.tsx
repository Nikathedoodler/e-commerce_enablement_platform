"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Package,
  Warehouse,
  TrendingUp,
  Lock,
  ShoppingCart,
  BarChart3,
  ArrowDownToLine,
  Truck,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

// Comprehensive demo data
const demoData = {
  dashboard: {
    ordersToday: 23,
    revenueToday: 2847.50,
    pendingShipments: 8,
    lowStockItems: 12,
    fulfillmentRate: 98.5,
    avgProcessingTime: "2.3h",
  },
  orders: [
    {
      id: "ORD-001",
      customer: "John Doe",
      email: "john@example.com",
      status: "pending",
      total: 125.00,
      items: 2,
      date: "Today",
      source: "Manual",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      email: "jane@example.com",
      status: "processing",
      total: 89.50,
      items: 1,
      date: "Today",
      source: "Shopify",
      tracking: "DHL123456789",
    },
    {
      id: "ORD-003",
      customer: "Acme Corp",
      email: "orders@acme.com",
      status: "fulfilled",
      total: 450.00,
      items: 5,
      date: "Yesterday",
      source: "Shopify",
      tracking: "DHL987654321",
    },
    {
      id: "ORD-004",
      customer: "Tech Store",
      email: "info@techstore.com",
      status: "processing",
      total: 234.99,
      items: 3,
      date: "Yesterday",
      source: "Manual",
    },
    {
      id: "ORD-005",
      customer: "Retail Co",
      email: "sales@retail.com",
      status: "pending",
      total: 67.25,
      items: 1,
      date: "2 days ago",
      source: "Shopify",
    },
  ],
  inventory: [
    {
      sku: "TSHIRT-BLUE-M",
      name: "Blue T-Shirt Medium",
      quantity: 45,
      threshold: 20,
      status: "in_stock",
      location: "Aisle 3, Shelf B",
    },
    {
      sku: "HOODIE-RED-L",
      name: "Red Hoodie Large",
      quantity: 12,
      threshold: 15,
      status: "low_stock",
      location: "Aisle 5, Shelf A",
    },
    {
      sku: "JEANS-BLACK-32",
      name: "Black Jeans 32",
      quantity: 8,
      threshold: 10,
      status: "low_stock",
      location: "Aisle 2, Shelf C",
    },
    {
      sku: "SHOES-WHITE-42",
      name: "White Sneakers 42",
      quantity: 25,
      threshold: 20,
      status: "in_stock",
      location: "Aisle 1, Shelf D",
    },
    {
      sku: "JACKET-GREEN-XL",
      name: "Green Jacket XL",
      quantity: 5,
      threshold: 10,
      status: "low_stock",
      location: "Aisle 4, Shelf B",
    },
  ],
  receiving: [
    {
      sku: "TSHIRT-BLUE-M",
      name: "Blue T-Shirt Medium",
      quantity: 50,
      condition: "good",
      date: "2 hours ago",
      location: "Aisle 3, Shelf B",
    },
    {
      sku: "HOODIE-RED-L",
      name: "Red Hoodie Large",
      quantity: 30,
      condition: "good",
      date: "5 hours ago",
      location: "Aisle 5, Shelf A",
    },
    {
      sku: "JEANS-BLACK-32",
      name: "Black Jeans 32",
      quantity: 5,
      condition: "damaged",
      date: "Yesterday",
      location: "Aisle 2, Shelf C",
    },
    {
      sku: "SHOES-WHITE-42",
      name: "White Sneakers 42",
      quantity: 20,
      condition: "good",
      date: "Yesterday",
      location: "Aisle 1, Shelf D",
    },
  ],
  shipping: [
    {
      orderId: "ORD-002",
      tracking: "DHL123456789",
      status: "in_transit",
      cost: 12.50,
      service: "Express Worldwide",
      estimatedDelivery: "Jan 15, 2025",
    },
    {
      orderId: "ORD-003",
      tracking: "DHL987654321",
      status: "delivered",
      cost: 15.75,
      service: "Express Worldwide",
      estimatedDelivery: "Jan 12, 2025",
    },
  ],
  analytics: {
    chartData: [
      { day: "Mon", orders: 45, revenue: 1200 },
      { day: "Tue", orders: 52, revenue: 1450 },
      { day: "Wed", orders: 48, revenue: 1350 },
      { day: "Thu", orders: 61, revenue: 1800 },
      { day: "Fri", orders: 55, revenue: 1650 },
      { day: "Sat", orders: 38, revenue: 1100 },
      { day: "Sun", orders: 42, revenue: 1250 },
    ],
    stats: {
      totalRevenue: 9750,
      avgOrder: 178,
      fulfillmentRate: 98.5,
      processingTime: "2.3h",
    },
  },
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

export default function DemoDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 text-center text-sm sticky top-0 z-10">
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

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Platform Demo</h1>
            <p className="text-muted-foreground mt-1">
              Explore all features with interactive previews
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Interactive Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-muted h-auto p-1 mb-6">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4 text-xs md:text-sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2 hidden sm:inline" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4 text-xs md:text-sm"
            >
              <Package className="w-4 h-4 mr-2 hidden sm:inline" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4 text-xs md:text-sm"
            >
              <Warehouse className="w-4 h-4 mr-2 hidden sm:inline" />
              Inventory
            </TabsTrigger>
            <TabsTrigger
              value="receiving"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4 text-xs md:text-sm"
            >
              <ArrowDownToLine className="w-4 h-4 mr-2 hidden sm:inline" />
              Receiving
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4 text-xs md:text-sm"
            >
              <Truck className="w-4 h-4 mr-2 hidden sm:inline" />
              Shipping
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4 text-xs md:text-sm"
            >
              <BarChart3 className="w-4 h-4 mr-2 hidden sm:inline" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Metrics Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardDescription>Orders Today</CardDescription>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{demoData.dashboard.ordersToday}</div>
                    <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardDescription>Revenue Today</CardDescription>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${demoData.dashboard.revenueToday.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">+8% from yesterday</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardDescription>Pending Shipments</CardDescription>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{demoData.dashboard.pendingShipments}</div>
                    <p className="text-xs text-muted-foreground">Ready to ship</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardDescription>Low Stock Items</CardDescription>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{demoData.dashboard.lowStockItems}</div>
                    <p className="text-xs text-muted-foreground">Need restocking</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Fulfillment Rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{demoData.dashboard.fulfillmentRate}%</div>
                  <p className="text-xs text-green-600">+2% this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Avg Processing Time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{demoData.dashboard.avgProcessingTime}</div>
                  <p className="text-xs text-green-600">-10% faster</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total SKUs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">247</div>
                  <p className="text-xs text-muted-foreground">Active products</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Labels Generated</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,847</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders in your system</CardDescription>
              </CardHeader>
              <CardContent>
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
                      {demoData.orders.slice(0, 5).map((order) => (
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
                          <TableCell className="text-right">
                            ${order.total.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order Management</CardTitle>
                    <CardDescription>
                      Manage orders from Shopify and manual entries
                    </CardDescription>
                  </div>
                  <Button disabled variant="outline" size="sm" className="opacity-50">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Order
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {demoData.orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customer}</div>
                              <div className="text-xs text-muted-foreground">{order.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{order.source}</Badge>
                          </TableCell>
                          <TableCell>{order.items} items</TableCell>
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
                          <TableCell className="text-right">
                            ${order.total.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Create orders manually or sync from Shopify</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Update order status (pending → processing → fulfilled)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Generate shipping labels automatically</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Track shipments with DHL integration</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Order Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
                    <span className="font-semibold">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-800">Fulfilled</Badge>
                    <span className="font-semibold">24</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total SKUs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">247</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Low Stock Items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">12</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>In Stock</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">235</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Inventory Items</CardTitle>
                    <CardDescription>Manage your product inventory</CardDescription>
                  </div>
                  <Button disabled variant="outline" size="sm" className="opacity-50">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Threshold</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {demoData.inventory.map((item) => (
                        <TableRow key={item.sku}>
                          <TableCell className="font-medium">{item.sku}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.threshold}</TableCell>
                          <TableCell>
                            <Badge
                              variant={item.status === "low_stock" ? "destructive" : "default"}
                            >
                              {item.status === "low_stock" ? "Low Stock" : "In Stock"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {item.location}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Add, edit, and delete inventory items</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Low stock alerts with customizable thresholds</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Search by SKU or product name</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Automatic updates from receiving workflow</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Location tracking and organization</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Receiving Tab */}
          <TabsContent value="receiving" className="space-y-6">
            <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownToLine className="h-5 w-5" />
                  Log Receiving
                </CardTitle>
                <CardDescription>Log incoming inventory and update stock levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">SKU</label>
                    <div className="h-10 bg-background border rounded-md px-3 flex items-center text-muted-foreground">
                      Enter SKU...
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Quantity</label>
                    <div className="h-10 bg-background border rounded-md px-3 flex items-center text-muted-foreground">
                      0
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Condition</label>
                    <div className="h-10 bg-background border rounded-md px-3 flex items-center text-muted-foreground">
                      Good
                    </div>
                  </div>
                </div>
                <Button disabled className="mt-4 opacity-50">
                  Log Receiving
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receiving History</CardTitle>
                <CardDescription>Recent receiving log entries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demoData.receiving.map((log, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{log.sku}</div>
                        <div className="text-sm text-muted-foreground">{log.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{log.location}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">Qty: {log.quantity}</div>
                        <Badge
                          variant={log.condition === "good" ? "default" : "destructive"}
                          className="mt-1"
                        >
                          {log.condition}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">{log.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automated Workflow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Automatic inventory updates for &quot;good&quot; condition items</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Create new SKUs automatically when receiving</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Track damaged, defective, and returned items separately</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Complete audit trail of all receiving operations</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Tab */}
          <TabsContent value="shipping" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Labels Generated</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,847</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Success Rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">99.2%</div>
                  <p className="text-xs text-muted-foreground">Label generation</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Avg Cost</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12.50</div>
                  <p className="text-xs text-muted-foreground">Per shipment</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Labels</CardTitle>
                <CardDescription>DHL Express integration for shipping</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoData.shipping.map((label) => (
                    <div
                      key={label.tracking}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">Order {label.orderId}</div>
                        <div className="text-sm text-muted-foreground">
                          Tracking: {label.tracking}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Service: {label.service} • Est. Delivery: {label.estimatedDelivery}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${label.cost.toFixed(2)}</div>
                        <Badge
                          variant={label.status === "delivered" ? "default" : "secondary"}
                          className="mt-1"
                        >
                          {label.status}
                        </Badge>
                        <Button disabled variant="outline" size="sm" className="mt-2 opacity-50">
                          Download Label
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>DHL Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Express Worldwide</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Express 12:00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Economy Select</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Express Envelope</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Auto-Generation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Generate when order status changes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Auto-generate for Shopify orders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Default package settings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Complete audit log</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${demoData.analytics.stats.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-green-600">+15% this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Avg Order Value</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${demoData.analytics.stats.avgOrder}</div>
                  <p className="text-xs text-green-600">+5% this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Fulfillment Rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{demoData.analytics.stats.fulfillmentRate}%</div>
                  <p className="text-xs text-green-600">+2% this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Processing Time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{demoData.analytics.stats.processingTime}</div>
                  <p className="text-xs text-red-600">-10% faster</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order Volume Over Time</CardTitle>
                <CardDescription>Weekly order trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {demoData.analytics.chartData.map((data, idx) => (
                    <motion.div
                      key={data.day}
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t flex-1 flex items-end">
                        <div
                          className="w-full bg-blue-600 rounded-t"
                          style={{
                            height: `${(data.orders / 65) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">{data.day}</div>
                      <div className="text-xs text-muted-foreground">{data.orders}</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analytics Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Order trends and revenue analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Fulfillment performance metrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Inventory status and low stock alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Shipping cost analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Receiving trends and quality metrics</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
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
