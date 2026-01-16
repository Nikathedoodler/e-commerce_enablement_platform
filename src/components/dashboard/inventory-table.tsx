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
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { InventoryTableSkeleton } from "./inventory-table-skeleton";
import { InventoryItem } from "@/types/inventory";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { InventoryDeleteDialog } from "./inventory-delete-dialog";
import { InventoryDetailDialog } from "./inventory-detail-dialog";
import { Pagination } from "@/components/ui/pagination";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read filter state from URL query parameters with defaults
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const sortBy = searchParams.get("sortBy") || "created_at";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const searchFromURL = searchParams.get("search") || "";

  // Local state for search input (debounced before updating URL)
  const [searchInput, setSearchInput] = useState<string>(searchFromURL);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const debouncedSearch = useDebounce(searchInput, 300);

  // Update URL query parameters
  const updateURL = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Reset to page 1 when filters change (except when explicitly setting page)
      if (!updates.page && Object.keys(updates).some((k) => k !== "page")) {
        params.set("page", "1");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // Sync debounced search to URL (only update if it actually changed)
  useEffect(() => {
    if (debouncedSearch !== searchFromURL) {
      updateURL({ search: debouncedSearch || null });
    }
  }, [debouncedSearch, searchFromURL, updateURL]);

  // Sync URL search param to local input when URL changes externally
  useEffect(() => {
    if (searchFromURL !== searchInput) {
      setSearchInput(searchFromURL);
    }
  }, [searchFromURL]);

  // Build filters object from URL params
  const filters = {
    search: searchFromURL || undefined,
    // Convert boolean to string "true" if lowStockOnly is true
    // The query helper expects a string or undefined
    lowStockOnly: lowStockOnly ? "true" : undefined,
    page,
    pageSize,
    sortBy,
    sortOrder,
  };

  const { data: itemsResult, isLoading, error } = useInventories(filters);
  const items = itemsResult?.data || [];
  const pagination = itemsResult?.pagination;

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order if clicking the same column
      updateURL({
        sortOrder: sortOrder === "asc" ? "desc" : "asc",
        page: 1, // Reset to page 1 when sorting changes
      });
    } else {
      // Set new column and default to descending
      updateURL({
        sortBy: column,
        sortOrder: "desc",
        page: 1, // Reset to page 1 when sorting changes
      });
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Search by SKU or name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
          {searchFromURL ? (
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
              <TableHead>
                <button
                  onClick={() => handleSort("sku")}
                  className="flex items-center hover:text-foreground transition-colors cursor-pointer"
                >
                  SKU
                  <SortIcon column="sku" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center hover:text-foreground transition-colors cursor-pointer"
                >
                  Name
                  <SortIcon column="name" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("quantity")}
                  className="flex items-center hover:text-foreground transition-colors cursor-pointer"
                >
                  Quantity
                  <SortIcon column="quantity" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("reorder_threshold")}
                  className="flex items-center hover:text-foreground transition-colors cursor-pointer"
                >
                  Reorder Threshold
                  <SortIcon column="reorder_threshold" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("location")}
                  className="flex items-center hover:text-foreground transition-colors cursor-pointer"
                >
                  Location
                  <SortIcon column="location" />
                </button>
              </TableHead>
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
      {pagination && pagination.totalPages > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            onPageChange={(newPage) => {
              updateURL({ page: newPage });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onPageSizeChange={(newPageSize) => {
              updateURL({ pageSize: newPageSize, page: 1 });
            }}
          />
        </div>
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
