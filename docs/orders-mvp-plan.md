# Orders MVP Implementation Plan

**Created:** Current Session  
**Status:** Planning Phase  
**Next Feature:** Orders Management System

---

## 🎯 Overview

Build a fully functional orders management system that allows users to:

- View all orders in a sortable, filterable, paginated table
- View detailed order information
- Create, update, and delete orders
- Manage order statuses

This will serve as the foundation for future Shopify integration (Phase 3).

---

## 📋 Step-by-Step Implementation Plan

### Step 1: Database Schema & Migrations

**Goal:** Create the `orders` and `inventory` tables with proper structure.

**Tasks:**

1. Create migration file: `docs/migrations/005_create_orders_table.sql`

   - Fields from technical plan (line 62):
     - `id` (UUID, primary key)
     - `user_id` (UUID, references auth.users)
     - `shop_id` (UUID, nullable - for future Shopify integration)
     - `order_number` (TEXT, unique per user)
     - `status` (TEXT - pending, processing, fulfilled, cancelled)
     - `customer_email` (TEXT)
     - `shipping_address` (JSONB)
     - `items` (JSONB)
     - `financial_status` (TEXT)
     - `total` (NUMERIC/DECIMAL for currency)
     - `tracking_number` (TEXT, nullable)
     - `created_at` (TIMESTAMP)
     - `updated_at` (TIMESTAMP)
   - Include indexes on `user_id`, `created_at`, `status`
   - Add `shop_id` as nullable (for future Shopify integration)

2. Create migration file: `docs/migrations/006_create_inventory_table.sql`

   - Fields from technical plan (line 63):
     - `id` (UUID, primary key)
     - `user_id` (UUID, references auth.users)
     - `sku` (TEXT)
     - `name` (TEXT)
     - `quantity` (INTEGER)
     - `location` (TEXT)
     - `reorder_threshold` (INTEGER)
     - `updated_at` (TIMESTAMP)
   - Index on `user_id` and `sku` (for lookups)

3. Apply migrations in Supabase SQL Editor

**Recommendations:**

- Use `jsonb` for `shipping_address` and `items` in orders (flexible schema)
- Add `status` enum or text with CHECK constraints
- Consider `total` as `numeric` or `decimal` for currency precision
- Add `updated_at` trigger to auto-update timestamp

---

### Step 2: RLS Policies

**Goal:** Ensure users can only access their own data.

**Tasks:**

1. Create policies for `orders` table:

   - SELECT: `user_id = auth.uid()`
   - INSERT: `user_id = auth.uid()`
   - UPDATE: `user_id = auth.uid()`
   - DELETE: `user_id = auth.uid()` (optional)

2. Create policies for `inventory` table:

   - Same pattern as orders

3. Test policies by querying as different users

**Recommendations:**

- Use Supabase SQL Editor to test policies
- Consider creating a helper function for policy creation
- Document policy rationale in migration comments

---

### Step 3: Install & Configure TanStack Query

**Goal:** Set up data fetching infrastructure.

**Tasks:**

1. Install dependencies:

   ```bash
   npm install @tanstack/react-query
   ```

2. Create query client provider:

   - Create `src/lib/providers/query-provider.tsx`
   - Wrap dashboard layout with QueryClientProvider

3. Configure default options:
   - Stale time, cache time, retry logic

**Recommendations:**

- Use React Query v5 (latest)
- Set up error boundaries for query errors
- Consider React Query DevTools for development (`@tanstack/react-query-devtools`)

---

### Step 4: TypeScript Types

**Goal:** Define type safety for orders and inventory.

**Tasks:**

1. Create `types/orders.ts`:

   - `Order` type matching schema
   - `OrderStatus` enum/union type
   - `OrderItem` type for items array
   - `ShippingAddress` type for address JSONB

2. Create `types/inventory.ts`:
   - `InventoryItem` type

**Recommendations:**

- Match database schema exactly
- Use Zod schemas for runtime validation if needed
- Export types for use across the app

---

### Step 5: Supabase Query Helpers

**Goal:** Create reusable functions for data fetching.

**Tasks:**

1. Create `src/lib/supabase/queries/orders.ts`:

   - `getOrders()` - fetch with filters
   - `getOrderById(id)` - single order
   - `createOrder(data)` - insert
   - `updateOrder(id, data)` - update
   - `deleteOrder(id)` - delete (optional)

2. Create `src/lib/supabase/queries/inventory.ts`:
   - Similar pattern for inventory

**Recommendations:**

- Use server-side Supabase client (`createServerClient`)
- Return typed data
- Handle errors consistently
- Consider pagination parameters

---

