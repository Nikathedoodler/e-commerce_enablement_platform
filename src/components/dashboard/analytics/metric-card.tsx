"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  isLoading?: boolean;
}

export function MetricCard({
  title,
  value,
  change,
  subtitle,
  trend,
  isLoading,
}: MetricCardProps) {
  const formatValue = (val: string | number): string => {
    if (typeof val === "number") {
      return val.toLocaleString();
    }
    return val;
  };

  const formatChange = (changeValue?: number): string => {
    if (changeValue === undefined || changeValue === null) {
      return "";
    }
    const sign = changeValue >= 0 ? "+" : "";
    return `${sign}${changeValue.toFixed(1)}%`;
  };

  const getTrendIcon = () => {
    if (trend === "up") {
      return <ArrowUp className="h-4 w-4 text-green-600" />;
    }
    if (trend === "down") {
      return <ArrowDown className="h-4 w-4 text-red-600" />;
    }
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getChangeColor = () => {
    if (trend === "up") {
      return "text-green-600";
    }
    if (trend === "down") {
      return "text-red-600";
    }
    return "text-muted-foreground";
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            {subtitle && (
              <div className="h-3 w-40 bg-muted animate-pulse rounded" />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{formatValue(value)}</p>
            {change !== undefined && change !== null && (
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  getChangeColor()
                )}
              >
                {getTrendIcon()}
                <span>{formatChange(change)}</span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
