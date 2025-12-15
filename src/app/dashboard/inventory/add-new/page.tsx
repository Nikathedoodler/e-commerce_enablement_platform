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
import { createInventorySchema } from "@/lib/validations/inventory";
import type { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { InventoryInput } from "@/types/inventory";
import { useCreateInventory } from "@/hooks/use-inventory";
import { toast } from "sonner";

type CreateInventoryFormData = z.infer<typeof createInventorySchema>;

export default function AddNewItemPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateInventoryFormData>({
    resolver: zodResolver(createInventorySchema),
    defaultValues: {
      sku: "",
      name: "",
      quantity: 0,
      location: "",
      reorder_threshold: 0,
    },
  });

  const router = useRouter();
  const createInventory = useCreateInventory();

  const onSubmit = async (data: CreateInventoryFormData) => {
    const inventoryItem: InventoryInput = {
      ...data,
      location: data.location || null,
    };

    try {
      await createInventory.mutateAsync(inventoryItem);
      toast.success("Inventory item created successfully");
      router.push("/dashboard/inventory/all-items");
    } catch (err) {
      toast.error("Failed to create inventory item");
    }

    console.log("Form submitted with data:", data);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Item</h1>
        <p className="text-muted-foreground">
          Add a new item to your inventory
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Fields marked with <span className="text-destructive">*</span> are
              required
            </p>

            {/* Section 1: Item Details */}
            <FieldGroup>
              <FieldSet>
                <FieldLegend className="font-bold">Item Details</FieldLegend>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="sku">
                      SKU <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldDescription>
                      Stock Keeping Unit - unique identifier for this item
                    </FieldDescription>
                    <Input
                      id="sku"
                      type="text"
                      placeholder="e.g., SKU-001"
                      {...register("sku")}
                    />
                    {errors.sku && (
                      <FieldError>{errors.sku.message}</FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="name">
                      Product Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldDescription>
                      The display name of the inventory item
                    </FieldDescription>
                    <Input
                      id="name"
                      type="text"
                      placeholder="e.g., Wireless Mouse"
                      {...register("name")}
                    />
                    {errors.name && (
                      <FieldError>{errors.name.message}</FieldError>
                    )}
                  </Field>
                </div>
              </FieldSet>
            </FieldGroup>

            <Separator className="my-6" />

            {/* Section 2: Stock Information */}
            <FieldGroup>
              <FieldSet>
                <FieldLegend className="font-bold">
                  Stock Information
                </FieldLegend>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="quantity">
                      Quantity <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldDescription>
                      Current stock quantity available
                    </FieldDescription>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register("quantity", { valueAsNumber: true })}
                    />
                    {errors.quantity && (
                      <FieldError>{errors.quantity.message}</FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="reorder_threshold">
                      Reorder Threshold{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldDescription>
                      Alert when quantity falls to or below this number
                    </FieldDescription>
                    <Input
                      id="reorder_threshold"
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register("reorder_threshold", {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.reorder_threshold && (
                      <FieldError>
                        {errors.reorder_threshold.message}
                      </FieldError>
                    )}
                  </Field>
                </div>
              </FieldSet>
            </FieldGroup>

            <Separator className="my-6" />

            {/* Section 3: Location (Optional) */}
            <FieldGroup>
              <FieldSet>
                <FieldLegend className="font-bold">
                  Location (Optional)
                </FieldLegend>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="location">Storage Location</FieldLabel>
                    <FieldDescription>
                      Warehouse, shelf, or bin location for this item
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
              </FieldSet>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Section 4: Actions */}
        <FieldGroup className="w-full mt-6 lg:flex-row lg:justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/inventory/all-items")}
          >
            Cancel
          </Button>
          <Button type="submit">Create Item</Button>
        </FieldGroup>
      </form>
    </div>
  );
}
