# Analytics & Reporting Dashboard - Implementation Plan

**Created:** 2025-01-XX  
**Status:** Planning Phase  
**Phase:** Phase 7 - Advanced Analytics & Reporting  
**Target Page:** `/dashboard/analytics`

---

## 🎯 Overview

Build a comprehensive analytics and reporting dashboard that provides users with insights into their fulfillment operations, order trends, inventory status, shipping performance, and receiving activities.

---

## 📊 Available Data Sources

### 1. **Orders Table** (`orders`)

- Order counts by status, date, source (Shopify vs Manual)
- Revenue metrics (total, average order value)
- Order trends over time
- Customer data (email, addresses)

### 2. **Inventory Table** (`inventory`)

- Total SKU count
- Low stock items count
- Inventory value (if we add price field)
- Inventory by location
- Quantity trends

### 3. **Receiving Log** (`receiving_log`)

- Items received by date
- Receiving by condition (good/damaged/defective/returned)
- Receiving trends over time
- Receiving by location

### 4. **Shipping Labels** (`shipping_labels`)

- Label generation count
- Shipping costs
- Labels by carrier
- Success/failure rates

### 5. **Label Generation Audit Log** (`label_generation_audit_log`)

- Label generation attempts
- Success vs failure rates
- Error tracking
- Generation by type (auto vs manual)

### 6. **Shopify Stores** (`shopify_stores`)

- Connected stores count
- Orders by store

---

## 🎨 UI Components Needed

### Required Installations

1. **shadcn Chart Component**

   ```bash
   npx shadcn@latest add chart
   ```

   This installs:

   - `@/components/ui/chart.tsx` (wrapper component)
   - Requires `recharts` library

2. **Recharts Library** (charting library)

   ```bash
   npm install recharts
   ```

3. **shadcn Tabs Component** (if not already installed)

   ```bash
   npx shadcn@latest add tabs
   ```

4. **shadcn Select Component** (for date range filters - already installed ✅)

---

## 📈 Dashboard Sections & Metrics

### Section 1: Overview Cards (Top Row)

**4 Key Metric Cards:**

1. **Total Orders**

   - Value: Count of orders in selected period
   - Change: % vs previous period
   - Trend indicator (up/down arrow)
   - Subtitle: "Orders in selected period"

2. **Total Revenue**

   - Value: Sum of `orders.total` in period
   - Change: % vs previous period
   - Trend indicator
   - Subtitle: "Revenue in selected period"

3. **Pending Shipments**

   - Value: Count of orders with `status = 'pending'` or `'processing'`
   - Change: Count change vs previous period
   - Subtitle: "Orders awaiting fulfillment"

4. **Low Stock Items**
   - Value: Count of inventory items where `quantity <= reorder_threshold`
   - Change: Count change vs previous period
   - Subtitle: "Items needing restock"

### Section 2: Order Analytics Chart

**Line/Area Chart:**

- Title: "Order Volume Over Time"
- X-axis: Date (daily/weekly/monthly based on period)
- Y-axis: Order count
- Series: Order count per day
- Optional: Add revenue line (secondary Y-axis)
- Period selector: Last 7 days, Last 30 days, Last 3 months, Custom range

### Section 3: Order Status Breakdown

**Pie/Doughnut Chart:**

- Title: "Orders by Status"
- Segments: Pending, Processing, Fulfilled, Cancelled
- Show percentages and counts
- Color-coded (matching existing status badges)

### Section 4: Order Source Breakdown

**Bar Chart:**

- Title: "Orders by Source"
- Bars: Shopify Orders vs Manual Orders
- Show counts and percentages
- Based on `shop_id` field (null = manual, not null = Shopify)

### Section 5: Revenue Trends

**Area Chart:**

- Title: "Revenue Over Time"
- X-axis: Date
- Y-axis: Revenue amount (currency)
- Show cumulative revenue trend
- Period selector (same as Order Analytics)

### Section 6: Inventory Analytics

**Cards + Table:**

**Cards:**

- Total SKUs
- Total Inventory Value (if we track item prices)
- Low Stock Count
- Average Stock Level

**Table:**

- Top 10 SKUs by quantity
- Columns: SKU, Name, Quantity, Location, Status (Low Stock/In Stock)

### Section 7: Receiving Analytics

**Bar Chart:**

- Title: "Items Received by Condition"
- Bars: Good, Damaged, Defective, Returned
- Show counts
- Period filter

**Line Chart:**

- Title: "Receiving Trends"
- X-axis: Date
- Y-axis: Quantity received
- Show receiving volume over time

