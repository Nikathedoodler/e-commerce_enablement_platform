"use client";
import React from "react";
import * as motion from "motion/react-client";

const metrics = [
  {
    value: "60%",
    label: "Lower Fulfillment Costs",
    description: "Compared to traditional EU fulfillment centers",
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
  },
  {
    value: "2-3",
    label: "Day EU Delivery",
    description: "Fast shipping across all European markets",
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
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    ),
  },
  {
    value: "24/7",
    label: "AI Support",
    description: "Instant answers to your fulfillment questions",
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
  },
  {
    value: "100%",
    label: "EU Compliant",
    description: "Fully compliant with EU regulations and standards",
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
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

const KeyMetrics = () => {
  return (
    <section
      id="key-metrics"
      className="w-full bg-black text-white py-20 md:py-32"
      style={{ minHeight: '400px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Why Brands Choose Us
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Real numbers that make a difference for your business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-800 hover:border-gray-700 transition-all hover:scale-105 group"
            >
              <div className="text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                {metric.icon}
              </div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-2 text-white"
              >
                {metric.value}
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                {metric.label}
              </h3>
              <p className="text-gray-400 text-sm">{metric.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyMetrics;
