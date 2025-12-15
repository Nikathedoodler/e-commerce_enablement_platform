"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FieldGroup,
  FieldSet,
  FieldLegend,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrderSchema } from "@/lib/validations/order";
import type { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useCreateOrder } from "@/hooks/use-orders";
import type { OrderInput } from "@/types/orders";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

type CreateOrderFormData = z.infer<typeof createOrderSchema>;

const CreateOrder = () => {
  // const [total, setTotal] = useState(0);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      order_number: "", // or auto-generated
      financial_status: "pending",
      items: [{ sku: "", name: "", quantity: 1, price: 0 }],
      shipping_address: {
        country: "US",
      },
    },
  });

  const createOrder = useCreateOrder();
  const router = useRouter();

  const onSubmit = async (data: CreateOrderFormData) => {
    const calculatedTotal =
      data.items?.reduce(
        (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
        0
      ) || 0;

    const orderData: OrderInput = {
      ...data,
      status: "pending", // default order status
      total: calculatedTotal,
      tracking_number: null,
      // user_id will be set on the server using auth, so we don’t pass it
    };

    try {
      await createOrder.mutateAsync(orderData);
      toast.success("Order created successfully");
      router.push("/dashboard/orders/all-orders");
    } catch (err) {
      toast.error("Failed to create order");
    }
  };

  // For dynamic items array:
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  const total =
    items?.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    ) || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Order</h1>
        <p className="text-muted-foreground">
          Enter order details and shipping information to create order
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            {/* Section 1: Order Basics */}
            <FieldGroup>
              <FieldSet>
                <FieldLegend className="font-bold">Order Basics</FieldLegend>
                {/* Order Number, Customer Email, Financial Status fields will go here */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <Field>
                    <FieldLabel htmlFor="customer_email">
                      Order Number
                    </FieldLabel>
                    <Input
                      id="order_number"
                      type="text"
                      {...register("order_number")}
                    />
                    {errors.order_number && (
                      <FieldError>{errors.order_number.message}</FieldError>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="customer_email">
                      Customer Email
                    </FieldLabel>
                    <Input
                      id="customer_email"
                      type="email"
                      {...register("customer_email")}
                    />
                    {errors.customer_email && (
                      <FieldError>{errors.customer_email.message}</FieldError>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="financial_status">
                      Financial Status
                    </FieldLabel>
                    <select
                      id="financial_status"
                      {...register("financial_status")}
                      className="h-9 rounded-md border border-input bg-transparent px-3"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="refunded">Refunded</option>
                      <option value="partially_refunded">
                        Partially Refunded
                      </option>
                    </select>
                    {errors.financial_status && (
                      <FieldError>{errors.financial_status.message}</FieldError>
                    )}
                  </Field>
                </div>
              </FieldSet>
            </FieldGroup>

            <Separator className="my-6" />

            {/* Section 2: Shipping Address */}
            <FieldGroup>
              <FieldSet>
                <FieldLegend className="font-bold">
                  Shipping Address
                </FieldLegend>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    <Input {...register("shipping_address.name")} />
                  </Field>
                  <Field>
                    <FieldLabel>address 1</FieldLabel>
                    <Input {...register("shipping_address.address1")} />
                  </Field>
                  <Field>
                    <FieldLabel>address 2</FieldLabel>
                    <Input {...register("shipping_address.address2")} />
                  </Field>
                  <Field>
                    <FieldLabel>Phone</FieldLabel>
                    <Input {...register("shipping_address.phone")} />
                  </Field>
                  <Field>
                    <FieldLabel>Country</FieldLabel>
                    <Input {...register("shipping_address.country")} />
                  </Field>
                  <Field>
                    <FieldLabel>City</FieldLabel>
                    <Input {...register("shipping_address.city")} />
                  </Field>
                  <Field>
                    <FieldLabel>State</FieldLabel>
                    <Input {...register("shipping_address.state")} />
                  </Field>
                  <Field>
                    <FieldLabel>ZIP</FieldLabel>
                    <Input {...register("shipping_address.zip")} />
                  </Field>
                </div>
              </FieldSet>
            </FieldGroup>

            <Separator className="my-6" />

            {/* Section 3: Order Items */}
            <FieldGroup>
              <FieldSet>
                <div className="mt-4 flex items-center justify-between gap-4 mr-4">
                  <FieldLegend className="font-bold">Order Items</FieldLegend>
                  <Button
                    type="button"
                    size="icon"
                    className="bg-black text-white border-black cursor-pointer hover:bg-black/90"
                    onClick={() =>
                      append({ sku: "", name: "", quantity: 1, price: 0 })
                    }
                  >
                    <Plus className="text-white" />
                  </Button>
                </div>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border rounded-lg p-4 flex flex-col lg:flex-row items-center lg:items-end gap-4 "
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4  w-full">
                      <Field>
                        <FieldLabel>SKU</FieldLabel>
                        <Input {...register(`items.${index}.sku`)} />
                        {errors.items?.[index]?.sku && (
                          <FieldError>
                            {errors.items[index]?.sku?.message}
                          </FieldError>
                        )}
                      </Field>
                      <Field>
                        <FieldLabel>Product Name</FieldLabel>
                        <Input {...register(`items.${index}.name`)} />
                        {errors.items?.[index]?.name && (
                          <FieldError>
                            {errors.items[index]?.name?.message}
                          </FieldError>
                        )}
                      </Field>
                      <Field>
                        <FieldLabel>Quantity</FieldLabel>
                        <Input
                          type="number"
                          {...register(`items.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                        />
                        {errors.items?.[index]?.quantity && (
                          <FieldError>
                            {errors.items[index]?.quantity?.message}
                          </FieldError>
                        )}
                      </Field>
                      <Field>
                        <FieldLabel>Price (per unit)</FieldLabel>
                        <Input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.price`, {
                            valueAsNumber: true,
                          })}
                        />
                        {errors.items?.[index]?.price && (
                          <FieldError>
                            {errors.items[index]?.price?.message}
                          </FieldError>
                        )}
                      </Field>
                    </div>
                    <div className="hidden lg:block lg:justify-start">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                    <div className="flex justify-end lg:hidden">
                      <Button
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="cursor-pointer bg-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </FieldSet>
            </FieldGroup>

            <Separator className="my-6" />

            {/* Section 4: Order Summary */}
            <FieldGroup>
              <FieldSet>
                <FieldLegend className="font-bold">Order Summary</FieldLegend>
                <div className="flex justify-end">
                  <div className="text-right">
                    <div className="text-sm font-medium text-muted-foreground">
                      Total
                    </div>
                    <div className="text-2xl font-semibold">
                      ${total.toFixed(2)}
                    </div>
                  </div>
                </div>
              </FieldSet>
            </FieldGroup>
          </CardContent>
        </Card>
        {/* Section 5: Actions */}
        <FieldGroup className="w-full mt-6 lg:flex-row lg:justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/orders/all-orders")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createOrder.isPending}>
            {createOrder.isPending ? "Creating..." : "Create Order"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default CreateOrder;
