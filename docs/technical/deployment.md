# Deployment Guide

Guide for deploying the platform to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Vercel Deployment](#vercel-deployment)
3. [Supabase Setup](#supabase-setup)
4. [Database Migrations](#database-migrations)
5. [Post-Deployment](#post-deployment)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ Vercel account
- ✅ Supabase project
- ✅ Stripe account (with API keys)
- ✅ Shopify app (if using Shopify integration)
- ✅ DHL API credentials (if using shipping)
- ✅ Domain name (optional, for custom domain)

---

## Vercel Deployment

### Initial Deployment

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub/GitLab repository
   - Select the repository

2. **Configure Project**
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or leave default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

3. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add all required variables (see [Environment Variables](./environment-variables.md))
   - Set for: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-project.vercel.app`

### Custom Domain

1. **Add Domain**
   - Go to Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **SSL Certificate**
   - Vercel automatically provisions SSL certificates
   - Wait for DNS propagation (can take up to 48 hours)

---

## Supabase Setup

### Production Database

1. **Create Production Project**
   - Go to [Supabase Dashboard](https://supabase.com)
   - Create new project (or use existing)
   - Note the project URL and API keys

2. **Run Migrations**
   - See [Database Migrations](#database-migrations) section
   - Run all migration files in order

3. **Configure RLS Policies**
   - Verify all tables have RLS enabled
   - Test policies with test user

4. **Set Up Auth**
   - Configure email templates
   - Set up password reset flow
   - Configure email provider (if custom)

---

## Database Migrations

### Running Migrations

Migrations are located in `docs/migrations/`. Run them in order:

1. `001_create_profiles_table.sql`
2. `002_add_full_name_to_profiles.sql`
3. `003_update_trigger_read_metadata.sql`
4. `004_sync_existing_users_profiles.sql`
5. `005_create_orders_table.sql`
6. `006_create_inventory_table.sql`
7. `007_seed_inventory_data.sql` (optional)
8. `008_create_receiving_log_table.sql`
9. `009_create_shopify_stores_table.sql`
10. `010_create_subscriptions_table.sql`
11. `011_create_shipping_labels_table.sql`

### How to Run

**Option 1: Supabase SQL Editor**
1. Go to Supabase Dashboard → SQL Editor
2. Copy migration SQL
3. Paste and run
4. Verify success

**Option 2: Supabase CLI** (if installed)
```bash
supabase db push
```

### Verification

After running migrations, verify:
- ✅ All tables exist
- ✅ RLS is enabled on all tables
- ✅ Indexes are created
- ✅ Triggers are set up
- ✅ Test queries work

---

## Post-Deployment

### 1. Verify Environment Variables

Check that all environment variables are set correctly:
- Supabase keys
- Stripe keys (use live keys for production)
- Shopify keys (if using)
- DHL keys (if using)
- Analytics ID

### 2. Configure Webhooks

**Shopify:**
1. Go to Shopify Admin → Settings → Notifications
2. Create webhook:
   - Event: Order creation
   - URL: `https://yourdomain.com/api/webhooks/shopify/orders`
   - Format: JSON
3. Save webhook secret to environment variables

**Stripe:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
3. Copy webhook signing secret to environment variables

### 3. Test Critical Flows

Test these flows after deployment:

- ✅ User signup and login
- ✅ Order creation
- ✅ Shopify webhook (create test order)
- ✅ Stripe checkout (test mode first)
- ✅ Label generation (if DHL configured)
- ✅ Inventory management
- ✅ Receiving workflow

### 4. Set Up Monitoring

**Error Tracking:**
- Configure Sentry (if using)
- Set up error alerts

**Analytics:**
- Verify Google Analytics is tracking
- Set up conversion goals

**Performance:**
- Monitor Vercel Analytics
- Check Core Web Vitals

### 5. Security Checklist

- ✅ All secrets are in environment variables (not in code)
- ✅ RLS policies are enabled and tested
- ✅ Webhook signatures are verified
- ✅ HTTPS is enabled (automatic with Vercel)
- ✅ CORS is configured correctly
- ✅ Rate limiting considered (if needed)

---

## Rollback Procedure

If deployment has issues:

1. **Revert Code**
   - Go to Vercel Dashboard → Deployments
   - Find last working deployment
   - Click "Promote to Production"

2. **Revert Database** (if needed)
   - Restore from backup
   - Or manually rollback migrations

3. **Check Environment Variables**
   - Verify all variables are correct
   - Check for typos

---

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests get preview deployments

### Manual Deployments

1. Go to Vercel Dashboard
2. Click "Deploy" → "Create Deployment"
3. Select branch and commit
4. Deploy

---

## Troubleshooting

**Build Fails:**
- Check build logs in Vercel
- Verify all dependencies are in `package.json`
- Check for TypeScript errors

**Environment Variables Not Working:**
- Verify variables are set for correct environment
- Redeploy after adding variables
- Check variable names match code

**Database Connection Issues:**
- Verify Supabase URL and keys
- Check RLS policies
- Test connection from Supabase dashboard

**Webhooks Not Working:**
- Verify webhook URLs are correct
- Check webhook secrets match
- Test webhook delivery in external service

---

## Maintenance

### Regular Tasks

- **Weekly**: Review error logs
- **Monthly**: Review performance metrics
- **Quarterly**: Rotate API keys
- **As Needed**: Update dependencies

### Updates

1. **Code Updates:**
   - Merge to `main` branch
   - Vercel auto-deploys

2. **Database Updates:**
   - Create new migration file
   - Run in Supabase SQL Editor
   - Test in staging first

3. **Environment Variable Updates:**
   - Update in Vercel Dashboard
   - Redeploy to apply changes

---

**Last Updated**: 2025-01-XX

