import { OrdersTable } from "@/components/dashboard/orders-table";

export default function AllOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Orders</h1>
        <p className="text-muted-foreground">View and manage all your orders</p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <OrdersTable defaultStatus="" />
      </div>
    </div>
  );
}
