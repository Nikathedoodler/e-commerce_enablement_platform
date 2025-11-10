import Image from "next/image";
import React from "react";
import * as motion from "motion/react-client";

const Features = () => {
  return (
    <div
      id="features"
      className="max-w-7xl mx-auto text-gray-900 flex flex-col space-y-10 py-10 px-12 scroll-mt-40"
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
              <div className="w-10 h-10 mb-2 rounded-lg bg-white/20 flex items-center justify-center mx-auto sm:mx-0">
                {/* Google AI logo */}
                <Image
                  src="/images/TrustArc_Logo.svg"
                  alt="Google AI"
                  width={32}
                  height={32}
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
              <div className="w-10 h-10 mb-2 rounded-lg bg-white/20 flex items-center justify-center mx-auto sm:mx-0">
                {/* Anthropic logo */}
                <Image
                  src="/images/Mine_Logo.svg"
                  alt="Anthropic"
                  width={32}
                  height={32}
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
                {/* Perplexity logo */}
                <Image
                  src="/images/DataGrail_Logo.svg"
                  alt="Perplexity"
                  width={32}
                  height={32}
                />
              </div>
              <div className="font-semibold">Multi-Warehouse Management</div>
              <div className="text-xs opacity-80">
                Distribute stock and manage fulfillment from multiple strategic
                EU locations.
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
        className="w-full bg-gray-100 rounded-xl p-6 shadow-2xl "
      >
        <div>
          <h1 className="text-xl font-bold">Available Features</h1>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="flex flex-col items-center lg:items-start space-y-2 bg-gray-100 rounded-xl p-6 shadow-xl hover:-translate-y-2  hover:-translate-x-2 duration-500 hover:shadow-lg hover:bg-pink-100 cursor-pointer">
            <Image
              alt="logo"
              src="/images/tracking.png"
              className="h-10 lg:h-10 w-auto"
              width={32}
              height={16}
            />
            <h1 className="text-md font-semibold text-center lg:text-start">
              Real-time order tracking
            </h1>
            <p className="hidden xl:block text-sm xl:text-xs">
              Instant updates on your order’s status and location, giving full
              transparency through every step of fulfillment.
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start space-y-2 bg-gray-100 rounded-xl p-6 shadow-xl hover:-translate-y-2  hover:translate-x-2 duration-500 hover:shadow-lg hover:bg-pink-100 cursor-pointer">
            <Image
              alt="logo"
              src="/images/warehouse_inventory.png"
              className="h-10 lg:h-10 w-auto"
              width={32}
              height={16}
            />
            <h1 className="text-md font-semibold text-center lg:text-start">
              Warehouse inventory dashboard
            </h1>
            <p className="hidden xl:block text-sm xl:text-xs">
              Live overview of stock levels and product movement to prevent
              shortages and streamline restocking.
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start space-y-2 bg-gray-100 rounded-xl p-6 shadow-xl hover:-translate-y-2  hover:-translate-x-2 duration-500 hover:shadow-lg hover:bg-pink-100 cursor-pointer">
            <Image
              alt="logo"
              src="/images/fast-delivery-icon.webp"
              className="h-10 lg:h-10 w-auto"
              width={32}
              height={16}
            />
            <h1 className="text-md font-semibold text-center lg:text-start">
              Fast EU delivery
            </h1>
            <p className="hidden xl:block text-sm xl:text-xs">
              Reliable 2-3 day shipping across Europe, optimized for speed and
              cost-efficiency from tax-advantaged warehouses.
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start space-y-2 bg-gray-100 rounded-xl p-6 shadow-xl hover:-translate-y-2  hover:translate-x-2 duration-500 hover:shadow-lg hover:bg-pink-100 cursor-pointer">
            <Image
              alt="logo"
              src="/images/ai-prediction.png"
              className="h-10 lg:h-8 w-auto"
              width={32}
              height={16}
            />
            <h1 className="text-md font-semibold text-center lg:text-start">
              AI-based cost prediction
            </h1>
            <p className="hidden xl:block text-sm xl:text-xs">
              Smart forecasts of fulfillment expenses based on historical data
              help you optimize operations and pricing.
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start space-y-2 bg-gray-100 rounded-xl p-6 shadow-xl hover:-translate-y-2  hover:-translate-x-2 duration-500 hover:shadow-lg hover:bg-pink-100 cursor-pointer">
            <Image
              alt="logo"
              src="/images/routing.jpg"
              className="h-10 lg:h-8 w-auto"
              width={32}
              height={16}
            />
            <h1 className="text-md font-semibold text-center lg:text-start">
              Automated Order Routing
            </h1>
            <p className="hidden xl:block text-sm xl:text-xs">
              Instantly direct each order to the optimal warehouse and carrier
              for the fastest, lowest-cost delivery
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start space-y-2 bg-gray-100 rounded-xl p-6 shadow-xl hover:-translate-y-2  hover:translate-x-2 duration-500 hover:shadow-lg hover:bg-pink-100 cursor-pointer">
            <Image
              alt="logo"
              src="/images/return_management.png"
              className="h-10 lg:h-10 w-auto"
              width={32}
              height={16}
            />
            <h1 className="text-md font-semibold text-center lg:text-start">
              Returns Management
            </h1>
            <p className="hidden xl:block text-sm xl:text-xs">
              Streamlined process for handling EU returns, including automated
              labels and real-time status tracking
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start space-y-2 bg-gray-100 rounded-xl p-6 shadow-xl hover:-translate-y-2  hover:-translate-x-2 duration-500 hover:shadow-lg hover:bg-pink-100 cursor-pointer">
            <Image
              alt="logo"
              src="/images/inventory_alert.png"
              className="h-10 lg:h-10 w-auto"
              width={32}
              height={16}
            />
            <h1 className="text-md font-semibold text-center lg:text-start">
              Real-Time Inventory Alerts
            </h1>
            <p className="hidden xl:block text-sm xl:text-xs">
              Proactive notifications and restock recommendations to prevent
              out-of-stock situations and improve sales velocity
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start space-y-2 bg-gray-100 rounded-xl p-6 shadow-xl hover:-translate-y-2  hover:translate-x-2 duration-500 hover:shadow-lg hover:bg-pink-100 cursor-pointer">
            <Image
              alt="logo"
              src="/images/package.png"
              className="h-10 lg:h-10 w-auto"
              width={32}
              height={16}
            />
            <h1 className="text-md font-semibold text-center lg:text-start">
              Custom Packing Solutions
            </h1>
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
