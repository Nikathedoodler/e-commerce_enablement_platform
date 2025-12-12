import { OrdersTable } from "@/components/dashboard/orders-table";

export default function PendingOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pending Orders</h1>
        <p className="text-muted-foreground">Orders awaiting fulfillment</p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <OrdersTable defaultStatus="pending" />
      </div>
    </div>
  );
}
