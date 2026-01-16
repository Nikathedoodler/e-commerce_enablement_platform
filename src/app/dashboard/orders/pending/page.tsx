import { Suspense } from "react";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { OrdersTableSkeleton } from "@/components/dashboard/orders-table-skeleton";

export default function PendingOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pending Orders</h1>
        <p className="text-muted-foreground">Orders awaiting fulfillment</p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <Suspense fallback={<OrdersTableSkeleton />}>
          <OrdersTable defaultStatus="pending" />
        </Suspense>
      </div>
    </div>
  );
}
