"use client";
import React from "react";
import * as motion from "motion/react-client";

const benefits = [
  {
    title: "Save Time & Resources",
    description:
      "Automate order processing, inventory tracking, and shipping label generation. Focus on growing your brand instead of managing logistics.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: "blue",
  },
  {
    title: "Reduce Operational Costs",
    description:
      "Cut fulfillment costs by up to 60% compared to traditional EU fulfillment centers. Lower storage fees and optimized shipping rates.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    color: "green",
  },
  {
    title: "Scale Without Limits",
    description:
      "Handle 10 orders or 10,000 orders with the same platform. No infrastructure changes needed as you grow.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M3 3v18h18M7 16l4-4 4 4 6-6" />
        <path d="M7 12h10" />
      </svg>
    ),
    color: "purple",
  },
  {
    title: "Real-Time Visibility",
    description:
      "Track every order, monitor inventory levels, and analyze performance with comprehensive dashboards and analytics.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    color: "orange",
  },
];

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 border-blue-200",
  green: "bg-green-50 text-green-600 border-green-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
  orange: "bg-orange-50 text-orange-600 border-orange-200",
};

const BenefitsSection = () => {
  return (
    <section
      id="benefits"
      className="w-full bg-white py-20 md:py-32"
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
            Built for Your Success
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to streamline operations, reduce costs, and scale your e-commerce business across Europe.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={benefit.title}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white rounded-xl p-6 md:p-8 border-2 border-gray-100 hover:border-gray-300 transition-all hover:shadow-xl group"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 border-2 ${colorClasses[benefit.color as keyof typeof colorClasses]} group-hover:scale-110 transition-transform duration-300`}
              >
                {benefit.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
