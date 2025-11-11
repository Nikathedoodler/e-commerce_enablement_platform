# E-Commerce Enablement Platform Technical Plan

## 1. Context & Objectives

- Anchor the build to the business plan for D2C brands seeking cost-advantaged fulfillment leveraging the Kutaisi FIZ hub.
- Deliver a production-ready MVP in 90 days with 14–21 hours/week, focusing on landing page, lead capture, client dashboard, Shopify automation, warehouse tooling, and billing.
- Support future expansion (additional storefronts, advanced analytics, logistics partners) through modular architecture and infrastructure decisions made in this phase.

## 2. Guiding Principles

- **Incremental delivery:** Ship weekly milestones to keep momentum and unlock validation with pilot brands.
- **Security & compliance:** Enforce Supabase RLS, secure credential storage, and auditable integrations from the outset to satisfy enterprise prospects.
- **Multi-tenant readiness:** Isolate client data per workspace to handle agency and brand accounts.
- **DX & Maintainability:** Automated linting, formatting, testing, and CI to keep the solo dev workflow efficient.
- **Observability-first:** Instrument logging, analytics, and error reporting early to monitor pilot usage and iterate quickly.

## 3. Architecture Overview

### 3.1 Frontend Layer

- **Framework:** Next.js 14 App Router, React 18, TailwindCSS, shadcn/ui for consistent design system, TanStack Query for data orchestration.
- **Surface Areas:**
  - Marketing site (`/`) with landing sections, pricing, FAQ, lead capture.
  - Auth pages (`/login`, `/signup`, password reset).
  - Authenticated dashboard (`/dashboard/*`) with responsive sidebar, orders, inventory, receiving, settings.
  - Mobile-friendly receiving workflow with barcode scanning (PWA capabilities targeted mid-term).
- **State Management:** Rely on TanStack Query and component-level state; avoid global stores until necessary.
- **Animations:** Framer Motion for hero, navigation, and scroll animations.

### 3.2 Backend & API Layer

- **Primary Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions) as the system of record.
- **Edge Functions / Next.js Route Handlers:**
  - `/api/shopify/auth` for OAuth handshake.
  - `/api/webhooks/shopify/orders` for order ingestion.
  - `/api/shipping/dhl/*` for rate + label acquisition.
  - `/api/stripe/*` for checkout, billing, and webhook handling.
- **Server Utilities:** Encapsulate Supabase client helpers, Shopify Admin REST/GraphQL interactions, DHL SOAP/REST wrappers, and Stripe SDK calls in dedicated `src/lib/` modules.

### 3.3 Integration Layer

- **Shopify:** OAuth flow, orders webhook, product sync (future), and status updates. Store tokens hashed/encrypted in Supabase `shopify_stores`.
- **Shipping (DHL priority):** Rate calculation and label generation endpoints; abstract the carrier to enable future FedEx/Georgian Post integrations.
- **Stripe Billing:** Subscription plans aligned with pricing strategy; usage-based billing extension later.
- **Email / Notifications:** Resend/SendGrid for transactional emails (order ingestion, receiving confirmations).

### 3.4 Infrastructure & Operations

- **Hosting:** Vercel for frontend & serverless API routes.
- **Database:** Supabase managed PostgreSQL with row-level security and policies.
- **Storage:** Supabase buckets for invoices, labels, supporting documents.
- **Secrets Management:** `.env.local` for dev, Vercel environment variables for preview/prod. Rotate API keys quarterly.
- **Analytics & Monitoring:** Google Analytics 4, Vercel Analytics, Sentry (error tracking), Logflare (optional) for server logs.

## 4. Data Architecture

