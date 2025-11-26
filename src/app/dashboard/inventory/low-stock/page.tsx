export default function LowStockPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Low Stock Items</h1>
        <p className="text-muted-foreground">
          Items that need restocking
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Low stock items will be displayed here
        </p>
      </div>
    </div>
  );
}

