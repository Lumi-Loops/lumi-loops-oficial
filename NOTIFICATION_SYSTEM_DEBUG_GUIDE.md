# Notification System - Debug & Verification Guide

## Overview

The notification system is designed to work on Cloudflare Workers using **polling (5-second intervals)** instead of WebSocket-based Realtime, due to Workers' limitations with long-lived connections.

---

## System Architecture

```
FLOW 1: Admin receives notification when client creates inquiry
┌─────────────────────────────────────────────────────────────────┐
│ Client creates inquiry via /dashboard?tab=inquiries             │
│ → /api/submit-inquiry endpoint                                  │
│ → Creates record in client_inquiries table                       │
│ → Creates record in admin_notifications_queue table             │
│ → Admin's polling hook (5s) detects new unread notification     │
│ → Notification Bell animates + Sound plays                       │
│ → Notification appears in bell dropdown                          │
│ → Admin clicks → navigates to /admin?tab=inquiries             │
└─────────────────────────────────────────────────────────────────┘

FLOW 2: Client receives notification when admin changes status
┌─────────────────────────────────────────────────────────────────┐
│ Admin changes inquiry status in /admin?tab=inquiries           │
│ → AdminInquiriesManagement.updateInquiryStatus()               │
│ → Creates record in client_notifications table                 │
│ → Sends email via /api/send-inquiry-email                      │
│ → Client's polling hook (5s) detects new unread notification   │
│ → Notification Bell animates + Sound plays                      │
│ → Notification appears in client's bell dropdown                │
│ → Client sees "View all notifications" → /dashboard?tab=notifications │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Tables

### 1. `client_notifications`

**For registered clients** - when admin changes inquiry status

```sql
id              UUID PRIMARY KEY
user_id         UUID FOREIGN KEY (auth.users)
inquiry_id      UUID FOREIGN KEY (client_inquiries)
type            VARCHAR (e.g., "status_change")
title           VARCHAR (notification title)
message         VARCHAR (notification message)
read            BOOLEAN (default: false)
action_url      VARCHAR (route to navigate to)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

**RLS Policies:**

- ✅ System can insert notifications
- ✅ Users can view their own notifications
- ✅ Users can update their own notifications (mark as read)

### 2. `admin_notifications_queue`

**For admins** - when client creates inquiry

```sql
id                  UUID PRIMARY KEY
recipient_user_id   UUID FOREIGN KEY (profiles.id)
notification_type   VARCHAR (e.g., "new_client_inquiry")
status              VARCHAR (default: "sent")
read                BOOLEAN (default: false)
created_at          TIMESTAMP
updated_at          TIMESTAMP (nullable)
```

**RLS Policies:**

- ✅ System can insert notifications
- ✅ Admins can view notification queue (if role = 'admin')
- ✅ Admins can update notifications (mark as read)

### 3. `client_inquiries`

**Client inquiry records** - created by registered users

```sql
id              UUID PRIMARY KEY
user_id         UUID FOREIGN KEY (auth.users)
message         TEXT
content_type    JSON ARRAY
platforms       JSON ARRAY
goal            VARCHAR (nullable)
budget_range    VARCHAR (nullable)
contact_preference VARCHAR (nullable)
status          VARCHAR (default: "new")
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### 4. `visitor_inquiries`

**Visitor inquiry records** - created by unauthenticated users

```sql
id              UUID PRIMARY KEY
message         TEXT
email           VARCHAR
phone           VARCHAR (nullable)
business_name   VARCHAR (nullable)
content_type    JSON ARRAY
platforms       JSON ARRAY
goal            VARCHAR (nullable)
budget_range    VARCHAR (nullable)
contact_preference VARCHAR (nullable)
status          VARCHAR (default: "new")
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## Testing Checklist

### ✅ Step 1: Verify Database Setup

