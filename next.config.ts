import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Set output file tracing root to fix workspace root warning
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    // Optimize barrel file imports for better performance
    // This automatically transforms barrel imports to direct imports at build time
    // Reduces bundle size and improves dev/build performance significantly
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-select",
      "@radix-ui/react-slot",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-dialog",
      "@radix-ui/react-separator",
      "@radix-ui/react-label",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-avatar",
      "@radix-ui/react-accordion",
      "@radix-ui/react-collapsible",
      "recharts", // Optimize recharts imports
    ],
  },
  // Production optimizations
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header
  // Note: SWC minification is now the default in Next.js 15, no need to specify
  // Reduce JavaScript execution time
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"], // Keep error and warn logs
          }
        : false,
  },
  // Enable back/forward cache while maintaining security
  // Use 'private, no-cache' instead of 'no-store' to allow bfcache
  async headers() {
    return [
      {
        source: "/dashboard/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, must-revalidate",
          },
        ],
      },
    ];
  },
};

// Make sure adding Sentry options is the last code to run before exporting
export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for better debugging
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  // Note: Source maps are uploaded to Sentry but not included in client bundles by default

  // Webpack configuration for Sentry
  webpack: {
    // Automatically tree-shake Sentry logger statements to reduce bundle size
    treeshake: {
      removeDebugLogging: true,
    },
    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
});
