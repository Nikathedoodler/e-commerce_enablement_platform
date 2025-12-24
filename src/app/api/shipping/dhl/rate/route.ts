import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateDHLRates } from "@/lib/shipping/dhl";
import type { DHLRateRequest } from "@/types/shipping";

/**
 * POST /api/shipping/dhl/rate
 * Calculates shipping rates for an order
 *
 * Body:
 * - origin: { country, city, postalCode }
 * - destination: ShippingAddress (from order)
 * - package: { weight, dimensions?: { length, width, height } }
 * - serviceType?: DHLServiceType (optional)
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
    const { origin, destination, package: packageData, serviceType } = body;

    // Validate required fields
    if (!origin || !destination || !packageData) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: origin, destination, and package are required",
        },
        { status: 400 }
      );
    }

    // Validate origin
    if (!origin.country || !origin.city || !origin.postalCode) {
      return NextResponse.json(
        {
          error: "Origin must include country, city, and postalCode",
        },
        { status: 400 }
      );
    }

    // Validate destination (ShippingAddress)
    if (
      !destination.address1 ||
      !destination.city ||
      !destination.zip ||
      !destination.country
    ) {
      return NextResponse.json(
        {
          error: "Destination must include address1, city, zip, and country",
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

    // Build DHL rate request
    const rateRequest: DHLRateRequest = {
      origin: {
        country: origin.country,
        city: origin.city,
        postalCode: origin.postalCode,
      },
      destination,
      package: {
        weight: packageData.weight,
        dimensions: packageData.dimensions,
      },
      serviceType,
    };

    // Calculate rates using DHL API wrapper
    const { rates, error } = await calculateDHLRates(rateRequest);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    // Return rates
    return NextResponse.json({ rates });
  } catch (error) {
    console.error("DHL rate calculation error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to calculate shipping rates" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to calculate shipping rates" },
      { status: 500 }
    );
  }
}
