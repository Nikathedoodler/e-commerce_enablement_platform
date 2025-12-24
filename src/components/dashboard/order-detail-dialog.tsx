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
  const { data: shippingLabels, isLoading: labelsLoading } =
    useShippingLabelsByOrderId(orderItem?.id || "");

  if (!orderItem) return null;

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === orderItem.status) return;

    try {
      await updateOrder.mutateAsync({
        id: orderItem.id,
        updates: { status: selectedStatus as OrderStatus },
      });
      toast.success("Order status updated successfully");
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 flex-wrap">
            <span>Order {orderItem.order_number}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(
                orderItem.status
              )}`}
            >
              {orderItem.status}
            </span>
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
          </DialogTitle>
          <DialogDescription>
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

        <div className="space-y-4">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItem.items.map((item, index) => (
                    <TableRow key={`${item.sku}-${index}`}>
                      <TableCell className="font-mono text-sm">
                        {item.sku}
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
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
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {orderItem.shipping_address && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {orderItem.shipping_address.name && (
                    <p className="font-medium">
                      {orderItem.shipping_address.name}
                    </p>
                  )}
                  <p className="text-sm">
                    {orderItem.shipping_address.address1}
                  </p>
                  {orderItem.shipping_address.address2 && (
                    <p className="text-sm">
                      {orderItem.shipping_address.address2}
                    </p>
                  )}
                  <p className="text-sm">
                    {orderItem.shipping_address.city}
                    {orderItem.shipping_address.state &&
                      `, ${orderItem.shipping_address.state}`}{" "}
                    {orderItem.shipping_address.zip}
                  </p>
                  <p className="text-sm">
                    {orderItem.shipping_address.country}
                  </p>
                  {orderItem.shipping_address.phone && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Phone: {orderItem.shipping_address.phone}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Totals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
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
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
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
                <p className="text-sm text-muted-foreground">Loading labels...</p>
              ) : shippingLabels && shippingLabels.length > 0 ? (
                <div className="space-y-3">
                  {shippingLabels.map((label) => (
                    <div
                      key={label.id}
                      className="rounded-lg border p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{label.carrier}</Badge>
                          <span className="text-sm font-medium">
                            {label.tracking_number}
                          </span>
                        </div>
                        <span className="text-sm font-semibold">
                          {label.cost.toFixed(2)} {label.carrier === "DHL" ? "EUR" : ""}
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
                    No shipping labels generated yet. Click "Generate Label" above to create one.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tracking Number (Legacy - will be replaced by labels) */}
          {orderItem.tracking_number && !shippingLabels?.length && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tracking Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-sm">{orderItem.tracking_number}</p>
              </CardContent>
            </Card>
          )}

          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Update Status</CardTitle>
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
