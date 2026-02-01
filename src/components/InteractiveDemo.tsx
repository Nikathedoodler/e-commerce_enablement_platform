"use client";
import React, { useState } from "react";
import * as motion from "motion/react-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trackButtonClick } from "@/lib/analytics";
import { DemoModal } from "@/components/DemoModal";
import { Package, Warehouse, ArrowDownToLine, Truck, Settings2, BarChart3, ShoppingCart } from "lucide-react";

// Sample data for previews
const dashboardMetrics = [
  { label: "Total Orders", value: "1,234", change: "+12%", trend: "up", icon: ShoppingCart },
  { label: "Pending", value: "23", change: "-5", trend: "down", icon: Package },
  { label: "Revenue", value: "€45K", change: "+8%", trend: "up", icon: BarChart3 },
  { label: "Low Stock", value: "12", change: "+3", trend: "neutral", icon: Warehouse },
];

const sampleOrders = [
  { id: "ORD-001", customer: "John Doe", status: "pending", total: "€125.00", date: "Today", items: 2 },
  { id: "ORD-002", customer: "Jane Smith", status: "processing", total: "€89.50", date: "Today", items: 1, tracking: "DHL123456789" },
  { id: "ORD-003", customer: "Acme Corp", status: "fulfilled", total: "€450.00", date: "Yesterday", items: 5, tracking: "DHL987654321" },
  { id: "ORD-004", customer: "Tech Store", status: "processing", total: "€234.99", date: "Yesterday", items: 3 },
];

const sampleInventory = [
  { sku: "TSHIRT-BLUE-M", name: "Blue T-Shirt Medium", quantity: 45, threshold: 20, status: "in_stock" },
  { sku: "HOODIE-RED-L", name: "Red Hoodie Large", quantity: 12, threshold: 15, status: "low_stock" },
  { sku: "JEANS-BLACK-32", name: "Black Jeans 32", quantity: 8, threshold: 10, status: "low_stock" },
  { sku: "SHOES-WHITE-42", name: "White Sneakers 42", quantity: 25, threshold: 20, status: "in_stock" },
];

const sampleReceiving = [
  { sku: "TSHIRT-BLUE-M", name: "Blue T-Shirt Medium", quantity: 50, condition: "good", date: "2 hours ago" },
  { sku: "HOODIE-RED-L", name: "Red Hoodie Large", quantity: 30, condition: "good", date: "5 hours ago" },
  { sku: "JEANS-BLACK-32", name: "Black Jeans 32", quantity: 5, condition: "damaged", date: "Yesterday" },
];

const chartData = [
  { day: "Mon", orders: 45, revenue: 1200 },
  { day: "Tue", orders: 52, revenue: 1450 },
  { day: "Wed", orders: 48, revenue: 1350 },
  { day: "Thu", orders: 61, revenue: 1800 },
  { day: "Fri", orders: 55, revenue: 1650 },
  { day: "Sat", orders: 38, revenue: 1100 },
  { day: "Sun", orders: 42, revenue: 1250 },
];