### Section 8: Shipping & Label Analytics

**Cards:**

- Total Labels Generated
- Success Rate (%)
- Total Shipping Costs
- Average Cost per Label

**Bar Chart:**

- Title: "Label Generation Success Rate"
- Show successful vs failed attempts
- Based on `label_generation_audit_log`

**Line Chart:**

- Title: "Labels Generated Over Time"
- Show daily/weekly label generation volume

---

## 🗂️ Page Structure

### Route: `/dashboard/analytics`

**Layout:**

```
┌─────────────────────────────────────────┐
│  Analytics Dashboard                    │
│  [Date Range Selector: Last 7/30/90]   │
└─────────────────────────────────────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Orders   │ │ Revenue   │ │ Pending  │ │ Low Stock│
│ 1,234    │ │ $45,678   │ │ 23       │ │ 12       │
│ +12.5%   │ │ +8.2%     │ │ -5       │ │ +3       │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

┌─────────────────────────────────────────┐
│  Order Volume Over Time                 │
│  [Line Chart]                           │
└─────────────────────────────────────────┘

┌──────────────────┐ ┌──────────────────┐
│ Orders by Status │ │ Orders by Source │
│ [Pie Chart]      │ │ [Bar Chart]      │
└──────────────────┘ └──────────────────┘

┌─────────────────────────────────────────┐
│  Revenue Trends                         │
│  [Area Chart]                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Inventory Analytics                    │
│  [Cards + Top SKUs Table]              │
└─────────────────────────────────────────┘

┌──────────────────┐ ┌──────────────────┐
│ Receiving Trends │ │ Receiving by      │
│ [Line Chart]     │ │ Condition [Bar]  │
└──────────────────┘ └──────────────────┘

┌─────────────────────────────────────────┐
│  Shipping & Label Analytics            │
│  [Cards + Charts]                      │
└─────────────────────────────────────────┘
```

---

## 🔧 Implementation Steps

### Step 1: Install Dependencies

- [ ] Install `recharts`: `npm install recharts`
- [ ] Install shadcn chart component: `npx shadcn@latest add chart`
- [ ] Verify chart component is created in `src/components/ui/chart.tsx`

### Step 2: Create Analytics Query Helpers

**File:** `src/lib/supabase/queries/analytics.ts`

**Functions to create:**

- `getOrderStats(startDate, endDate)` - Order counts, revenue, status breakdown
- `getOrderTrends(startDate, endDate, groupBy)` - Daily/weekly/monthly order counts
- `getRevenueTrends(startDate, endDate, groupBy)` - Daily/weekly/monthly revenue
- `getOrderSourceBreakdown(startDate, endDate)` - Shopify vs Manual counts
- `getInventoryStats()` - SKU counts, low stock count, inventory value
- `getTopSKUs(limit)` - Top SKUs by quantity
- `getReceivingStats(startDate, endDate)` - Receiving counts by condition
- `getReceivingTrends(startDate, endDate, groupBy)` - Receiving over time
- `getLabelStats(startDate, endDate)` - Label generation stats
- `getLabelTrends(startDate, endDate, groupBy)` - Label generation over time

### Step 3: Create Analytics Hooks

**File:** `src/hooks/use-analytics.ts`

**Hooks to create:**

- `useOrderStats(dateRange)`
- `useOrderTrends(dateRange, groupBy)`
- `useRevenueTrends(dateRange, groupBy)`
- `useOrderSourceBreakdown(dateRange)`
- `useInventoryStats()`
- `useTopSKUs(limit)`
- `useReceivingStats(dateRange)`
- `useReceivingTrends(dateRange, groupBy)`
- `useLabelStats(dateRange)`
- `useLabelTrends(dateRange, groupBy)`

### Step 4: Create Analytics Types

**File:** `src/types/analytics.ts`

**Types to define:**

- `DateRange` - { startDate: Date, endDate: Date }
- `OrderStats` - { totalOrders, totalRevenue, pendingCount, etc. }
- `TrendDataPoint` - { date: string, value: number }
- `StatusBreakdown` - { status: string, count: number, percentage: number }
- `SourceBreakdown` - { source: 'shopify' | 'manual', count: number }
- `InventoryStats` - { totalSKUs, lowStockCount, totalValue, etc. }
- `ReceivingStats` - { good, damaged, defective, returned }
- `LabelStats` - { total, successful, failed, successRate, totalCost }

### Step 5: Create Chart Components

**Files:**

