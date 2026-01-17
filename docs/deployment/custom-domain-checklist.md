# Custom Domain Migration Checklist

**Purpose:** Checklist for when migrating from Vercel default domain to custom domain

---

## ⚠️ Important: Email Notification URLs

When switching from Vercel (`*.vercel.app`) to a custom domain, you **must** update the environment variable for email notification links to work correctly.

### Required Action

**Set the following environment variable in your production environment:**

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Where to set:**
- Vercel Dashboard → Your Project → Settings → Environment Variables
- Add/Update `NEXT_PUBLIC_APP_URL` for **Production** environment
- Value: Your custom domain URL (e.g., `https://yourdomain.com`)

### Why This Is Needed

The email notification system (`src/lib/email/url-helpers.ts`) uses this priority order for URLs:

1. `NEXT_PUBLIC_APP_URL` (if set) ← **Set this for custom domain**
2. `VERCEL_URL` (automatically set by Vercel) ← Works for `*.vercel.app` domains
3. `localhost:3000` (development fallback)

**Without setting `NEXT_PUBLIC_APP_URL`:**
- Email links will still point to `your-app.vercel.app` instead of your custom domain
- Users clicking "View Order in Dashboard" will go to the Vercel URL, not your custom domain

### Affected Features

These email notifications include dashboard links:
- ✅ New Shopify order notifications
- ✅ Shipping label generation (success/failure)
- ✅ Low stock alerts

### Testing After Migration

1. Generate a test order or label
2. Check the email notification
3. Verify the "View Order in Dashboard" link uses your custom domain
4. Click the link and confirm it works correctly

---

## Other Considerations

### DNS Configuration
- Ensure your custom domain DNS is properly configured
- Point your domain to Vercel (or your hosting provider)
- Wait for DNS propagation

### SSL Certificate
- Vercel automatically provisions SSL certificates for custom domains
- Ensure SSL is active before going live

### Environment Variables Review
- Review all environment variables that might reference URLs
- Update any hardcoded URLs in configuration files
- Check webhook URLs in external services (Shopify, Stripe)

---

**Last Updated:** 2025-01-XX  
**Status:** Ready for custom domain migration
