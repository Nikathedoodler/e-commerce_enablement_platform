"use client";

import { Order, OrderItem as OrderItemType, OrderStatus } from "@/types/orders";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUpdateOrder } from "@/hooks/use-orders";
import { useShippingLabelsByOrderId } from "@/hooks/use-shipping";
import { toast } from "sonner";
import { GenerateLabelDialog } from "./generate-label-dialog";
import { LabelAuditLog } from "./label-audit-log";
import { Badge } from "@/components/ui/badge";

type OrderDetailDialogProps = {
  orderItem: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statusColor: (status: string) => string;
};

export function OrderDetailDialog({
  orderItem,
  open,
  onOpenChange,
  statusColor,
}: OrderDetailDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [generateLabelOpen, setGenerateLabelOpen] = useState(false);
  const updateOrder = useUpdateOrder();

  // Fetch shipping labels for this order
  // Add refetchInterval to poll for new labels (useful when auto-generation happens)
  const {
    data: shippingLabels,
    isLoading: labelsLoading,
    refetch: refetchLabels,
  } = useShippingLabelsByOrderId(orderItem?.id || "");

  if (!orderItem) return null;

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === orderItem.status) return;

    try {
      await updateOrder.mutateAsync({
        id: orderItem.id,
        updates: { status: selectedStatus as OrderStatus },
      });
      toast.success("Order status updated successfully");

      // If status changed to "processing", auto-generation might happen
      // Show a message and refresh labels after a delay
      if (selectedStatus === "processing") {
        toast.info(
          "Auto-generating shipping label... Check back in a few seconds."
        );
        setTimeout(() => {
          refetchLabels();
        }, 3000); // 3 second delay to allow auto-generation to complete
      }

      onOpenChange(false);
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const calculateItemTotal = (item: OrderItemType) => {
    return item.total || item.quantity * item.price;
  };

  const subtotal = orderItem.items.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-3xl max-h-[90vh] w-full overflow-hidden flex flex-col p-4 sm:p-6">
        <DialogHeader className="flex-shrink-0 text-center sm:text-left">
          <DialogTitle className="text-base sm:text-lg">
            Order {orderItem.order_number}
          </DialogTitle>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(
                  orderItem.status
                )}`}
              >
                {orderItem.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Payment:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  orderItem.financial_status === "paid"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : orderItem.financial_status === "refunded" ||
                      orderItem.financial_status === "partially_refunded"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                }`}
              >
                {orderItem.financial_status}
              </span>
            </div>
          </div>
          <DialogDescription className="mt-2">
            Placed on{" "}
            {new Date(orderItem.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto overflow-x-auto min-w-0">
          <div className="space-y-4 min-w-fit">
            {/* Customer Information */}
            <Card className="min-w-0 w-full">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{orderItem.customer_email}</p>
                  {orderItem.shipping_address?.name && (
                    <p className="text-sm text-muted-foreground">
                      {orderItem.shipping_address.name}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="min-w-0 w-full">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {/* Mobile/Tablet: Card Layout */}
                <div className="block md:hidden space-y-3">
                  {orderItem.items.map((item, index) => (
                    <div
                      key={`${item.sku}-${index}`}
                      className="border rounded-lg p-3 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm break-words">
                            {item.name}
                          </p>
                          <p className="font-mono text-xs text-muted-foreground mt-1">
                            SKU: {item.sku}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 text-sm">
                        <div className="space-y-1 w-full sm:w-auto">
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">
                              Quantity:
                            </span>
                            <span className="font-medium">{item.quantity}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">
                              Price:
                            </span>
                            <span>${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0">
                          <div className="text-xs text-muted-foreground">
                            Total
                          </div>
                          <div className="font-semibold text-base">
                            ${calculateItemTotal(item).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: Table Layout */}
                <div className="hidden md:block overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
                  <Table className="table-fixed w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">SKU</TableHead>
                        <TableHead className="w-[200px]">Product</TableHead>
                        <TableHead className="text-right w-[80px]">
                          Quantity
                        </TableHead>
                        <TableHead className="text-right w-[100px]">
                          Price
                        </TableHead>
                        <TableHead className="text-right w-[100px]">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItem.items.map((item, index) => (
                        <TableRow key={`${item.sku}-${index}`}>
                          <TableCell className="font-mono text-sm">
                            {item.sku}
                          </TableCell>
                          <TableCell className="font-medium w-[200px] overflow-hidden">
                            <div className="break-words whitespace-normal">
                              {item.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            ${item.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${calculateItemTotal(item).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {orderItem.shipping_address && (
              <Card className="min-w-0 w-full">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {orderItem.shipping_address.name && (
                      <p className="font-medium">
                        {orderItem.shipping_address.name}
                      </p>
                    )}
                    {orderItem.shipping_address.address1 && (
                      <p className="text-sm">
                        {orderItem.shipping_address.address1}
                      </p>
                    )}
                    {orderItem.shipping_address.address2 && (
                      <p className="text-sm">
                        {orderItem.shipping_address.address2}
                      </p>
                    )}
                    {(orderItem.shipping_address.city ||
                      orderItem.shipping_address.state ||
                      orderItem.shipping_address.zip) && (
                      <p className="text-sm">
                        {orderItem.shipping_address.city || ""}
                        {orderItem.shipping_address.city &&
                          orderItem.shipping_address.state &&
                          ", "}
                        {orderItem.shipping_address.state || ""}
                        {orderItem.shipping_address.zip && " "}
                        {orderItem.shipping_address.zip || ""}
                      </p>
                    )}
                    {orderItem.shipping_address.country && (
                      <p className="text-sm">
                        {orderItem.shipping_address.country}
                      </p>
                    )}
                    {orderItem.shipping_address.phone && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Phone: {orderItem.shipping_address.phone}
                      </p>
                    )}
                    {/* Debug: Show if address is incomplete */}
                    {(!orderItem.shipping_address.city ||
                      !orderItem.shipping_address.zip ||
                      !orderItem.shipping_address.country) && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                        ⚠️ Incomplete address: Missing city, zip, or country
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Totals */}
            <Card className="min-w-0 w-full">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${orderItem.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Labels */}
            <Card className="min-w-0 w-full">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base sm:text-lg">
                    Shipping Labels
                    {shippingLabels && shippingLabels.length > 0 && (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({shippingLabels.length})
                      </span>
                    )}
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setGenerateLabelOpen(true)}
                    disabled={!orderItem.shipping_address}
                  >
                    {shippingLabels && shippingLabels.length > 0
                      ? "Generate Another Label"
                      : "Generate Label"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {labelsLoading ? (
                  <p className="text-sm text-muted-foreground">
                    Loading labels...
                  </p>
                ) : shippingLabels && shippingLabels.length > 0 ? (
                  <div className="space-y-3">
                    {shippingLabels.map((label) => (
                      <div
                        key={label.id}
                        className="rounded-lg border p-4 space-y-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-1">
                            <div className="flex items-center justify-between sm:justify-start gap-2">
                              <Badge variant="outline" className="w-fit">
                                {label.carrier}
                              </Badge>
                              <span className="text-sm font-semibold sm:hidden">
                                {label.cost.toFixed(2)}{" "}
                                {label.carrier === "DHL" ? "EUR" : ""}
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {label.tracking_number}
                            </span>
                          </div>
                          <span className="text-sm font-semibold hidden sm:inline">
                            {label.cost.toFixed(2)}{" "}
                            {label.carrier === "DHL" ? "EUR" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            Generated:{" "}
                            {new Date(label.generated_at).toLocaleDateString()}
                          </span>
                          {label.label_url && (
                            <a
                              href={label.label_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Download Label
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      No shipping labels generated yet. Click &quot;Generate
                      Label&quot; above to create one.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tracking Number (Legacy - will be replaced by labels) */}
            {orderItem.tracking_number && !shippingLabels?.length && (
              <Card className="min-w-0 w-full">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Tracking Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-sm">
                    {orderItem.tracking_number}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Label Generation History */}
            <LabelAuditLog orderId={orderItem.id} />

            {/* Status Update */}
            <Card className="min-w-0 w-full">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">
                  Update Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 items-center">
                  <select
                    value={selectedStatus || orderItem.status}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="h-9 rounded-md border border-input bg-transparent px-3 flex-1 max-w-xs"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={
                      !selectedStatus ||
                      selectedStatus === orderItem.status ||
                      updateOrder.isPending
                    }
                    size="sm"
                  >
                    {updateOrder.isPending ? "Updating..." : "Update Status"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Generate Label Dialog */}
        <GenerateLabelDialog
          order={orderItem}
          open={generateLabelOpen}
          onOpenChange={setGenerateLabelOpen}
          onSuccess={() => {
            // Labels will auto-refresh via query invalidation
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
