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
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { OrdersTableSkeleton } from "./orders-table-skeleton";
import { OrderDetailDialog } from "./order-detail-dialog";
import { Order } from "@/types/orders";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname } from "next/navigation";

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
  const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const filters = {
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
  };

  const { data: orders, isLoading, error } = useOrders(filters);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search orders or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
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
                      setIsViewOpen(true);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant={"destructive"} size="icon">
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <OrderDetailDialog
        orderItem={selectedOrder}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        statusColor={getStatusColor}
      />
    </div>
  );
}
