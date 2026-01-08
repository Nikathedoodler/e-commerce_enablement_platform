# Environment Variables Reference

Complete list of required and optional environment variables.

## Table of Contents

1. [Required Variables](#required-variables)
2. [Optional Variables](#optional-variables)
3. [Development Setup](#development-setup)
4. [Production Setup](#production-setup)

---

## Required Variables

### Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
SUPABASE_SECRET_KEY=eyJhbGc... (or sb_secret_...)
```

**Description:**
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase anon/public key
- `SUPABASE_SECRET_KEY`: Supabase service role key (for server-side operations)

**Where to Find:**
- Supabase Dashboard → Settings → API

---

### Stripe

```env
STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Description:**
- `STRIPE_SECRET_KEY`: Stripe secret API key
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key (for frontend)
- `STRIPE_WEBHOOK_SECRET`: Webhook signing secret

**Where to Find:**
- Stripe Dashboard → Developers → API keys
- Stripe Dashboard → Developers → Webhooks → Signing secret

**Note:** Use `sk_test_` and `pk_test_` for development, `sk_live_` and `pk_live_` for production.

---

## Optional Variables

### Shopify Integration

```env
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
SHOPIFY_APP_SCOPES=read_orders,write_orders,read_products
```

**Description:**
- `SHOPIFY_API_KEY`: Shopify app API key (Client ID from Partners dashboard)
- `SHOPIFY_API_SECRET`: Shopify app API secret (from Partners dashboard)
- `SHOPIFY_WEBHOOK_SECRET`: Webhook secret (for manually created webhooks)
- `SHOPIFY_APP_SCOPES`: Comma-separated OAuth scopes (has defaults)

**Defaults:**
- `SHOPIFY_APP_SCOPES`: `read_customers,read_inventory,read_orders,write_orders,read_products,write_products`
- **Redirect URI**: Automatically generated from request origin (no need to set `SHOPIFY_APP_REDIRECT_URI`)
  - Production: `https://ai-privacy-compliance.vercel.app/api/shopify/auth/callback`
  - Development: `http://localhost:3000/api/shopify/auth/callback`

---

### DHL Shipping

```env
DHL_API_KEY=your_consumer_key
DHL_API_SECRET=your_consumer_secret
DHL_API_BASE_URL=https://express.api.dhl.com/mydhlapi/test
```

**Description:**
- `DHL_API_KEY`: DHL Consumer Key (API Key)
- `DHL_API_SECRET`: DHL Consumer Secret (API Secret)
- `DHL_API_BASE_URL`: DHL API base URL

**Defaults:**
- If not set, uses mock data for development
- Sandbox: `https://express.api.dhl.com/mydhlapi/test`
- Production: `https://express.api.dhl.com/mydhlapi`

**Note:** If `DHL_API_KEY` is not set or equals "mock_key", the system uses mock data.

---

### Analytics

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Description:**
- Google Analytics 4 Measurement ID

**Where to Find:**
- Google Analytics → Admin → Data Streams → Measurement ID

---

### Sentry Error Tracking

```env
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=your-org-name
SENTRY_PROJECT=your-project-name
```

**Description:**
- `NEXT_PUBLIC_SENTRY_DSN`: Sentry Data Source Name (DSN) for error tracking
- `SENTRY_ORG`: Your Sentry organization slug
- `SENTRY_PROJECT`: Your Sentry project slug

**Where to Find:**
- Sentry Dashboard → Settings → Projects → [Your Project] → Client Keys (DSN)
- Sentry Dashboard → Settings → Organization → Organization Slug
- Sentry Dashboard → Settings → Projects → Project Slug

**Note:** Sentry is optional but highly recommended for production. If `NEXT_PUBLIC_SENTRY_DSN` is not set, Sentry will not initialize.

---

### Warehouse/Origin Address (for DHL)

```env
DHL_ORIGIN_COUNTRY=GE
DHL_ORIGIN_CITY=Kutaisi
DHL_ORIGIN_POSTAL_CODE=4600
DHL_ORIGIN_ADDRESS=Your Warehouse Address
DHL_ORIGIN_NAME=Your Company Name
DHL_ORIGIN_PHONE=+995...
```

**Description:**
- Default warehouse/shipper information for DHL label generation
- Currently hardcoded in `generate-label-dialog.tsx` but can be moved to env vars

---

## Development Setup

### `.env.local` File

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Shopify (Optional)
SHOPIFY_API_KEY=your_key
SHOPIFY_API_SECRET=your_secret

# DHL (Optional - uses mock if not set)
# DHL_API_KEY=mock_key
# DHL_API_SECRET=mock_secret

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...

# Sentry Error Tracking (Optional but recommended)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=your-org-name
SENTRY_PROJECT=your-project-name
```

### Security Notes

- ✅ Never commit `.env.local` to git (already in `.gitignore`)
- ✅ Use test/development keys for local development
- ✅ Rotate secrets regularly
- ✅ Use different keys for development and production

---

## Production Setup

### Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable for:
   - **Production**
   - **Preview** (optional, for PR previews)
   - **Development** (optional)

### Required for Production

```env
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
SUPABASE_SECRET_KEY=eyJhbGc...

# Stripe (Live Mode)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Shopify (Production)
SHOPIFY_API_KEY=your_production_key
SHOPIFY_API_SECRET=your_production_secret
SHOPIFY_WEBHOOK_SECRET=your_production_webhook_secret

# DHL (Production - when ready)
DHL_API_KEY=your_production_key
DHL_API_SECRET=your_production_secret
DHL_API_BASE_URL=https://express.api.dhl.com/mydhlapi

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...

# Sentry Error Tracking (Recommended for production)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=your-org-name
SENTRY_PROJECT=your-project-name
```

### Webhook URLs

Update webhook URLs in external services:

**Shopify:**
- Webhook URL: `https://yourdomain.com/api/webhooks/shopify/orders`
- Set in Shopify Admin → Settings → Notifications → Webhooks

**Stripe:**
- Webhook URL: `https://yourdomain.com/api/webhooks/stripe`
- Set in Stripe Dashboard → Developers → Webhooks

---

## Variable Validation

### Startup Checks

The application should validate required variables on startup:

```typescript
// Example validation (not currently implemented)
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SECRET_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
];

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

---

## Security Best Practices

1. **Never Expose Secrets:**
   - Never commit `.env.local` or `.env` files
   - Never log environment variables
   - Never expose in client-side code

2. **Use Different Keys:**
   - Separate keys for development and production
   - Use test mode for Stripe/Shopify in development

3. **Rotate Regularly:**
   - Rotate API keys quarterly
   - Rotate after security incidents
   - Use key versioning when possible

4. **Limit Access:**
   - Only give access to necessary team members
   - Use environment-specific keys
   - Monitor key usage

---

## Troubleshooting

**Q: "Missing environment variable" error**
A: Check that all required variables are set in `.env.local` (development) or Vercel (production).

**Q: Webhooks not working**
A: Verify webhook secrets match in both the platform and external service (Shopify/Stripe).

**Q: DHL using mock data in production**
A: Set `DHL_API_KEY` and `DHL_API_SECRET` environment variables with real credentials.

**Q: Stripe in test mode in production**
A: Use `sk_live_` and `pk_live_` keys for production, not `sk_test_` and `pk_test_`.

---

**Last Updated**: 2025-01-XX

