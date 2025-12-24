import type { ShippingAddress } from "./orders";

/**
 * Shipping Carrier Types
 * Matches the CHECK constraint in the database schema
 */
export type Carrier = "DHL" | "FedEx" | "UPS" | "Georgian Post";

/**
 * Shipping Label Type
 * Matches the shipping_labels table schema exactly
 */
export interface ShippingLabel {
  id: string; // UUID
  user_id: string; // UUID
  order_id: string; // UUID
  carrier: Carrier;
  label_url: string; // URL to PDF label in Supabase Storage
  tracking_number: string;
  cost: number; // NUMERIC(10, 2)
  generated_at: string; // TIMESTAMPTZ (ISO string)
  created_at: string; // TIMESTAMPTZ (ISO string)
  updated_at: string; // TIMESTAMPTZ (ISO string)
}

/**
 * Shipping Label Input Type (for creating labels)
 * Omits auto-generated fields
 */
export type ShippingLabelInput = Omit<
  ShippingLabel,
  "id" | "user_id" | "created_at" | "updated_at"
> & {
  user_id?: string; // Optional for updates, required for creates
};

/**
 * Shipping Label Update Type (partial updates)
 */
export type ShippingLabelUpdate = Partial<
  Pick<ShippingLabel, "label_url" | "tracking_number" | "cost">
>;

/**
 * DHL Rate Request
 * Parameters needed to calculate shipping rates
 */
export interface DHLRateRequest {
  // Origin address (warehouse location)
  origin: {
    country: string; // ISO country code (e.g., "GE" for Georgia)
    city: string;
    postalCode: string;
  };
  // Destination address (customer shipping address)
  destination: ShippingAddress;
  // Package details
  package: {
    weight: number; // Weight in kg
    dimensions?: {
      length: number; // cm
      width: number; // cm
      height: number; // cm
    };
  };
  // Service type (optional, defaults to standard)
  serviceType?: DHLServiceType;
}

/**
 * DHL Service Types
 * Common DHL shipping services
 */
export type DHLServiceType =
  | "EXPRESS_WORLDWIDE" // Fast international
  | "EXPRESS_12_00" // Express by noon
  | "ECONOMY_SELECT" // Economy shipping
  | "EXPRESS_ENVELOPE" // Document shipping
  | "EXPRESS_WORLDWIDE_NON_DOCUMENTS"; // Non-document express

/**
 * DHL Rate Response
 * Shipping rate information from DHL API
 */
export interface DHLRate {
  serviceType: DHLServiceType;
  serviceName: string;
  totalPrice: number; // Price in currency
  currency: string; // e.g., "EUR", "USD"
  deliveryTime: {
    min: number; // Minimum days
    max: number; // Maximum days
  };
  estimatedDeliveryDate?: string; // ISO date string
}

/**
 * DHL Label Request
 * Parameters needed to generate a shipping label
 */
export interface DHLLabelRequest {
  // Order information
  orderId: string; // UUID of the order
  orderNumber: string; // Human-readable order number
  
  // Origin address (warehouse/shipper)
  shipper: {
    name: string;
    companyName?: string;
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string; // ISO country code
    phone: string;
    email?: string;
  };
  
  // Destination address (customer)
  recipient: ShippingAddress;
  
  // Package details
  package: {
    weight: number; // kg
    dimensions?: {
      length: number; // cm
      width: number; // cm
      height: number; // cm
    };
    description?: string; // Package contents description
  };
  
  // Service type
  serviceType: DHLServiceType;
  
  // Additional options
  options?: {
    insuranceValue?: number; // Declared value for insurance
    signatureRequired?: boolean;
    saturdayDelivery?: boolean;
  };
}

/**
 * DHL Label Response
 * Response from DHL API after label generation
 */
export interface DHLLabelResponse {
  trackingNumber: string; // DHL tracking number
  labelUrl: string; // URL to PDF label (base64 or URL)
  labelData?: string; // Base64 encoded PDF (if provided directly)
  cost: number; // Shipping cost
  currency: string; // e.g., "EUR"
  estimatedDeliveryDate?: string; // ISO date string
  serviceType: DHLServiceType;
}

/**
 * Shipping Rate Response (Generic)
 * Standardized format for any carrier's rate response
 */
export interface ShippingRate {
  carrier: Carrier;
  serviceType: string;
  serviceName: string;
  price: number;
  currency: string;
  estimatedDays: {
    min: number;
    max: number;
  };
  estimatedDeliveryDate?: string;
}

/**
 * Generate Label Response
 * Standardized response after label generation
 */
export interface GenerateLabelResponse {
  label: ShippingLabel; // The created shipping label record
  trackingNumber: string;
  labelUrl: string;
  cost: number;
  currency: string;
}

