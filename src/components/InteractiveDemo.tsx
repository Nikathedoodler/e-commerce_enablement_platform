"use client";
import React, { useState } from "react";
import * as motion from "motion/react-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trackButtonClick } from "@/lib/analytics";
import { DemoModal } from "@/components/DemoModal";

// Sample data for previews
const dashboardMetrics = [
  { label: "Total Orders", value: "1,234", change: "+12%", trend: "up" },
  { label: "Pending", value: "23", change: "-5", trend: "down" },
  { label: "Revenue", value: "€45K", change: "+8%", trend: "up" },
  { label: "Low Stock", value: "12", change: "+3", trend: "neutral" },
];

const sampleOrders = [
  { id: "ORD-001", customer: "John Doe", status: "pending", total: "€125.00", date: "Today" },
  { id: "ORD-002", customer: "Jane Smith", status: "processing", total: "€89.50", date: "Today" },
  { id: "ORD-003", customer: "Acme Corp", status: "fulfilled", total: "€450.00", date: "Yesterday" },
  { id: "ORD-004", customer: "Tech Store", status: "processing", total: "€234.99", date: "Yesterday" },
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
            <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6">
              <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto p-0">
                <TabsTrigger
                  value="dashboard"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg py-4 px-6 text-sm font-semibold"
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg py-4 px-6 text-sm font-semibold"
                >
                  Orders
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg py-4 px-6 text-sm font-semibold"
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
                  {dashboardMetrics.map((metric, idx) => (
                    <motion.div
                      key={metric.label}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
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
                  ))}
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Recent Orders</h3>
                  <div className="space-y-2">
                    {sampleOrders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200"
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
                          <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                            {order.total}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Order Actions Preview */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Quick Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      disabled
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed"
                    >
                      Create Order
                    </button>
                    <button
                      disabled
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed"
                    >
                      Generate Label
                    </button>
                    <button
                      disabled
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed"
                    >
                      Export
                    </button>
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
