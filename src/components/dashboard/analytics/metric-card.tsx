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
      return <ArrowUp className="h-3 w-3" />;
    }
    if (trend === "down") {
      return <ArrowDown className="h-3 w-3" />;
    }
    return <Minus className="h-3 w-3" />;
  };

  const getChangeColor = () => {
    if (trend === "up") {
      return "text-green-600 dark:text-green-500";
    }
    if (trend === "down") {
      return "text-red-600 dark:text-red-500";
    }
    return "text-muted-foreground";
  };

  const getBadgeBgColor = () => {
    if (trend === "up") {
      return "bg-green-50 dark:bg-green-950/20";
    }
    if (trend === "down") {
      return "bg-red-50 dark:bg-red-950/20";
    }
    return "bg-muted";
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-b from-background via-muted/20 to-muted/40">
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted-foreground/20 animate-pulse rounded" />
            <div className="h-8 w-32 bg-muted-foreground/20 animate-pulse rounded" />
            {subtitle && (
              <div className="h-3 w-40 bg-muted-foreground/20 animate-pulse rounded" />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-b from-background via-muted/20 to-muted/40 border-muted">
      <CardContent className="p-6 relative">
        {/* Title */}
        <div className="flex items-start justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {/* Change badge in top right */}
          {change !== undefined && change !== null && (
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium",
                getBadgeBgColor(),
                getChangeColor()
              )}
            >
              {getTrendIcon()}
              <span>{formatChange(change)}</span>
            </div>
          )}
        </div>

        {/* Main value */}
        <p className="text-2xl font-bold mb-2">{formatValue(value)}</p>

        {/* Subtitle */}
        {subtitle && (
          <div className="flex items-center gap-1.5">
            {trend && trend !== "neutral" && (
              <div className={cn("flex items-center", getChangeColor())}>
                {getTrendIcon()}
              </div>
            )}
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
