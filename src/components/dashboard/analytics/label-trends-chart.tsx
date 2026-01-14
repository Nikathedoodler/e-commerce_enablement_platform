"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import type { LabelTrendDataPoint } from "@/types/analytics";

interface LabelTrendsChartProps {
  data: LabelTrendDataPoint[];
  isLoading?: boolean;
}

const chartConfig = {
  successful: {
    label: "Successful",
    color: "hsl(var(--chart-4))",
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--destructive))",
  },
} as const;

export function LabelTrendsChart({
  data,
  isLoading,
}: LabelTrendsChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Labels Generated Over Time</CardTitle>
          <CardDescription>Label generation volume</CardDescription>
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
          <CardTitle>Labels Generated Over Time</CardTitle>
          <CardDescription>Label generation volume</CardDescription>
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
        <CardTitle>Labels Generated Over Time</CardTitle>
        <CardDescription>Label generation volume</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="fillSuccessful" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-successful)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-successful)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillFailed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-failed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-failed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="successful"
              stackId="1"
              stroke="var(--color-successful)"
              fill="url(#fillSuccessful)"
              name="Successful"
            />
            <Area
              type="monotone"
              dataKey="failed"
              stackId="1"
              stroke="var(--color-failed)"
              fill="url(#fillFailed)"
              name="Failed"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
