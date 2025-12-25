import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

/**
 * GET /api/shopify/auth
 * Initiates Shopify OAuth flow
 *
 * Query params:
 * - shop: Shopify shop domain (e.g., "mystore.myshopify.com")
 */
export async function GET(req: NextRequest) {
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

    // Get shop domain from query params
    const searchParams = req.nextUrl.searchParams;
    const shop = searchParams.get("shop");

    if (!shop) {
      return NextResponse.json(
        { error: "Shop parameter is required" },
        { status: 400 }
      );
    }

    // Validate shop domain format
    const shopDomain = shop.trim().toLowerCase();
    if (!shopDomain.endsWith(".myshopify.com") && !shopDomain.includes(".")) {
      return NextResponse.json(
        { error: "Invalid shop domain format" },
        { status: 400 }
      );
    }

    // Get Shopify app credentials from environment
    const apiKey = process.env.SHOPIFY_API_KEY;
    const apiSecret = process.env.SHOPIFY_API_SECRET;
    const scopes =
      process.env.SHOPIFY_APP_SCOPES ||
      "read_customers,read_inventory,read_orders,write_orders,read_products,write_products";
    // Always use the request origin to ensure it matches the actual domain being used
    const redirectUri = `${req.nextUrl.origin}/api/shopify/auth/callback`;

    // Debug logging (remove after fixing)
    console.log("Shopify OAuth - Redirect URI:", redirectUri);
    console.log("Shopify OAuth - Request origin:", req.nextUrl.origin);

    if (!apiKey || !apiSecret) {
      console.error("Missing Shopify API credentials");
      return NextResponse.json(
        { error: "Shopify integration not configured" },
        { status: 500 }
      );
    }

    // Generate a random nonce (state) for CSRF protection
    const state = crypto.randomBytes(16).toString("hex");

    // Store state in a cookie or session (we'll use a cookie with httpOnly)
    // For now, we'll include it in the redirect URL and verify on callback
    // In production, consider storing in Redis or database for better security

    // Build Shopify OAuth URL
    const authUrl = new URL(`https://${shopDomain}/admin/oauth/authorize`);
    authUrl.searchParams.set("client_id", apiKey);
    authUrl.searchParams.set("scope", scopes);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("state", state);

    // Store state in a secure cookie (httpOnly, sameSite)
    const response = NextResponse.redirect(authUrl.toString());
    response.cookies.set("shopify_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    // Also store shop domain and user_id for callback
    response.cookies.set("shopify_oauth_shop", shopDomain, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });
    response.cookies.set("shopify_oauth_user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Shopify OAuth initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate Shopify OAuth" },
      { status: 500 }
    );
  }
}
