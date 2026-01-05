# Critical Testing Checklist

**Purpose**: Quick smoke testing of critical flows before pilot launch  
**Time Estimate**: 2-3 hours  
**Status**: ⏳ Not Started

---

## Pre-Testing Setup

- [ ] Create a test account (separate from your main account)
- [ ] Have test data ready (sample products, orders)
- [ ] Test in incognito/private browser window
- [ ] Clear browser cache if needed

---

## Authentication & Access

### Sign Up Flow

- [ ] Can create new account
- [ ] Email confirmation link works
- [ ] Can log in after confirmation
- [ ] Profile is created automatically
- [ ] Company name displays correctly

### Login Flow

- [ ] Can log in with email/password
- [ ] Invalid credentials show error
- [ ] "Forgot Password" link works
- [ ] Password reset email arrives
- [ ] Can reset password successfully

### Access Control

- [ ] Cannot access dashboard without login
- [ ] Redirects to login when not authenticated
- [ ] Logout works correctly
- [ ] Cannot access other users' data

---

## Orders Management

### Create Order (Manual)

- [ ] Can navigate to "Create Order" page
- [ ] Form validation works (required fields)
- [ ] Can add multiple order items
- [ ] Can remove order items
- [ ] Order total calculates correctly
- [ ] Can create order successfully
- [ ] Order appears in "All Orders" list
- [ ] Order number is auto-generated if not provided

### View Orders

- [ ] "All Orders" page loads
- [ ] Orders are displayed correctly
- [ ] Can search orders by order number
- [ ] Can search orders by customer email
- [ ] Can filter by status (pending, processing, fulfilled, cancelled)
- [ ] "Pending" page shows only pending orders
- [ ] "Fulfilled" page shows only fulfilled orders

### Order Details

- [ ] Can open order detail dialog
- [ ] All order information displays correctly
- [ ] Customer information shows
- [ ] Order items table displays correctly
- [ ] Shipping address displays correctly
- [ ] Order totals are correct
- [ ] Can update order status
- [ ] Status update saves successfully

### Delete Order

- [ ] Can delete an order
- [ ] Confirmation dialog appears
- [ ] Order is removed after deletion
- [ ] Order disappears from list

---

## Shopify Integration

### Connect Store

- [ ] Can navigate to Integrations page
- [ ] "Connect Store" button works
- [ ] Can enter Shopify store domain
- [ ] OAuth flow redirects to Shopify
- [ ] Can authorize connection
- [ ] Store appears in connected stores list
- [ ] Connection status shows correctly

### Order Sync (if Shopify connected)

- [ ] Create test order in Shopify
- [ ] Order appears in dashboard (within 1-2 minutes)
- [ ] Order information is correct
- [ ] Shipping address is correct
- [ ] Order items are correct
- [ ] Order total matches Shopify

---

## Inventory Management

### Add Inventory

- [ ] Can navigate to "Add New" page
- [ ] Form validation works
- [ ] Can create inventory item
- [ ] Item appears in "All Items" list
- [ ] SKU is saved correctly
- [ ] Quantity is saved correctly

### View Inventory

- [ ] "All Items" page loads
- [ ] Can search by SKU
- [ ] Can search by product name
- [ ] "Low Stock" filter works
- [ ] Low stock items show correct badge

### Edit Inventory

- [ ] Can open inventory item dialog
- [ ] Can edit all fields inline
- [ ] Changes save successfully
- [ ] Quantity updates correctly
- [ ] Low stock badge updates when threshold crossed

### Delete Inventory

- [ ] Can delete inventory item
- [ ] Confirmation dialog appears
- [ ] Item is removed after deletion

---

## Receiving Module

### Log Receiving

- [ ] Can navigate to Receiving page
- [ ] Form validation works
- [ ] Can log receiving entry
- [ ] Entry appears in history table
- [ ] Inventory quantity updates automatically (for "good" condition)
- [ ] New SKU is created if doesn't exist

### Receiving History

- [ ] History table displays entries
- [ ] Can search by SKU
- [ ] Can search by notes
- [ ] Can filter by condition
- [ ] Dates display correctly

---

## Shipping Labels

### Generate Label

