"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import type { StatusBreakdown } from "@/types/analytics";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderStatusChartProps {
  data: StatusBreakdown[];
  isLoading?: boolean;
}

const statusColors: Record<string, string> = {
  pending: "hsl(var(--chart-2))",
  processing: "hsl(var(--chart-3))",
  fulfilled: "hsl(var(--chart-4))",
  cancelled: "hsl(var(--destructive))",
};

export function OrderStatusChart({ data, isLoading }: OrderStatusChartProps) {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders by Status</CardTitle>
          <CardDescription>Status breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders by Status</CardTitle>
          <CardDescription>Status breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
    fill: statusColors[item.status] || "hsl(var(--muted))",
  }));

  const chartConfig = chartData.reduce(
    (acc, item) => {
      acc[item.name.toLowerCase()] = {
        label: item.name,
        color: item.fill,
      };
      return acc;
    },
    {} as Record<string, { label: string; color: string }>
  );

  // Adjust outerRadius based on screen size
  const outerRadius = isMobile ? 70 : 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders by Status</CardTitle>
        <CardDescription>Status breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const item = data.find(
                      (d) =>
                        d.status.toLowerCase() === name?.toString().toLowerCase()
                    );
                    return [
                      `${value} (${item?.percentage.toFixed(1)}%)`,
                      name,
                    ];
                  }}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={outerRadius}
              label={(entry) => `${entry.name}: ${entry.value}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