### Step 6: TanStack Query Hooks

**Goal:** Create React hooks for data fetching.

**Tasks:**

1. Create `src/hooks/use-orders.ts`:

   - `useOrders()` - list with filters
   - `useOrder(id)` - single order
   - `useCreateOrder()` - mutation
   - `useUpdateOrder()` - mutation
   - `useDeleteOrder()` - mutation

2. Implement optimistic updates for mutations

**Recommendations:**

- Use `useQuery` for reads, `useMutation` for writes
- Invalidate queries after mutations
- Add loading and error states
- Consider query keys structure: `['orders', filters]`, `['order', id]`

---

### Step 7: Orders Table Component

**Goal:** Build the main orders list UI.

**Tasks:**

1. Create `src/components/dashboard/orders-table.tsx`:

   - Use shadcn/ui Table component
   - Columns: Order #, Customer, Status, Total, Date, Actions

2. Add sorting:

   - Sort by date, total, status
   - Use URL params or local state

3. Add filtering:

   - Filter by status
   - Search by order number or customer email

4. Add pagination:
   - Use TanStack Query's pagination
   - Or implement server-side pagination

**Recommendations:**

- Use shadcn/ui components (Table, Select, Input)
- Keep filters in URL params for shareable links
- Show loading skeletons during fetch
- Add empty state when no orders

---

### Step 8: Order Detail View

**Goal:** Display full order information.

**Tasks:**

1. Create order detail modal/page:

   - Show all order fields
   - Display items list
   - Show shipping address
   - Edit status

2. Add edit functionality:
   - Update order status
   - Edit other fields if needed

**Recommendations:**

- Use shadcn/ui Dialog for modal
- Or create `/dashboard/orders/[id]` route
- Show formatted dates and currency
- Use React Hook Form for edit forms

---

### Step 9: Integration & Polish

**Goal:** Connect everything and add final touches.

**Tasks:**

1. Update `all-orders/page.tsx`:

   - Use OrdersTable component
   - Add page header with actions

2. Add toast notifications:

   - Success/error messages for mutations
   - Use sonner (already installed)

3. Add empty states:

   - No orders message
   - Loading states

4. Test CRUD operations:
   - Create, read, update, delete
   - Verify RLS policies work

**Recommendations:**

- Test with multiple users to verify RLS
- Add error boundaries
- Consider accessibility (keyboard navigation, ARIA labels)

---

## 🏗️ Architecture Decisions to Consider

### 1. Data Fetching Strategy

- **Server-side vs Client-side:** Start with client-side (TanStack Query), move to server components later if needed
- **Pagination:** Server-side pagination is more scalable for large datasets

### 2. State Management

- **Server State:** Use TanStack Query for server state
- **UI State:** Use React state for UI state (filters, modals)

### 3. Form Handling

- **Forms:** Use React Hook Form (already installed) for create/edit forms
- **Validation:** Use Zod (already installed) for schema validation

### 4. Error Handling

- **Consistency:** Consistent error messages across the app
- **User Experience:** User-friendly error states

---

## ❓ Questions to Guide Your Implementation

1. **Which step do you want to start with?**

   - Recommended: Start with Step 1 (Database Schema)

2. **Server vs Client Components?**

   - Start with client components for flexibility, optimize later

3. **Order Statuses?**

   - Suggested: `pending`, `processing`, `fulfilled`, `cancelled`
   - Can be extended later

4. **Pagination Strategy?**
   - Start with client-side for MVP, move to server-side if needed

---

## 🎓 How I Can Help

As your mentor/guide, I can assist with:

- ✅ **Reviewing your migration SQL** - Check syntax, indexes, constraints
- ✅ **Setting up TanStack Query** - Configuration and provider setup
- ✅ **Designing table component structure** - Component architecture
- ✅ **Creating query hooks pattern** - Best practices for React Query
- ✅ **Debugging RLS policies** - Testing and fixing policy issues
- ✅ **Code reviews** - Review your implementation and suggest improvements
- ✅ **Answering questions** - Clarify any step or concept

---

## 📝 Implementation Notes

- Follow the collaborative approach: You implement, I guide
- Test each step before moving to the next
- Keep migration files in `docs/migrations/`
- Document any deviations from the plan
- Update `progress-summary.md` as you complete steps

---

## 🔗 Related Files

- `docs/technical-plan.md` - Full technical plan (see line 62-63 for schema)
- `docs/progress-summary.md` - Current project status
- `docs/migrations/` - Database migration files
- `src/app/dashboard/orders/all-orders/page.tsx` - Target page to build

---

**Ready to start building! Begin with Step 1 when you're ready.** 🚀
