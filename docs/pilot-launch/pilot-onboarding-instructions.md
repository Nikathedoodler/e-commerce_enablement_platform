# Pilot Onboarding Instructions

**Purpose:** Step-by-step guide for onboarding pilot users  
**Audience:** Internal team (for managing pilot program)  
**Time Estimate:** 15-30 minutes per pilot user

---

## 📋 Pre-Onboarding Checklist

Before reaching out to a pilot user:

- [ ] Pilot user account is created in the system
- [ ] Demo data is loaded (if applicable)
- [ ] Platform is ready and tested
- [ ] Support infrastructure is set up
- [ ] Welcome email template is ready
- [ ] Quick Start Guide is available

---

## 🎯 Onboarding Steps

### Step 1: Account Setup (5 minutes)

**Create Pilot User Account:**

1. User signs up via signup page OR
2. You create account for them via Supabase dashboard:
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add User"
   - Fill in email and temporary password
   - Send password reset email to user

**Verify Account:**
- [ ] User email is verified (or send verification email)
- [ ] User can log in successfully
- [ ] Profile is created in database

---

### Step 2: Send Welcome Email (2 minutes)

**Action:** Send welcome email to pilot user

**Template:** Use `welcome-email-template.md`

**Customize:**
- Replace `[First Name]` with user's actual name
- Replace `[User Email]` with their email
- Replace `[Login Link]` with actual login URL
- Include any pilot-specific details or special instructions

**Send:**
- Via email client or email service (Resend/SendGrid)
- CC/BCC yourself for tracking
- Save email to user communication log

**Checklist:**
- [ ] Email sent successfully
- [ ] Login link works
- [ ] All links in email are correct
- [ ] Support email address is correct

---

### Step 3: Schedule Onboarding Call (Optional, 15 minutes)

**When to Schedule:**
- For important pilot users
- If user requests it
- If user seems unsure about getting started

**How to Schedule:**
- Suggest 15-20 minute call
- Use calendar tool (Calendly, etc.)
- Send calendar invitation

**Call Agenda:**
1. **Introduction** (2 min)
   - Welcome and thank them for participating
   - Explain pilot program goals
   - Set expectations

2. **Platform Walkthrough** (10 min)
   - Use demo walkthrough script (`docs/pilot-launch/demo-assets/09_demo_walkthrough_script.md`)
   - Cover main features:
     - Inventory management
     - Order management
     - Receiving workflow
     - Shipping labels
     - Shopify integration (if applicable)

3. **Q&A** (3-5 min)
   - Answer questions
   - Address concerns
   - Set up next steps

4. **Follow-up** (1 min)
   - Send Quick Start Guide link
   - Schedule check-in (optional)
   - Ask for feedback timeline

---

### Step 4: Provide Resources (2 minutes)

**Send Links:**
- [ ] Quick Start Guide: [Link]
- [ ] Full Documentation: [Link]
- [ ] Video Tutorials: [Link if available]
- [ ] Support Page: [Link]

**Share Via:**
- Email (in welcome email or follow-up)
- Or create a shared document/folder

---

### Step 5: Set Up Demo Data (Optional, 5 minutes)

**When:** If you want to show examples in their account

**What to Load:**
- 5-10 sample inventory items
- 2-3 sample orders
- 1-2 sample receiving logs

**How:**
- Use demo assets seed files (`docs/pilot-launch/demo-assets/`)
- Replace user_id with pilot user's ID
- Run seed files in Supabase SQL Editor

**Note:** Let them know this is demo data and they can delete it or keep it as examples.

---

### Step 6: First Check-in (3-5 days after onboarding)

**Action:** Send follow-up email

**Template:**

**Subject:** How's it going with [Platform Name]? 

Hi [First Name],

Hope you're settling into [Platform Name]! I wanted to check in and see how things are going.

**Quick Questions:**
- Have you been able to log in and explore the platform?
- Have you added any inventory items yet?
- Any questions or issues so far?
- How can we help you get more value from the platform?

**Resources:**
- Quick Start Guide: [Link]
- Support: support@yourplatform.com

We'd love to hear your initial feedback - what's working well and what could be improved.

Let me know if you need anything!

Best,  
[Your Name]

---

## 📊 Tracking Pilot Users

**Create a Tracking Document:**

| Pilot User | Email | Onboarded Date | Status | Check-in Date | Notes |
|------------|-------|----------------|--------|---------------|-------|
| User 1 | email@example.com | 2025-01-XX | Active | 2025-01-XX | Connected Shopify |
| User 2 | email@example.com | 2025-01-XX | Pending | - | Waiting for setup |

**Status Options:**
- Pending: Account created, not yet onboarded
- Onboarded: Welcome email sent, account ready
- Active: User is using the platform
- Inactive: User hasn't logged in recently
- Completed: Pilot period ended

---

## 🎯 Onboarding Success Criteria

A pilot user is successfully onboarded when:

- [ ] They can log in successfully
- [ ] They've received welcome email
- [ ] They've completed their profile
- [ ] They've added at least one inventory item
- [ ] They know how to contact support
- [ ] They've received Quick Start Guide

---

## 🔄 Follow-up Schedule

### Week 1
- **Day 1**: Send welcome email
- **Day 3-5**: First check-in email
- **Day 7**: Check if they've logged in (if not, send reminder)

### Week 2
- **Day 14**: Second check-in (ask for feedback)
- Offer onboarding call if they haven't used platform

### Week 3-4
- **Weekly**: Check in for feedback
- **End of Month**: Request comprehensive feedback

---

## 📝 Communication Templates

### Reminder Email (if user hasn't logged in after 3 days)

**Subject:** Quick reminder: Get started with [Platform Name]

Hi [First Name],

Just wanted to send a quick reminder that your [Platform Name] account is ready!

**Quick Start:**
1. Log in: [Login Link]
2. Complete your profile
3. Add your inventory items
4. Create your first order

**Need Help?** We're here to assist:
- Support: support@yourplatform.com
- Quick Start Guide: [Link]

Let me know if you have any questions!

Best,  
[Your Name]

---

### Feedback Request Email

**Subject:** Share your feedback on [Platform Name]

Hi [First Name],

Thanks for being part of our pilot program! We'd love to hear your thoughts on [Platform Name].

**Quick Feedback:**
1. What's working well?
2. What could be improved?
3. What features would you like to see?
4. Any issues or blockers?

**Ways to Share:**
- Reply to this email
- Use the Support page in your dashboard
- Schedule a call: [Calendar Link]

Your feedback helps us improve the platform for everyone!

Best,  
[Your Name]

---

## 🚨 Troubleshooting

### Issue: User can't log in

**Check:**
- Email is verified
- Password is correct
- Account exists in Supabase
- No account lockout

**Fix:**
- Send password reset email
- Check Supabase Auth logs
- Verify account status

### Issue: User hasn't responded to welcome email

**Action:**
- Send reminder after 2-3 days
- Try different communication channel (phone, LinkedIn)
- Check if email bounced

### Issue: User is stuck on a feature

**Action:**
- Offer quick screen share call
- Send specific guide link
- Provide step-by-step instructions

---

## ✅ Onboarding Checklist Summary

**For Each Pilot User:**

- [ ] Account created and verified
- [ ] Welcome email sent
- [ ] Quick Start Guide shared
- [ ] Onboarding call scheduled (if needed)
- [ ] Demo data loaded (if applicable)
- [ ] First check-in scheduled
- [ ] Added to tracking document
- [ ] Support channels communicated

---

**Last Updated:** 2025-01-XX  
**Version:** 1.0
