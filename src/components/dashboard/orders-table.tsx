"use client";

import { useOrders } from "@/hooks/use-orders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { OrdersTableSkeleton } from "./orders-table-skeleton";
import { OrderDetailDialog } from "./order-detail-dialog";
import { Order } from "@/types/orders";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { OrderDeleteDialog } from "./order-delete-dialog";
import { Pagination } from "@/components/ui/pagination";

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "fulfilled":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}

interface OrdersTableProps {
  defaultStatus: string;
}

export function OrdersTable({ defaultStatus }: OrdersTableProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isAllOrdersPage = pathname?.includes("/all-orders");

  // Read filter state from URL query parameters with defaults
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const sortBy = searchParams.get("sortBy") || "created_at";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const searchFromURL = searchParams.get("search") || "";
  // For status filter, use URL param if on all-orders page, otherwise use defaultStatus prop
  const statusFromURL = searchParams.get("status") || "";
  const statusFilter = isAllOrdersPage
    ? statusFromURL || ""
    : defaultStatus || "";

  // Local state for search input (debounced before updating URL)
  const [searchInput, setSearchInput] = useState<string>(searchFromURL);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const debouncedSearch = useDebounce(searchInput, 300);

  // Update URL query parameters
  const updateURL = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Reset to page 1 when filters change (except when explicitly setting page)
      if (!updates.page && Object.keys(updates).some((k) => k !== "page")) {
        params.set("page", "1");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // Sync debounced search to URL (only update if it actually changed)
  useEffect(() => {
    if (debouncedSearch !== searchFromURL) {
      updateURL({ search: debouncedSearch || null });
    }
  }, [debouncedSearch, searchFromURL, updateURL]);

  // Sync URL search param to local input when URL changes externally
  useEffect(() => {
    if (searchFromURL !== searchInput) {
      setSearchInput(searchFromURL);
    }
  }, [searchFromURL, searchInput]);

  // Build filters object from URL params
  const filters = {
    search: searchFromURL || undefined,
    status: statusFilter || undefined,
    page,
    pageSize,
    sortBy,
    sortOrder,
  };

  const { data: ordersResult, isLoading, error } = useOrders(filters);
  const orders = ordersResult?.data || [];
  const pagination = ordersResult?.pagination;

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order if clicking the same column
      updateURL({
        sortOrder: sortOrder === "asc" ? "desc" : "asc",
        page: 1, // Reset to page 1 when sorting changes
      });
    } else {
      // Set new column and default to descending
      updateURL({
        sortBy: column,
        sortOrder: "desc",
        page: 1, // Reset to page 1 when sorting changes
      });
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4 items-center justify-between w-full md:w-auto">
          <Input
            placeholder="Search orders or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="hidden md:block md:max-w-sm"
          />
          {isAllOrdersPage && (
            <select
              value={statusFilter}
              onChange={(e) => updateURL({ status: e.target.value || null, page: 1 })}
              className="h-9 rounded-md border border-input bg-transparent px-3"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          )}
          <Button
            className="cursor-pointer md:hidden"
            onClick={() => router.push("/dashboard/orders/create-order")}
          >
            Create Order
          </Button>
        </div>
        <Button
          className="cursor-pointer hidden md:block"
          onClick={() => router.push("/dashboard/orders/create-order")}
        >
          Create Order
        </Button>
      </div>
      <div className="md:hidden">
        <Input
          placeholder="Search orders or email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full"
        />
      </div>
      {isLoading ? (
        <OrdersTableSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-destructive">
            Failed to load orders
          </p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : !orders?.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No orders found
          </p>
          {searchFromURL || statusFilter ? (
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your filters
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">
              Get started by creating your first order
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto md:overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort("order_number")}
                    className="flex items-center hover:text-foreground transition-colors cursor-pointer"
                  >
                    Order #
                    <SortIcon column="order_number" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("customer_email")}
                    className="flex items-center hover:text-foreground transition-colors cursor-pointer"
                  >
                    Customer
                    <SortIcon column="customer_email" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center hover:text-foreground transition-colors cursor-pointer"
                  >
                    Status
                    <SortIcon column="status" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("total")}
                    className="flex items-center hover:text-foreground transition-colors cursor-pointer"
                  >
                    Total
                    <SortIcon column="total" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("created_at")}
                    className="flex items-center hover:text-foreground transition-colors cursor-pointer"
                  >
                    Date
                    <SortIcon column="created_at" />
                  </button>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.order_number}</TableCell>
                  <TableCell>{order.customer_email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log("View order:", order);
                        setSelectedOrder(order);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={"destructive"}
                      size="icon"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {pagination && pagination.totalPages > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            onPageChange={(newPage) => {
              updateURL({ page: newPage });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onPageSizeChange={(newPageSize) => {
              updateURL({ pageSize: newPageSize, page: 1 });
            }}
          />
        </div>
      )}
      <OrderDetailDialog
        orderItem={selectedOrder}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        statusColor={getStatusColor}
      />
      <OrderDeleteDialog
        id={selectedOrder?.id}
        orderNumber={selectedOrder?.order_number}
        customerEmail={selectedOrder?.customer_email}
        total={selectedOrder?.total}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  );
}
