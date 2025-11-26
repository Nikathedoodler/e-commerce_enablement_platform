export default function AllItemsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Items</h1>
        <p className="text-muted-foreground">View and manage your inventory</p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Inventory items will be displayed here
        </p>
      </div>
    </div>
  );
}
