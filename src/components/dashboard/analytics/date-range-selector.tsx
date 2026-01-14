"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import type { DateRangePreset } from "@/types/analytics";

interface DateRangeSelectorProps {
  value: DateRangePreset;
  onChange: (preset: DateRangePreset) => void;
}

const presets: { value: DateRangePreset; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 3 months" },
  { value: "180d", label: "Last 6 months" },
  { value: "1y", label: "Last year" },
];

export function DateRangeSelector({
  value,
  onChange,
}: DateRangeSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {presets.map((preset) => (
        <Button
          key={preset.value}
          variant={value === preset.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(preset.value)}
          className={cn(
            "text-xs whitespace-nowrap",
            value === preset.value && "bg-primary text-primary-foreground"
          )}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}

/**
 * Helper function to convert preset to DateRange
 */
export function getDateRangeFromPreset(
  preset: DateRangePreset
): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999); // End of today

  const startDate = new Date();

  switch (preset) {
    case "7d":
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(endDate.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(endDate.getDate() - 90);
      break;
    case "180d":
      startDate.setDate(endDate.getDate() - 180);
      break;
    case "1y":
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    case "custom":
      // For custom, we'd need a date picker - for now, default to 30 days
      startDate.setDate(endDate.getDate() - 30);
      break;
  }

  startDate.setHours(0, 0, 0, 0); // Start of day

  return { startDate, endDate };
}
