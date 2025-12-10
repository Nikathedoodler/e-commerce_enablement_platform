import { OrdersTable } from "@/components/dashboard/orders-table";

export default function FulfilledOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fulfilled Orders</h1>
        <p className="text-muted-foreground">Completed and shipped orders</p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <OrdersTable defaultStatus="fulfilled" />
      </div>
    </div>
  );
}
