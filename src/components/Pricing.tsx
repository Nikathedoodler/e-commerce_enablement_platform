"use client";

import React, { useState } from "react";
import * as motion from "motion/react-client";
import { Presence } from "motion/react-client";

const plans = [
  {
    name: "Starter",
    bestFor: "Early-stage, small D2C brands",
    monthlyFee: "€199/mo",
    orderVolume: "Up to 250 orders/mo",
    fulfillmentCost: "€4.00/order + 1 pallet storage incl.",
    warehousing: "1 EU warehouse (Kutaisi), basic Pick & Pack",
    integrations: "Shopify, WooCommerce",
    dashboard: "Real-time orders, inventory tracking",
    returns: "Manual portal",
    support: "Email support",
    setupFee: "€999 one-time",
    bullets: [
      "Up to 250 orders/month",
      "Shopify/WooCommerce integration",
      "1 EU warehouse (Kutaisi)",
      "Basic returns portal",
      "Email support",
    ],
    highlight: "Perfect for founders making their first EU shipments.",
  },
  {
    name: "Growth",
    bestFor: "Growing brands, multi-channel",
    monthlyFee: "€699/mo",
    orderVolume: "Up to 2,000 orders/mo",
    fulfillmentCost: "€3.50/order, 5 pallets incl.",
    warehousing: "Multi-location, advanced inventory",
    integrations: "+Amazon, Etsy, API access",
    dashboard: "Advanced analytics, low-stock alerts",
    returns: "Automated EU returns, tracking",
    support: "Priority support, Slack access",
    setupFee: "€5,999 one-time",
    bullets: [
      "Up to 2,000 orders/month",
      "Multi-channel integrations",
      "Multiple EU warehouse support",
      "Automated inventory alerts",
      "Priority support (Slack/email)",
    ],
    highlight: "Built for brands scaling channels across the EU.",
  },
  {
    name: "Scale Pro",
    bestFor: "Fast-moving, established brands",
    monthlyFee: "Custom/Enterprise",
    orderVolume: "2,000+ orders/mo",
    fulfillmentCost: "€3.20/order, 15+ pallets, volume pricing",
    warehousing: "Unlimited locations, custom SLA",
    integrations: "All integrations, ERP/custom",
    dashboard: "Custom reporting, role access",
    returns: "White-glove reverse logistics",
    support: "Dedicated account manager",
    setupFee: "Custom",
    bullets: [
      "Custom order volume & pricing",
      "All integrations & ERP connectivity",
      "Real-time advanced analytics",
      "White-glove onboarding",
      "Dedicated account manager",
    ],
    highlight: "Enterprise-grade fulfilment with tailored workflows.",
  },
];

const pricingRows = [
  { label: "Best for", key: "bestFor" as const },
  { label: "Monthly fee", key: "monthlyFee" as const },
  { label: "Order volume", key: "orderVolume" as const },
  { label: "Fulfillment cost", key: "fulfillmentCost" as const },
  { label: "Warehousing", key: "warehousing" as const },
  { label: "Integrations", key: "integrations" as const },
  { label: "Dashboard", key: "dashboard" as const },
  { label: "Returns", key: "returns" as const },
  { label: "Support", key: "support" as const },
  { label: "Setup fee", key: "setupFee" as const },
];

const Pricing = () => {
  const [isTableOpen, setIsTableOpen] = useState(false);

  return (
    <div
      id="pricing"
      className="w-full flex flex-col items-center justify-center py-20 bg-[#121212] text-white scroll-mt-90"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-[90%] max-w-5xl text-center space-y-4 mb-12"
      >
        <p className="text-md uppercase tracking-[0.4em] text-lime-300/80">
          Pricing
        </p>
        <h2 className="text-3xl md:text-4xl font-bold">
          Transparent Logistics Pricing for EU D2C Brands
        </h2>
        <p className="text-base md:text-lg text-gray-300">
          Every plan includes EU-compliant fulfillment, 2–3 day EU delivery
          lanes, real-time dashboards, and seamless store integrations. Choose
          the tier that matches your order volume, storage profile, and support
          needs—then scale up without penalties.
        </p>
        <p>
          Need more?{" "}
          <a
            href="#contact"
            className="text-lime-300 hover:text-lime-200 underline underline-offset-4"
          >
            Book a call
          </a>{" "}
          for a tailored quote.
        </p>
      </motion.div>

      <div className="w-[90%] max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white/10 border border-white/10 rounded-3xl p-6 flex flex-col gap-4 cursor-pointer hover:scale-105 transition duration-200"
          >
            <div>
              <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
              <p className="text-sm text-gray-400">{plan.bestFor}</p>
            </div>
            <ul className="space-y-2 text-sm text-white/90">
              {plan.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-lime-300" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-2">
              <span className="text-sm uppercase tracking-widest text-gray-400">
                Monthly fee
              </span>
              <p className="text-2xl font-bold text-white">{plan.monthlyFee}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="w-[90%] max-w-4xl mt-12 space-y-4 text-center text-gray-300 text-sm md:text-base">
        <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-6">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-lime-300 text-black font-semibold hover:bg-lime-200 transition"
          >
            Calculate Your Savings
          </a>
          <a
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition cursor-pointer"
            onClick={() => setIsTableOpen(!isTableOpen)}
          >
            Compare All Features
          </a>
        </div>
      </div>

      {isTableOpen && (
        <motion.div
          initial={{ x: 0, y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-[90%] max-w-6xl overflow-x-auto mt-16"
        >
          <table className="min-w-full border-separate border-spacing-0 rounded-3xl overflow-hidden bg-white/5 backdrop-blur-md">
            <thead className="bg-white/10">
              <tr>
                <th className="text-left text-sm md:text-base font-semibold px-6 py-5 text-gray-300">
                  Plan details
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.name}
                    className="text-left text-sm md:text-base font-semibold px-6 py-5"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-lg md:text-xl font-bold">
                        {plan.name}
                      </span>
                      <span className="text-gray-400 text-xs md:text-sm">
                        {plan.highlight}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pricingRows.map((row, idx) => (
                <tr
                  key={row.label}
                  className={idx % 2 === 0 ? "bg-white/5" : "bg-white/0"}
                >
                  <td className="align-top px-6 py-4 text-sm md:text-base text-gray-300 font-medium">
                    {row.label}
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={`${plan.name}-${row.key}`}
                      className="align-top px-6 py-4 text-sm md:text-base text-white/90"
                    >
                      {plan[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default Pricing;
