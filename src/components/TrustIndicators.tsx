"use client";
import React from "react";
import * as motion from "motion/react-client";

const trustItems = [
  {
    title: "EU Compliant",
    description: "Fully compliant with EU regulations, GDPR, and customs requirements",
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
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    title: "Secure & Encrypted",
    description: "Bank-level encryption and security protocols protect your data",
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
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "99.9% Uptime",
    description: "Reliable infrastructure ensures your operations never stop",
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
  },
  {
    title: "SOC 2 Ready",
    description: "Enterprise-grade security and compliance standards",
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
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

const TrustIndicators = () => {
  return (
    <section
      id="trust"
      className="w-full bg-gray-50 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Trusted & Secure
          </h2>
          <p className="text-gray-600">
            Your data and operations are protected with enterprise-grade security
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-3">
                {item.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Security Badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center items-center gap-6 md:gap-8 opacity-60"
        >
          <div className="text-xs text-gray-500 font-semibold">GDPR Compliant</div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="text-xs text-gray-500 font-semibold">SSL Encrypted</div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="text-xs text-gray-500 font-semibold">ISO 27001 Ready</div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="text-xs text-gray-500 font-semibold">SOC 2 Compliant</div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustIndicators;
