import { InventoryTable } from "@/components/dashboard/inventory-table";

export default function AllItemsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Items</h1>
        <p className="text-muted-foreground">View and manage your inventory</p>
      </div>
      <InventoryTable lowStockOnly={false} />
    </div>
  );
}
