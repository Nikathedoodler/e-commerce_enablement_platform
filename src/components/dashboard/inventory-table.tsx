"use client";

import { useInventories } from "@/hooks/use-inventory";
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
import { InventoryTableSkeleton } from "./inventory-table-skeleton";
import { InventoryItem } from "@/types/inventory";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";
import { InventoryDeleteDialog } from "./inventory-delete-dialog";
import { InventoryDetailDialog } from "./inventory-detail-dialog";

/**
 * Determines if an item is low on stock
 * An item is low stock when quantity <= reorder_threshold
 */
function isLowStock(item: InventoryItem): boolean {
  return item.quantity <= item.reorder_threshold;
}

/**
 * Returns color classes for low stock badge
 * Red for low stock, green for adequate stock
 */
function getStockStatusColor(isLow: boolean) {
  return isLow
    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
}

interface InventoryTableProps {
  /**
   * If true, only shows items with low stock (quantity <= reorder_threshold)
   * This is used on the low-stock page
   */
  lowStockOnly?: boolean;
}

export function InventoryTable({ lowStockOnly = false }: InventoryTableProps) {
  const [search, setSearch] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const router = useRouter();

  // Build filters object
  const filters = {
    search: debouncedSearch || undefined,
    // Convert boolean to string "true" if lowStockOnly is true
    // The query helper expects a string or undefined
    lowStockOnly: lowStockOnly ? "true" : undefined,
  };

  const { data: items, isLoading, error } = useInventories(filters);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Search by SKU or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Button
          className="cursor-pointer"
          onClick={() => router.push("/dashboard/inventory/add-new")}
        >
          Add Item
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <InventoryTableSkeleton />
      ) : error ? (
        /* Error State */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-destructive">
            Failed to load inventory
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
      ) : !items?.length ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            {lowStockOnly
              ? "No low stock items found"
              : "No inventory items found"}
          </p>
          {debouncedSearch ? (
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">
              Get started by adding your first inventory item
            </p>
          )}
        </div>
      ) : (
        /* Table with Data */
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Reorder Threshold</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const lowStock = isLowStock(item);
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">
                    {item.sku}
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.reorder_threshold}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.location || "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(
                        lowStock
                      )}`}
                    >
                      {lowStock ? "Low Stock" : "In Stock"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDetailDialogOpen(true);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant={"destructive"}
                        size="icon"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Delete Dialog */}
      <InventoryDeleteDialog
        id={selectedItem?.id}
        sku={selectedItem?.sku}
        name={selectedItem?.name}
        quantity={selectedItem?.quantity}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />

      {/* Detail Dialog */}
      <InventoryDetailDialog
        inventoryItem={selectedItem}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </div>
  );
}
