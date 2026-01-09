# Performance Audit Guide

Complete guide for running performance audits and optimizing your application.

**Last Updated:** 2025-01-XX

---

## What is a Performance Audit?

A performance audit measures how fast and efficient your website is. It helps identify:
- Slow page load times
- Large resource sizes
- Unoptimized images
- Blocking JavaScript
- Render-blocking CSS
- Opportunities for improvement

---

## Tools for Performance Auditing

### 1. Lighthouse (Recommended)

**What it is:** Built-in Chrome DevTools tool that audits performance, accessibility, SEO, and best practices.

**How to use:**
1. Open your site in Chrome
2. Open DevTools (F12 or Cmd+Option+I)
3. Go to "Lighthouse" tab
4. Select "Performance" category
5. Choose "Desktop" or "Mobile"
6. Click "Analyze page load"

**What it measures:**
- Performance Score (0-100)
- Core Web Vitals (LCP, FID, CLS)
- Opportunities (specific improvements)
- Diagnostics (additional issues)

### 2. Core Web Vitals

**What they are:** Google's key metrics for user experience.

**Metrics:**
- **LCP (Largest Contentful Paint):** Time to load main content
  - Good: < 2.5 seconds
  - Needs improvement: 2.5-4 seconds
  - Poor: > 4 seconds

- **FID (First Input Delay):** Time until page is interactive
  - Good: < 100ms
  - Needs improvement: 100-300ms
  - Poor: > 300ms

- **CLS (Cumulative Layout Shift):** Visual stability
  - Good: < 0.1
  - Needs improvement: 0.1-0.25
  - Poor: > 0.25

### 3. Network Tab

**What it shows:**
- Resource load times
- File sizes
- Request waterfall
- Blocking resources

**How to use:**
1. Open DevTools → Network tab
2. Reload page
3. Check file sizes and load times
4. Look for large files (> 500KB)

### 4. Performance Tab

**What it shows:**
- Frame rate
- JavaScript execution time
- Layout shifts
- Long tasks

**How to use:**
1. Open DevTools → Performance tab
2. Click record
3. Interact with page
4. Stop recording
5. Analyze timeline

---

## Step-by-Step Audit Process

### Step 1: Run Lighthouse Audit

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Open your site:**
   - Go to `http://localhost:3000`
   - Or your production URL

3. **Open Lighthouse:**
   - Press F12 (or Cmd+Option+I on Mac)
   - Click "Lighthouse" tab
   - Select "Performance"
   - Choose "Desktop" or "Mobile"
   - Click "Analyze page load"

4. **Wait for results:**
   - Lighthouse will analyze your page
   - Takes 30-60 seconds
   - Results appear automatically

### Step 2: Review Performance Score

**Score Breakdown:**
- **90-100:** Excellent (Green)
- **50-89:** Needs improvement (Orange)
- **0-49:** Poor (Red)

**Target:** Aim for 90+ on desktop, 80+ on mobile

### Step 3: Check Core Web Vitals

Look for these in Lighthouse results:
- **LCP:** Should be < 2.5s
- **FID:** Should be < 100ms
- **CLS:** Should be < 0.1

### Step 4: Review Opportunities

Lighthouse provides specific suggestions:
- "Reduce unused JavaScript"
- "Eliminate render-blocking resources"
- "Optimize images"
- "Reduce initial server response time"
- etc.

### Step 5: Check Diagnostics

Additional issues to address:
- Large DOM size
- Avoid long main-thread tasks
- Minimize main-thread work
- etc.

---

## Common Performance Issues & Fixes

### 1. Large JavaScript Bundles

**Problem:** Too much JavaScript loaded upfront

**How to identify:**
- Network tab shows large `.js` files
- Lighthouse shows "Reduce unused JavaScript"

**Fixes:**
- Code splitting (Next.js does this automatically)
- Dynamic imports for heavy components
- Remove unused dependencies
- Tree shaking (automatic with Next.js)

### 2. Unoptimized Images

**Problem:** Large image files slow down page load

**How to identify:**
- Network tab shows large image files
- Lighthouse shows "Optimize images"

**Fixes:**
- Use Next.js `Image` component (automatic optimization)
- Compress images before upload
- Use WebP format
- Lazy load images below the fold

### 3. Render-Blocking Resources

**Problem:** CSS or JS blocking page render

**How to identify:**
- Lighthouse shows "Eliminate render-blocking resources"
- Network tab shows resources blocking render

**Fixes:**
- Defer non-critical CSS
- Use `async` or `defer` for scripts
- Inline critical CSS
- Next.js handles this automatically for most cases

