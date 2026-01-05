"use client";

import { InventoryItem } from "@/types/inventory";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUpdateInventory } from "@/hooks/use-inventory";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";

type InventoryDetailDialogProps = {
  inventoryItem: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Determines if an item is low on stock
 */
function isLowStock(item: InventoryItem): boolean {
  return item.quantity <= item.reorder_threshold;
}

/**
 * Returns color classes for low stock badge
 */
function getStockStatusColor(isLow: boolean) {
  return isLow
    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
}

export function InventoryDetailDialog({
  inventoryItem,
  open,
  onOpenChange,
}: InventoryDetailDialogProps) {
  const [editedItem, setEditedItem] = useState<Partial<InventoryItem>>({});
  const updateInventory = useUpdateInventory();

  if (!inventoryItem) return null;

  const lowStock = isLowStock(inventoryItem);
  const hasChanges = Object.keys(editedItem).length > 0;

  const handleFieldChange = (
    field: keyof InventoryItem,
    value: string | number | null
  ) => {
    setEditedItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!hasChanges) return;

    try {
      await updateInventory.mutateAsync({
        id: inventoryItem.id,
        updates: editedItem,
      });
      toast.success("Inventory item updated successfully");
      setEditedItem({});
      onOpenChange(false);
    } catch {
      toast.error("Failed to update inventory item");
    }
  };

  const handleCancel = () => {
    setEditedItem({});
    onOpenChange(false);
  };

  // Use edited values if available, otherwise use original values
  const displayItem = {
    ...inventoryItem,
    ...editedItem,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 flex-wrap">
            <span>{displayItem.name}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(
                lowStock
              )}`}
            >
              {lowStock ? "Low Stock" : "In Stock"}
            </span>
          </DialogTitle>
          <DialogDescription>
            SKU: <span className="font-mono">{displayItem.sku}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel htmlFor="sku">
                  SKU <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="sku"
                  type="text"
                  value={displayItem.sku}
                  onChange={(e) => handleFieldChange("sku", e.target.value)}
                  className="font-mono"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="name">
                  Product Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="name"
                  type="text"
                  value={displayItem.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                />
              </Field>
            </CardContent>
          </Card>

          {/* Stock Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stock Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="quantity">
                    Quantity
                  </FieldLabel>
                  <FieldDescription>
                    Current stock quantity available
                  </FieldDescription>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={displayItem.quantity}
                    onChange={(e) =>
                      handleFieldChange(
                        "quantity",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="reorder_threshold">
                    Reorder Threshold
                  </FieldLabel>
                  <FieldDescription>
                    Alert when quantity falls to or below this number
                  </FieldDescription>
                  <Input
                    id="reorder_threshold"
                    type="number"
                    min="0"
                    value={displayItem.reorder_threshold}
                    onChange={(e) =>
                      handleFieldChange(
                        "reorder_threshold",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </Field>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <Field>
                <FieldLabel htmlFor="location">Storage Location</FieldLabel>
                <FieldDescription>
                  Warehouse, shelf, or bin location for this item
                </FieldDescription>
                <Input
                  id="location"
                  type="text"
                  value={displayItem.location || ""}
                  onChange={(e) =>
                    handleFieldChange("location", e.target.value || null)
                  }
                  placeholder="e.g., Warehouse A - Shelf 3"
                />
              </Field>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>
                    {new Date(inventoryItem.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>
                    {new Date(inventoryItem.updated_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {hasChanges && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Save Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 items-center justify-end">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={updateInventory.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdate}
                    disabled={updateInventory.isPending}
                  >
                    {updateInventory.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
