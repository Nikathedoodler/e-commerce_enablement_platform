/**
 * Get the base URL for the application
 * Priority:
 * 1. Explicitly provided baseUrl parameter
 * 2. NEXT_PUBLIC_APP_URL environment variable (manually set)
 * 3. VERCEL_URL (automatically set by Vercel in production/preview)
 * 4. localhost fallback (development only)
 */
function getBaseUrl(baseUrl?: string): string {
  if (baseUrl) {
    return baseUrl;
  }

  // Check for manually set app URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Vercel automatically sets VERCEL_URL in production and preview deployments
  // Format: your-app.vercel.app (without protocol)
  if (process.env.VERCEL_URL) {
    // Use https in production, http in preview/development
    const protocol = process.env.VERCEL_ENV === "production" ? "https" : "https";
    return `${protocol}://${process.env.VERCEL_URL}`;
  }

  // Fallback to localhost (development only)
  // In production, this should never be reached if VERCEL_URL is set
  return process.env.NODE_ENV === "production"
    ? "https://yourdomain.com" // This should never be reached - set NEXT_PUBLIC_APP_URL or deploy to Vercel
    : "http://localhost:3000";
}

/**
 * Build dashboard URL for an order
 */
export function getOrderUrl(orderId: string, baseUrl?: string): string {
  const base = getBaseUrl(baseUrl);
  return `${base}/dashboard/orders/all-orders?orderId=${orderId}`;
}

/**
 * Build dashboard URL for inventory
 */
export function getInventoryUrl(baseUrl?: string): string {
  const base = getBaseUrl(baseUrl);
  return `${base}/dashboard/inventory`;
}

/**
 * Build dashboard URL for billing/settings
 */
export function getBillingUrl(baseUrl?: string): string {
  const base = getBaseUrl(baseUrl);
  return `${base}/dashboard/settings/billing`;
}
