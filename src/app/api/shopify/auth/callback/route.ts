import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { upsertShopifyStore } from "@/lib/supabase/queries/shopify";
import crypto from "crypto";

/**
 * GET /api/shopify/auth/callback
 * Handles Shopify OAuth callback
 *
 * Query params from Shopify:
 * - code: Authorization code
 * - shop: Shop domain
 * - state: CSRF protection state
 * - hmac: HMAC signature for verification
 * - timestamp: Request timestamp
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");
    const shop = searchParams.get("shop");
    const state = searchParams.get("state");
    const hmac = searchParams.get("hmac");
    // timestamp is included in HMAC verification via searchParams.forEach below

    // Validate required parameters
    if (!code || !shop || !state || !hmac) {
      return NextResponse.redirect(
        `${req.nextUrl.origin}/dashboard/settings/integrations?error=missing_params`
      );
    }

    // Verify state (CSRF protection)
    const storedState = req.cookies.get("shopify_oauth_state")?.value;
    const storedShop = req.cookies.get("shopify_oauth_shop")?.value;
    const storedUserId = req.cookies.get("shopify_oauth_user_id")?.value;

    if (!storedState || !storedShop || !storedUserId) {
      return NextResponse.redirect(
        `${req.nextUrl.origin}/dashboard/settings/integrations?error=session_expired`
      );
    }

    if (state !== storedState) {
      return NextResponse.redirect(
        `${req.nextUrl.origin}/dashboard/settings/integrations?error=invalid_state`
      );
    }

    if (shop !== storedShop) {
      return NextResponse.redirect(
        `${req.nextUrl.origin}/dashboard/settings/integrations?error=shop_mismatch`
      );
    }

    // Verify HMAC signature
    const apiSecret = process.env.SHOPIFY_API_SECRET;
    if (!apiSecret) {
      console.error("Missing Shopify API secret");
      return NextResponse.redirect(
        `${req.nextUrl.origin}/dashboard/settings/integrations?error=config_error`
      );
    }

    // Build query string for HMAC verification (excluding hmac and signature)
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== "hmac" && key !== "signature") {
        params.append(key, value);
      }
    });
    const sortedParams = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const calculatedHmac = crypto
      .createHmac("sha256", apiSecret)
      .update(sortedParams)
      .digest("hex");

    if (calculatedHmac !== hmac) {
      console.error("HMAC verification failed");
      return NextResponse.redirect(
        `${req.nextUrl.origin}/dashboard/settings/integrations?error=invalid_hmac`
      );
    }

    // Exchange authorization code for access token
    const apiKey = process.env.SHOPIFY_API_KEY;
    if (!apiKey) {
      console.error("Missing Shopify API key");
      return NextResponse.redirect(
        `${req.nextUrl.origin}/dashboard/settings/integrations?error=config_error`
      );
    }

    const tokenResponse = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: apiKey,
          client_secret: apiSecret,
          code: code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      return NextResponse.redirect(
        `${req.nextUrl.origin}/dashboard/settings/integrations?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const scopes = tokenData.scope || "";

    if (!accessToken) {
      console.error("No access token in response");
      return NextResponse.redirect(
        `${req.nextUrl.origin}/dashboard/settings/integrations?error=no_token`
      );
    }

    // Verify user is still authenticated
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || user.id !== storedUserId) {
      return NextResponse.redirect(
        `${req.nextUrl.origin}/dashboard/settings/integrations?error=unauthorized`
      );
    }

    // Store the connection in database
    const { data: storeData, error: dbError } = await upsertShopifyStore({
      shop_domain: shop,
      access_token: accessToken, // In production, encrypt this
      scopes: scopes,
      status: "active",
      connected_at: new Date().toISOString(),
    });

    if (dbError || !storeData) {
      console.error("Database error:", dbError);
      return NextResponse.redirect(
        `${req.nextUrl.origin}/dashboard/settings/integrations?error=db_error`
      );
    }

    // Clear OAuth cookies
    const response = NextResponse.redirect(
      `${req.nextUrl.origin}/dashboard/settings/integrations?success=connected`
    );
    response.cookies.delete("shopify_oauth_state");
    response.cookies.delete("shopify_oauth_shop");
    response.cookies.delete("shopify_oauth_user_id");

    return response;
  } catch (error) {
    console.error("Shopify OAuth callback error:", error);
    return NextResponse.redirect(
      `${req.nextUrl.origin}/dashboard/settings/integrations?error=callback_error`
    );
  }
}
