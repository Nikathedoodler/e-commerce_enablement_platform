"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import type { ReceivingTrendDataPoint } from "@/types/analytics";

interface ReceivingTrendsChartProps {
  data: ReceivingTrendDataPoint[];
  isLoading?: boolean;
}

const chartConfig = {
  quantity: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
  good: {
    label: "Good",
    color: "hsl(var(--chart-4))",
  },
  damaged: {
    label: "Damaged",
    color: "hsl(var(--destructive))",
  },
  defective: {
    label: "Defective",
    color: "hsl(var(--chart-2))",
  },
  returned: {
    label: "Returned",
    color: "hsl(var(--chart-3))",
  },
} as const;

export function ReceivingTrendsChart({
  data,
  isLoading,
}: ReceivingTrendsChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Receiving Trends</CardTitle>
          <CardDescription>Receiving volume over time</CardDescription>
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
          <CardTitle>Receiving Trends</CardTitle>
          <CardDescription>Receiving volume over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receiving Trends</CardTitle>
        <CardDescription>Receiving volume over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value as string);
                    return date.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="quantity"
              stroke="var(--color-quantity)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="good"
              stroke="var(--color-good)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="damaged"
              stroke="var(--color-damaged)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="defective"
              stroke="var(--color-defective)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="returned"
              stroke="var(--color-returned)"
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
