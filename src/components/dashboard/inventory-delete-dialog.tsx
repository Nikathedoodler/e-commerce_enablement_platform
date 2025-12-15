"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useInventoryDelete } from "@/hooks/use-inventory";
import { toast } from "sonner";

type InventoryDeleteDialogProps = {
  id: string | undefined;
  sku?: string;
  name?: string;
  quantity?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function InventoryDeleteDialog({
  id,
  sku,
  name,
  quantity,
  open,
  onOpenChange,
}: InventoryDeleteDialogProps) {
  const deleteInventoryMutation = useInventoryDelete();

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteInventoryMutation.mutateAsync(id);
      toast.success("Inventory item deleted successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete inventory item");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            inventory item and remove it from your records.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {(sku || name || quantity !== undefined) && (
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-lg">Item Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sku && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">SKU</span>
                    <span className="font-mono font-semibold">{sku}</span>
                  </div>
                )}
                {name && (
                  <>
                    {sku && <Separator />}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <span className="font-medium">{name}</span>
                    </div>
                  </>
                )}
                {quantity !== undefined && (
                  <>
                    {(sku || name) && <Separator />}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Quantity
                      </span>
                      <span className="font-semibold text-lg">{quantity}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Delete Item
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

