"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  FieldGroup,
  FieldSet,
  FieldLegend,
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReceivingLogSchema } from "@/lib/validations/receiving";
import type { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateReceivingLog } from "@/hooks/use-receiving";
import { toast } from "sonner";
import type { ReceivingLogInput } from "@/types/receiving";

type CreateReceivingLogFormData = z.infer<typeof createReceivingLogSchema>;

export function ReceivingForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateReceivingLogFormData>({
    resolver: zodResolver(createReceivingLogSchema),
    defaultValues: {
      client_id: "",
      sku: "",
      item_name: "",
      quantity: 1,
      condition: "good",
      location: "",
      received_at: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
      notes: "",
    },
  });

  const createReceivingLog = useCreateReceivingLog();

  const onSubmit = async (data: CreateReceivingLogFormData) => {
    const receivingLog: ReceivingLogInput = {
      ...data,
      client_id: data.client_id || null,
      item_name: data.item_name || undefined, // Only include if provided
      location: data.location || null,
      received_at: data.received_at
        ? new Date(data.received_at).toISOString()
        : new Date().toISOString(),
      notes: data.notes || null,
    };

    try {
      await createReceivingLog.mutateAsync(receivingLog);
      toast.success("Receiving log created successfully");
      if (receivingLog.condition === "good") {
        toast.info("Inventory quantity has been updated");
      }
      reset(); // Reset form after successful submission
    } catch (err) {
      toast.error("Failed to create receiving log");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Fields marked with <span className="text-destructive">*</span> are
            required. Items in "good" condition will automatically update
            inventory quantities.
          </p>

          {/* Section 1: Receiving Details */}
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="font-bold">Receiving Details</FieldLegend>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="sku">
                    SKU <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FieldDescription>
                    Stock Keeping Unit of the received item
                  </FieldDescription>
                  <Input
                    id="sku"
                    type="text"
                    placeholder="e.g., SKU-001"
                    {...register("sku")}
                  />
                  {errors.sku && <FieldError>{errors.sku.message}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="item_name">
                    Item Name (Optional)
                  </FieldLabel>
                  <FieldDescription>
                    Product name - only needed if this is a new SKU not yet in
                    inventory
                  </FieldDescription>
                  <Input
                    id="item_name"
                    type="text"
                    placeholder="e.g., Wireless Mouse"
                    {...register("item_name")}
                  />
                  {errors.item_name && (
                    <FieldError>{errors.item_name.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="quantity">
                    Quantity <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FieldDescription>Number of items received</FieldDescription>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    placeholder="1"
                    {...register("quantity", { valueAsNumber: true })}
                  />
                  {errors.quantity && (
                    <FieldError>{errors.quantity.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="condition">
                    Condition <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FieldDescription>
                    Condition of the received items
                  </FieldDescription>
                  <select
                    id="condition"
                    {...register("condition")}
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="good">Good</option>
                    <option value="damaged">Damaged</option>
                    <option value="defective">Defective</option>
                    <option value="returned">Returned</option>
                  </select>
                  {errors.condition && (
                    <FieldError>{errors.condition.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="received_at">
                    Received Date & Time
                  </FieldLabel>
                  <FieldDescription>
                    When the items were actually received
                  </FieldDescription>
                  <Input
                    id="received_at"
                    type="datetime-local"
                    {...register("received_at")}
                  />
                  {errors.received_at && (
                    <FieldError>{errors.received_at.message}</FieldError>
                  )}
                </Field>
              </div>
            </FieldSet>
          </FieldGroup>

          <Separator className="my-6" />

          {/* Section 2: Additional Information */}
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="font-bold">
                Additional Information
              </FieldLegend>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="client_id">
                    Client/Supplier ID
                  </FieldLabel>
                  <FieldDescription>
                    Optional identifier for the client or supplier
                  </FieldDescription>
                  <Input
                    id="client_id"
                    type="text"
                    placeholder="e.g., SUPPLIER-001"
                    {...register("client_id")}
                  />
                  {errors.client_id && (
                    <FieldError>{errors.client_id.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="location">Storage Location</FieldLabel>
                  <FieldDescription>
                    Where the items will be stored
                  </FieldDescription>
                  <Input
                    id="location"
                    type="text"
                    placeholder="e.g., Warehouse A - Shelf 3"
                    {...register("location")}
                  />
                  {errors.location && (
                    <FieldError>{errors.location.message}</FieldError>
                  )}
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="notes">Notes</FieldLabel>
                <FieldDescription>
                  Additional notes about this receiving entry
                </FieldDescription>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Any additional information..."
                  {...register("notes")}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                {errors.notes && (
                  <FieldError>{errors.notes.message}</FieldError>
                )}
              </Field>
            </FieldSet>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Actions */}
      <FieldGroup className="w-full mt-6 lg:flex-row lg:justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => reset()}>
          Clear Form
        </Button>
        <Button type="submit" disabled={createReceivingLog.isPending}>
          {createReceivingLog.isPending ? "Recording..." : "Record Receiving"}
        </Button>
      </FieldGroup>
    </form>
  );
}