### 4. Slow Server Response

**Problem:** Server takes too long to respond

**How to identify:**
- Lighthouse shows "Reduce initial server response time"
- Network tab shows long TTFB (Time to First Byte)

**Fixes:**
- Optimize database queries
- Use caching
- CDN (Vercel provides this)
- Server-side optimizations

### 5. Large DOM Size

**Problem:** Too many DOM elements

**How to identify:**
- Lighthouse shows "Avoid an excessive DOM size"
- Performance tab shows slow rendering

**Fixes:**
- Reduce nested elements
- Virtualize long lists
- Lazy load content
- Paginate large datasets

---

## Next.js Performance Optimizations

### Automatic Optimizations

Next.js provides many optimizations automatically:
- ✅ Code splitting
- ✅ Image optimization (with `next/image`)
- ✅ Font optimization
- ✅ Automatic static optimization
- ✅ Route prefetching

### Manual Optimizations

**1. Use Next.js Image Component:**
```tsx
import Image from 'next/image'

<Image src="/logo.png" alt="Logo" width={200} height={200} />
```

**2. Dynamic Imports for Heavy Components:**
```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // if client-only
})
```

**3. Optimize Fonts:**
```tsx
import { Geist } from 'next/font/google'

const geist = Geist({ subsets: ['latin'] })
```

**4. Use React.memo for Expensive Components:**
```tsx
export default React.memo(ExpensiveComponent)
```

---

## Performance Checklist

### Before Audit
- [ ] Dev server running
- [ ] Browser cache cleared
- [ ] Network throttling disabled (for baseline)
- [ ] Production build tested (not just dev mode)

### During Audit
- [ ] Run Lighthouse on homepage
- [ ] Run Lighthouse on key pages (dashboard, orders, etc.)
- [ ] Test both desktop and mobile
- [ ] Check Network tab for large files
- [ ] Review Performance tab for bottlenecks

### After Audit
- [ ] Document baseline scores
- [ ] Prioritize issues (high impact first)
- [ ] Fix identified issues
- [ ] Re-run audit to verify improvements
- [ ] Document improvements

---

## Performance Targets

### Desktop
- Performance Score: **90+**
- LCP: **< 2.5s**
- FID: **< 100ms**
- CLS: **< 0.1**

### Mobile
- Performance Score: **80+**
- LCP: **< 2.5s**
- FID: **< 100ms**
- CLS: **< 0.1**

---

## Monitoring Performance

### Vercel Analytics

Vercel automatically tracks:
- Core Web Vitals
- Real User Monitoring (RUM)
- Performance metrics

**View:** Vercel Dashboard → Analytics → Speed Insights

### Sentry Performance

Sentry tracks:
- Transaction performance
- Slow API calls
- Database query times

**View:** Sentry Dashboard → Performance

---

## Quick Wins (Easy Fixes)

1. **Optimize Images:**
   - Use Next.js Image component
   - Compress images
   - Use WebP format

2. **Remove Unused Code:**
   - Delete unused imports
   - Remove unused dependencies
   - Tree shaking (automatic)

3. **Lazy Load Components:**
   - Use dynamic imports
   - Load below-the-fold content lazily

4. **Minimize Bundle Size:**
   - Check bundle analyzer
   - Remove large dependencies if possible

5. **Cache Static Assets:**
   - Vercel handles this automatically
   - Set proper cache headers

---

## Tools & Resources

### Chrome DevTools
- Lighthouse
- Network tab
- Performance tab
- Coverage tab (for unused code)

### Online Tools
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Next.js Tools
- Bundle Analyzer: `ANALYZE=true npm run build`
- Build output shows bundle sizes

---

## Example Audit Workflow

1. **Baseline:**
   - Run Lighthouse on production
   - Document scores
   - Screenshot results

2. **Identify Issues:**
   - Review opportunities
   - Check diagnostics
   - Prioritize by impact

3. **Fix Issues:**
   - Start with high-impact, low-effort
   - Test each fix
   - Verify improvements

4. **Re-audit:**
   - Run Lighthouse again
   - Compare scores
   - Document improvements

5. **Monitor:**
   - Set up continuous monitoring
   - Track Core Web Vitals
   - Alert on regressions

---

## Next Steps

After running your first audit:
1. Document baseline scores
2. Fix top 3-5 issues
3. Re-run audit
4. Set up monitoring
5. Schedule regular audits (monthly)

---

**Last Updated:** 2025-01-XX
