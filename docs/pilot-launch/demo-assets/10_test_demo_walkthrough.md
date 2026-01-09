# Testing the Demo Walkthrough

**Purpose:** Verify the demo walkthrough works smoothly before presenting to pilot users  
**Time Estimate:** 30-45 minutes  
**When to Test:** After all demo assets are loaded

---

## 🎯 Testing Objectives

By the end of testing, you should verify:

- ✅ All demo data is visible and correct
- ✅ Navigation flows work smoothly
- ✅ Features mentioned in the script actually work
- ✅ Timing is appropriate (not too fast or slow)
- ✅ You're comfortable with the flow

---

## 📋 Pre-Testing Checklist

Before you start testing:

- [ ] All demo assets are loaded (10 inventory items, 5 orders, 4 receiving logs)
- [ ] You're logged into the demo account
- [ ] Browser is ready (Chrome/Firefox recommended)
- [ ] Demo walkthrough script is open (`09_demo_walkthrough_script.md`)
- [ ] You have a timer ready (to check duration)
- [ ] Browser console is open (to check for errors)

---

## 🧪 Testing Steps

### Step 1: Verify Demo Data (5 minutes)

**Goal:** Make sure all demo data is present and correct

#### Inventory Check

1. Navigate to: **Inventory → All Items**
2. Verify:

   - [ ] You see exactly 10 items (DEMO-001 through DEMO-010)
   - [ ] 5 items show green "In Stock" status
   - [ ] 5 items show red "Low Stock" status
   - [ ] Search bar works (try searching "DEMO-001")
   - [ ] Items have locations assigned (some may be NULL)

3. Navigate to: **Inventory → Low Stock**
4. Verify:
   - [ ] You see exactly 5 items (all with red status)
   - [ ] These are: DEMO-002, DEMO-007, DEMO-008, DEMO-009, DEMO-010

#### Orders Check

1. Navigate to: **Orders → All Orders**
2. Verify:

   - [ ] You see exactly 5 orders (DEMO-ORD-001 through DEMO-ORD-005)
   - [ ] Orders show different statuses (pending, processing, fulfilled, cancelled)
   - [ ] Search works (try searching "DEMO-ORD-001")
   - [ ] Status filter works

3. Click on: **DEMO-ORD-001** (Pending order)
4. Verify:

   - [ ] Order detail dialog opens
   - [ ] Customer email shows: `customer1@example.com`
   - [ ] Shipping address is complete
   - [ ] Order items show correctly (2 items: DEMO-001 and DEMO-002)
   - [ ] Total shows: $139.97
   - [ ] Status dropdown is visible and works

5. Navigate to: **Orders → Pending**
6. Verify:
   - [ ] You see 2 pending orders (DEMO-ORD-001 and DEMO-ORD-004)

#### Receiving Logs Check

1. Navigate to: **Receiving**
2. Verify:
   - [ ] Receiving form is visible
   - [ ] Receiving history table shows 4 entries
   - [ ] Entries show different conditions (good, damaged)
   - [ ] Supplier/client IDs display correctly
   - [ ] Notes are visible

---

### Step 2: Test Navigation Flow (10 minutes)

**Goal:** Follow the demo script and verify each step works

#### Follow the Script

1. Open `09_demo_walkthrough_script.md`
2. Go through each section in order:

   - [ ] Introduction
   - [ ] Dashboard Overview
   - [ ] Inventory Management
   - [ ] Orders Management
   - [ ] Receiving Workflow
   - [ ] Settings & Integrations
   - [ ] Support & Help

3. For each section:
   - [ ] Navigate to the correct page
   - [ ] Verify the data/features mentioned are visible
   - [ ] Test any interactions mentioned (clicking, searching, filtering)
   - [ ] Check browser console for errors (should be none)

#### Test Interactions

- [ ] Search for "DEMO-001" in inventory
- [ ] Filter orders by status (Pending, Fulfilled)
- [ ] Click on an order to view details
- [ ] Try updating an order status (in the detail dialog)
- [ ] View receiving history entries
- [ ] Navigate to Settings → Profile
- [ ] Navigate to Settings → Integrations
- [ ] Navigate to Settings → Billing
- [ ] Navigate to Support page

---

### Step 3: Test Edge Cases (5 minutes)

**Goal:** Make sure nothing breaks during the demo

#### Test These Scenarios:

1. **What if they ask about a specific order?**

   - [ ] Can you quickly find DEMO-ORD-003?
   - [ ] Can you show order details smoothly?

2. **What if they want to see how to add inventory?**

   - [ ] Navigate to Inventory → Add New
   - [ ] Form loads correctly
   - [ ] You can explain the fields

