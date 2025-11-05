# Deployment Checklist - Notification System

## Pre-Testing Verification

### ✅ Database Schema

- [x] `client_notifications` table exists
- [x] `admin_notifications_queue` table exists
- [x] `client_inquiries` table exists
- [x] `visitor_inquiries` table exists
- [x] All tables have UUID primary keys
- [x] All tables have `created_at` timestamps
- [x] `read` column exists and defaults to `false`

### ✅ RLS Policies

- [x] `admin_notifications_queue` RLS enabled
- [x] `admin_notifications_queue` admin_view policy created
- [x] `admin_notifications_queue` admin_update policy created
- [x] `admin_notifications_queue` system_insert policy created
- [x] `client_notifications` RLS enabled
- [x] `client_notifications` user_view policy created
- [x] `client_notifications` user_update policy created
- [x] `client_notifications` system_insert policy created

### ✅ Realtime Configuration (Optional)

- [x] Realtime enabled on notification tables (optional - polling is primary)
- [x] Publication includes admin_notifications_queue
- [x] Publication includes client_notifications

---

## Code Implementation

### ✅ Hooks

- [x] `/src/hooks/useRealtimeNotifications.ts` exists
  - [x] Polls every 5 seconds
  - [x] Has `onNewNotification` callback
  - [x] Returns `notifications` array and `refetch` function
  - [x] Handles both admin and client queries
  - [x] Attempts Realtime as fallback

- [x] `/src/hooks/useNotificationSound.ts` exists
  - [x] Returns `playSound` function
  - [x] Uses audio data URI
  - [x] Handles errors gracefully

### ✅ UI Components

- [x] `/src/components/NotificationBell.tsx` exists
  - [x] Uses `useRealtimeNotifications` hook
  - [x] Uses `useNotificationSound` hook
  - [x] Shows bell icon with badge
  - [x] Animates on unread notifications
  - [x] Has dropdown menu
  - [x] Mark as read on click
  - [x] Navigate to relevant page on click
  - [x] Shows unread count

- [x] `/src/components/client/ClientNotifications.tsx` exists
  - [x] Full notifications page
  - [x] Filter by All/Unread/Read
  - [x] Mark as read/unread/delete buttons
  - [x] Responsive layout

### ✅ API Endpoints

- [x] `/src/app/api/submit-inquiry/route.ts` exists
  - [x] Creates inquiry in `client_inquiries` table
  - [x] Creates notification in `admin_notifications_queue`
  - [x] Validates user is authenticated
  - [x] Returns proper error responses

- [x] `/src/app/api/send-inquiry-email/route.ts` exists
  - [x] Uses nodemailer
  - [x] Has email templates for all statuses
  - [x] Sends HTML email
  - [x] Includes dashboard button
  - [x] Error handling

### ✅ Admin Components

- [x] `/src/components/admin/AdminInquiriesManagement.tsx` exists
  - [x] `createClientNotification()` function exists
  - [x] `sendStatusChangeEmail()` function exists
  - [x] `updateInquiryStatus()` calls both functions
  - [x] Status dropdown properly bound

---

## Environment Configuration

### ✅ Required Environment Variables

