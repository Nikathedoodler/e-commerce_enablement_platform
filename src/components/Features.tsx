"use client";
import Image from "next/image";
import React from "react";
import * as motion from "motion/react-client";

const Features = () => {
  const handleExploreClick = () => {
    // Scroll to the fulfillment section below
    const fulfillmentSection = document.getElementById("fulfillment-features");
    if (fulfillmentSection) {
      fulfillmentSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSeeInActionClick = () => {
    // Scroll to contact section or open demo modal
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="features"
      className="max-w-7xl mx-auto text-gray-900 flex flex-col space-y-10 py-10 px-4 sm:px-6 md:px-8 lg:px-12 scroll-mt-40"
      aria-label="Platform features and fulfillment tools"
    >
      <motion.header
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col sm:flex-row sm:justify-between space-y-6 sm:items-center text-center sm:text-left"
      >
        <div className="sm:w-3/4 lg:w-1/2 space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            Platform-Powered Fulfillment Tools
          </h1>
          <p className="sm:w-3/4 lg:w-full text-sm sm:text-base lg:text-lg text-gray-500">
            Leverage automation, real-time insights, and seamless integrations
            to optimize every order and deliver remarkable fulfillment
            experiences across Europe.
          </p>
        </div>
        <button
          onClick={handleExploreClick}
          aria-label="Explore our fulfillment tools"
          className="w-full sm:w-auto mx-auto sm:mx-0 px-6 py-3 bg-black text-white rounded-full font-semibold shadow-md shadow-black/80 hover:shadow-lg hover:shadow-green-400 transition-all duration-300 hover:scale-105 group cursor-pointer"
        >
          <span className="flex items-center gap-2">
            Explore Our Fulfillment Tools
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </span>
        </button>
      </motion.header>
      
      {/* Fulfillment Features Section */}
      <motion.article
        id="fulfillment-features"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="w-full rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 mb-8 bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8 shadow-2xl hover:shadow-3xl transition-shadow duration-300"
      >
        {/* Left: Title and CTA */}
        <div className="flex-1 flex flex-col gap-4 sm:gap-5 text-white text-center lg:text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl font-bold leading-tight text-white">
            Grow Beyond Borders With Advanced Fulfillment
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-base xl:text-lg text-gray-100 leading-relaxed">
            Our unified platform brings together live order tracking, inventory
            intelligence, fast EU shipping, and cost-saving automations—all in
            one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 justify-center lg:justify-start">
            <button
              onClick={handleSeeInActionClick}
              aria-label="See fulfillment platform in action"
              className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-300 w-full sm:w-auto cursor-pointer transform hover:scale-105"
            >
              See Fulfillment in Action
            </button>
          </div>
        </div>
        
        {/* Right: Integration Cards */}
        <div className="flex-1 w-full flex flex-col sm:flex-row gap-4 lg:gap-5">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex-1 min-w-[180px] bg-gray-800/90 backdrop-blur-sm rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-lg items-center sm:items-start text-center sm:text-left hover:bg-gray-700/90 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group border border-gray-700/50"
          >
            <div>
              <div className="w-12 h-12 mb-3 rounded-lg bg-white/25 flex items-center justify-center mx-auto sm:mx-0 p-2 group-hover:bg-white/35 transition-colors duration-300">
                <Image
                  src="/images/Shopify_logo.svg.png"
                  alt="Shopify integration logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-base mb-2 text-white">Shopify Integration</h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                Seamlessly sync your store for automatic order flow and status
                updates.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex-1 min-w-[180px] bg-gray-800/90 backdrop-blur-sm rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-lg items-center sm:items-start text-center sm:text-left hover:bg-gray-700/90 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group border border-gray-700/50"
          >
            <div>
              <div className="w-12 h-12 mb-3 rounded-lg bg-white/25 flex items-center justify-center mx-auto sm:mx-0 p-2 group-hover:bg-white/35 transition-colors duration-300">
                <Image
                  src="/images/dhl.png"
                  alt="DHL carrier network logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-semibold text-base mb-2 text-white">DHL/Carrier Network</h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                Access express shipping across Europe through established
                carrier partnerships.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex-1 min-w-[180px] bg-gray-800/90 backdrop-blur-sm rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-lg items-center sm:items-start text-center sm:text-left hover:bg-gray-700/90 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group border border-gray-700/50"
          >
            <div>
              <div className="w-12 h-12 mb-3 rounded-lg bg-white/25 flex items-center justify-center mx-auto sm:mx-0 group-hover:bg-white/35 transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-white"
                  aria-hidden="true"
                >
                  <path d="M22 10v6M2 10l10-5 10 5M2 10l10 5 10-5M2 10v6c0 1.1.9 2 2 2h4M22 10v6c0 1.1-.9 2-2 2h-4M12 22V12" />
                </svg>
              </div>
              <h3 className="font-semibold text-base mb-2 text-white">Kutaisi FIZ Warehouse</h3>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                Centralized fulfillment from our strategic location in
                Kutaisi, Georgia for cost-efficient EU operations.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.article>
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
