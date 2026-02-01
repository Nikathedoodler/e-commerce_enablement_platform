"use client";
import Image from "next/image";
import React from "react";
import * as motion from "motion/react-client";

const Features = () => {
  return (
    <section
      id="features"
      className="max-w-7xl mx-auto text-gray-900 flex flex-col space-y-10 py-10 px-4 sm:px-6 md:px-8 lg:px-12 scroll-mt-40"
      aria-label="Platform features and fulfillment tools"
    >
      {/* Available Features */}
      <motion.section
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="w-full bg-gray-100 rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl"
        aria-label="Available platform features"
      >
        <header>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Available Features</h2>
        </header>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center lg:items-start space-y-2 bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-lg hover:-translate-y-2 hover:-translate-x-2 duration-300 hover:shadow-xl hover:bg-pink-50 cursor-pointer transition-all group"
          >
            <Image
              alt="Real-time order tracking icon"
              src="/images/tracking.png"
              className="h-8 sm:h-10 lg:h-12 w-auto group-hover:scale-110 transition-transform duration-300"
              width={32}
              height={16}
            />
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-center lg:text-start">
              Real-time order tracking
            </h3>
            <p className="hidden xl:block text-sm text-gray-600 leading-relaxed">
              Instant updates on your order&apos;s status and location, giving full
              transparency through every step of fulfillment.
            </p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center lg:items-start space-y-2 bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-lg hover:-translate-y-2 hover:translate-x-2 duration-300 hover:shadow-xl hover:bg-pink-50 cursor-pointer transition-all group"
          >
            <Image
              alt="Warehouse inventory dashboard icon"
              src="/images/warehouse_inventory.png"
              className="h-8 sm:h-10 lg:h-12 w-auto group-hover:scale-110 transition-transform duration-300"
              width={32}
              height={16}
            />
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-center lg:text-start">
              Warehouse inventory dashboard
            </h3>
            <p className="hidden xl:block text-sm text-gray-600 leading-relaxed">
              Live overview of stock levels and product movement to prevent
              shortages and streamline restocking.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center lg:items-start space-y-2 bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-lg hover:-translate-y-2 hover:-translate-x-2 duration-300 hover:shadow-xl hover:bg-pink-50 cursor-pointer transition-all group"
          >
            <Image
              alt="Fast EU delivery icon"
              src="/images/fast-delivery-icon.webp"
              className="h-8 sm:h-10 lg:h-12 w-auto group-hover:scale-110 transition-transform duration-300"
              width={32}
              height={16}
            />
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-center lg:text-start">
              Fast EU delivery
            </h3>
            <p className="hidden xl:block text-sm text-gray-600 leading-relaxed">
              Reliable 2-3 day shipping across Europe, optimized for speed and
              cost-efficiency from tax-advantaged warehouses.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center lg:items-start space-y-2 bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-lg hover:-translate-y-2 hover:translate-x-2 duration-300 hover:shadow-xl hover:bg-pink-50 cursor-pointer transition-all group"
          >
            <Image
              alt="Real-time inventory alerts icon"
              src="/images/inventory_alert.png"
              className="h-8 sm:h-10 lg:h-12 w-auto group-hover:scale-110 transition-transform duration-300"
              width={32}
              height={16}
            />
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-center lg:text-start">
              Real-Time Inventory Alerts
            </h3>
            <p className="hidden xl:block text-sm text-gray-600 leading-relaxed">
              Proactive notifications and restock recommendations to prevent
              out-of-stock situations and improve sales velocity.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col items-center lg:items-start space-y-2 bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-lg hover:-translate-y-2 hover:translate-x-2 duration-300 hover:shadow-xl hover:bg-pink-50 cursor-pointer transition-all group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 sm:h-10 lg:h-12 w-8 sm:w-10 lg:w-12 text-gray-700 group-hover:scale-110 transition-transform duration-300"
              aria-hidden="true"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-center lg:text-start">
              AI Assistant
            </h3>
            <p className="hidden xl:block text-sm text-gray-600 leading-relaxed">
              Get instant help with your fulfillment operations, order management,
              and platform features through our intelligent AI assistant.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col items-center lg:items-start space-y-2 bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-lg hover:-translate-y-2 hover:-translate-x-2 duration-300 hover:shadow-xl hover:bg-pink-50 cursor-pointer transition-all group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 sm:h-10 lg:h-12 w-8 sm:w-10 lg:w-12 text-gray-700 group-hover:scale-110 transition-transform duration-300"
              aria-hidden="true"
            >
              <path d="M20 7h-4M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M4 7h16M4 7v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-center lg:text-start">
              Receiving & Warehouse Intake
            </h3>
            <p className="hidden xl:block text-sm text-gray-600 leading-relaxed">
              Streamlined receiving workflow with barcode scanning support to
              log incoming inventory and automatically update stock levels.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col items-center lg:items-start space-y-2 bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-lg hover:-translate-y-2 hover:translate-x-2 duration-300 hover:shadow-xl hover:bg-pink-50 cursor-pointer transition-all group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 sm:h-10 lg:h-12 w-8 sm:w-10 lg:w-12 text-gray-700 group-hover:scale-110 transition-transform duration-300"
              aria-hidden="true"
            >
              <path d="M3 3v18h18M7 16l4-4 4 4 6-6" />
              <path d="M7 12h10" />
            </svg>
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-center lg:text-start">
              Advanced Analytics & Reporting
            </h3>
            <p className="hidden xl:block text-sm text-gray-600 leading-relaxed">
              Comprehensive dashboards with order trends, revenue analytics,
              inventory insights, and shipping performance metrics.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col items-center lg:items-start space-y-2 bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-lg hover:-translate-y-2 hover:-translate-x-2 duration-300 hover:shadow-xl hover:bg-pink-50 cursor-pointer transition-all group relative"
          >
            <Image
              alt="Custom packing solutions icon"
              src="/images/package.png"
              className="h-8 sm:h-10 lg:h-12 w-auto group-hover:scale-110 transition-transform duration-300"
              width={32}
              height={16}
            />
            <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start">
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-center lg:text-start">
                Custom Packing Solutions
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                Coming Soon
              </span>
            </div>
            <p className="hidden xl:block text-sm text-gray-600 leading-relaxed">
              Choose branded, sustainable, or protective packaging for your
              products, tailored per SKU and order type.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </section>
  );
};

export default Features;
