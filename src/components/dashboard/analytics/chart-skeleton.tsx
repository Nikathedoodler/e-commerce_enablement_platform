import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartSkeletonProps {
  title?: string;
  description?: string;
}

export function ChartSkeleton({ title, description }: ChartSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        {title && (
          <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        )}
        {description && (
          <CardDescription className="text-xs sm:text-sm">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {/* Fixed dimensions matching ChartAreaInteractive: h-[200px] sm:h-[250px] */}
        <Skeleton className="h-[200px] w-full sm:h-[250px]" />
      </CardContent>
    </Card>
  );
}