| Table             | Purpose                          | Key Fields                                                                                                                                                                                      |
| ----------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `profiles`        | Extended user metadata           | `id (uuid)`, `role`, `company_name`, `timezone`, `created_at`                                                                                                                                   |
| `leads`           | Marketing site submissions       | `id`, `email`, `source`, `utm_medium`, `created_at`                                                                                                                                             |
| `shopify_stores`  | Connected storefront credentials | `id`, `user_id`, `shop_domain`, `access_token (encrypted)`, `scopes`, `connected_at`, `status`                                                                                                  |
| `orders`          | Multi-tenant order records       | `id`, `user_id`, `shop_id`, `order_number`, `status`, `customer_email`, `shipping_address (jsonb)`, `items (jsonb)`, `financial_status`, `total`, `tracking_number`, `created_at`, `updated_at` |
| `inventory`       | SKU tracking                     | `id`, `user_id`, `sku`, `name`, `quantity`, `location`, `reorder_threshold`, `updated_at`                                                                                                       |
| `receiving_log`   | Warehouse intake                 | `id`, `user_id`, `client_id`, `sku`, `quantity`, `condition`, `location`, `received_at`, `notes`                                                                                                |
| `subscriptions`   | Stripe linkage                   | `id`, `user_id`, `stripe_customer_id`, `stripe_subscription_id`, `plan_tier`, `status`, `current_period_end`                                                                                    |
| `shipping_labels` | Carrier artifacts                | `id`, `order_id`, `carrier`, `label_url`, `tracking_number`, `cost`, `generated_at`                                                                                                             |

> Enforce RLS so each `user_id` sees only their data. Consider `organizations` / `workspaces` in the next iteration for shared access.

## 5. Security & Compliance

- Enable Supabase RLS on all tables with `user_id = auth.uid()` checks; add service-role bypass for server-to-server tasks.
- Store OAuth tokens encrypted (pgcrypto) or via Supabase Secrets Manager; never expose in client-side code.
- Protect Next.js routes with middleware verifying Supabase session; revalidate server components on auth changes.
- Implement webhook signature verification (Shopify HMAC, Stripe signing secret).
- Log access events and maintain audit columns (`created_by`, `updated_by`) where relevant.
- Adhere to GDPR best practices given EU-focused clientele: provide data deletion path, anonymize PII in logs, update privacy notice on marketing site.

## 6. Tooling & Workflow

- **Version Control:** GitHub repository, conventional commits, feature branches per phase.
- **Automation:** Prettier, ESLint, TypeScript strict mode, husky + lint-staged for pre-commit checks.
- **CI/CD:** Vercel preview deployments on PRs; integrate Supabase migrations via `supabase db diff` scripts.
- **Project Management:** Track weekly goals in Notion/Jira board tied to the 90-day plan; capture decisions in `/docs`.
- **Documentation:** Maintain living docs in `docs/` (technical plan, SOPs, API references) synced with Notion/Confluence for stakeholders.

## 7. Phase Roadmap & Technical Milestones

### Phase 1 (Weeks 1–2): Foundation & Landing Page

- **Infrastructure:** Vercel deployment, Supabase project, environment configuration.
- **Marketing Site:** Navigation, hero, trust indicators, pricing sections, FAQ, smooth scroll animations, responsive Tailwind layout.
- **Lead Capture:** React Hook Form + Zod validation, Supabase `leads` insert, success/error toast, GA4 events, CTA tracking.
- **Performance:** Lighthouse/PageSpeed >90, SEO metadata, Open Graph, responsive testing.

### Phase 2 (Weeks 3–5): Authentication & Dashboard MVP

- **Auth:** Supabase email/password, profiles table, RLS policies, helper utilities, password reset, onboarding flow.
- **Routing:** Protected layouts, middleware guarding `/dashboard/*`, fallback loader states.
- **Dashboard Shell:** Sidebar navigation, top bar, responsive layout, placeholder widgets, consistent theming with shadcn/ui.
- **Orders MVP:** Supabase schema for orders & inventory, TanStack Query data fetching, table with sorting/filtering/pagination, order detail modal, CRUD mutations with optimistic updates and toast notifications.

### Phase 3 (Weeks 6–7): Shopify Integration & Webhooks

- **OAuth Flow:** `/api/shopify/auth` route handlers, state nonce management, Supabase storage of tokens, dashboard settings UI to connect/disconnect stores.
- **Webhook Listener:** `/api/webhooks/shopify/orders` verifying HMAC, storing orders, creating/updating inventory, triggering realtime updates (Supabase Realtime channel).
- **Notifications:** Email via Resend/SendGrid when new orders arrive; optional dashboard toast.

### Phase 4 (Weeks 8–9): Inventory & Receiving

- **Inventory UI:** Search, filters, low-stock highlights, bulk export, CSV import pipeline, CRUD forms with validation.
- **Receiving Module:** `/dashboard/receiving` form capturing intake, updating `inventory`, maintaining `receiving_log` with history view; experiment with QuaggaJS for barcode scanning on mobile.
- **PWA Considerations:** Audit for offline caches and mobile UX improvements (defer full PWA packaging post-MVP).

