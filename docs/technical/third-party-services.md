# Third-Party Services & Integrations

Complete list of all third-party services, APIs, and integrations used in the platform.

**Last Updated:** 2025-01-XX

---

## Table of Contents

1. [Authentication & Database](#authentication--database)
2. [Payment Processing](#payment-processing)
3. [E-Commerce Integration](#e-commerce-integration)
4. [Shipping](#shipping)
5. [Error Tracking & Monitoring](#error-tracking--monitoring)
6. [Email Services](#email-services)
7. [Analytics](#analytics)
8. [Hosting & Deployment](#hosting--deployment)

---

## Authentication & Database

### Supabase

**Purpose:** Backend-as-a-Service (BaaS) providing:

- User authentication (email/password)
- PostgreSQL database
- Row-Level Security (RLS) policies
- Real-time subscriptions (not currently used)

**Status:** ✅ Active

**Setup:**

- Dashboard: [supabase.com](https://supabase.com)
- Project URL: Set in `NEXT_PUBLIC_SUPABASE_URL`
- API Keys: Set in environment variables

**Environment Variables:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
SUPABASE_SECRET_KEY=eyJhbGc... (or sb_secret_...)
```

**Documentation:**

- [Supabase Docs](https://supabase.com/docs)
- Internal: `docs/migrations/` - Database migrations

**Key Features Used:**

- Email authentication with PKCE flow
- Profiles table with RLS
- Orders, Inventory, Receiving, Subscriptions tables
- Automatic profile creation on signup

**Cost:** Free tier available, scales with usage

---

## Payment Processing

### Stripe

**Purpose:** Payment processing and subscription management

**Status:** ✅ Active

**Setup:**

- Dashboard: [dashboard.stripe.com](https://dashboard.stripe.com)
- API Keys: Set in environment variables
- Webhooks: Configured for subscription events

**Environment Variables:**

```env
STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Webhook Endpoint:**

- Production: `https://yourdomain.com/api/webhooks/stripe`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

**Documentation:**

- [Stripe Docs](https://stripe.com/docs)
- Internal: `docs/stripe-billing-progress.md`

**Key Features Used:**

- Stripe Checkout for subscription payments
- Customer Portal for billing management
- Webhook handling for subscription sync
- Three plan tiers: Starter, Growth, Scale Pro

**Cost:** 2.9% + $0.30 per transaction (standard Stripe fees)

---

## E-Commerce Integration

### Shopify

**Purpose:** E-commerce platform integration for order syncing

**Status:** ✅ Active

**Setup:**

- Partners Dashboard: [partners.shopify.com](https://partners.shopify.com)
- OAuth App: Created in Partners dashboard
- Webhooks: Manually configured in Shopify Admin

**Environment Variables:**

```env
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
SHOPIFY_APP_SCOPES=read_orders,write_orders,read_products
```

**OAuth Flow:**

- Initiation: `/api/shopify/auth`
- Callback: `/api/shopify/auth/callback`
- Redirect URI: Auto-generated from request origin

**Webhook Endpoint:**

- Production: `https://yourdomain.com/api/webhooks/shopify/orders`
- Event: `orders/create`
- Security: HMAC signature verification

**Documentation:**

- [Shopify API Docs](https://shopify.dev/docs/api)
- Internal: `docs/shopify-app-setup.md`

**Key Features Used:**

- OAuth 2.0 for store connection
- Order webhook syncing
- Multi-store support
- Automatic order transformation

**Cost:** Free (Shopify app)

---

## Shipping

### DHL Express

**Purpose:** Shipping label generation and tracking

**Status:** ⏳ Configured but using mock data (not yet in production)

**Setup:**

- Developer Portal: [developer.dhl.com](https://developer.dhl.com)
- API Credentials: Consumer Key and Secret
- Sandbox: Available for testing

**Environment Variables:**

```env
DHL_API_KEY=your_consumer_key
DHL_API_SECRET=your_consumer_secret
DHL_API_BASE_URL=https://express.api.dhl.com/mydhlapi/test
```

**Documentation:**

- [DHL API Docs](https://developer.dhl.com/api-reference)
- Internal: `docs/dhl-api-research.md`, `docs/shipping-label-flow.md`

**Key Features Used:**

- Label generation
- Rate calculation
- Tracking (planned)
- Mock mode for development

**Cost:** Pay-per-use (contact DHL for pricing)

**Note:** Currently using mock data. Set real credentials for production.

---

## Error Tracking & Monitoring

### Sentry

**Purpose:** Error tracking, performance monitoring, and session replay

**Status:** ✅ Active

**Setup:**

- Dashboard: [sentry.io](https://sentry.io)
- Project: `e-commerce-platform`
- Organization: `black-sea-industrial-group`
- Region: EU (`de.sentry.io`)

**Environment Variables:**

```env
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.de.sentry.io/xxx
SENTRY_ORG=black-sea-industrial-group
SENTRY_PROJECT=e-commerce-platform
SENTRY_AUTH_TOKEN=xxx (for source maps, optional)
```

**Documentation:**

- [Sentry Docs](https://docs.sentry.io)
- Internal: `docs/technical/sentry-setup.md`

**Key Features Used:**

- Client-side error tracking
- Server-side error tracking
- Edge runtime error tracking
- Session replay (10% sample rate)
- Performance monitoring
- Email alerts for new issues

**Cost:** Free tier: 5,000 errors/month, 10,000 performance units/month

---

## Email Services

### Resend

**Purpose:** Transactional email delivery for support contact form

**Status:** ✅ Active

**Setup:**

- Dashboard: [resend.com](https://resend.com)
- API Key: Created in dashboard
- Domain: Verify for production (optional for testing)

**Environment Variables:**

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com (or onboarding@resend.dev for testing)
SUPPORT_EMAIL=support@yourdomain.com
```

**Documentation:**

- [Resend Docs](https://resend.com/docs)
- Internal: `docs/technical/environment-variables.md`

**Key Features Used:**

- Support contact form emails
- Reply-to functionality
- HTML and plain text emails

**Cost:** Free tier: 3,000 emails/month, 100 emails/day

**Note:** For production, verify your domain. Test emails can use `onboarding@resend.dev`.

---

## Analytics

### Google Analytics 4 (GA4)

**Purpose:** Website analytics and user behavior tracking

**Status:** ✅ Active

**Setup:**

- Dashboard: [analytics.google.com](https://analytics.google.com)
- Measurement ID: Set in environment variable

**Environment Variables:**

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Documentation:**

- [GA4 Docs](https://developers.google.com/analytics/devguides/collection/ga4)
- Internal: `src/lib/analytics.ts`

**Key Features Used:**

- Page view tracking
- Form submission tracking
- Button click tracking
- Custom event tracking

**Cost:** Free

---

### Vercel Speed Insights

**Purpose:** Performance monitoring and Core Web Vitals tracking

**Status:** ✅ Active (automatic with Vercel)

**Setup:**

- Automatic with Vercel deployment
- No configuration needed

**Documentation:**

- [Vercel Speed Insights](https://vercel.com/docs/analytics/speed-insights)

**Key Features Used:**

- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Performance metrics

**Cost:** Free with Vercel

---

## Hosting & Deployment

### Vercel

**Purpose:** Hosting, deployment, and CDN

**Status:** ✅ Active

**Setup:**

- Dashboard: [vercel.com](https://vercel.com)
- Automatic deployments from Git
- Environment variables configured in dashboard

**Documentation:**

- [Vercel Docs](https://vercel.com/docs)
- Internal: `docs/technical/deployment.md`

**Key Features Used:**

- Next.js hosting
- Automatic deployments
- Preview deployments for PRs
- Environment variable management
- Custom domains
- SSL certificates (automatic)

**Cost:** Free tier: Unlimited personal projects, 100GB bandwidth/month

**Deployment:**

- Production: Automatic on `main` branch push
- Preview: Automatic for pull requests
- Manual: Available via dashboard

---

## Service Status & Health Checks

### Monitoring Checklist

- [ ] Supabase: Check status at [status.supabase.com](https://status.supabase.com)
- [ ] Stripe: Check status at [status.stripe.com](https://status.stripe.com)
- [ ] Shopify: Check status at [status.shopify.com](https://status.shopify.com)
- [ ] Sentry: Check status at [status.sentry.io](https://status.sentry.io)
- [ ] Resend: Check status at [status.resend.com](https://status.resend.com)
- [ ] Vercel: Check status at [vercel-status.com](https://vercel-status.com)

---

## API Rate Limits

### Known Limits

- **Resend:** 100 emails/day (free tier), 3,000/month
- **Sentry:** 5,000 errors/month (free tier)
- **Stripe:** 100 requests/second (test mode), varies in production
- **Shopify:** 2 requests/second per store (REST API)
- **DHL:** Varies by plan
- **Supabase:** 500MB database (free tier), 2GB bandwidth/month

---

## Security Considerations

### API Keys & Secrets

- ✅ All secrets stored in environment variables
- ✅ Never committed to Git
- ✅ Different keys for development/production
- ✅ Rotate keys quarterly or after security incidents

### Webhook Security

- ✅ HMAC signature verification (Shopify)
- ✅ Stripe signature verification
- ✅ Always return 200 to prevent retries

### Data Privacy

- ✅ GDPR-compliant (EU region for Sentry)
- ✅ User data isolated via RLS policies
- ✅ No PII in logs or error tracking

---

## Cost Summary

### Monthly Costs (Estimated)

- **Supabase:** Free (or $25/month for Pro)
- **Stripe:** 2.9% + $0.30 per transaction
- **Shopify:** Free (app)
- **DHL:** Pay-per-use
- **Sentry:** Free tier (or $26/month for Team)
- **Resend:** Free tier (or $20/month for Pro)
- **Google Analytics:** Free
- **Vercel:** Free tier (or $20/month for Pro)

**Total Estimated:** $0-100/month (depending on usage and plan tiers)

---

## Migration & Backup

### Backup Strategy

- **Database:** Supabase handles automatic backups
- **Code:** Git repository (GitHub/GitLab)
- **Environment Variables:** Documented in this file and `.env.example`

### Migration Notes

- All services can be migrated to different providers if needed
- Database migrations are versioned in `docs/migrations/`
- Environment variables are centralized in documentation

---

## Support & Resources

### Getting Help

- **Supabase:** [Discord](https://discord.supabase.com) | [GitHub](https://github.com/supabase/supabase)
- **Stripe:** [Support](https://support.stripe.com) | [Discord](https://discord.gg/stripe)
- **Shopify:** [Community](https://community.shopify.com) | [Partners](https://partners.shopify.com)
- **Sentry:** [Discord](https://discord.gg/sentry) | [GitHub](https://github.com/getsentry/sentry)
- **Resend:** [Discord](https://discord.gg/resend) | [GitHub](https://github.com/resendlabs/resend-node)
- **Vercel:** [Discord](https://vercel.com/discord) | [GitHub](https://github.com/vercel)

---

## Updates & Maintenance

### Regular Tasks

- **Weekly:** Review Sentry errors
- **Monthly:** Review API usage and costs
- **Quarterly:** Rotate API keys
- **As needed:** Update service versions and dependencies

### Version Updates

- Check service status pages for updates
- Review changelogs before major updates
- Test in development before production deployment

---

**Last Updated:** 2025-01-XX  
**Maintained By:** Development Team