```bash
# Check if tables exist
supabase db pull

# Check RLS policies
SELECT tablename, policyname FROM pg_policies
WHERE tablename IN ('client_notifications', 'admin_notifications_queue');

# Check if Realtime is enabled on tables (optional)
SELECT * FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';
```

### ✅ Step 2: Test Admin Receives Notification (Client Creates Inquiry)

**Prerequisites:**

- Admin user logged in at `/admin?tab=inquiries`
- Client user logged in at `/dashboard?tab=inquiries`
- Both browser tabs/windows open and visible

**Test Steps:**

1. Admin: Open browser DevTools → Network tab
2. Admin: Open browser DevTools → Console tab (watch for logs)
3. Client: Submit a new inquiry via form
4. **Expected outcome (within 5 seconds):**
   - Admin's bell icon animates (bounce + yellow)
   - Badge appears on bell with "1" unread
   - Bell dropdown shows new notification: "New Client Inquiry"
   - Sound plays (beep)
   - Console shows: "Realtime update received" or successful fetch
5. Admin: Click notification → redirects to /admin?tab=inquiries

**If not working:**

- Check browser console for errors
- Verify admin user's role = 'admin' in profiles table
- Check Network tab: should see polling requests every 5s to `/rest/v1/admin_notifications_queue`
- Verify `recipient_user_id` matches admin's UUID in admin_notifications_queue table

---

### ✅ Step 3: Test Client Receives Notification (Admin Changes Status)

**Prerequisites:**

- Admin user logged in at `/admin?tab=inquiries`
- Client user logged in at `/dashboard?tab=inquiries`
- An existing inquiry from client to admin
- Both browser tabs/windows open and visible

**Test Steps:**

1. Client: Open browser DevTools → Console tab
2. Admin: Change inquiry status from "new" → "viewed" (or any other status)
3. **Expected outcome (within 5 seconds):**
   - Client's bell icon animates (bounce + yellow)
   - Badge appears with "1" unread
   - Sound plays (beep)
   - Console shows: "Realtime update received" or successful fetch
   - Notification appears in dropdown
4. Client: Click notification → redirects to `/dashboard?tab=inquiries`
5. **Within 1 minute:** Client receives email (if SMTP configured)

**If not working:**

- Check browser console for errors
- Verify `user_id` matches client's UUID in client_notifications table
- Check Network tab: polling requests every 5s to `/rest/v1/client_notifications`
- Verify SMTP credentials are correct (if testing email)

---

### ✅ Step 4: Test Email Sending

**Prerequisites:**