3. **What if they ask about low stock alerts?**

   - [ ] Navigate to Inventory → Low Stock
   - [ ] Explain how reorder thresholds work
   - [ ] Show how to update a threshold

4. **What if they want to see order creation?**

   - [ ] Navigate to Orders → Create Order
   - [ ] Form loads correctly
   - [ ] You can explain the process

5. **What if browser is slow?**
   - [ ] Test on slower connection (optional)
   - [ ] Verify pages still load reasonably fast

---

### Step 4: Practice the Script (15-20 minutes)

**Goal:** Get comfortable with the flow and timing

#### Option A: Self-Practice

1. Open the demo walkthrough script
2. Go through it out loud (as if presenting)
3. Time yourself (should be 15-20 minutes)
4. Note any parts that feel awkward or unclear
5. Practice smooth transitions between sections

#### Option B: Record Yourself

1. Use screen recording software (Loom, OBS, QuickTime)
2. Record yourself going through the demo
3. Watch the recording and note:
   - [ ] Are you speaking clearly?
   - [ ] Are transitions smooth?
   - [ ] Is the timing appropriate?
   - [ ] Are there any awkward pauses?

#### Option C: Practice with a Colleague

1. Ask a colleague to be your "pilot user"
2. Go through the demo with them
3. Ask for feedback:
   - [ ] Was anything confusing?
   - [ ] Did they understand the value proposition?
   - [ ] Were there questions you couldn't answer?
   - [ ] Was the pace appropriate?

---

### Step 5: Verify Key Features Work (5 minutes)

**Goal:** Ensure all features mentioned actually function

#### Test These Features:

- [ ] **Low Stock Alerts:** Verify red badges show correctly
- [ ] **Order Status Updates:** Try updating an order status
- [ ] **Search Functionality:** Test search in inventory and orders
- [ ] **Filtering:** Test status filters in orders
- [ ] **Receiving Form:** Verify form fields work
- [ ] **Inventory Updates:** Check that receiving logs updated inventory (for "good" items)

#### Check for Errors:

- [ ] Open browser console (F12)
- [ ] Navigate through all pages
- [ ] Verify no console errors appear
- [ ] Check network tab for failed requests

---

## ✅ Testing Checklist Summary

After completing all testing steps, verify:

**Data Verification:**

- [ ] All 10 inventory items are present
- [ ] All 5 orders are present
- [ ] All 4 receiving logs are present
- [ ] Data displays correctly (no formatting issues)

**Functionality:**

- [ ] All navigation links work
- [ ] Search works in inventory and orders
- [ ] Filters work correctly
- [ ] Order detail dialog opens and displays correctly
- [ ] Status updates work
- [ ] No console errors

**Presentation:**

- [ ] You can smoothly navigate through all sections
- [ ] You're comfortable explaining each feature
- [ ] Timing feels appropriate (15-20 minutes)
- [ ] You can answer common questions

**Readiness:**

- [ ] Demo walkthrough script is clear and helpful
- [ ] You know where everything is located
- [ ] You're confident in the flow
- [ ] You have answers ready for common questions

---

## 🚨 Common Issues & Fixes

### Issue: Demo data not showing

**Fix:**

- Verify you're logged in with the correct account
- Check that seed files were run successfully
- Verify user_id matches in all seed files

### Issue: Pages load slowly

**Fix:**

- Check browser console for errors
- Verify network connection
- Clear browser cache if needed

### Issue: Features don't work as expected

**Fix:**

- Check browser console for JavaScript errors
- Verify you're on the correct page
- Test in a different browser

### Issue: Can't find specific demo items

**Fix:**

- Use search functionality
- Check that seed files were run completely
- Verify SKU names match (DEMO-001, DEMO-ORD-001, etc.)

---

## 📝 Post-Testing Notes

After testing, document:

- **What worked well:**

  - [ ] ***
  - [ ] ***

- **What needs improvement:**

  - [ ] ***
  - [ ] ***

- **Questions that came up:**

  - [ ] ***
  - [ ] ***

- **Timing notes:**
  - Total demo time: **\_** minutes
  - Sections that took longer: **********\_\_\_**********
  - Sections that were quick: **********\_\_\_**********

---

## 🎯 Ready for Demo?

You're ready to demo when:

- ✅ All demo data is present and correct
- ✅ You can navigate smoothly through all sections
- ✅ You're comfortable explaining features
- ✅ No technical issues or errors
- ✅ You can answer common questions
- ✅ Timing is appropriate (15-20 minutes)

**If all checkboxes are checked, you're ready! 🚀**

---

**Last Updated:** 2025-01-XX  
**Version:** 1.0