- [ ] Can open order detail dialog
- [ ] "Generate Label" button is visible
- [ ] Can open label generation dialog
- [ ] Form validation works (weight required)
- [ ] Can select service type
- [ ] Can enter package weight
- [ ] Can enter package dimensions (optional)
- [ ] Can generate label successfully
- [ ] Label appears in order detail
- [ ] Tracking number is displayed
- [ ] Cost is displayed
- [ ] Can download label PDF (if URL provided)

### Multiple Labels

- [ ] Can generate second label for same order
- [ ] Both labels appear in list
- [ ] Label count shows correctly "(2)"

---

## Billing & Subscriptions

### View Billing

- [ ] Can navigate to Billing page
- [ ] Current subscription displays (if subscribed)
- [ ] Plan details show correctly
- [ ] Billing period dates display
- [ ] Usage limits show (if applicable)
- [ ] Plan comparison table works

### Checkout Flow (if testing)

- [ ] Can click "Subscribe" or "Upgrade"
- [ ] Redirects to Stripe Checkout
- [ ] Can complete checkout (test mode)
- [ ] Returns to billing page
- [ ] Subscription status updates

### Customer Portal

- [ ] "Manage Billing" button works
- [ ] Redirects to Stripe Customer Portal
- [ ] Can manage payment methods
- [ ] Can view invoices

---

## Error Handling

### Network Errors

- [ ] Handles network disconnection gracefully
- [ ] Shows appropriate error messages
- [ ] Doesn't crash the app

### Validation Errors

- [ ] Form validation shows clear errors
- [ ] Required fields are marked
- [ ] Invalid data shows helpful messages

### Not Found

- [ ] Accessing non-existent order shows error
- [ ] Invalid IDs handled gracefully

---

## Cross-Browser Testing (Quick)

- [ ] Test in Chrome (primary)
- [ ] Test in Safari (if on Mac)
- [ ] Test in Firefox (optional)
- [ ] Mobile responsive (check on phone)

---

## Performance (Quick Check)

- [ ] Pages load within 2-3 seconds
- [ ] No obvious lag when clicking buttons
- [ ] Forms submit without long delays
- [ ] Tables render without freezing

---

## Notes Section

**Issues Found:**

- [ ] Issue 1: Company name displayed incorrectly. Still renders “My company” at the top and “company“ under it
  - steps: 1. Open sign up page, fill company name in registration form. Create account and open dashboard.
  - screens: company_name.png
- [ ] Issue 2: Password resent did send email but on the first try it took 5 minutes. On second try received immediately.
  - Workaround: Maybe show notification for user to wait 10 minutes to receive email?
- [ ] Issue 3: 3. Clicking link on confimation email transfers to the landing page. It should transfer to the dashboard.
  - Workaround: change link so it transfers to dashboard route.
  - [ ] Issue 4: Order detail dialog sometimes shows horizontal scroll.
    - screens: Order-dialog.png
    - workaround: dialog window size should not be fixed so It can accomodate content without horizonal scroll
  - [ ] Issue 5: In inventory, when createing new item, quantity and reorder threshold are marked with red \* but they are not required as I was able to create item with 0 value and validation does not work too.
  - [ ] Issue 6: There is item with low stock badge in "all items" but in "low stock" section there is a data fetch error
    - screen: low-item-error.png
  - [ ] Issue 7: when generating label, weight is required field but is is automaticlhy field with value 0.1 so user can skip this field and generate value. also when input changed to 0, label is not generated but validation does not show as well.
  - workaround: Maybe It is better value to be 0 at the start or even empty input. give suggestions which is better.
  - [ ] Issue 8:

**Critical Issues (Blockers):**

- [ ] ***
- [ ] ***

**Non-Critical Issues (Can Fix Later):**

- [ ] ***
- [ ] ***

---

## Completion

- [ ] All critical flows tested
- [ ] Critical issues documented
- [ ] Ready to proceed to pilot prep (if no blockers)

**Tested By**: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***  
**Date**: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***  
**Status**: ⏳ Not Started | 🔄 In Progress | ✅ Complete

---

**Next Step**: If no critical blockers, proceed to [Pilot Launch Preparation Checklist](./pilot-launch-preparation-checklist.md)
