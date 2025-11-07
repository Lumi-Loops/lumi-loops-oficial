# Quick Test - Notification System (5 minute check)

## Prerequisites

- Dev server running: `npm run dev`
- Two browser windows/tabs open (one for admin, one for client)
- Both users logged in

---

## Test 1: Admin Notification (2 minutes)

### Setup

1. **Tab 1 (Admin):** Navigate to `http://localhost:3000/admin?tab=inquiries`
2. **Tab 2 (Client):** Navigate to `http://localhost:3000/dashboard?tab=inquiries`
3. **Tab 1 (Admin):** Open DevTools → Console (Ctrl+Shift+I)

### Execute

1. **Tab 2 (Client):** Click "New Inquiry" → Submit a test inquiry
2. **Tab 1 (Admin):** Watch for:
   - ✅ Bell icon animates yellow (bounces)
   - ✅ Red badge appears "1"
   - ✅ Beep sound plays
   - ✅ Console shows: "Realtime update received"

### Expected Result

- Notification appears **within 5 seconds** (no page refresh needed)
- Bell dropdown shows: "New Client Inquiry"

**Issue?** → See [NOTIFICATION_SYSTEM_DEBUG_GUIDE.md](./NOTIFICATION_SYSTEM_DEBUG_GUIDE.md#issue-1-notifications-not-appearing)

---

## Test 2: Client Notification (2 minutes)

### Setup

1. **Tab 1 (Admin):** Still on inquiries page with DevTools open
2. **Tab 2 (Client):** Open DevTools → Console

### Execute

1. **Tab 1 (Admin):** Click the inquiry from Test 1
2. **Tab 1 (Admin):** Change status dropdown from "new" → "viewed"
3. **Tab 2 (Client):** Watch for:
   - ✅ Bell icon animates yellow (bounces)
   - ✅ Red badge appears "1"
   - ✅ Beep sound plays
   - ✅ Console shows: "Realtime update received"

### Expected Result

- Notification appears **within 5 seconds**
- Bell dropdown shows: "Your inquiry has been reviewed"

**Issue?** → See [NOTIFICATION_SYSTEM_DEBUG_GUIDE.md](./NOTIFICATION_SYSTEM_DEBUG_GUIDE.md#issue-1-notifications-not-appearing)

---

## Test 3: Email (1 minute - if SMTP configured)

### Execute

1. **Tab 1 (Admin):** Change status again to "in-progress"
2. **Check email inbox:** Look for email from sender

### Expected Result

- Email arrives within 1 minute with status update

**Issue?** → See [NOTIFICATION_SYSTEM_DEBUG_GUIDE.md](./NOTIFICATION_SYSTEM_DEBUG_GUIDE.md#issue-2-emails-not-sending)

---

## Verification Checklist

- [ ] Test 1: Admin receives notification (bell animates)
- [ ] Test 2: Client receives notification (bell animates)
- [ ] Test 3: Sound plays on notifications
- [ ] Test 4: Notifications appear within 5 seconds (no refresh)
- [ ] Test 5: Clicking notification navigates correctly
- [ ] Test 6: (Optional) Email received

---

## Debugging: Open Network Tab

If notifications not working, check Network requests:

1. Admin DevTools → Network tab
2. Filter: `admin_notifications_queue` or `client_notifications`
3. Look for requests every 5 seconds

**Expected:**

```
GET /rest/v1/admin_notifications_queue?... 200 OK
GET /rest/v1/admin_notifications_queue?... 200 OK (5s later)
GET /rest/v1/admin_notifications_queue?... 200 OK (5s later)
```

If not seeing these requests:

- Check browser console for errors
- Verify user is logged in
- Check RLS policies (see guide)

---

## If All Tests Pass ✅

Your notification system is **production-ready**!

Next: Deploy to Cloudflare Workers and test again

---

## Quick Reference

| Component           | File                                                 | Purpose                      |
| ------------------- | ---------------------------------------------------- | ---------------------------- |
| Polling Hook        | `/src/hooks/useRealtimeNotifications.ts`             | Polls every 5 seconds        |
| Sound Hook          | `/src/hooks/useNotificationSound.ts`                 | Plays beep sound             |
| Bell UI             | `/src/components/NotificationBell.tsx`               | Shows notifications          |
| Admin Notif Create  | `/src/app/api/submit-inquiry/route.ts`               | Creates admin notification   |
| Client Notif Create | `/src/components/admin/AdminInquiriesManagement.tsx` | Creates client notification  |
| Email               | `/src/app/api/send-inquiry-email/route.ts`           | Sends email on status change |