- `src/components/dashboard/analytics/order-volume-chart.tsx`
- `src/components/dashboard/analytics/order-status-chart.tsx`
- `src/components/dashboard/analytics/order-source-chart.tsx`
- `src/components/dashboard/analytics/revenue-chart.tsx`
- `src/components/dashboard/analytics/receiving-trends-chart.tsx`
- `src/components/dashboard/analytics/receiving-condition-chart.tsx`
- `src/components/dashboard/analytics/label-stats-chart.tsx`

### Step 6: Create Metric Card Component

**File:** `src/components/dashboard/analytics/metric-card.tsx`

**Props:**

- `title`: string
- `value`: string | number
- `change`: number (percentage change)
- `subtitle`: string
- `trend`: 'up' | 'down' | 'neutral'

### Step 7: Create Date Range Selector Component

**File:** `src/components/dashboard/analytics/date-range-selector.tsx`

**Options:**

- Last 7 days
- Last 30 days
- Last 3 months
- Last 6 months
- Last year
- Custom range (date picker)

### Step 8: Create Analytics Page

**File:** `src/app/dashboard/analytics/page.tsx`

**Structure:**

- Server component that fetches initial data
- Client component wrapper for interactive charts
- Date range state management
- Loading states
- Error handling

### Step 9: Add Navigation Link

**File:** `src/components/dashboard/app-sidebar.tsx`

Add "Analytics" to navigation menu (probably under main nav items)

---

## 📐 Chart Specifications

### Line/Area Charts (Order Volume, Revenue, Receiving Trends)

- **Library:** Recharts via shadcn chart component
- **Type:** `AreaChart` or `LineChart`
- **Responsive:** Yes
- **Colors:** Use theme colors (matching existing UI)
- **Tooltip:** Show formatted values
- **X-axis:** Date labels (formatted)
- **Y-axis:** Numeric values (formatted with commas/currency)

### Pie Charts (Order Status)

- **Type:** `PieChart`
- **Show:** Percentages and counts in tooltip
- **Colors:** Match existing status badge colors
- **Legend:** Show on side or bottom

### Bar Charts (Order Source, Receiving Condition)

- **Type:** `BarChart`
- **Horizontal or Vertical:** Vertical (default)
- **Show:** Values on bars
- **Colors:** Theme colors

---

## 🎨 Design Considerations

1. **Consistent Styling:**

   - Use existing shadcn/ui components
   - Match current dashboard theme
   - Use Card components for sections

2. **Responsive Design:**

   - Charts should be responsive
   - Stack cards on mobile
   - Horizontal scroll for tables if needed

3. **Loading States:**

   - Skeleton loaders for charts
   - Loading spinners for cards

4. **Empty States:**

   - Show helpful messages when no data
   - Suggest actions (create orders, add inventory)

5. **Performance:**
   - Cache analytics data with TanStack Query
   - Consider server-side aggregation for large datasets
   - Debounce date range changes

---

## 🔍 Data Aggregation Strategy

### Server-Side Aggregation (Recommended)

- Use PostgreSQL aggregation functions (`COUNT`, `SUM`, `GROUP BY`)
- Aggregate by date ranges in database
- Return pre-aggregated data to frontend
- Reduces data transfer and improves performance

### Example Query Pattern:

```sql
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as order_count,
  SUM(total) as revenue
FROM orders
WHERE user_id = $1
  AND created_at >= $2
  AND created_at <= $3
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date ASC;
```

---

## ✅ Success Criteria

1. **Functional:**

   - All charts render correctly
   - Date range filtering works
   - Data is accurate and matches source tables
   - Loading and error states work

2. **Performance:**

   - Page loads in < 2 seconds
   - Charts render smoothly
   - No layout shifts

3. **UX:**
   - Intuitive date range selection
   - Clear metric cards with trends
   - Responsive on mobile
   - Accessible (keyboard navigation, screen readers)

---

## 🚀 Future Enhancements (Post-MVP)

- Export reports to PDF/CSV
- Email scheduled reports
- Custom date range presets
- Comparison mode (compare two periods)
- Drill-down capabilities (click chart → see details)
- Real-time updates (WebSocket/SSE)
- Advanced filters (by location, SKU, customer)
- Forecasting/predictions
- Custom dashboard widgets (drag & drop)

---

## 📝 Notes

- **shadcn Chart Component:** Uses Recharts under the hood, provides consistent styling with shadcn/ui
- **Date Handling:** Use UTC dates for consistency, convert to user timezone for display
- **Currency Formatting:** Format revenue with proper currency symbols and decimals
- **Percentage Calculations:** Handle division by zero (no previous period data)
- **RLS:** All queries must respect RLS policies (user_id filtering)

---

**Ready to start implementation!** 🎉
