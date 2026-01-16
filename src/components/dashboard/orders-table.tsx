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
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { OrdersTableSkeleton } from "./orders-table-skeleton";
import { OrderDetailDialog } from "./order-detail-dialog";
import { Order } from "@/types/orders";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname } from "next/navigation";
import { OrderDeleteDialog } from "./order-delete-dialog";
import { useRouter } from "next/navigation";
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
  const isAllOrdersPage = pathname?.includes("/all-orders");

  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>(defaultStatus);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const debouncedSearch = useDebounce(search, 300);

  const router = useRouter();

  const filters = {
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    page,
    pageSize,
    sortBy,
    sortOrder,
  };

  const { data: ordersResult, isLoading, error } = useOrders(filters);
  const orders = ordersResult?.data || [];
  const pagination = ordersResult?.pagination;

  // Reset to page 1 when search, status filter, or sort changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new column and default to descending
      setSortBy(column);
      setSortOrder("desc");
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="hidden md:block md:max-w-sm"
          />
          {isAllOrdersPage && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
          {debouncedSearch || statusFilter ? (
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
