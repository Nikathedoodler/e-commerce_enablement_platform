"use client";

import { useState } from "react";
import type { Order } from "@/types/orders";
import type { DHLLabelRequest, DHLServiceType } from "@/types/shipping";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { useGenerateDHLLabel } from "@/hooks/use-shipping";
import { toast } from "sonner";

type GenerateLabelDialogProps = {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

// Default warehouse/shipper info (should come from env or settings)
const DEFAULT_SHIPPER = {
  name: "Your Company Name",
  companyName: "Your Company",
  address1: "Warehouse Address",
  city: "Kutaisi",
  postalCode: "4600",
  country: "GE",
  phone: "+995 XXX XXX XXX",
  email: "warehouse@example.com",
};

export function GenerateLabelDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: GenerateLabelDialogProps) {
  const [serviceType, setServiceType] =
    useState<DHLServiceType>("EXPRESS_WORLDWIDE");
  const [packageWeight, setPackageWeight] = useState<string>("1.0");
  const [packageLength, setPackageLength] = useState<string>("");
  const [packageWidth, setPackageWidth] = useState<string>("");
  const [packageHeight, setPackageHeight] = useState<string>("");
  const [packageDescription, setPackageDescription] = useState<string>("");

  const generateLabel = useGenerateDHLLabel();

  if (!order) return null;

  const handleGenerate = async () => {
    if (!order.shipping_address) {
      toast.error("Order missing shipping address");
      return;
    }

    const weight = parseFloat(packageWeight);
    if (isNaN(weight) || weight <= 0) {
      toast.error("Package weight must be greater than 0");
      return;
    }

    // Build label request
    const labelRequest: DHLLabelRequest = {
      orderId: order.id,
      orderNumber: order.order_number,
      shipper: DEFAULT_SHIPPER,
      recipient: order.shipping_address,
      package: {
        weight,
        dimensions:
          packageLength && packageWidth && packageHeight
            ? {
                length: parseFloat(packageLength),
                width: parseFloat(packageWidth),
                height: parseFloat(packageHeight),
              }
            : undefined,
        description: packageDescription || undefined,
      },
      serviceType,
    };

    try {
      await generateLabel.mutateAsync(labelRequest);
      toast.success("Shipping label generated successfully!");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate shipping label"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto w-full p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Generate Shipping Label</DialogTitle>
          <DialogDescription className="text-sm">
            Generate a DHL shipping label for order {order.order_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Service Type */}
          <Field>
            <FieldLabel>
              Service Type <span className="text-red-500">*</span>
            </FieldLabel>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value as DHLServiceType)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3"
            >
              <option value="EXPRESS_WORLDWIDE">DHL Express Worldwide</option>
              <option value="EXPRESS_12_00">DHL Express 12:00</option>
              <option value="ECONOMY_SELECT">DHL Economy Select</option>
              <option value="EXPRESS_ENVELOPE">DHL Express Envelope</option>
              <option value="EXPRESS_WORLDWIDE_NON_DOCUMENTS">
                DHL Express Worldwide (Non-Documents)
              </option>
            </select>
            <FieldDescription>
              Select the DHL service type for this shipment
            </FieldDescription>
          </Field>

          {/* Package Weight */}
          <Field>
            <FieldLabel>
              Package Weight (kg) <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              type="number"
              step="0.1"
              min="0.1"
              value={packageWeight}
              onChange={(e) => setPackageWeight(e.target.value)}
              placeholder="1.0"
            />
            <FieldDescription>
              Total weight of the package in kilograms
            </FieldDescription>
          </Field>

          {/* Package Dimensions (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Field>
              <FieldLabel>Length (cm)</FieldLabel>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={packageLength}
                onChange={(e) => setPackageLength(e.target.value)}
                placeholder="Optional"
              />
            </Field>
            <Field>
              <FieldLabel>Width (cm)</FieldLabel>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={packageWidth}
                onChange={(e) => setPackageWidth(e.target.value)}
                placeholder="Optional"
              />
            </Field>
            <Field>
              <FieldLabel>Height (cm)</FieldLabel>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={packageHeight}
                onChange={(e) => setPackageHeight(e.target.value)}
                placeholder="Optional"
              />
            </Field>
          </div>
          <p className="text-sm text-muted-foreground">
            Package dimensions are optional but recommended for accurate pricing
          </p>

          {/* Package Description */}
          <Field>
            <FieldLabel>Package Description</FieldLabel>
            <Input
              type="text"
              value={packageDescription}
              onChange={(e) => setPackageDescription(e.target.value)}
              placeholder="e.g., Electronics, Clothing, etc."
            />
            <FieldDescription>
              Optional description of package contents
            </FieldDescription>
          </Field>

          {/* Shipping Address Preview */}
          {order.shipping_address && (
            <div className="rounded-lg border p-4 bg-muted/50">
              <p className="text-sm font-medium mb-2">Shipping To:</p>
              <div className="text-sm text-muted-foreground space-y-1">
                {order.shipping_address.name && (
                  <p>{order.shipping_address.name}</p>
                )}
                <p>{order.shipping_address.address1}</p>
                {order.shipping_address.address2 && (
                  <p>{order.shipping_address.address2}</p>
                )}
                <p>
                  {order.shipping_address.city}
                  {order.shipping_address.state &&
                    `, ${order.shipping_address.state}`}{" "}
                  {order.shipping_address.zip}
                </p>
                <p>{order.shipping_address.country}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={generateLabel.isPending}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={generateLabel.isPending || !packageWeight}
              className="w-full sm:w-auto"
            >
              {generateLabel.isPending ? "Generating..." : "Generate Label"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
