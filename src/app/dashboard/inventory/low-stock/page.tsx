import { InventoryTable } from "@/components/dashboard/inventory-table";

export default function LowStockPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Low Stock Items</h1>
        <p className="text-muted-foreground">
          Items that need restocking
        </p>
      </div>
      <InventoryTable lowStockOnly={true} />
    </div>
  );
}