### Phase 5 (Weeks 10–11): Shipping & Billing

- **Shipping Integration:** DHL sandbox config, rate and label endpoints, storing artifacts, exposing “Generate Label” CTA in order detail along with print/download functionality.
- **Stripe Billing:** Checkout flow aligned with pricing tiers, webhooks updating `subscriptions`, billing portal link, error handling for payment failures, metrics on MRR/ARR tracked via Stripe dashboard.

### Phase 6 (Weeks 12): Testing, Documentation, Pilot Launch

- **Testing:** End-to-end journey validation, cross-browser/device coverage, performance tuning (code splitting, caching).
- **Documentation:** User guides for clients, internal SOPs for warehouse staff, API/webhook references, onboarding templates.
- **Pilot Enablement:** Support email setup, help center, demo assets, pilot feedback loop, observability (Sentry dashboards, GA funnels).
- **Handover:** Prepare backlog for post-pilot iterations (analytics dashboards, additional carriers, AI automation enhancements).

## 8. Testing & Quality Strategy

- **Unit Tests:** Focus on data helpers, Supabase RLS policies, integration wrappers (Shopify, Stripe, DHL) using Jest/Vitest + MSW.
- **Integration Tests:** Next.js route handlers, Supabase interactions with local stack, and supabase-js client in Node environment.
- **E2E Tests:** Playwright for auth, dashboard navigation, order listing, form submissions, Shopify webhook simulation.
- **Manual QA:** Weekly smoke testing checklist covering landing page, auth, key dashboard features on desktop + mobile.
- **Performance Monitoring:** Lighthouse CI or automated PageSpeed checks; track Core Web Vitals via Vercel Analytics.

## 9. Monitoring & Analytics

- **Metrics:** Lead conversions, MAU, orders synced, inventory updates, label generation success rate, subscription activations, churn.
- **Alerting:** Sentry alerts for 5xx errors, Supabase edge function failures, webhook delivery retries.
- **Dashboards:** GA4 funnels for marketing, Supabase SQL reports for product usage, Stripe dashboards for revenue, Shopify Partner metrics for storefront connections.

## 10. Risk Register & Mitigation

- **Integration Fragility:** Shopify/DHL API changes → Monitor changelogs, encapsulate API clients, maintain regression tests.
- **Single Point of Failure (Solo Dev):** Weekly knowledge capture in docs, automate deployments, schedule buffer weeks for refactoring.
- **Data Privacy:** Strict RLS testing, encryption at rest, documented data retention policy, configurable data deletion requests.
- **Performance Bottlenecks:** Use TanStack Query caching, pagination, index critical columns (`orders.created_at`, `inventory.sku`).
- **Timeline Creep:** Time-box each weekly deliverable, defer stretch goals (e.g., advanced analytics, AI automation) if core flows slip.

## 11. Post-MVP Considerations

- Expand storefront integrations (WooCommerce, BigCommerce).
- AI enhancements: GPT-powered ticket replies, predictive inventory, automated description generation (aligned with business plan).
- Advanced analytics: cohort reports, fulfillment SLAs, logistics cost optimization.
- Warehouse automation: IoT scanners, real-time location tracking, RFID support.
- Compliance scaling: SOC 2 readiness, ISO 27001 alignment, data residency controls.

## 12. Documentation & Knowledge Base

- Maintain `/docs` directory with:
  - Technical plan (this document), Supabase schema migrations, API references.
  - Operational SOPs for receiving, order exception handling, carrier escalation.
  - Client-facing guides (onboarding, Shopify connection, dashboard usage).
- Mirror critical docs into Notion/Confluence for stakeholder visibility.
- Schedule monthly documentation review to keep instructions synced with implementation.

## 13. Implementation Checklist (Per Phase)

- ✅ Infrastructure deployed (Vercel, Supabase, GA, Sentry).
- ✅ Supabase RLS policies verified via automated tests.
- ✅ Shopify sandbox store configured; OAuth + orders ingest tested.
- ✅ Stripe webhooks captured and subscription state updated.
- ✅ DHL sandbox credentials validated with sample labels.
- ✅ E2E tests pass on CI prior to each milestone release.
- ✅ Documentation updated and shared with stakeholders.

---

**Prepared for future reference when executing the 90-day implementation roadmap.**
