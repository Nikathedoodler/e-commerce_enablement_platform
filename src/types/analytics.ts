/**
 * Analytics Types
 * Type definitions for analytics and reporting data
 */

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

export type DateRangePreset = 
  | "7d" 
  | "30d" 
  | "90d" 
  | "180d" 
  | "1y" 
  | "custom";

export type GroupByPeriod = "day" | "week" | "month";

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingCount: number;
  processingCount: number;
  fulfilledCount: number;
  cancelledCount: number;
  previousPeriodOrders: number;
  previousPeriodRevenue: number;
  ordersChangePercent: number;
  revenueChangePercent: number;
}

export interface TrendDataPoint {
  date: string;
  value: number;
  revenue?: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
  percentage: number;
}

export interface SourceBreakdown {
  source: "shopify" | "manual";
  count: number;
  percentage: number;
}

export interface InventoryStats {
  totalSKUs: number;
  lowStockCount: number;
  totalQuantity: number;
  averageQuantity: number;
  previousLowStockCount: number;
  lowStockChange: number;
}

export interface TopSKU {
  sku: string;
  name: string;
  quantity: number;
  location: string | null;
  isLowStock: boolean;
}

export interface ReceivingStats {
  totalReceived: number;
  good: number;
  damaged: number;
  defective: number;
  returned: number;
  previousPeriodTotal: number;
  changePercent: number;
}

export interface ReceivingTrendDataPoint {
  date: string;
  quantity: number;
  good: number;
  damaged: number;
  defective: number;
  returned: number;
}

export interface LabelStats {
  total: number;
  successful: number;
  failed: number;
  successRate: number;
  totalCost: number;
  averageCost: number;
  previousPeriodTotal: number;
  changePercent: number;
}

export interface LabelTrendDataPoint {
  date: string;
  count: number;
  successful: number;
  failed: number;
}
