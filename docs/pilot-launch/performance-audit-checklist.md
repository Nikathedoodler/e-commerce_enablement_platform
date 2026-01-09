# Performance Audit Checklist

**Purpose:** Run a comprehensive performance audit before pilot launch  
**Time Estimate:** 1-2 hours  
**Status**: ⏳ Not Started

---

## Pre-Audit Setup

### 1. Build Production Version

**Why:** Dev mode is slower. We need to test production build.

```bash
# Build the production version
npm run build

# Start production server
npm start
```

**Note:** For local testing, use `npm start` (production mode). For actual deployment testing, use your Vercel preview/production URL.

### 2. Clear Browser Cache

**Why:** Cached files can give false results.

- Open Chrome DevTools (F12)
- Right-click refresh button → "Empty Cache and Hard Reload"
- Or: DevTools → Application → Clear storage

### 3. Disable Extensions

**Why:** Browser extensions can affect performance.

- Use Incognito/Private mode (extensions disabled by default)
- Or disable extensions manually

---

## Step 1: Run Lighthouse Audit

### Desktop Audit

1. **Open your site:**
   - Local: `http://localhost:3000`
   - Production: Your Vercel URL

2. **Open Lighthouse:**
   - Press `F12` (or `Cmd+Option+I` on Mac)
   - Click **"Lighthouse"** tab
   - Select **"Performance"** category
   - Choose **"Desktop"**
   - Click **"Analyze page load"**

3. **Wait for results** (30-60 seconds)

4. **Document scores:**
   - [ ] Performance Score: _____ / 100
   - [ ] LCP (Largest Contentful Paint): _____ seconds
   - [ ] FID (First Input Delay): _____ ms
   - [ ] CLS (Cumulative Layout Shift): _____
   - [ ] TTI (Time to Interactive): _____ seconds
   - [ ] TBT (Total Blocking Time): _____ ms

### Mobile Audit

1. **Repeat steps above** but choose **"Mobile"**

2. **Document scores:**
   - [ ] Performance Score: _____ / 100
   - [ ] LCP: _____ seconds
   - [ ] FID: _____ ms
   - [ ] CLS: _____

### Target Scores

**Desktop:**
- Performance: **90+** (Green)
- LCP: **< 2.5s**
- FID: **< 100ms**
- CLS: **< 0.1**

**Mobile:**
- Performance: **80+** (Green)
- LCP: **< 2.5s**
- FID: **< 100ms**
- CLS: **< 0.1**

---

## Step 2: Review Opportunities

Lighthouse provides specific suggestions. Document the top issues:

### High Priority Issues

- [ ] Issue 1: _______________________
  - Impact: _____
  - Estimated savings: _____ seconds
  
- [ ] Issue 2: _______________________
  - Impact: _____
  - Estimated savings: _____ seconds

- [ ] Issue 3: _______________________
  - Impact: _____
  - Estimated savings: _____ seconds

### Common Issues to Look For

- [ ] "Reduce unused JavaScript"
- [ ] "Eliminate render-blocking resources"
- [ ] "Optimize images"
- [ ] "Reduce initial server response time"
- [ ] "Minimize main-thread work"
- [ ] "Reduce JavaScript execution time"

---

## Step 3: Check Network Tab

### Analyze Resource Loading

1. **Open Network Tab:**
   - DevTools → Network tab
   - Reload page
   - Check "Disable cache" (if not already)

2. **Document findings:**
   - [ ] Largest JavaScript file: _____ KB
   - [ ] Largest CSS file: _____ KB
   - [ ] Largest image: _____ KB
   - [ ] Total page size: _____ KB
   - [ ] Number of requests: _____

3. **Look for issues:**
   - [ ] Files > 500KB (should be optimized)
   - [ ] Too many requests (> 50)
   - [ ] Blocking resources
   - [ ] Unused resources

---

## Step 4: Check Core Web Vitals

### Real User Metrics (if available)

**From Vercel Analytics:**
- [ ] LCP: _____ seconds
- [ ] FID: _____ ms
- [ ] CLS: _____

**From Lighthouse:**
- [ ] LCP: _____ seconds
- [ ] FID: _____ ms
- [ ] CLS: _____

**Target:** All metrics in "Good" range

---

## Step 5: Test Key Pages

Run Lighthouse on these pages:

### Homepage
- [ ] Performance Score: _____
- [ ] LCP: _____
- [ ] Issues found: _____

### Dashboard
- [ ] Performance Score: _____
- [ ] LCP: _____
- [ ] Issues found: _____

### Orders Page
- [ ] Performance Score: _____
- [ ] LCP: _____
- [ ] Issues found: _____

### Inventory Page
- [ ] Performance Score: _____
- [ ] LCP: _____
- [ ] Issues found: _____

---

## Step 6: Identify Fixes

### Quick Wins (High Impact, Low Effort)

- [ ] Fix 1: _______________________
- [ ] Fix 2: _______________________
- [ ] Fix 3: _______________________

### Medium Priority

- [ ] Fix 1: _______________________
- [ ] Fix 2: _______________________

### Low Priority (Can Do Later)

- [ ] Fix 1: _______________________
- [ ] Fix 2: _______________________

---

## Step 7: Apply Fixes

### After Each Fix

1. [ ] Rebuild: `npm run build`
2. [ ] Re-run Lighthouse
3. [ ] Document improvement
4. [ ] Verify fix didn't break anything

### Fix Log

**Fix 1:**
- What: _______________________
- Before: _____
- After: _____
- Improvement: _____ seconds

**Fix 2:**
- What: _______________________
- Before: _____
- After: _____
- Improvement: _____ seconds

---

## Step 8: Final Audit

### After All Fixes

- [ ] Run final Lighthouse audit
- [ ] Document final scores
- [ ] Compare to baseline
- [ ] Verify all targets met

### Final Scores

**Desktop:**
- Performance: _____ / 100
- LCP: _____ seconds
- FID: _____ ms
- CLS: _____

**Mobile:**
- Performance: _____ / 100
- LCP: _____ seconds
- FID: _____ ms
- CLS: _____

---

## Performance Baseline

### Initial Scores (Before Fixes)

**Desktop:**
- Performance: _____ / 100
- LCP: _____ seconds
- FID: _____ ms
- CLS: _____

**Mobile:**
- Performance: _____ / 100
- LCP: _____ seconds
- FID: _____ ms
- CLS: _____

**Date:** _____

---

## Notes

**Issues Found:**
- _______________________
- _______________________

**Decisions Made:**
- _______________________
- _______________________

**Future Improvements:**
- _______________________
- _______________________

---

## Completion

- [ ] All audits completed
- [ ] Issues documented
- [ ] Fixes applied
- [ ] Final scores meet targets
- [ ] Performance baseline documented

**Completed By:** _______________________  
**Date:** _______________________  
**Status**: ⏳ Not Started | 🔄 In Progress | ✅ Complete

---

**Next Step:** If performance is acceptable, proceed to next pilot preparation task. If not, continue optimizing.
