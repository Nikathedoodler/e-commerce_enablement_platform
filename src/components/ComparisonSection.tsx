"use client";
import React from "react";
import * as motion from "motion/react-client";

const comparisonData = [
  {
    feature: "Fulfillment Cost per Order",
    us: "€3.20 - €4.00",
    competitors: "€8.00 - €12.00",
    highlight: true,
  },
  {
    feature: "EU Delivery Time",
    us: "2-3 days",
    competitors: "5-7 days",
    highlight: true,
  },
  {
    feature: "Setup Fees",
    us: "€999 - €5,999",
    competitors: "€10,000+",
    highlight: false,
  },
  {
    feature: "Real-Time Analytics",
    us: "Included",
    competitors: "Premium add-on",
    highlight: true,
  },
  {
    feature: "AI Assistant Support",
    us: "24/7 Included",
    competitors: "Email only",
    highlight: true,
  },
  {
    feature: "Multi-Channel Integration",
    us: "Shopify, WooCommerce, API",
    competitors: "Limited options",
    highlight: false,
  },
];

const ComparisonSection = () => {
  return (
    <section
      id="comparison"
      className="w-full bg-white py-20 md:py-32"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Compare the Difference
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            See how we stack up against traditional EU fulfillment providers
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-xl"
        >
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 md:p-6 border-b-2 border-gray-200">
            <div className="font-semibold text-gray-900 text-sm md:text-base">
              Feature
            </div>
            <div className="text-center font-bold text-green-600 text-sm md:text-base">
              Us
            </div>
            <div className="text-center font-semibold text-gray-600 text-sm md:text-base">
              Traditional Providers
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {comparisonData.map((row, idx) => (
              <motion.div
                key={row.feature}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`grid grid-cols-3 gap-4 p-4 md:p-6 items-center ${
                  row.highlight ? "bg-green-50/50" : ""
                } hover:bg-gray-50 transition-colors`}
              >
                <div className="font-medium text-gray-900 text-sm md:text-base">
                  {row.feature}
                </div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold text-xs md:text-sm">
                    {row.us}
                    {row.highlight && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                </div>
                <div className="text-center text-gray-600 text-sm md:text-base">
                  {row.competitors}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-center"
        >
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all hover:scale-105"
          >
            <span>See Our Pricing</span>
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;
