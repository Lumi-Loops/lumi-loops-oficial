# Notification System Analysis - Lumi Loops Admin Dashboard

## Current State

### What Exists ✅

1. **Database Tables:**
   - `visitor_inquiries` - Stores form submissions from home page (name, email, message, etc.)
   - `admin_notifications_queue` - Manages notification delivery status
   - `notifications` - (assumed to exist) Admin notification history
   - `support_tickets` - Support ticket management
   - `payments` - Payment tracking

2. **Admin UI Components:**
   - `NotificationQueueAdmin` - Shows notification delivery queue with status (queued, sending, sent, failed)
   - `AdminTicketsInbox` - Displays support tickets
   - `AdminResponseForm` - Allows admin to respond to tickets
   - `AdminCustomers` - Lists all customers

3. **Frontend Form:**
   - `LeadForm` - Contact form on home page capturing: name, email, business_name, content_type, platforms, examples, goal, budget_range, contact_preference, message

### What's MISSING ❌

1. **No API Endpoint for Form Submission:**
   - Form sends to `/api/submit-lead` or `/api/submit-lead-test` (lines 65-66 in LeadForm)
   - This endpoint DOES NOT exist - needs to be created
   - Form data is NOT being stored in `visitor_inquiries` table

2. **No Admin Notification on New Inquiry:**
   - When a user submits the form, admin doesn't receive any notification
   - No entry is created in `admin_notifications_queue`
   - No way for admin to see new inquiries in the dashboard

3. **Notification Queue System is Incomplete:**
   - `NotificationQueueAdmin` only manages email delivery status
   - NOT integrated with actual email sending
   - No mechanism to create notifications when new inquiries arrive

4. **No Inbox Tab for Inquiries:**
   - Admin dashboard doesn't have a dedicated view for new visitor inquiries
   - Can't distinguish between support tickets and contact form inquiries

## Architecture Flow (What Should Happen)

```
1. User submits form on home page
   ↓
2. [MISSING] API endpoint receives form data
   ↓
3. [MISSING] Form data stored in visitor_inquiries table
   ↓
4. [MISSING] Entry created in admin_notifications_queue
   ↓
5. [MISSING] Email sent to admin with inquiry details
   ↓
6. Admin sees notification in dashboard's "Inquiries" or "Tickets" tab
   ↓
7. Admin reviews inquiry and can:
   - Send response/proposal email
   - Schedule call/meeting
   - Mark as handled
```

## Recommended Solution

### Phase 1: Create API Endpoint

Create `/src/app/api/submit-lead/route.ts` that:

1. Validates form data using Zod schema
2. Stores data in `visitor_inquiries` table
3. Creates entry in `admin_notifications_queue` with type: "new_inquiry"
4. Triggers email to admin (optional for now, can be async)

### Phase 2: Create Inquiries Admin View

Create new component `AdminInquiries.tsx` to:

1. Display all visitor inquiries in table format
2. Show status (new, responded, scheduled, closed)
3. Allow admin to mark as handled
4. Show response history

### Phase 3: Clarify Notification Types

Notifications should handle multiple types:

- `new_inquiry` - New contact form submission
- `scheduled_call` - Meeting confirmation
- `delivery_update` - Project delivery status
- `interview_confirmation` - Call/interview scheduling

### Phase 4: Create Admin Message Composer

Create `AdminInquiryResponse.tsx` for admin to:

1. Send email response to inquirer
2. Schedule a call (with calendar integration)
3. Update inquiry status
4. Attach documents/proposals

## Database Schema Check Needed

```sql
-- Verify visitor_inquiries table has these columns:
- id (UUID)
- name (TEXT)
- email (TEXT)
- business_name (TEXT)
- content_type (TEXT[])
- platforms (TEXT[])
- examples (TEXT[])
- goal (TEXT)
- budget_range (TEXT)
- contact_preference (TEXT)
- message (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- status (TEXT) -- new, responded, scheduled, closed
- admin_notes (TEXT)

-- Verify admin_notifications_queue table structure:
- id (UUID)
- response_id (UUID FK)
- recipient_user_id (UUID FK)
- notification_type (TEXT) -- new_inquiry, call_scheduled, etc.
- status (TEXT) -- queued, sending, sent, failed
- retry_count (INT)
- max_retries (INT)
- error_message (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Summary of What Needs to Be Done

1. ✅ Create `/api/submit-lead/route.ts` API endpoint
2. ✅ Create new "Inquiries" tab in admin dashboard
3. ✅ Create `AdminInquiries.tsx` component
4. ✅ Update `NotificationQueueAdmin` to handle multiple notification types
5. ✅ Create `AdminInquiryResponse.tsx` for responding to inquiries
6. ✅ Add status field to `visitor_inquiries` if missing
7. ✅ Integrate call scheduling (optional: Calendly, Google Calendar, etc.)

## Current Notification Queue Purpose

Currently, `NotificationQueueAdmin` is designed to:

- Track admin-to-client email deliveries for responses, updates, and confirmations
- NOT for managing incoming inquiries

This is correct! We just need to add the missing pieces above.
