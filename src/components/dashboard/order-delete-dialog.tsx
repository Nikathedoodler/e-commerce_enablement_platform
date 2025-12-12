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
import { useOrderDelete } from "@/hooks/use-orders";
import { toast } from "sonner";

type OrderDeleteDialogProps = {
  id: string | undefined;
  orderNumber?: string;
  customerEmail?: string;
  total?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function OrderDeleteDialog({
  id,
  orderNumber,
  customerEmail,
  total,
  open,
  onOpenChange,
}: OrderDeleteDialogProps) {
  const deleteOrderMutation = useOrderDelete();

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteOrderMutation.mutateAsync(id);
      toast.success("Order Deleted successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the order
            and remove it from your records.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {(orderNumber || customerEmail || total !== undefined) && (
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-lg">Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orderNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Order Number
                    </span>
                    <span className="font-semibold">#{orderNumber}</span>
                  </div>
                )}
                {customerEmail && (
                  <>
                    {orderNumber && <Separator />}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Customer Email
                      </span>
                      <span className="font-medium">{customerEmail}</span>
                    </div>
                  </>
                )}
                {total !== undefined && (
                  <>
                    {(orderNumber || customerEmail) && <Separator />}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total Amount
                      </span>
                      <span className="font-semibold text-lg">
                        ${total.toFixed(2)}
                      </span>
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
            Delete Order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
