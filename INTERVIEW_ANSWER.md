# Next.js Infrastructure Walkthrough - Interview Answer

## Overview

This is an e-commerce enablement platform built with Next.js 15.3.2, using the App Router architecture. It handles inventory management, order processing, and Shopify integrations with Supabase as the backend.

## App Router vs Pages Router

We're using **App Router** exclusively. The entire application is structured around the `src/app` directory, which gives us several advantages:

- **Server Components by default**: Most of our pages are server components, which means they render on the server and only ship the necessary JavaScript to the client. For example, our dashboard layout (`src/app/dashboard/layout.tsx`) is a server component that fetches user authentication and profile data directly from Supabase before rendering.

- **Route groups and nested layouts**: We have a clean separation between public routes (marketing pages, auth) and protected routes (dashboard). The dashboard has its own layout that wraps all child routes, handling authentication checks and providing shared UI components like the sidebar.

- **API Routes**: All our API endpoints live in `src/app/api` - things like Shopify OAuth callbacks, AI integrations (OpenAI/Gemini), and data seeding. These are Route Handlers using the standard `GET`, `POST` functions.

- **File-based routing**: The structure is intuitive - `/dashboard/orders/all-orders/page.tsx` maps directly to the URL path. This makes it easy for the team to understand where code lives.

## Middleware Implementation

The middleware is probably one of the more interesting parts of this project. We have a custom middleware at the root (`middleware.ts`) that handles authentication and route protection.

**Key responsibilities:**

1. **Session management with Supabase**: The middleware uses `@supabase/ssr` to create a server client that syncs authentication cookies between the browser and server. This is crucial because Supabase uses httpOnly cookies for security, and we need to keep them in sync across requests.

2. **Route protection**: The middleware checks authentication status using `supabase.auth.getClaims()` and protects `/dashboard/*` routes. If an unauthenticated user tries to access the dashboard, they're redirected to `/auth/login`. Conversely, if an authenticated user tries to access login/signup pages, they're redirected to the dashboard.

3. **Smart matcher configuration**: We use a regex matcher that excludes static assets (`_next/static`, `_next/image`, images, videos) from middleware processing. This prevents unnecessary authentication checks on static resources and improves performance.

4. **Cookie handling complexity**: One thing that tripped us up initially was the cookie synchronization. The middleware has to carefully manage the `NextResponse` object to ensure cookies are properly set and forwarded. There are detailed comments in the code about this because it's easy to accidentally break session management if you create a new response object without copying cookies.

The middleware runs on every request (except static assets), so it's lightweight and fast. It's essentially our first line of defense for authentication.

## Caching Strategies

We use a multi-layered caching approach:

**1. Client-side caching with React Query (TanStack Query)**

- We wrap the dashboard in a `QueryProvider` that configures React Query with a 1-minute stale time for queries. This means data is considered fresh for 60 seconds, reducing unnecessary refetches.
- We disabled `refetchOnWindowFocus` because in a dashboard context, users might be switching tabs frequently, and we don't want to trigger refetches every time they come back.
- Query invalidation is handled strategically - when a mutation succeeds (like creating or updating an order), we invalidate the relevant query keys so the UI updates immediately.
- The query keys are structured hierarchically (e.g., `["orders", filters]`, `["order", id]`), which allows for granular cache invalidation.

**2. Server-side data fetching**

- Server components fetch data directly using Supabase server clients. For example, the dashboard layout fetches the user profile in a server component, which means that data is fetched once on the server and doesn't need to be sent to the client.
- All our data fetching functions are marked with `"use server"` and live in `src/lib/supabase/queries/`. These are server actions that can be called from both server and client components.

**3. No explicit Next.js caching (yet)**

- We haven't implemented Next.js's built-in caching features like `revalidate` or `fetchCache` options. This is something we could optimize in the future, especially for data that doesn't change frequently.
- API routes don't have explicit cache headers, so they're dynamic by default. This makes sense for most of our endpoints since they're user-specific and authentication-dependent.

**4. Static asset optimization**

- Next.js automatically handles caching for static assets through the `_next/static` directory. We're using Next.js Image optimization implicitly through the middleware matcher exclusions.

**Future caching improvements we're considering:**

- Adding `revalidate` to server components that fetch relatively static data (like product catalogs)
- Implementing ISR (Incremental Static Regeneration) for public-facing pages
- Adding cache headers to API routes that serve public data
- Using React Query's `persistQueryClient` for offline support in the dashboard

## Additional Infrastructure Notes

- **Supabase SSR setup**: We have separate client creation functions for server components (`createClient` in `server.ts`) and middleware (`createServerClient` in `middleware.ts`). This is necessary because they handle cookies differently - server components use Next.js's `cookies()` API, while middleware works directly with request/response objects.

- **Type safety**: Everything is TypeScript, and we have type definitions for all our data models (orders, inventory, Shopify stores, etc.). This catches errors at compile time.

- **Environment-based configuration**: The middleware uses environment variables to determine cookie security settings (`secure: process.env.NODE_ENV === "production"`), which is important for local development vs production.

The architecture is designed to be scalable - as we add more features, the App Router's file-based structure and server components make it easy to organize code, and the middleware provides a centralized place for cross-cutting concerns like authentication.
