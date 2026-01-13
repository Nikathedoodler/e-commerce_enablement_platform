"use client";

import { useLabelAuditLogByOrderId } from "@/hooks/use-label-audit-log";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, Clock, Zap, Hand } from "lucide-react";
// Simple date formatter (no external dependency needed)
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`;
}

type LabelAuditLogProps = {
  orderId: string;
};

export function LabelAuditLog({ orderId }: LabelAuditLogProps) {
  const { data: auditLogs, isLoading, error } = useLabelAuditLogByOrderId(orderId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Generation History</CardTitle>
          <CardDescription>Loading audit log...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Generation History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            Error loading audit log: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!auditLogs || auditLogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Generation History</CardTitle>
          <CardDescription>No generation attempts recorded yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusDescription = (status: string): string => {
    switch (status) {
      case "success":
        return "Label generated successfully";
      case "failed":
        return "Label generation failed";
      case "pending":
        return "Label generation in progress...";
      default:
        return "";
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "destructive" | "secondary" => {
    switch (status) {
      case "success":
        return "default";
      case "failed":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getGenerationTypeIcon = (type: string) => {
    return type === "auto" ? (
      <Zap className="h-3 w-3" />
    ) : (
      <Hand className="h-3 w-3" />
    );
  };

  const formatTriggeredBy = (triggeredBy: string | null) => {
    if (!triggeredBy) return "Unknown";
    return triggeredBy
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Generation History</CardTitle>
        <CardDescription>
          Audit log of all label generation attempts for this order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="border rounded-lg p-4 space-y-2 bg-muted/50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 flex-wrap">
                  {getStatusIcon(log.status)}
                  <Badge
                    variant={getStatusBadgeVariant(log.status)}
                    className="text-xs"
                  >
                    {log.status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getGenerationTypeIcon(log.generation_type)}
                    <span className="ml-1">
                      {log.generation_type === "auto" ? "Auto" : "Manual"}
                    </span>
                  </Badge>
                  {log.carrier && (
                    <Badge variant="outline" className="text-xs">
                      {log.carrier}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(log.created_at)}
                </span>
              </div>

              {/* Status description */}
              <div className="text-xs text-muted-foreground">
                {getStatusDescription(log.status)}
              </div>

              {log.triggered_by && (
                <div className="text-xs text-muted-foreground">
                  Triggered by: {formatTriggeredBy(log.triggered_by)}
                </div>
              )}

              {log.tracking_number && (
                <div className="text-sm">
                  <span className="font-medium">Tracking:</span>{" "}
                  <span className="font-mono">{log.tracking_number}</span>
                </div>
              )}

              {log.cost !== null && (
                <div className="text-sm">
                  <span className="font-medium">Cost:</span> €{log.cost.toFixed(2)}
                </div>
              )}

              {log.error_message && (
                <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                  <span className="font-medium">Error:</span> {log.error_message}
                </div>
              )}

              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    View details
                  </summary>
                  <pre className="mt-2 p-2 bg-background rounded text-xs overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
