"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { SourceBreakdown } from "@/types/analytics";

interface OrderSourceChartProps {
  data: SourceBreakdown[];
  isLoading?: boolean;
}

const chartConfig = {
  shopify: {
    label: "Shopify",
    color: "hsl(var(--chart-1))",
  },
  manual: {
    label: "Manual",
    color: "hsl(var(--chart-2))",
  },
} as const;

export function OrderSourceChart({ data, isLoading }: OrderSourceChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders by Source</CardTitle>
          <CardDescription>Shopify vs Manual orders</CardDescription>
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
          <CardTitle>Orders by Source</CardTitle>
          <CardDescription>Shopify vs Manual orders</CardDescription>
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
    name: item.source.charAt(0).toUpperCase() + item.source.slice(1),
    value: item.count,
    percentage: item.percentage,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders by Source</CardTitle>
        <CardDescription>Shopify vs Manual orders</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const item = data.find(
                      (d) =>
                        d.source.toLowerCase() === name?.toString().toLowerCase()
                    );
                    return [
                      `${value} (${item?.percentage.toFixed(1)}%)`,
                      name,
                    ];
                  }}
                />
              }
            />
            <Bar
              dataKey="value"
              fill="var(--color-shopify)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
