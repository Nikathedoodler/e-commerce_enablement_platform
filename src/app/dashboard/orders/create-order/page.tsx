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

type CreateOrderFormData = z.infer<typeof createOrderSchema>;

const CreateOrder = () => {
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

  // For dynamic items array:
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

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
      <Card>
        <CardContent>
          {/* Section 1: Order Basics */}
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="font-bold">Order Basics</FieldLegend>
              {/* Order Number, Customer Email, Financial Status fields will go here */}
              <Field className="w-full 2xl:max-w-1/3">
                <FieldLabel htmlFor="customer_email">Order Number</FieldLabel>
                <Input
                  id="order_number"
                  type="text"
                  {...register("order_number")}
                />
                {errors.order_number && (
                  <FieldError>{errors.order_number.message}</FieldError>
                )}
              </Field>
              <Field className="w-full 2xl:max-w-1/3">
                <FieldLabel htmlFor="customer_email">Customer Email</FieldLabel>
                <Input
                  id="customer_email"
                  type="email"
                  {...register("customer_email")}
                />
                {errors.customer_email && (
                  <FieldError>{errors.customer_email.message}</FieldError>
                )}
              </Field>
              <Field className="w-full 2xl:max-w-1/3">
                <FieldLabel htmlFor="financial_status">
                  Financial Status
                </FieldLabel>
                <Input
                  id="financial_status"
                  type="text"
                  {...register("financial_status")}
                />
                {errors.customer_email && (
                  <FieldError>{errors.customer_email.message}</FieldError>
                )}
              </Field>
            </FieldSet>
          </FieldGroup>

          <Separator className="my-6" />

          {/* Section 2: Shipping Address */}
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="font-bold">Shipping Address</FieldLegend>
              <div className="grid grid-cols-3 gap-4">
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
              <FieldLegend className="font-bold">Order Items</FieldLegend>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <Field className="flex-1">
                    <FieldLabel>SKU</FieldLabel>
                    <div className="flex gap-4">
                      <Input
                        className="w-full 2xl:max-w-1/3"
                        {...register(`items.${index}.sku`)}
                      />
                      {errors.items?.[index]?.sku && (
                        <FieldError>
                          {errors.items[index]?.sku?.message}
                        </FieldError>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  </Field>
                  {/* Similar for name, quantity, price */}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-[200px]"
                onClick={() =>
                  append({ sku: "", name: "", quantity: 1, price: 0 })
                }
              >
                Add Item
              </Button>
            </FieldSet>
          </FieldGroup>

          <Separator className="my-6" />

          {/* Section 4: Order Summary */}
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="font-bold">Order Summary</FieldLegend>
              {/* Calculated total will go here */}
            </FieldSet>
          </FieldGroup>

          {/* Section 5: Actions */}
          <FieldGroup className="mt-6">
            {/* Cancel and Create Order buttons will go here */}
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateOrder;
