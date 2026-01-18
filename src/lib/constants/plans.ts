import type { PlanTier } from "@/types/stripe";

export interface PlanFeature {
  tier: PlanTier;
  name: string;
  bestFor: string;
  monthlyFee: string;
  orderVolume: string;
  fulfillmentCost: string;
  warehousing: string;
  integrations: string;
  dashboard: string;
  returns: string;
  support: string;
  setupFee: string;
}

export const planFeatures: PlanFeature[] = [
  {
    tier: "starter",
    name: "Starter",
    bestFor: "Early-stage, small D2C brands",
    monthlyFee: "€199/mo",
    orderVolume: "Up to 250 orders/mo",
    fulfillmentCost: "€4.00/order + 1 pallet storage incl.",
    warehousing: "1 warehouse (Kutaisi, Georgia), basic Pick & Pack",
    integrations: "Shopify, WooCommerce",
    dashboard: "Real-time orders, inventory tracking, AI Assistant",
    returns: "Manual portal",
    support: "Email support",
    setupFee: "€999 one-time",
  },
  {
    tier: "professional",
    name: "Growth",
    bestFor: "Growing brands, multi-channel",
    monthlyFee: "€699/mo",
    orderVolume: "Up to 2,000 orders/mo",
    fulfillmentCost: "€3.50/order, 5 pallets incl.",
    warehousing: "1 warehouse (Kutaisi, Georgia), advanced inventory",
    integrations: "Shopify, WooCommerce, API access",
    dashboard: "Advanced analytics, low-stock alerts, AI Assistant",
    returns: "Automated EU returns, tracking",
    support: "Priority support, Slack access",
    setupFee: "€5,999 one-time",
  },
  {
    tier: "enterprise",
    name: "Scale Pro",
    bestFor: "Fast-moving, established brands",
    monthlyFee: "€2,000/mo",
    orderVolume: "2,000+ orders/mo",
    fulfillmentCost: "€3.20/order, 15+ pallets, volume pricing",
    warehousing: "1 warehouse (Kutaisi, Georgia), custom SLA",
    integrations: "Shopify, WooCommerce, API access, Custom integrations",
    dashboard: "Custom reporting, role access, AI Assistant",
    returns: "White-glove reverse logistics",
    support: "Dedicated account manager",
    setupFee: "Custom",
  },
];

export const planComparisonRows = [
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

export function getPlanLimit(planTier: PlanTier): number {
  if (planTier === "starter") {
    return 250;
  }

  if (planTier === "professional") {
    return 2000;
  }

  if (planTier === "enterprise") {
    return 999999;
  }

  return 0;
}
