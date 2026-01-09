# Mobile Performance Fixes

**Issue:** Integrations page mobile performance score is 77/100  
**Main Problem:** LCP is 4.6s (target: < 2.5s)  
**Date:** 2025-01-XX  
**Priority:** Low (non-blocking for pilot launch)

**Note:** This is the ONLY page with performance issues. All other routes score 95-100 on both desktop and mobile.

---

## Problem Analysis

### Current Metrics (Mobile)

- **Performance Score:** 77/100
- **LCP:** 4.6s (84% slower than target)
- **TBT:** 320ms (60% slower than target)
- **Unused JavaScript:** 148 KiB
- **Long Tasks:** 3 found

### Root Causes

1. **Slow LCP (4.6s):**
   - Server-side data fetching (Supabase queries)
   - Multiple API calls on page load
   - Large JavaScript bundle execution
   - No loading states (blank screen until data loads)

2. **High TBT (320ms):**
   - JavaScript execution blocking main thread
   - Multiple components rendering synchronously
   - Heavy React Query setup

3. **Unused JavaScript (148 KiB):**
   - Not all code is being used
   - Could be code-split better

---

## Fixes (Priority Order)

### Priority 1: Optimize LCP (Target: < 2.5s)

#### Fix 1.1: Add Loading Skeletons

**Problem:** Blank screen while data loads makes LCP slow

**Solution:** Show skeleton loaders immediately

**Files to modify:**
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/orders/all-orders/page.tsx`
- `src/app/dashboard/inventory/all-items/page.tsx`

**Implementation:**
```tsx
// Add skeleton component
import { Skeleton } from "@/components/ui/skeleton";

// Show skeleton while loading
{isLoading ? (
  <Skeleton className="h-8 w-full" />
) : (
  <ActualContent />
)}
```

#### Fix 1.2: Optimize Data Fetching

**Problem:** Multiple sequential API calls slow down page

**Solution:** 
- Parallel data fetching where possible
- Use React Suspense for streaming
- Cache data appropriately

**Files to modify:**
- `src/app/dashboard/layout.tsx`
- Data fetching hooks

#### Fix 1.3: Reduce Initial Bundle Size

**Problem:** Large JavaScript bundle delays rendering

**Solution:**
- Code split dashboard components
- Lazy load heavy components
- Dynamic imports for non-critical features

---

### Priority 2: Reduce Total Blocking Time (Target: < 200ms)

#### Fix 2.1: Code Split Heavy Components

**Problem:** All components load at once

**Solution:** Use dynamic imports

**Example:**
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false // if client-only
});
```

#### Fix 2.2: Optimize React Query

**Problem:** React Query setup adds overhead

**Solution:**
- Already optimized (staleTime: 1min, retry: 1)
- Consider reducing initial queries
- Use prefetching strategically

---

### Priority 3: Reduce Unused JavaScript (148 KiB)

#### Fix 3.1: Analyze Bundle

**Problem:** Don't know what's unused

**Solution:** Run bundle analyzer

```bash
ANALYZE=true npm run build
```

This will show what's taking up space.

#### Fix 3.2: Remove Unused Dependencies

**Problem:** May have unused packages

**Solution:**
- Review `package.json`
- Remove unused imports
- Check for duplicate dependencies

#### Fix 3.3: Tree Shaking

**Problem:** Not all code is tree-shaken

**Solution:**
- Next.js does this automatically
- Ensure proper ES module imports
- Avoid default imports from large libraries

---

### Priority 4: Fix Back/Forward Cache

#### Fix 4.1: Review Page Lifecycle

**Problem:** 3 failure reasons preventing cache

**Solution:**
- Check for unload listeners
- Ensure proper cleanup
- Review React effects

**Common issues:**
- `beforeunload` listeners
- Unclosed WebSocket connections
- Timers not cleared

---

### Priority 5: Optimize Long Tasks

#### Fix 5.1: Break Up Heavy Computations

**Problem:** 3 long tasks blocking main thread

**Solution:**
- Identify long tasks (Chrome DevTools Performance tab)
- Break into smaller chunks
- Use `requestIdleCallback` or `setTimeout` for non-critical work

---

## Quick Wins (Easy Fixes First)

### 1. Add Loading Skeletons ⭐ (High Impact, Low Effort)

**Time:** 30 minutes  
**Impact:** Improves perceived performance, may help LCP

**Steps:**
1. Create skeleton components
2. Add to dashboard pages
3. Show while data loads

### 2. Lazy Load Non-Critical Components ⭐ (High Impact, Medium Effort)

**Time:** 1 hour  
**Impact:** Reduces initial bundle size

**Steps:**
1. Identify components not needed on first render
2. Use dynamic imports
3. Test functionality

### 3. Optimize Images (if any) ⭐ (Medium Impact, Low Effort)

**Time:** 15 minutes  
**Impact:** Reduces load time

**Steps:**
1. Ensure all images use Next.js Image component
2. Add proper width/height
3. Use appropriate formats (WebP)

---

## Testing After Fixes

1. **Rebuild:** `npm run build`
2. **Re-run Lighthouse:** Mobile audit
3. **Target Scores:**
   - Performance: 80+ (aim for 85+)
   - LCP: < 2.5s (aim for < 2.0s)
   - TBT: < 200ms (aim for < 150ms)

---

## Expected Improvements

### After Quick Wins

- **Performance Score:** 77 → 82-85
- **LCP:** 4.6s → 3.0-3.5s
- **TBT:** 320ms → 250-280ms

### After All Fixes

- **Performance Score:** 77 → 85-90
- **LCP:** 4.6s → 2.0-2.5s ✅
- **TBT:** 320ms → 150-200ms ✅

---

## Implementation Order

1. ✅ **Week 1:** Quick wins (skeletons, lazy loading)
2. ⏳ **Week 2:** Data fetching optimization
3. ⏳ **Week 3:** Bundle optimization
4. ⏳ **Week 4:** Advanced optimizations

---

## Notes

- Desktop performance is already good (no changes needed)
- Mobile is the focus
- Some fixes may require testing
- Monitor performance after each fix

---

**Last Updated:** 2025-01-XX
