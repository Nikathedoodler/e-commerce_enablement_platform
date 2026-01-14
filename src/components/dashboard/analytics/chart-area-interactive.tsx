"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { 
  TrendDataPoint, 
  ReceivingTrendDataPoint, 
  LabelTrendDataPoint 
} from "@/types/analytics";

interface ChartAreaInteractiveProps {
  title: string;
  description?: string;
  data: TrendDataPoint[] | ReceivingTrendDataPoint[] | LabelTrendDataPoint[];
  isLoading?: boolean;
  onTimeRangeChange?: (range: "7d" | "30d" | "90d") => void;
  defaultTimeRange?: "7d" | "30d" | "90d";
  valueKey?: string; // e.g., "value", "revenue", "quantity", "count"
  formatValue?: (value: number) => string; // Custom formatter for values
  showRevenue?: boolean; // If true, format as currency
}

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({
  title,
  description,
  data,
  isLoading,
  onTimeRangeChange,
  defaultTimeRange = "30d",
  valueKey = "value",
  formatValue,
  showRevenue = false,
}: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "90d">(
    defaultTimeRange
  );

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const handleTimeRangeChange = (value: "7d" | "30d" | "90d") => {
    setTimeRange(value);
    onTimeRangeChange?.(value);
  };

  // Filter data based on time range
  const getFilteredData = () => {
    if (!data || data.length === 0) return [];
    
    const now = new Date();
    const daysToShow = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - daysToShow);

    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= cutoffDate;
    });
  };

  const filteredData = getFilteredData();

  // Get value formatter
  const getValueFormatter = () => {
    if (formatValue) return formatValue;
    if (showRevenue) {
      return (value: number) => 
        `$${value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
    }
    return (value: number) => value.toLocaleString();
  };

  const valueFormatter = getValueFormatter();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = filteredData.map((item) => {
    let value = 0;
    
    if (valueKey === "revenue" && "revenue" in item) {
      value = (item as TrendDataPoint).revenue || 0;
    } else if (valueKey === "quantity" && "quantity" in item) {
      value = (item as ReceivingTrendDataPoint).quantity || 0;
    } else if (valueKey === "count" && "count" in item) {
      value = (item as LabelTrendDataPoint).count || 0;
    } else if ("value" in item) {
      value = (item as TrendDataPoint).value || 0;
    }
    
    return {
      date: item.date,
      value,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardDescription className="text-xs sm:text-sm">{title}</CardDescription>
        <CardTitle className="text-base sm:text-lg">{description || "Overview"}</CardTitle>
        <CardAction>
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger
              className="w-[120px] sm:w-[140px] text-xs sm:text-sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg text-xs sm:text-sm">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg text-xs sm:text-sm">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg text-xs sm:text-sm">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] sm:h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-value)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : Math.min(10, chartData.length - 1)}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  formatter={(value) => {
                    return [
                      valueFormatter(Number(value)),
                      title,
                    ];
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="value"
              type="natural"
              fill="url(#fillValue)"
              stroke="var(--color-value)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
