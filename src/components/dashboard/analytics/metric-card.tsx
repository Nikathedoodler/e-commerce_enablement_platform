"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";

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
  const shouldReduceMotion = useReducedMotion();

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
      return <TrendingUp className="size-4" />;
    }
    if (trend === "down") {
      return <TrendingDown className="size-4" />;
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            <div className="h-4 w-24 bg-muted-foreground/20 animate-pulse rounded" />
          </CardDescription>
          <CardTitle>
            <div className="h-8 w-32 bg-muted-foreground/20 animate-pulse rounded" />
          </CardTitle>
        </CardHeader>
        {subtitle && (
          <CardFooter>
            <div className="h-3 w-40 bg-muted-foreground/20 animate-pulse rounded" />
          </CardFooter>
        )}
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={
        shouldReduceMotion
          ? {}
          : { y: -4, transition: { duration: 0.2 } }
      }
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
    >
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-xs sm:text-sm">
            {title}
          </CardDescription>
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.3, delay: 0.1 }
            }
          >
            <CardTitle className="text-xl font-semibold tabular-nums sm:text-2xl @[250px]/card:text-3xl">
              {formatValue(value)}
            </CardTitle>
          </motion.div>
          {change !== undefined && change !== null && (
            <CardAction>
              <motion.div
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.3, delay: 0.2 }
                }
              >
                <Badge variant="outline" className="gap-1 text-xs">
                  {getTrendIcon()}
                  {formatChange(change)}
                </Badge>
              </motion.div>
            </CardAction>
          )}
        </CardHeader>
        {subtitle && (
          <CardFooter className="flex-col items-start gap-1.5 text-xs sm:text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {subtitle} {trend && trend !== "neutral" && getTrendIcon()}
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
