# Security Review Checklist

**Purpose:** Verify security measures are in place before pilot launch  
**Time Estimate:** 1-2 hours  
**Status:** ⏳ In Progress

---

## 🎯 Security Review Objectives

By the end of this review, you should verify:

- ✅ All environment variables are set correctly (local and production)
- ✅ RLS policies are enabled and working
- ✅ API endpoints are properly secured
- ✅ Authentication/authorization works correctly
- ✅ Webhook signatures are validated
- ✅ No secrets are exposed in code or logs

---

## 📋 Step 1: Environment Variables Review

### 1.1 Check Local Environment Variables

**Action:** Verify `.env.local` file exists and contains all required variables

**Checklist:**

- [ ] `.env.local` file exists in project root
- [ ] File is in `.gitignore` (should NOT be committed)
- [ ] All required variables are set:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - [ ] `SUPABASE_SECRET_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_PUBLISHABLE_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET` (if using Stripe webhooks)
  - [ ] `SHOPIFY_API_KEY` (if using Shopify)
  - [ ] `SHOPIFY_API_SECRET` (if using Shopify)
  - [ ] `SHOPIFY_WEBHOOK_SECRET` (if using Shopify webhooks)
- [ ] Optional variables are set (if needed):
  - [ ] `NEXT_PUBLIC_SENTRY_DSN`
  - [ ] `SENTRY_ORG`
  - [ ] `SENTRY_PROJECT`
  - [ ] `RESEND_API_KEY`
  - [ ] `RESEND_FROM_EMAIL`
  - [ ] `SUPPORT_EMAIL`
  - [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID`

**How to Check:**

```bash
# Check if .env.local exists
ls -la .env.local

# Check if it's in .gitignore
grep -q ".env.local" .gitignore && echo "✅ In .gitignore" || echo "❌ NOT in .gitignore"

# View variables (BE CAREFUL - don't expose in screenshots/logs)
cat .env.local | grep -v "SECRET" | grep -v "KEY"  # Only show non-secret vars
```

**Issues to Watch For:**

- ❌ `.env.local` is committed to git
- ❌ Secrets are logged to console
- ❌ Test keys used in production (e.g., `sk_test_` instead of `sk_live_`)

---

### 1.2 Check Vercel Production Environment Variables

**Action:** Verify all production environment variables are set in Vercel

**Checklist:**

- [ ] Log into Vercel Dashboard
- [ ] Go to Project → Settings → Environment Variables
- [ ] Verify all required variables are set for **Production** environment:
  - [ ] Supabase variables (production values)
  - [ ] Stripe variables (use `sk_live_` and `pk_live_` for production)
  - [ ] Shopify variables (if using)
  - [ ] Other required variables
- [ ] Verify test/development keys are NOT used in production

**How to Check:**

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Review each variable:
   - ✅ Production keys should start with `sk_live_` / `pk_live_` (Stripe)
   - ✅ Supabase URL should be production URL
   - ✅ All secrets should be set

**Issues to Watch For:**

- ❌ Using `sk_test_` keys in production
- ❌ Missing required variables
- ❌ Using development/test URLs in production

---

### 1.3 Verify No Secrets in Code

**Action:** Check that no secrets are hardcoded in the codebase

**How to Check:**

```bash
# Search for common secret patterns in code
grep -r "sk_live_\|sk_test_\|password.*=.*['\"]" src/ --exclude-dir=node_modules || echo "✅ No obvious secrets found"

# Check for API keys in code
grep -r "api.*key.*=.*['\"][^'\"]\{10,\}" src/ --exclude-dir=node_modules || echo "✅ No hardcoded API keys found"
```

**Checklist:**

- [ ] No API keys in source code
- [ ] No passwords in source code
- [ ] All secrets use `process.env.VAR_NAME`
- [ ] No secrets in client-side code (only `NEXT_PUBLIC_*` vars should be in client code)

---

## 📋 Step 2: RLS Policies Review

### 2.1 Verify RLS is Enabled

**Action:** Check that Row-Level Security is enabled on all user data tables

**Tables to Check:**

- [ ] `orders` - RLS enabled
- [ ] `inventory` - RLS enabled
- [ ] `receiving_log` - RLS enabled
- [ ] `profiles` - RLS enabled (if exists)
- [ ] `subscriptions` - RLS enabled (if exists)
- [ ] `shopify_stores` - RLS enabled (if exists)
- [ ] `shipping_labels` - RLS enabled (if exists)

**How to Check:**

```sql
-- Run in Supabase SQL Editor
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('orders', 'inventory', 'receiving_log', 'profiles', 'subscriptions', 'shopify_stores', 'shipping_labels')
ORDER BY tablename;
```

**Expected Result:**
All tables should show `rls_enabled = true`

---

### 2.2 Verify RLS Policies are Correct

**Action:** Verify policies enforce `auth.uid() = user_id` for all operations

**How to Check:**

```sql
-- Check policies for each table
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('orders', 'inventory', 'receiving_log')
ORDER BY tablename, cmd;
```

**Checklist for Each Table:**

**Orders Table:**

- [x] ✅ SELECT policy: `auth.uid() = user_id` (qual shows correct condition)
- [x] ✅ INSERT policy: `auth.uid() = user_id` (with_check shows correct condition)
- [x] ✅ UPDATE policy: `auth.uid() = user_id` (both qual and with_check show correct condition)
- [x] ✅ DELETE policy: `auth.uid() = user_id` (qual shows correct condition)

**Inventory Table:**

- [x] ✅ SELECT policy: `auth.uid() = user_id` (qual shows correct condition)
- [x] ✅ INSERT policy: `auth.uid() = user_id` (with_check shows correct condition)
- [x] ✅ UPDATE policy: `auth.uid() = user_id` (both qual and with_check show correct condition)
- [x] ✅ DELETE policy: `auth.uid() = user_id` (qual shows correct condition)

**Receiving Log Table:**

- [x] ✅ SELECT policy: `auth.uid() = user_id` (qual shows correct condition)
- [x] ✅ INSERT policy: `auth.uid() = user_id` (with_check shows correct condition)
- [x] ✅ UPDATE policy: `auth.uid() = user_id` (both qual and with_check show correct condition)
- [x] ✅ DELETE policy: `auth.uid() = user_id` (qual shows correct condition)

**Expected Pattern:**

- `qual` should contain `(auth.uid() = user_id)`
- `with_check` should contain `(auth.uid() = user_id)` for INSERT/UPDATE

---

### 2.3 Test RLS Policies

**Action:** Test that users can only access their own data

**How to Test:**

1. Log in as User A
2. Create some test data (order, inventory item)
3. Log in as User B (different account)
4. Try to access User A's data - should fail

**Checklist:**

- [ ] User B cannot see User A's orders
- [ ] User B cannot see User A's inventory
- [ ] User B cannot see User A's receiving logs
- [ ] User B cannot modify User A's data
- [ ] User B cannot delete User A's data

**Quick Test Query:**

```sql
-- Test as User A (replace with actual user_id)
-- This should only return User A's data
SELECT * FROM orders WHERE user_id = auth.uid();
SELECT * FROM inventory WHERE user_id = auth.uid();
SELECT * FROM receiving_log WHERE user_id = auth.uid();

-- This should return empty (if User A has different user_id)
-- Try with a different user's ID - should return nothing
SELECT * FROM orders WHERE user_id = 'different-user-uuid';
```

---

## 📋 Step 3: API Endpoint Security Review

### 3.1 Verify Authentication Checks

**Action:** Check that all protected API endpoints verify authentication

**Protected Endpoints to Check:**

- [ ] `/api/stripe/checkout` - Requires auth
- [ ] `/api/stripe/portal` - Requires auth
- [ ] `/api/shipping/dhl/rate` - Requires auth
- [ ] `/api/shipping/dhl/label` - Requires auth
- [ ] `/api/shopify/auth` - Requires auth
- [ ] `/api/shopify/auth/callback` - Requires auth (via state)
- [ ] `/api/support/contact` - Requires auth (likely)

**How to Check:**
Look for authentication pattern in each route file:

```typescript
const supabase = await createClient();
const {
  data: { user },
  error: authError,
} = await supabase.auth.getUser();

if (authError || !user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

**Checklist:**

- [ ] Each protected endpoint checks `supabase.auth.getUser()`
- [ ] Returns 401 if user is not authenticated
- [ ] Continues only if user exists

---

### 3.2 Verify Authorization Checks

**Action:** Check that endpoints enforce user ownership of resources

**Endpoints with Resource Ownership:**

- [ ] Order operations - User can only access own orders
- [ ] Inventory operations - User can only access own inventory
- [ ] Receiving log operations - User can only access own logs

**How to Check:**
Look for patterns that use `user.id` from authentication:

```typescript
const { data, error } = await supabase
  .from("orders")
  .select("*")
  .eq("user_id", user.id) // ✅ Should use authenticated user's ID
  .single();
```

**Checklist:**

- [ ] Queries filter by `user_id` using authenticated `user.id`
- [ ] No direct ID parameters without user_id check
- [ ] RLS policies provide additional layer of protection

---

### 3.3 Test API Endpoint Security

**Action:** Test that unauthenticated requests are rejected

**How to Test:**

```bash
# Test without authentication (should fail)
curl -X POST http://localhost:3000/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -d '{"planTier": "starter"}'

# Expected: {"error": "Unauthorized"} with status 401
```

**Checklist:**

- [x] ✅ Unauthenticated requests to protected endpoints return 401
  - Verified: `/api/stripe/checkout` returns `401 Unauthorized` with `{"error": "Unauthorized"}`
- [ ] Authenticated requests work correctly (test with valid session)
- [ ] Users cannot access other users' resources (test with multiple users)

---

## 📋 Step 4: Webhook Security Review

### 4.1 Verify Shopify Webhook Signature Validation

**Action:** Check that Shopify webhooks verify HMAC signatures

**File to Review:** `src/app/api/webhooks/shopify/orders/route.ts`

**How to Check:**

1. Open the webhook route file
2. Look for HMAC verification code:

```typescript
// Should verify HMAC signature
const hmacHeader = req.headers.get("X-Shopify-Hmac-Sha256");
const webhookSecret =
  process.env.SHOPIFY_WEBHOOK_SECRET || process.env.SHOPIFY_API_SECRET;

if (!verifyHmac(rawBody, hmacHeader, webhookSecret)) {
  return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
}
```

**Checklist:**

- [ ] Reads `X-Shopify-Hmac-Sha256` header
- [ ] Uses `SHOPIFY_WEBHOOK_SECRET` or `SHOPIFY_API_SECRET`
- [ ] Verifies HMAC signature before processing
- [ ] Returns 401 if signature is invalid
- [ ] Uses raw body for HMAC calculation (not parsed JSON)

---

### 4.2 Verify Stripe Webhook Signature Validation

**Action:** Check that Stripe webhooks verify signatures

**File to Review:** `src/app/api/webhooks/stripe/route.ts`

**How to Check:**

1. Open the webhook route file
2. Look for signature verification:

```typescript
// Should use Stripe SDK to verify
const signature = request.headers.get("stripe-signature");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const event = await verifyStripeWebhook(req, webhookSecret);
```

**Checklist:**

- [ ] Reads `stripe-signature` header
- [ ] Uses `STRIPE_WEBHOOK_SECRET` from environment
- [ ] Uses Stripe SDK `constructEvent` to verify signature
- [ ] Returns 400/401 if signature is invalid
- [ ] Handles raw body correctly for verification

---

### 4.3 Test Webhook Security

**Action:** Test that invalid webhook signatures are rejected

**How to Test:**

```bash
# Test Shopify webhook with invalid signature
curl -X POST http://localhost:3000/api/webhooks/shopify/orders \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Hmac-Sha256: invalid-signature" \
  -H "X-Shopify-Shop-Domain: test.myshopify.com" \
  -d '{}'

# Expected: {"error": "Invalid signature"} with status 401

# Test Stripe webhook with invalid signature
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "stripe-signature: invalid-signature" \
  -d '{}'

# Expected: Error response with status 400 or 401
```

**Checklist:**

- [ ] Invalid Shopify HMAC signatures are rejected
- [ ] Invalid Stripe signatures are rejected
- [ ] Missing signature headers are rejected
- [ ] Valid signatures are accepted

---

## 📋 Step 5: Authentication & Authorization Testing

### 5.1 Test Login/Logout Flow

**Action:** Verify authentication flow works correctly

**Checklist:**

- [ ] Users can log in with valid credentials
- [ ] Invalid credentials are rejected
- [ ] Sessions are created correctly
- [ ] Users can log out
- [ ] Logged-out users are redirected to login

**How to Test:**

1. Try logging in with valid credentials → Should succeed
2. Try logging in with invalid credentials → Should fail
3. After login, check dashboard → Should be accessible
4. Click logout → Should redirect to login
5. Try accessing dashboard after logout → Should redirect to login

---

### 5.2 Test Route Protection

**Action:** Verify middleware protects dashboard routes

**Routes to Test:**

- [ ] `/dashboard` - Requires auth
- [ ] `/dashboard/orders` - Requires auth
- [ ] `/dashboard/inventory` - Requires auth
- [ ] `/dashboard/receiving` - Requires auth
- [ ] `/dashboard/settings` - Requires auth

**Checklist:**

- [ ] Unauthenticated users are redirected to `/auth/login`
- [ ] Authenticated users can access dashboard
- [ ] Authenticated users accessing `/auth/login` are redirected to dashboard

**How to Test:**

1. Log out (or use incognito)
2. Try accessing `/dashboard` → Should redirect to `/auth/login`
3. Log in
4. Try accessing `/dashboard` → Should work
5. Try accessing `/auth/login` while logged in → Should redirect to `/dashboard`

---

### 5.3 Test Multi-User Data Isolation

**Action:** Verify users can only access their own data

**Checklist:**

- [ ] User A cannot see User B's orders
- [ ] User A cannot see User B's inventory
- [ ] User A cannot modify User B's data
- [ ] Each user sees only their own data in dashboards

**How to Test:**

1. Create two test accounts (User A and User B)
2. As User A, create some orders/inventory
3. Log in as User B
4. Check dashboard → Should show empty or User B's own data
5. Try to access User A's data directly (if possible) → Should fail

---

## 📋 Step 6: Additional Security Checks

### 6.1 Check for Console Logging of Secrets

**Action:** Verify no secrets are logged to console

**How to Check:**

```bash
# Search for console.log with environment variables
grep -r "console.*process\.env" src/ --exclude-dir=node_modules

# Should only find safe variables (NEXT_PUBLIC_*)
# Should NOT find SECRET_KEY, API_SECRET, etc.
```

**Checklist:**

- [ ] No `console.log(process.env.SECRET_KEY)`
- [ ] No `console.log(process.env.API_SECRET)`
- [ ] No logging of sensitive data
- [ ] Only safe variables are logged (e.g., `NEXT_PUBLIC_SUPABASE_URL`)

---

### 6.2 Check Client-Side Secret Exposure

**Action:** Verify secrets are not exposed in client-side code

**How to Check:**

```bash
# Search for process.env in client-side files
grep -r "process\.env\." src/app/ src/components/ --exclude-dir=api

# Should only find NEXT_PUBLIC_* variables
# Should NOT find server-only variables like SUPABASE_SECRET_KEY, STRIPE_SECRET_KEY
```

**Checklist:**

- [ ] Only `NEXT_PUBLIC_*` variables in client-side code
- [ ] No `SUPABASE_SECRET_KEY` in client code
- [ ] No `STRIPE_SECRET_KEY` in client code
- [ ] No `SHOPIFY_API_SECRET` in client code

---

### 6.3 Verify Environment Variable Usage

**Action:** Check that all env vars are properly used

**Checklist:**

- [ ] All required variables are checked for existence
- [ ] Missing variables return appropriate errors
- [ ] Variables are validated before use (e.g., Stripe key format)

**Example Pattern to Look For:**

```typescript
const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
}
```

---

## ✅ Security Review Summary

After completing all steps:

- [ ] **Environment Variables:** All set and secure
- [ ] **RLS Policies:** Enabled and working correctly
- [ ] **API Endpoints:** Properly authenticated and authorized
- [ ] **Webhooks:** Signature validation in place
- [ ] **Authentication:** Working correctly
- [ ] **Data Isolation:** Users can only access own data
- [ ] **No Secrets Exposed:** Secrets not in code or logs

---

## 🚨 Common Security Issues to Fix

### Issue: RLS Not Enabled

**Fix:** Enable RLS on all tables:

```sql
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- Repeat for other tables
```

### Issue: Missing Authentication Check

**Fix:** Add authentication check to protected endpoints:

```typescript
const {
  data: { user },
  error,
} = await supabase.auth.getUser();
if (error || !user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### Issue: Webhook Not Verifying Signatures

**Fix:** Add signature verification before processing webhooks

### Issue: Test Keys in Production

**Fix:** Use production keys (`sk_live_`, `pk_live_`) in Vercel production environment

---

## 📝 Security Review Notes

Document any issues found and fixes applied:

**Issues Found:**

- [ ] ***
- [ ] ***

**Fixes Applied:**

- [ ] ***
- [ ] ***

**Remaining Concerns:**

- [ ] ***
- [ ] ***

---

## 🎯 Ready for Pilot Launch?

You're ready when:

- ✅ All environment variables are set correctly
- ✅ RLS policies are enabled and tested
- ✅ API endpoints are secured
- ✅ Webhook signatures are validated
- ✅ Authentication/authorization works
- ✅ No security issues identified

**If all checks pass, you're ready for pilot launch! 🚀**

---

**Last Updated:** 2025-01-XX  
**Reviewer:** ****\*\*****\_\_\_****\*\*****  
**Date:** ****\*\*****\_\_\_****\*\*****  
**Status:** ✅ Complete
