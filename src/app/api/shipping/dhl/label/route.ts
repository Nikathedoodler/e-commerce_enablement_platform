import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateLabelServer } from "@/lib/shipping/generate-label-server";
import type { DHLLabelRequest } from "@/types/shipping";

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

    // Generate label using server function (includes audit logging)
    const result = await generateLabelServer(labelRequest, {
      generationType: "manual",
      triggeredBy: "manual_click",
      metadata: {
        order_number: orderNumber,
        service_type: serviceType,
        package_weight: packageData.weight,
      },
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to generate shipping label" },
        { status: 500 }
      );
    }

    // Get the saved label to return full details
    const { data: savedLabel } = await supabase
      .from("shipping_labels")
      .select("*")
      .eq("order_id", orderId)
      .eq("tracking_number", result.trackingNumber)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!savedLabel) {
      return NextResponse.json(
        { error: "Label generated but not found in database" },
        { status: 500 }
      );
    }

    // Return saved label information
    return NextResponse.json({
      label: {
        id: savedLabel.id,
        trackingNumber: savedLabel.tracking_number,
        labelUrl: savedLabel.label_url,
        cost: savedLabel.cost,
        currency: "EUR", // Default, could be from settings
        serviceType: serviceType,
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