- Environment variables set:
  - `EMAIL_USER` (Gmail address with App Password)
  - `EMAIL_PASSWORD` (Gmail App Password)
  - `NEXT_PUBLIC_SITE_URL` (e.g., http://localhost:3000)

**Test Steps:**

1. Admin: Change a client inquiry status
2. **Expected outcome (within 1 minute):**
   - Email appears in client's inbox
   - Email contains:
     - Client's name
     - Status message (e.g., "We're working on your project")
     - Button linking to dashboard
     - Styled HTML template
3. Client: Click email button → redirects to dashboard

**If email not received:**

- Check `/api/send-inquiry-email` logs
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env.local`
- Check spam/promotions folder
- Test manually: `curl -X POST http://localhost:3000/api/send-inquiry-email -H "Content-Type: application/json" -d '{"clientEmail":"your@email.com","clientName":"Test","status":"viewed"}'`

---

### ✅ Step 5: Test Sound Playback

**Prerequisites:**

- Browser speakers enabled
- Volume not muted

**Test Steps:**

1. Open NotificationBell component in browser
2. Create new notification (client inquiry or status change)
3. **Expected outcome:**
   - Beep sound plays immediately upon notification arrival
   - Sound should be audible (not muted)
4. Verify in DevTools Console: should see sound hook execution

**If sound not working:**

- Check browser console: look for audio element logs
- Verify browser volume is not muted
- Check if browser allows autoplay (some browsers require user interaction first)

---

### ✅ Step 6: Test Animation Effects

**Prerequisites:**

- Browser with CSS animation support

**Test Steps:**

1. Create new notification
2. **Expected animations:**
   - Bell icon: `animate-bounce text-yellow-500` (when unread)
   - Badge: `animate-pulse` (red color)
   - Both should stop animating after marking as read

**If animations not working:**

- Check if CSS is loaded correctly
- Verify Tailwind CSS is compiled with animation utilities
- Check browser DevTools → Elements tab → inspect bell element

---

### ✅ Step 7: Test Polling Interval

**Prerequisites:**

- Browser DevTools open

**Test Steps:**

1. Open Network tab
2. Filter requests to URL containing "client_notifications" or "admin_notifications_queue"
3. Observe request timing

**Expected behavior:**

- First request: immediate on component mount
- Subsequent requests: exactly 5 seconds apart
- Requests should contain: `order=created_at.desc&limit=20`

**If polling not working:**

- Check interval logic in useRealtimeNotifications.ts (should be 5000ms)
- Verify component is mounted (check DevTools → React tab)
- Check if cleanup/unmount is happening unexpectedly

---

## Common Issues & Solutions

### Issue 1: Notifications not appearing

**Symptoms:** No notifications in bell dropdown, no animation

**Troubleshooting:**

1. Check database: manually insert test notification
   ```sql
   INSERT INTO client_notifications (user_id, inquiry_id, type, title, message, read)
   VALUES ('USER_ID', 'INQUIRY_ID', 'test', 'Test', 'Test message', false);
   ```
2. Check polling: verify Network tab shows requests every 5s
3. Check RLS: verify user_id matches authenticated user
4. Check console: look for error messages

### Issue 2: Emails not sending

**Symptoms:** Status changes but no email

**Troubleshooting:**

1. Verify SMTP credentials in `.env.local`
2. Check server logs: `npm run dev` output
3. Test endpoint manually: POST to /api/send-inquiry-email
4. Check email provider: Gmail requires "App Password" not regular password

### Issue 3: Sound not playing

**Symptoms:** Animation works but no beep

**Troubleshooting:**

1. Check browser volume/mute settings
2. Check browser console for audio errors
3. Verify useNotificationSound hook is called
4. Try different browser (Chrome vs Firefox)

### Issue 4: Polling requests failing

**Symptoms:** Network tab shows 401/403 errors

**Troubleshooting:**

1. Check user is authenticated: `supabase.auth.getUser()`
2. Check RLS policies: user_id must match filter
3. Check Supabase session: may have expired
4. Refresh page to re-authenticate

### Issue 5: High database queries/costs

**Symptoms:** Many requests to notification tables

**Solutions:**

1. Increase polling interval from 5s → 10s if acceptable UX
2. Implement debouncing on requests
3. Use edge caching if available
4. Optimize query: select only necessary columns

---

## Debugging Commands

### Check notification records:

```sql
-- Admin notifications
SELECT id, recipient_user_id, notification_type, read, created_at
FROM admin_notifications_queue
ORDER BY created_at DESC
LIMIT 10;

-- Client notifications
SELECT id, user_id, type, title, read, created_at
FROM client_notifications
ORDER BY created_at DESC
LIMIT 10;
```

### Check inquiries created:

```sql
-- Client inquiries
SELECT id, user_id, message, status, created_at
FROM client_inquiries
ORDER BY created_at DESC
LIMIT 10;

-- Visitor inquiries
SELECT id, email, message, status, created_at
FROM visitor_inquiries
ORDER BY created_at DESC
LIMIT 10;
```

### Check user profiles:

```sql
-- Verify admin role
SELECT id, email, role FROM profiles WHERE role = 'admin';

-- Verify client users
SELECT id, email FROM auth.users LIMIT 10;
```

### Test RLS policies:

```sql
-- Check if current user can see their notifications
SELECT * FROM client_notifications
WHERE user_id = auth.uid();

-- Check if admin can see all notifications
SELECT * FROM admin_notifications_queue
WHERE recipient_user_id = auth.uid();
```

---

## Performance Optimization

### Current Strategy

- **Polling interval:** 5 seconds (configurable in useRealtimeNotifications.ts)
- **Query limit:** 20 notifications per fetch
- **Update frequency:** Real-time on status change

### Optimization Options

1. **Increase polling interval** (tradeoff: slower updates)

   ```typescript
   setInterval(() => fetchNotifications(), 10000); // 10 seconds
   ```

2. **Implement message deduplication** (prevent duplicate notifications)

   ```typescript
   const seen = new Set(notifications.map((n) => n.id));
   const filtered = newData.filter((n) => !seen.has(n.id));
   ```

3. **Lazy load notifications** (don't load until user opens bell)

   ```typescript
   const [shouldFetch, setShouldFetch] = useState(false);
   // Only fetch when dropdown is open
   ```

4. **Use cursor-based pagination** (for large notification lists)
   ```typescript
   // Instead of limit: 20, use cursor
   .range(lastCursor, lastCursor + 19)
   ```

---

## Cloudflare Workers Specific Notes

### Why Realtime doesn't work

- Cloudflare Workers has **request timeout: 30 seconds**
- Realtime WebSockets are **long-lived connections** (hours)
- Workers environment cannot maintain persistent connections
- ✅ **Solution: Polling every 5 seconds is reliable**

### Wrangler Configuration

```toml
# D:\lumi-loops-oficial\wrangler.toml
compatibility_date = "2025-03-25"
compatibility_flags = ["nodejs_compat"]
# nodejs_compat required for Next.js Edge Runtime
```

### Deployment Notes

- Deploy: `npm run deploy` (or `wrangler deploy`)
- Polling works on Cloudflare because it's request-based (not persistent)
- Each poll = 1 HTTP request (counted normally)
- No special Cloudflare configuration needed

---

## Testing Flowchart

```
START
  ↓
[Test 1: Database tables exist?] → NO → Run migrations
  ↓ YES
[Test 2: RLS policies active?] → NO → Enable RLS
  ↓ YES
[Test 3: Admin can see notifications?] → NO → Check admin role
  ↓ YES
[Test 4: Client creates inquiry?] → NO → Check form validation
  ↓ YES
[Test 5: Admin receives notification?] → NO → Check polling interval
  ↓ YES
[Test 6: Client notified on status change?] → NO → Check email config
  ↓ YES
[Test 7: Sound plays?] → NO → Check browser settings
  ↓ YES
✅ NOTIFICATION SYSTEM WORKING
```

---

## Files Modified/Created

- ✅ `/src/hooks/useRealtimeNotifications.ts` - Polling hook
- ✅ `/src/hooks/useNotificationSound.ts` - Sound hook
- ✅ `/src/components/NotificationBell.tsx` - Bell UI
- ✅ `/src/components/client/ClientNotifications.tsx` - Full notifications page
- ✅ `/src/components/admin/AdminInquiriesManagement.tsx` - Status updates
- ✅ `/src/app/api/submit-inquiry/route.ts` - Create admin notification
- ✅ `/src/app/api/send-inquiry-email/route.ts` - Email sending
- ✅ Database migrations (tables + RLS policies)

---

## Next Steps

1. **Immediate:** Run full testing checklist above
2. **Verify:** Admin and client both see notifications without page refresh
3. **Email:** Confirm SMTP credentials and email sending
4. **Performance:** Monitor polling request frequency
5. **Production:** Deploy to Cloudflare and test end-to-end

---

## Support Information

- **Polling interval:** 5 seconds (fastest safe interval on Cloudflare)
- **Realtime support:** Not recommended on Cloudflare Workers
- **Email:** Required SMTP configuration (Gmail recommended)
- **Sound:** Requires browser audio permissions
- **Animations:** Requires CSS animations enabled
