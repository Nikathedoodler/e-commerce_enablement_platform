import { z } from "zod";

const shippingAddressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(1, "Phone is required"),
});

const orderItemSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Product name is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive"),
});

export const createOrderSchema = z.object({
  order_number: z.string().optional(), // Will be auto-generated if not provided
  customer_email: z.string().email("Invalid email address"),
  financial_status: z.enum([
    "pending",
    "paid",
    "refunded",
    "partially_refunded",
  ]),
  shipping_address: shippingAddressSchema,
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  // total will be calculated from items
});
