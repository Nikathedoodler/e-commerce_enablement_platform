# Stripe Billing Integration - Current Progress

**Date:** 2025-01-XX  
**Phase:** Phase 5 - Shipping & Billing (Stripe Billing)  
**Branch:** `feature/shopify-integration` (or create new branch `feature/stripe-billing`)

---

## ✅ Completed

1. **Database Schema**

   - ✅ Created `010_create_subscriptions_table.sql` migration
   - ✅ Table structure: id, user_id, stripe_customer_id, stripe_subscription_id, plan_tier, status, current_period_start, current_period_end, cancel_at_period_end
   - ✅ RLS policies implemented
   - ⚠️ **Action needed:** Run migration in Supabase

2. **TypeScript Types**

   - ✅ Created `src/types/stripe.ts`
   - ✅ Types: `Subscription`, `SubscriptionInput`, `SubscriptionUpdate`, `PlanTier`, `SubscriptionStatus`
   - ✅ Stripe webhook event types defined

3. **Stripe Package**

   - ✅ Installed: `npm install stripe`

4. **Checkout Route Structure**
   - ✅ Created `src/app/api/stripe/checkout/route.ts`
   - ⚠️ **Needs completion:** Price ID mapping and checkout session creation

---

## 🔄 Currently Working On

### Step: Setting up Stripe Products

**What you're doing:**

- Creating 3 products in Stripe Dashboard:
  1. **Starter** - €199/month
  2. **Growth/Professional** - €699/month
  3. **Enterprise** - Custom pricing (placeholder amount)

**Product Details:**

**Starter:**

- Name: Starter
- Description: "Early-stage, small D2C brands - Up to 250 orders/month"
- Amount: €199.00 (19900 cents)
- Currency: EUR
- Billing: Monthly recurring

**Growth:**

- Name: Growth (or Professional)
- Description: "Growing brands, multi-channel - Up to 2,000 orders/month. Multi-channel integrations, multiple EU warehouse support, automated inventory alerts, and priority support (Slack/email). Built for brands scaling channels across the EU."
- Amount: €699.00 (69900 cents)
- Currency: EUR
- Billing: Monthly recurring

**Enterprise:**

- Name: Scale Pro (or Enterprise)
- Description: "Fast-moving, established brands - 2,000+ orders/month. Custom order volume & pricing, all integrations & ERP connectivity, real-time advanced analytics, white-glove onboarding, and dedicated account manager. Enterprise-grade fulfilment with tailored workflows."
- Amount: €2,000.00 (200000 cents) - placeholder
- Currency: EUR
- Billing: Monthly recurring

**After creating products:**

- Copy the **Price ID** for each (starts with `price_...`)
- You'll need these to update the checkout route

---

## 📝 Next Steps (In Order)

### 1. Complete Stripe Products Setup

- [ ] Create all 3 products in Stripe Dashboard
- [ ] Copy Price IDs for each
- [ ] Update `src/app/api/stripe/checkout/route.ts` with Price IDs

### 2. Complete Checkout Route

- [ ] Uncomment and fill in `priceIdMap` with your Price IDs
- [ ] Uncomment Stripe checkout session creation code
- [ ] Uncomment return statement
- [ ] Test checkout flow

### 3. Environment Variables

Add to `.env.local` and Vercel:

```bash
STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)
```

### 4. Create Stripe Webhook Handler

- [ ] Create `/api/webhooks/stripe/route.ts`
- [ ] Handle events: `checkout.session.completed`, `customer.subscription.updated`, etc.
- [ ] Verify webhook signatures
- [ ] Update subscriptions table

### 5. Create Query Helpers

- [ ] Create `src/lib/supabase/queries/subscriptions.ts`
- [ ] Functions: `getSubscription()`, `upsertSubscription()`, `updateSubscription()`

### 6. Create Hooks

- [ ] Create `src/hooks/use-subscriptions.ts`
- [ ] Hook: `useSubscription()` - fetch current subscription

### 7. Build Billing UI

- [ ] Update `src/app/dashboard/settings/billing/page.tsx`
- [ ] Show current plan
- [ ] Add "Upgrade" / "Change Plan" buttons
- [ ] Add billing portal link

---

## 🔑 Key Files

**Created:**

- `docs/migrations/010_create_subscriptions_table.sql` - Database migration
- `src/types/stripe.ts` - TypeScript types
- `src/app/api/stripe/checkout/route.ts` - Checkout endpoint (needs Price IDs)

**To Create:**

- `src/app/api/webhooks/stripe/route.ts` - Webhook handler
- `src/lib/supabase/queries/subscriptions.ts` - Query helpers
- `src/hooks/use-subscriptions.ts` - React hooks
- Update `src/app/dashboard/settings/billing/page.tsx` - Billing UI

---

## 💡 Important Notes

1. **Plan Tier Mapping:**

   - Database uses: `starter`, `professional`, `enterprise`
   - Pricing component uses: `Starter`, `Growth`, `Scale Pro`
   - Map: Starter → starter, Growth → professional, Scale Pro → enterprise

2. **Stripe API Version:**

   - Code uses: `"2024-12-18.acacia"` (check latest version)

3. **Webhook Setup:**

   - After creating webhook endpoint, register it in Stripe Dashboard
   - Get webhook signing secret for `STRIPE_WEBHOOK_SECRET`

4. **Testing:**
   - Use Stripe test mode first
   - Test cards: https://stripe.com/docs/testing

---

## 🎯 Current Status

**Where you are:** Setting up Stripe products in dashboard  
**Next action:** Get Price IDs and update checkout route  
**Blockers:** None - just need to complete Stripe product setup

---

**Ready to continue?** Once you have the Price IDs, update the checkout route and we can test the checkout flow!
