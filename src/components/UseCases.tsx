"use client";
import React from "react";
import * as motion from "motion/react-client";

const useCases = [
  {
    title: "D2C Brands Expanding to EU",
    description:
      "Launch in European markets without the complexity. We handle customs, compliance, and fulfillment so you can focus on marketing and growth.",
    features: [
      "EU-compliant fulfillment",
      "Tax-advantaged warehouse location",
      "Multi-country shipping",
    ],
  },
  {
    title: "Growing E-Commerce Stores",
    description:
      "Scale from hundreds to thousands of orders without hiring a logistics team. Our platform grows with you.",
    features: [
      "Automated order processing",
      "Real-time inventory management",
      "Scalable infrastructure",
    ],
  },
  {
    title: "Multi-Channel Sellers",
    description:
      "Manage orders from Shopify, WooCommerce, and manual entries all in one unified dashboard.",
    features: [
      "Multi-platform integration",
      "Unified order management",
      "Centralized analytics",
    ],
  },
];

const UseCases = () => {
  return (
    <section
      id="use-cases"
      className="w-full bg-gray-50 py-20 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Perfect For Every Business Stage
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you&apos;re just starting out or scaling rapidly, we&apos;ve got you covered.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {useCases.map((useCase, idx) => (
            <motion.div
              key={useCase.title}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-white rounded-xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                {useCase.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {useCase.description}
              </p>
              <ul className="space-y-2">
                {useCase.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
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
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