const InteractiveDemo = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    trackButtonClick(`demo_tab_${value}`, "interactive_demo", {
      tab_name: value,
    });
  };

  const handleOpenFullDemo = () => {
    setDemoModalOpen(true);
    trackButtonClick("open_full_demo", "interactive_demo", {
      source: "interactive_preview",
    });
  };

  return (
    <section
      id="interactive-demo"
      className="w-full bg-gradient-to-b from-gray-50 to-white py-20 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            See How It Works
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Explore key features with our interactive preview. Click through different sections to see how the platform works.
          </p>
        </motion.div>

        {/* Interactive Preview */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 overflow-x-auto">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-transparent h-auto p-0 min-w-[600px]">
                <TabsTrigger
                  value="dashboard"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg py-3 px-4 text-xs md:text-sm font-semibold whitespace-nowrap"
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg py-3 px-4 text-xs md:text-sm font-semibold whitespace-nowrap"
                >
                  Orders
                </TabsTrigger>
                <TabsTrigger
                  value="inventory"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg py-3 px-4 text-xs md:text-sm font-semibold whitespace-nowrap"
                >
                  Inventory
                </TabsTrigger>
                <TabsTrigger
                  value="receiving"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg py-3 px-4 text-xs md:text-sm font-semibold whitespace-nowrap"
                >
                  Receiving
                </TabsTrigger>
                <TabsTrigger
                  value="shipping"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg py-3 px-4 text-xs md:text-sm font-semibold whitespace-nowrap"
                >
                  Shipping
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg py-3 px-4 text-xs md:text-sm font-semibold whitespace-nowrap"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="p-6 md:p-8 m-0">
              <div className="space-y-6">
                {/* Metrics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {dashboardMetrics.map((metric, idx) => {
                    const Icon = metric.icon;
                    return (
                      <motion.div
                        key={metric.label}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs text-gray-500">{metric.label}</div>
                          <Icon className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                          {metric.value}
                        </div>
                        <div
                          className={`text-xs font-semibold ${
                            metric.trend === "up"
                              ? "text-green-600"
                              : metric.trend === "down"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {metric.change}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">Today's Orders</div>
                    <div className="text-xl font-bold text-gray-900">23</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="text-xs text-gray-600 mb-1">Fulfillment Rate</div>
                    <div className="text-xl font-bold text-gray-900">98.5%</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="text-xs text-gray-600 mb-1">Avg Processing</div>
                    <div className="text-xl font-bold text-gray-900">2.3h</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <div className="text-xs text-gray-600 mb-1">Labels Today</div>
                    <div className="text-xl font-bold text-gray-900">18</div>
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Recent Orders
                  </h3>
                  <div className="space-y-2">
                    {sampleOrders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{order.id}</div>
                          <div className="text-xs text-gray-500">{order.customer}</div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {order.status}
                          </span>
                          <div className="text-sm font-semibold text-gray-900 mt-1">
                            {order.total}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Features Overview */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Platform Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Shopify Integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">DHL Shipping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600">Real-time Updates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-600">Analytics & Reports</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="p-6 md:p-8 m-0">
              <div className="space-y-4">
                {/* Orders Table Preview */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Order #
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Customer
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Items
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleOrders.map((order, idx) => (
                        <motion.tr
                          key={order.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {order.id}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{order.customer}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{order.items} items</td>
                          <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                            {order.total}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Order Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Order Management
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Create orders manually or via Shopify</li>
                      <li>• Update order status (pending → processing → fulfilled)</li>
                      <li>• Track order history and changes</li>
                      <li>• Filter by status, date, customer</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Shipping Integration
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Generate DHL shipping labels</li>
                      <li>• Automatic label generation</li>
                      <li>• Track shipments with tracking numbers</li>
                      <li>• Export orders to CSV</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="p-6 md:p-8 m-0">
              <div className="space-y-4">
                {/* Inventory Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">Total SKUs</div>
                    <div className="text-2xl font-bold text-gray-900">247</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border border-orange-200">
                    <div className="text-xs text-gray-600 mb-1">Low Stock</div>
                    <div className="text-2xl font-bold text-gray-900">12</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-200">
                    <div className="text-xs text-gray-600 mb-1">In Stock</div>
                    <div className="text-2xl font-bold text-gray-900">235</div>
                  </div>
                </div>

                {/* Inventory Table Preview */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Warehouse className="w-4 h-4" />
                    Inventory Items
                  </h3>
                  <div className="space-y-2">
                    {sampleInventory.map((item, idx) => (
                      <motion.div
                        key={item.sku}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{item.sku}</div>
                          <div className="text-xs text-gray-500">{item.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            Qty: {item.quantity}
                          </div>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${
                              item.status === "low_stock"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {item.status === "low_stock" ? "Low Stock" : "In Stock"}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Inventory Features */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✅ Add, edit, and delete inventory items</li>
                    <li>✅ Low stock alerts with customizable thresholds</li>
                    <li>✅ Search by SKU or product name</li>
                    <li>✅ Automatic updates from receiving workflow</li>
                    <li>✅ Location tracking and organization</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Receiving Tab */}
            <TabsContent value="receiving" className="p-6 md:p-8 m-0">
              <div className="space-y-4">
                {/* Receiving Form Preview */}
                <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ArrowDownToLine className="w-4 h-4" />
                    Log Receiving
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">SKU</label>
                      <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-400">
                        Enter SKU...
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Quantity</label>
                      <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-400">
                        0
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Condition</label>
                      <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-400">
                        Good
                      </div>
                    </div>
                  </div>
                  <button
                    disabled
                    className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium cursor-not-allowed opacity-50"
                  >
                    Log Receiving
                  </button>
                </div>

                {/* Receiving History */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Recent Receiving Logs</h3>
                  <div className="space-y-2">
                    {sampleReceiving.map((log, idx) => (
                      <motion.div
                        key={`${log.sku}-${idx}`}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{log.sku}</div>
                          <div className="text-xs text-gray-500">{log.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            Qty: {log.quantity}
                          </div>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${
                              log.condition === "good"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {log.condition}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">{log.date}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Receiving Features */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Automated Workflow</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✅ Automatic inventory updates for "good" condition items</li>
                    <li>✅ Create new SKUs automatically when receiving</li>
                    <li>✅ Track damaged, defective, and returned items separately</li>
                    <li>✅ Complete audit trail of all receiving operations</li>
                    <li>✅ Search and filter receiving history</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Shipping Tab */}
            <TabsContent value="shipping" className="p-6 md:p-8 m-0">
              <div className="space-y-4">
                {/* Shipping Labels Preview */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Shipping Labels
                  </h3>
                  <div className="space-y-3">
                    {sampleOrders
                      .filter((o) => o.tracking)
                      .map((order, idx) => (
                        <motion.div
                          key={order.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                          className="bg-white rounded-lg p-4 border border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm text-gray-900">{order.id}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Tracking: {order.tracking}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-900">
                                {order.total}
                              </div>
                              <button
                                disabled
                                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium cursor-not-allowed opacity-50"
                              >
                                Download Label
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>

                {/* Shipping Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-2">DHL Integration</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Express Worldwide</li>
                      <li>• Express 12:00</li>
                      <li>• Economy Select</li>
                      <li>• Express Envelope</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Auto-Generation</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Generate when order status changes</li>
                      <li>• Auto-generate for Shopify orders</li>
                      <li>• Default package settings</li>
                      <li>• Complete audit log</li>
                    </ul>
                  </div>
                </div>

                {/* Shipping Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">Labels Generated</div>
                    <div className="text-2xl font-bold text-gray-900">1,847</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-200">
                    <div className="text-xs text-gray-600 mb-1">Success Rate</div>
                    <div className="text-2xl font-bold text-gray-900">99.2%</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border border-purple-200">
                    <div className="text-xs text-gray-600 mb-1">Avg Cost</div>
                    <div className="text-2xl font-bold text-gray-900">€12.50</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="p-6 md:p-8 m-0">
              <div className="space-y-6">
                {/* Chart Preview */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Order Volume Over Time</h3>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {chartData.map((data, idx) => (
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
                        <div className="text-xs text-gray-600 font-medium">{data.day}</div>
                        <div className="text-xs text-gray-500">{data.orders}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">Total Revenue</div>
                    <div className="text-xl font-bold text-gray-900">€9,750</div>
                    <div className="text-xs text-green-600 font-semibold mt-1">+15%</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-200">
                    <div className="text-xs text-gray-600 mb-1">Avg Order</div>
                    <div className="text-xl font-bold text-gray-900">€178</div>
                    <div className="text-xs text-green-600 font-semibold mt-1">+5%</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border border-purple-200">
                    <div className="text-xs text-gray-600 mb-1">Fulfillment Rate</div>
                    <div className="text-xl font-bold text-gray-900">98.5%</div>
                    <div className="text-xs text-green-600 font-semibold mt-1">+2%</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border border-orange-200">
                    <div className="text-xs text-gray-600 mb-1">Processing Time</div>
                    <div className="text-xl font-bold text-gray-900">2.3h</div>
                    <div className="text-xs text-red-600 font-semibold mt-1">-10%</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleOpenFullDemo}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all hover:scale-105 shadow-lg group"
            >
              <span>See Full Demo</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
            <p className="text-sm text-gray-500">
              or{" "}
              <a href="#contact" className="text-gray-900 font-semibold underline">
                contact us
              </a>{" "}
              for a personalized demo.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Full Demo Modal */}
      <DemoModal open={demoModalOpen} onOpenChange={setDemoModalOpen} />
    </section>
  );
};

export default InteractiveDemo;
