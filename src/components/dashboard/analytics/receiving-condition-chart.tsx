"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ReceivingStats } from "@/types/analytics";

interface ReceivingConditionChartProps {
  data: ReceivingStats | null;
  isLoading?: boolean;
}

const chartConfig = {
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

export function ReceivingConditionChart({
  data,
  isLoading,
}: ReceivingConditionChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Items Received by Condition</CardTitle>
          <CardDescription>Receiving breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Items Received by Condition</CardTitle>
          <CardDescription>Receiving breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    { name: "Good", value: data.good, fill: "var(--color-good)" },
    { name: "Damaged", value: data.damaged, fill: "var(--color-damaged)" },
    { name: "Defective", value: data.defective, fill: "var(--color-defective)" },
    { name: "Returned", value: data.returned, fill: "var(--color-returned)" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Items Received by Condition</CardTitle>
        <CardDescription>Receiving breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
