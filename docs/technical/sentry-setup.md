# Sentry Error Tracking Setup

Complete guide for setting up Sentry error tracking and monitoring.

## Overview

Sentry is configured to automatically track:
- Client-side errors (React components, browser errors)
- Server-side errors (API routes, server components)
- Edge runtime errors (middleware, edge routes)
- Performance monitoring
- Session replay (for debugging user sessions)

---

## Setup Steps

### 1. Create Sentry Account

1. Go to [sentry.io](https://sentry.io)
2. Sign up for a free account (or log in)
3. Create a new project:
   - Select **Next.js** as the platform
   - Choose your organization (or create one)
   - Name your project (e.g., "e-commerce-platform")

### 2. Get Your DSN

1. In Sentry Dashboard → Settings → Projects → [Your Project]
2. Go to **Client Keys (DSN)**
3. Copy the **DSN** (looks like: `https://xxx@xxx.ingest.sentry.io/xxx`)

### 3. Get Organization and Project Slugs

1. **Organization Slug:**
   - Sentry Dashboard → Settings → Organization
   - Copy the **Organization Slug** (e.g., "my-org")

2. **Project Slug:**
   - Sentry Dashboard → Settings → Projects → [Your Project]
   - Copy the **Project Slug** (e.g., "e-commerce-platform")

### 4. Configure Environment Variables

Add to your `.env.local` (development) and Vercel (production):

```env
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=your-org-name
SENTRY_PROJECT=your-project-name
```

**Important:** 
- `NEXT_PUBLIC_SENTRY_DSN` must be public (starts with `NEXT_PUBLIC_`) because it's used in client-side code
- `SENTRY_ORG` and `SENTRY_PROJECT` are only used during build for source map uploads

### 5. Verify Installation

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Trigger a test error (optional):
   - Add a button that throws an error
   - Or check Sentry dashboard for any existing errors

3. Check Sentry Dashboard:
   - Go to Issues → You should see errors appear here
   - If you see errors, Sentry is working!

---

## Configuration Files

The Sentry setup includes these files:

- `sentry.client.config.ts` - Client-side error tracking
- `sentry.server.config.ts` - Server-side error tracking
- `sentry.edge.config.ts` - Edge runtime error tracking
- `src/instrumentation.ts` - Initializes Sentry based on runtime
- `next.config.ts` - Wraps Next.js config with Sentry (for source maps)

---

## Features Enabled

### Error Tracking
- ✅ Automatic error capture
- ✅ Source maps for better debugging
- ✅ Stack traces with file names and line numbers

### Performance Monitoring
- ✅ Transaction tracing (100% sample rate in development)
- ✅ Performance insights in Sentry dashboard

### Session Replay
- ✅ Replay on errors (100% sample rate)
- ✅ Session replay (10% sample rate)
- ✅ Masks all text and media for privacy

---

## Adjusting Sample Rates

For production, you may want to reduce sample rates to save on Sentry quota:

### Client Config (`sentry.client.config.ts`)

```typescript
tracesSampleRate: 0.1, // 10% of transactions
replaysOnErrorSampleRate: 1.0, // 100% of error sessions
replaysSessionSampleRate: 0.1, // 10% of all sessions
```

### Server Config (`sentry.server.config.ts`)

```typescript
tracesSampleRate: 0.1, // 10% of transactions
```

---

## Setting Up Alerts

### Email Alerts

1. Sentry Dashboard → Settings → Projects → [Your Project] → Alerts
2. Create a new alert rule:
   - **Trigger:** When an issue is created
   - **Action:** Send email notification
   - **Recipients:** Your email address

### Slack Alerts (Optional)

1. Sentry Dashboard → Settings → Integrations → Slack
2. Connect your Slack workspace
3. Configure alert rules to send to Slack channels

---

## Testing Error Tracking

### Test Client-Side Error

Create a test page or button:

```typescript
// In a component
const handleTestError = () => {
  throw new Error("Test error from client");
};
```

### Test Server-Side Error

Create a test API route:

```typescript
// app/api/test-error/route.ts
export async function GET() {
  throw new Error("Test error from server");
}
```

Visit the route or click the button, then check Sentry Dashboard → Issues.

---

## Source Maps

Source maps are automatically uploaded during build when:
- `SENTRY_ORG` and `SENTRY_PROJECT` are set
- `SENTRY_AUTH_TOKEN` is set (for CI/CD)

### For Local Development

Source maps are included automatically (no upload needed).

### For Production (Vercel)

1. Get your Sentry Auth Token:
   - Sentry Dashboard → Settings → Auth Tokens
   - Create new token with `project:releases` scope

2. Add to Vercel:
   - Vercel Dashboard → Settings → Environment Variables
   - Add `SENTRY_AUTH_TOKEN` (for Production, Preview, Development)

3. Source maps will upload automatically on each deployment.

---

## Filtering Errors

You can filter out known errors or noise in `sentry.client.config.ts`:

```typescript
Sentry.init({
  // ... other config
  beforeSend(event, hint) {
    // Filter out specific errors
    if (event.exception) {
      const error = hint.originalException;
      if (error?.message?.includes("ResizeObserver loop")) {
        return null; // Don't send this error
      }
    }
    return event;
  },
});
```

---

## Privacy Considerations

### Session Replay Settings

Current configuration masks:
- ✅ All text content (`maskAllText: true`)
- ✅ All media (`blockAllMedia: true`)

This ensures user privacy while still capturing useful debugging information.

### Data Scrubbing

Sentry automatically scrubs:
- Credit card numbers
- Social security numbers
- Passwords
- API keys (if detected)

You can add custom data scrubbing rules in Sentry Dashboard → Settings → Security & Privacy.

---

## Troubleshooting

### Errors Not Appearing in Sentry

1. **Check DSN:**
   - Verify `NEXT_PUBLIC_SENTRY_DSN` is set correctly
   - Check browser console for Sentry initialization errors

2. **Check Network:**
   - Ensure Sentry can reach `*.ingest.sentry.io`
   - Check for ad blockers blocking Sentry

3. **Check Build:**
   - Verify `SENTRY_ORG` and `SENTRY_PROJECT` are set
   - Check build logs for Sentry-related errors

### Source Maps Not Working

1. **Verify Auth Token:**
   - Check `SENTRY_AUTH_TOKEN` is set in Vercel
   - Verify token has `project:releases` scope

2. **Check Build Logs:**
   - Look for "Uploading source maps" messages
   - Check for any upload errors

3. **Verify Release:**
   - Sentry Dashboard → Releases
   - Check that releases are being created

---

## Best Practices

1. **Set Appropriate Sample Rates:**
   - Start with 100% in development
   - Reduce to 10-20% in production

2. **Set Up Alerts:**
   - Alert on new issues
   - Alert on high error rates
   - Alert on critical errors

3. **Review Regularly:**
   - Check Sentry dashboard weekly
   - Fix high-frequency errors first
   - Monitor error trends

4. **Use Releases:**
   - Tag releases with git commits
   - Track which version introduced errors
   - Set up release health monitoring

---

## Next Steps

After Sentry is set up:

1. ✅ Set up email/Slack alerts
2. ✅ Configure sample rates for production
3. ✅ Set up release tracking (optional)
4. ✅ Review and fix any existing errors
5. ✅ Monitor error rates during pilot

---

**Last Updated**: 2025-01-XX