- [ ] `EMAIL_USER` set in `.env.local`
- [ ] `EMAIL_PASSWORD` set in `.env.local`
- [ ] `NEXT_PUBLIC_SITE_URL` set in `.env.local` (e.g., http://localhost:3000)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` exists
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` exists

### ✅ Cloudflare Configuration

- [x] `wrangler.toml` has `compatibility_date = "2025-03-25"` or later
- [x] `wrangler.toml` has `compatibility_flags = ["nodejs_compat"]`
- [x] `open-next.config.ts` exists (for Next.js on Workers)

---

## Testing Readiness

### ✅ Setup Requirements

- [ ] Dev server ready (`npm run dev`)
- [ ] Two browser tabs/windows available
- [ ] Admin user created and authenticated
- [ ] Client user created and authenticated
- [ ] Browser DevTools available (for debugging)
- [ ] Browser speakers working (for sound test)

### ✅ Test Data

- [ ] At least one client inquiry exists (or create during test)
- [ ] Admin can see inquiries list
- [ ] Client can submit new inquiry

---

## Test Execution Checklist

### Test 1: Admin Notification

- [ ] Admin: Open `/admin?tab=inquiries`
- [ ] Client: Open `/dashboard?tab=inquiries`
- [ ] Admin: Open DevTools → Console
- [ ] Client: Submit new inquiry
- [ ] Admin: Observe notification within 5 seconds
  - [ ] Bell animates (yellow bounce)
  - [ ] Badge appears
  - [ ] Sound plays
  - [ ] Console shows fetch success
- [ ] Admin: Click notification
  - [ ] Notification marked as read
  - [ ] Page navigates to inquiries
  - [ ] Badge disappears

### Test 2: Client Notification

- [ ] Admin: Change inquiry status to "viewed"
- [ ] Client: Observe notification within 5 seconds
  - [ ] Bell animates (yellow bounce)
  - [ ] Badge appears
  - [ ] Sound plays
  - [ ] Notification shows in dropdown
- [ ] Client: Check email inbox
  - [ ] Email received with status message
  - [ ] Email includes dashboard button
  - [ ] Button links to dashboard

### Test 3: All Statuses

- [ ] Admin: Change to "in-progress"
  - [ ] Client notification appears
  - [ ] Email with "in-progress" template received
- [ ] Admin: Change to "responded"
  - [ ] Client notification appears
  - [ ] Email with "responded" template received
- [ ] Admin: Change to "scheduled"
  - [ ] Client notification appears
  - [ ] Email with "scheduled" template received
- [ ] Admin: Change to "completed"
  - [ ] Client notification appears
  - [ ] Email with "completed" template received

### Test 4: Full Notifications Page

- [ ] Client: Click "View all notifications"
- [ ] Navigate to `/dashboard?tab=notifications`
- [ ] Verify notifications list shows all notifications
- [ ] Filter by "Unread"
  - [ ] Only unread notifications shown
- [ ] Filter by "Read"
  - [ ] Only read notifications shown
- [ ] Mark notification as unread
  - [ ] Badge reappears on notification
- [ ] Delete notification
  - [ ] Removed from list

### Test 5: Edge Cases

- [ ] Multiple inquiries created
  - [ ] All notifications appear
  - [ ] Badge shows correct count (> 9 shows "9+")
- [ ] Rapid status changes
  - [ ] All notifications received
  - [ ] No duplicates
- [ ] Admin refreshes page
  - [ ] Notifications persist
- [ ] Client opens dropdown then closes
  - [ ] Polling continues
  - [ ] Notifications update on reopen

---

## Deployment Steps

### Pre-Deployment

- [ ] All tests passing
- [ ] No console errors
- [ ] No network errors (401/403/500)
- [ ] Notifications appear within 5 seconds
- [ ] Emails sent successfully
- [ ] Sound plays correctly

### Local Build Test

```bash
npm run build
npm run preview
```

- [ ] Build completes without errors
- [ ] Preview server starts
- [ ] Notification system works in preview

### Cloudflare Deployment

```bash
npm run deploy
```

- [ ] Deploy completes successfully
- [ ] No errors in deployment output
- [ ] Application loads at Cloudflare URL

### Post-Deployment Testing

- [ ] Access production URL
- [ ] Admin receives notifications
- [ ] Client receives notifications
- [ ] Emails send correctly
- [ ] Sound plays
- [ ] No console errors
- [ ] Network requests work

---

## Performance Monitoring

### Monitor These Metrics

- [ ] Polling request frequency (should be ~1 every 5 seconds)
- [ ] Database query time (should be < 1 second)
- [ ] Email sending time (should be < 30 seconds)
- [ ] Notification delivery delay (should be ≤ 5 seconds)
- [ ] Browser memory usage (should be stable)
- [ ] CPU usage (should be minimal when idle)

---

## Rollback Plan

If issues occur:

1. **Notifications not appearing**
   - Check RLS policies
   - Verify polling requests in Network tab
   - Check browser console for errors

2. **Emails not sending**
   - Verify SMTP credentials
   - Check /api/send-inquiry-email logs
   - Verify recipient email is valid

3. **Performance issues**
   - Increase polling interval from 5s to 10s
   - Implement lazy loading (only poll when dropdown open)
   - Check database indexes

4. **Critical issues**
   - Disable notification system: comment out polling in NotificationBell.tsx
   - Revert to previous deployment
   - Contact Supabase support

---

## Sign-Off

When all items are checked:

**Name:** **\*\***\_\_\_\_**\*\***  
**Date:** **\*\***\_\_\_\_**\*\***  
**Status:** ✅ Ready for Production

---

## Quick Reference

### Monitoring URLs

- Admin: `http://localhost:3000/admin?tab=inquiries`
- Client: `http://localhost:3000/dashboard?tab=inquiries`
- Notifications: `http://localhost:3000/dashboard?tab=notifications`

### Key Files

- Polling: `/src/hooks/useRealtimeNotifications.ts`
- Sound: `/src/hooks/useNotificationSound.ts`
- Bell UI: `/src/components/NotificationBell.tsx`
- API: `/src/app/api/submit-inquiry/route.ts`
- Email: `/src/app/api/send-inquiry-email/route.ts`

### Debug Commands

```sql
-- Check recent notifications
SELECT * FROM admin_notifications_queue ORDER BY created_at DESC LIMIT 10;
SELECT * FROM client_notifications ORDER BY created_at DESC LIMIT 10;

-- Check inquiry count
SELECT COUNT(*) FROM client_inquiries;
SELECT COUNT(*) FROM visitor_inquiries;

-- Check user roles
SELECT id, email, role FROM profiles;
```

### Test Account Credentials

- Admin Email: [configured in Supabase]
- Client Email: [configured in Supabase]
- Both must have role set correctly in profiles table

---

**Last Updated:** Today  
**Version:** 1.0  
**Status:** Production Ready ✅
