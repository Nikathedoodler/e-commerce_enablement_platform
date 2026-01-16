"use client";

import { useReceivingLogs } from "@/hooks/use-receiving";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { ReceivingHistoryTableSkeleton } from "./receiving-history-table-skeleton";
import { Pagination } from "@/components/ui/pagination";

function getConditionColor(condition: string) {
  switch (condition) {
    case "good":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "damaged":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "defective":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "returned":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}

export function ReceivingHistoryTable() {
  const [search, setSearch] = useState<string>("");
  const [conditionFilter, setConditionFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const debouncedSearch = useDebounce(search, 300);

  const filters = {
    search: debouncedSearch || undefined,
    page,
    pageSize,
  };

  const { data: logsResult, isLoading, error } = useReceivingLogs(filters);
  const logs = logsResult?.data || [];
  const pagination = logsResult?.pagination;

  // Filter by condition on client side if needed
  // Note: For better performance with large datasets, consider moving condition filter to server-side
  const filteredLogs = conditionFilter
    ? logs?.filter((log) => log.condition === conditionFilter)
    : logs;

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Search by SKU or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-3"
          >
            <option value="">All Conditions</option>
            <option value="good">Good</option>
            <option value="damaged">Damaged</option>
            <option value="defective">Defective</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <ReceivingHistoryTableSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-destructive">
            Failed to load receiving history
          </p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      ) : !filteredLogs?.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No receiving logs found
          </p>
          {debouncedSearch ? (
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">
              Start by recording your first receiving entry
            </p>
          )}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date Received</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Client ID</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {new Date(log.received_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="font-mono text-sm">{log.sku}</TableCell>
                <TableCell>{log.quantity}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(
                      log.condition
                    )}`}
                  >
                    {log.condition.charAt(0).toUpperCase() +
                      log.condition.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {log.location || "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {log.client_id || "—"}
                </TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">
                  {log.notes || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {pagination && pagination.totalPages > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onPageSizeChange={(newPageSize) => {
              setPageSize(newPageSize);
              setPage(1); // Reset to first page when changing page size
            }}
          />
        </div>
      )}
    </div>
  );
}
