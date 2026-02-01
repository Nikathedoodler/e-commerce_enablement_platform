"use client";
import React from "react";
import * as motion from "motion/react-client";

const PlatformShowcase = () => {
  return (
    <section
      id="platform-showcase"
      className="w-full bg-gradient-to-b from-white via-gray-50 to-white py-20 md:py-32"
      style={{ minHeight: '100vh' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need in One Dashboard
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time insights, powerful analytics, and seamless order management—all designed to help you scale faster.
          </p>
        </motion.div>

        {/* Dashboard Feature */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-24 md:mb-32"
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full text-sm font-semibold text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Unified Dashboard</span>
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                Real-Time Order Management
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Monitor all your orders in one place. Track status, manage fulfillment, and stay on top of every shipment with instant updates and smart notifications.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Live order tracking and status updates",
                  "Automated fulfillment workflows",
                  "Multi-channel order aggregation",
                  "Smart alerts for pending actions",
                ].map((feature, idx) => (
                  <motion.li
                    key={feature}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Right: Dashboard Mockup */}
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Mock Dashboard Header */}
                <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
                    <div className="h-4 w-24 bg-white/20 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded"></div>
                    <div className="w-8 h-8 bg-white/20 rounded"></div>
                  </div>
                </div>

                {/* Mock Dashboard Content */}
                <div className="p-6 space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Total Orders", value: "1,234", change: "+12%" },
                      { label: "Pending", value: "23", change: "-5" },
                      { label: "Revenue", value: "€45K", change: "+8%" },
                      { label: "Low Stock", value: "12", change: "+3" },
                    ].map((stat, idx) => (
                      <motion.div
                        key={stat.label}
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                      >
                        <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-xs text-green-600 mt-1">{stat.change}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Mock Table */}
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-12 bg-white border-b border-gray-100 flex items-center px-4 gap-4"
                        >
                          <div className="h-3 w-24 bg-gray-200 rounded"></div>
                          <div className="h-3 w-16 bg-gray-200 rounded"></div>
                          <div className="h-3 w-20 bg-gray-200 rounded ml-auto"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-400/20 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -z-10"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Analytics Feature */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-24 md:mb-32"
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Analytics Mockup */}
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative order-2 lg:order-1"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Mock Analytics Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-5 w-40 bg-white/20 rounded"></div>
                    <div className="h-8 w-32 bg-white/20 rounded"></div>
                  </div>
                </div>

                {/* Mock Charts */}
                <div className="p-6 space-y-6">
                  {/* Chart Area */}
                  <div className="space-y-4">
                    <div className="h-48 bg-gradient-to-t from-blue-50 to-transparent rounded-lg border border-gray-200 p-4">
                      {/* Mock Line Chart */}
                      <div className="h-full flex items-end justify-between gap-2">
                        {[65, 75, 60, 85, 70, 90, 80, 95, 88, 100, 92, 105].map((height, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${height}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 + idx * 0.05 }}
                            className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                      <span>Oct</span>
                      <span>Nov</span>
                      <span>Dec</span>
                    </div>
                  </div>

                  {/* Pie Chart Mock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-32 w-32 mx-auto relative">
                        <svg viewBox="0 0 100 100" className="transform -rotate-90">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="20"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="20"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                            whileInView={{ strokeDashoffset: 2 * Math.PI * 40 * 0.3 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.8 }}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-32 w-32 mx-auto relative">
                        <svg viewBox="0 0 100 100" className="transform -rotate-90">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="20"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="20"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                            whileInView={{ strokeDashoffset: 2 * Math.PI * 40 * 0.6 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 1 }}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl -z-10"></div>
            </motion.div>

            {/* Right: Content */}
            <div className="space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-sm font-semibold text-blue-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M3 3v18h18M7 16l4-4 4 4 6-6" />
                  <path d="M7 12h10" />
                </svg>
                <span>Advanced Analytics</span>
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                Data-Driven Insights That Drive Growth
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Make smarter decisions with comprehensive analytics. Track revenue trends, monitor inventory health, analyze shipping performance, and identify opportunities to optimize your operations.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Revenue and order trend analysis",
                  "Inventory forecasting and alerts",
                  "Shipping performance metrics",
                  "Custom date range reporting",
                ].map((feature, idx) => (
                  <motion.li
                    key={feature}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <svg
                      className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Additional Features Grid */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8"
                >
                  <path d="M20 7h-4M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M4 7h16M4 7v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              ),
              title: "Inventory Management",
              description: "Real-time stock tracking with automated low-stock alerts and receiving workflows.",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              ),
              title: "AI Assistant",
              description: "Get instant answers to your questions about orders, inventory, and platform features.",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              ),
              title: "Seamless Integrations",
              description: "Connect Shopify, WooCommerce, and more with automatic order syncing.",
            },
          ].map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-gray-900 mb-4">{feature.icon}</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-all hover:scale-105 shadow-lg group"
          >
            <span>See Platform in Action</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformShowcase;
