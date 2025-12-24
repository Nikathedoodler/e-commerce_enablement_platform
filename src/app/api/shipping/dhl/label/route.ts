import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateDHLLabel } from "@/lib/shipping/dhl";
import { createShippingLabel } from "@/lib/supabase/queries/shipping";
import type { DHLLabelRequest } from "@/types/shipping";
import type { ShippingLabelInput } from "@/types/shipping";

/**
 * POST /api/shipping/dhl/label
 * Generates a shipping label for an order
 *
 * Body:
 * - orderId: string (UUID)
 * - orderNumber: string
 * - shipper: { name, companyName?, address1, address2?, city, state?, postalCode, country, phone, email? }
 * - recipient: ShippingAddress
 * - package: { weight, dimensions?: { length, width, height }, description? }
 * - serviceType: DHLServiceType
 * - options?: { insuranceValue?, signatureRequired?, saturdayDelivery? }
 */
export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const {
      orderId,
      orderNumber,
      shipper,
      recipient,
      package: packageData,
      serviceType,
      options,
    } = body;

    // Validate required fields
    if (
      !orderId ||
      !orderNumber ||
      !shipper ||
      !recipient ||
      !packageData ||
      !serviceType
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: orderId, orderNumber, shipper, recipient, package, and serviceType are required",
        },
        { status: 400 }
      );
    }

    // Validate shipper
    if (
      !shipper.name ||
      !shipper.address1 ||
      !shipper.city ||
      !shipper.postalCode ||
      !shipper.country ||
      !shipper.phone
    ) {
      return NextResponse.json(
        {
          error:
            "Shipper must include name, address1, city, postalCode, country, and phone",
        },
        { status: 400 }
      );
    }

    // Validate recipient (ShippingAddress)
    if (
      !recipient.address1 ||
      !recipient.city ||
      !recipient.zip ||
      !recipient.country
    ) {
      return NextResponse.json(
        {
          error: "Recipient must include address1, city, zip, and country",
        },
        { status: 400 }
      );
    }

    // Validate package
    if (!packageData.weight || packageData.weight <= 0) {
      return NextResponse.json(
        {
          error: "Package weight is required and must be greater than 0",
        },
        { status: 400 }
      );
    }

    // Verify the order belongs to the user
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, user_id, tracking_number")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Order not found or access denied" },
        { status: 404 }
      );
    }

    // Build DHL label request
    const labelRequest: DHLLabelRequest = {
      orderId,
      orderNumber,
      shipper: {
        name: shipper.name,
        companyName: shipper.companyName,
        address1: shipper.address1,
        address2: shipper.address2,
        city: shipper.city,
        state: shipper.state,
        postalCode: shipper.postalCode,
        country: shipper.country,
        phone: shipper.phone,
        email: shipper.email,
      },
      recipient,
      package: {
        weight: packageData.weight,
        dimensions: packageData.dimensions,
        description: packageData.description,
      },
      serviceType,
      options,
    };

    // Generate label using DHL API wrapper
    const { label, error } = await generateDHLLabel(labelRequest);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    // TODO: Store label PDF in Supabase Storage if labelData is provided
    // For now, we'll use the labelUrl from DHL response
    // If label.labelData (base64 PDF) exists, we should upload it to Supabase Storage

    // Save label metadata to shipping_labels table
    const labelInput: ShippingLabelInput = {
      order_id: orderId,
      carrier: "DHL",
      label_url: label.labelUrl,
      tracking_number: label.trackingNumber,
      cost: label.cost,
      generated_at: new Date().toISOString(),
    };

    const { data: savedLabel, error: saveError } = await createShippingLabel(
      labelInput
    );

    if (saveError || !savedLabel) {
      console.error("Failed to save shipping label:", saveError);
      // Still return the label data even if save fails
      // The label was generated successfully, just not saved to DB
      return NextResponse.json({
        label: {
          trackingNumber: label.trackingNumber,
          labelUrl: label.labelUrl,
          cost: label.cost,
          currency: label.currency,
          estimatedDeliveryDate: label.estimatedDeliveryDate,
          serviceType: label.serviceType,
        },
        warning: "Label generated but failed to save to database",
      });
    }

    // Update order tracking number if not already set
    if (order.tracking_number !== label.trackingNumber) {
      await supabase
        .from("orders")
        .update({ tracking_number: label.trackingNumber })
        .eq("id", orderId);
    }

    // Return saved label information
    return NextResponse.json({
      label: {
        id: savedLabel.id,
        trackingNumber: savedLabel.tracking_number,
        labelUrl: savedLabel.label_url,
        cost: savedLabel.cost,
        currency: label.currency,
        estimatedDeliveryDate: label.estimatedDeliveryDate,
        serviceType: label.serviceType,
        generatedAt: savedLabel.generated_at,
      },
    });
  } catch (error) {
    console.error("DHL label generation error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to generate shipping label" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate shipping label" },
      { status: 500 }
    );
  }
}
