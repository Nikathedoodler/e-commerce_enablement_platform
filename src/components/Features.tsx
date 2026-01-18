import Image from "next/image";
import React from "react";
import * as motion from "motion/react-client";

const Features = () => {
  return (
    <div
      id="features"
      className="max-w-7xl mx-auto text-gray-900 flex flex-col space-y-10 py-10 px-4 sm:px-6 md:px-8 lg:px-12 scroll-mt-40"
    >
      <motion.div
        // initial={{ y: 30, opacity: 0 }}
        // whileInView={{ y: 0, opacity: 1 }}
        // transition={{ duration: 1, delay: 1 }}
        className="flex flex-col sm:flex-row sm:justify-between space-y-6 sm:items-center text-center"
      >
        <div className="sm:w-3/4 lg:w-1/2 space-y-4">
          <h1 className="text-2xl sm:text-lg lg:text-xl sm:text-start font-bold mb-2">
            Platform-Powered Fulfillment Tools
          </h1>
          <p className="sm:w-3/4 lg:w-full text-sm lg:text-md sm:text-start text-gray-500">
            Leverage automation, real-time insights, and seamless integrations
            to optimize every order and deliver remarkable fulfillment
            experiences across Europe
          </p>
        </div>
        <button className="w-full sm:w-auto mx-auto sm:mx-0 px-4 py-2 bg-black text-white rounded-full font-semibold shadow-md shadow-black/80 hover:shadow-md hover:shadow-green-400 transition-all duration-200 hover:scale-110 group cursor-pointer">
          Explore Our Fulfillment Tools
        </button>
      </motion.div>
      {/* New Section: Cutting-edge AI models */}
      <motion.div
        // initial={{ y: 0, opacity: 0 }}
        // whileInView={{ y: 0, opacity: 1 }}
        // transition={{ duration: 0.6, delay: 0.8 }}
        className="w-full rounded-2xl p-4 sm:p-6 md:p-8 md:pr-0 mb-8 bg-gradient-to-r from-black via-gray-900 to-gray-400 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl"
      >
        {/* Left: Title and Buttons */}
        <div className="flex-1 flex flex-col gap-3 sm:gap-4 text-white text-center md:text-left">
          <h2 className="text-start text-xl sm:text-2xl md:text-2xl lg:text-lg xl:text-xl font-bold">
            Grow Beyond Borders With Advanced Fulfillment
          </h2>
          <p className="text-sm text-start sm:text-base md:text-base lg:text-sm xl:text-sm opacity-80">
            Our unified platform brings together live order tracking, inventory
            intelligence, fast EU shipping, and cost-saving automations—all in
            one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 justify-center md:justify-start">
            <button className="bg-white text-[#1e1a5a] font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition w-full sm:w-auto cursor-pointer">
              See Fulfillment in Action
            </button>
          </div>
        </div>
        {/* Right: AI Model Cards */}
        <div className="flex-1 w-full flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-[180px] bg-white/10 rounded-xl p-4 flex flex-col justify-between shadow items-center sm:items-start text-center sm:text-left">
            <div>
              <div className="w-10 h-10 mb-2 rounded-lg bg-white/20 flex items-center justify-center mx-auto sm:mx-0 p-1.5">
                <Image
                  src="/images/Shopify_logo.svg.png"
                  alt="Shopify"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="font-semibold">Shopify Integration</div>
              <div className="text-xs opacity-80">
                Seamlessly sync your store for automatic order flow and status
                updates.
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-[180px] bg-white/10 rounded-xl p-4 flex flex-col justify-between shadow items-center sm:items-start text-center sm:text-left">
            <div>
              <div className="w-10 h-10 mb-2 rounded-lg bg-white/20 flex items-center justify-center mx-auto sm:mx-0 p-1.5">
                <Image
                  src="/images/dhl.png"
                  alt="DHL"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="font-semibold">DHL/Carrier Network</div>
              <div className="text-xs opacity-80">
                Access express shipping across Europe through established
                carrier partnerships.
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-[180px] bg-white/10 rounded-xl p-4 flex flex-col justify-between shadow items-center sm:items-start text-center sm:text-left fade-right">
            <div>
              <div className="w-10 h-10 mb-2 rounded-lg bg-white/20 flex items-center justify-center mx-auto sm:mx-0">
                {/* Warehouse icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-white"
                >
                  <path d="M22 10v6M2 10l10-5 10 5M2 10l10 5 10-5M2 10v6c0 1.1.9 2 2 2h4M22 10v6c0 1.1-.9 2-2 2h-4M12 22V12" />
                </svg>
              </div>
              <div className="font-semibold">Kutaisi FIZ Warehouse</div>
              <div className="text-xs opacity-80">
                Centralized fulfillment from our strategic EU location in
                Kutaisi, Georgia for cost-efficient operations.
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Available Features */}
      <motion.div
        // initial={{ y: 30, opacity: 0 }}
        // whileInView={{ y: 0, opacity: 1 }}
        // transition={{ duration: 1, delay: 1 }}
        className="w-full bg-gray-100 rounded-xl p-4 sm:p-6 shadow-2xl"
      >
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Available Features</h1>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6">
          <div className="flex flex-col items-center lg:items-start space-y-2 bg-gray-100 rounded-xl p-3 sm:p-4 md:p-6 shadow-xl hover:-translate-y-2 hover:-translate-x-2 duration-500 hover:shadow-lg hover:bg-pink-100 cursor-pointer">
            <Image
              alt="logo"
              src="/images/tracking.png"
              className="h-8 sm:h-10 lg:h-10 w-auto"
              width={32}
              height={16}
            />
            <h1 className="text-xs sm:text-sm md:text-md font-semibold text-center lg:text-start">
              Real-time order tracking
            </h1>
            <p className="hidden xl:block text-sm xl:text-xs">
              Instant updates on your order’s status and location, giving full
              transparency through every step of fulfillment.
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start space-y-2 bg-gray-100 rounded-xl p-3 sm:p-4 md:p-6 shadow-xl hover:-translate-y-2 hover:translate-x-2 duration-500 hover:shadow-lg hover:bg-pink-100 cursor-pointer">
            <Image
              alt="logo"
              src="/images/warehouse_inventory.png"
              className="h-8 sm:h-10 lg:h-10 w-auto"
              width={32}
              height={16}
            />
            <h1 className="text-xs sm:text-sm md:text-md font-semibold text-center lg:text-start">
              Warehouse inventory dashboard
            </h1>
            <p className="hidden xl:block text-sm xl:text-xs">
              Live overview of stock levels and product movement to prevent
              shortages and streamline restocking.
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start space-y-2 bg-gray-100 rounded-xl p-3 sm:p-4 md:p-6 shadow-xl hover:-translate-y-2 hover:-translate-x-2 duration-500 hover:shadow-lg hover:bg-pink-100 cursor-pointer">
            <Image
              alt="logo"
              src="/images/fast-delivery-icon.webp"
              className="h-8 sm:h-10 lg:h-10 w-auto"
              width={32}
              height={16}
            />
            <h1 className="text-xs sm:text-sm md:text-md font-semibold text-center lg:text-start">
              Fast EU delivery
            </h1>
            <p className="hidden xl:block text-sm xl:text-xs">
              Reliable 2-3 day shipping across Europe, optimized for speed and
              cost-efficiency from tax-advantaged warehouses.
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start space-y-2 bg-gray-100 rounded-xl p-3 sm:p-4 md:p-6 shadow-xl hover:-translate-y-2 hover:-translate-x-2 duration-500 hover:shadow-lg hover:bg-pink-100 cursor-pointer">
            <Image
              alt="logo"
              src="/images/inventory_alert.png"
              className="h-8 sm:h-10 lg:h-10 w-auto"
              width={32}
              height={16}
            />
            <h1 className="text-xs sm:text-sm md:text-md font-semibold text-center lg:text-start">
              Real-Time Inventory Alerts
            </h1>
            <p className="hidden xl:block text-sm xl:text-xs">
              Proactive notifications and restock recommendations to prevent
              out-of-stock situations and improve sales velocity
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start space-y-2 bg-gray-100 rounded-xl p-3 sm:p-4 md:p-6 shadow-xl hover:-translate-y-2 hover:translate-x-2 duration-500 hover:shadow-lg hover:bg-pink-100 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 sm:h-10 lg:h-10 w-8 sm:w-10 lg:w-10 text-gray-700"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <h1 className="text-xs sm:text-sm md:text-md font-semibold text-center lg:text-start">
              AI Assistant
            </h1>
            <p className="hidden xl:block text-sm xl:text-xs">
              Get instant help with your fulfillment operations, order management,
              and platform features through our intelligent AI assistant.
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start space-y-2 bg-gray-100 rounded-xl p-3 sm:p-4 md:p-6 shadow-xl hover:-translate-y-2 hover:-translate-x-2 duration-500 hover:shadow-lg hover:bg-pink-100 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 sm:h-10 lg:h-10 w-8 sm:w-10 lg:w-10 text-gray-700"
            >
              <path d="M20 7h-4M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M4 7h16M4 7v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <h1 className="text-xs sm:text-sm md:text-md font-semibold text-center lg:text-start">
              Receiving & Warehouse Intake
            </h1>
            <p className="hidden xl:block text-sm xl:text-xs">
              Streamlined receiving workflow with barcode scanning support to
              log incoming inventory and automatically update stock levels.
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start space-y-2 bg-gray-100 rounded-xl p-3 sm:p-4 md:p-6 shadow-xl hover:-translate-y-2 hover:translate-x-2 duration-500 hover:shadow-lg hover:bg-pink-100 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 sm:h-10 lg:h-10 w-8 sm:w-10 lg:w-10 text-gray-700"
            >
              <path d="M3 3v18h18M7 16l4-4 4 4 6-6" />
              <path d="M7 12h10" />
            </svg>
            <h1 className="text-xs sm:text-sm md:text-md font-semibold text-center lg:text-start">
              Advanced Analytics & Reporting
            </h1>
            <p className="hidden xl:block text-sm xl:text-xs">
              Comprehensive dashboards with order trends, revenue analytics,
              inventory insights, and shipping performance metrics.
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start space-y-2 bg-gray-100 rounded-xl p-3 sm:p-4 md:p-6 shadow-xl hover:-translate-y-2 hover:-translate-x-2 duration-500 hover:shadow-lg hover:bg-pink-100 cursor-pointer relative">
            <Image
              alt="logo"
              src="/images/package.png"
              className="h-8 sm:h-10 lg:h-10 w-auto"
              width={32}
              height={16}
            />
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm md:text-md font-semibold text-center lg:text-start">
                Custom Packing Solutions
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                Coming Soon
              </span>
            </div>
            <p className="hidden xl:block text-sm xl:text-xs">
              Choose branded, sustainable, or protective packaging for your
              products, tailored per SKU and order type
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Features;
