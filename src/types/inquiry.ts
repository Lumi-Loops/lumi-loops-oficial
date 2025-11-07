/**
 * Inquiry type definition
 * Represents a visitor inquiry/lead submission from the lead form
 * Used across admin (AdminInquiries, AdminInquiryResponse) and client (ClientInquiries) components
 * Business Strategy: Tracks visitor inquiries through their complete lifecycle
 */

export type InquiryStatus =
  | "new"
  | "viewed"
  | "responded"
  | "scheduled"
  | "in-progress"
  | "rejected"
  | "completed"
  | "closed";

export interface Inquiry {
  id: string;
  user_id: string | null; // Links to authenticated user if they submitted while logged in
  name: string;
  email: string;
  business_name: string | null;
  content_type: string[] | null;
  platforms: string[] | null;
  examples: string[] | null;
  goal: string | null;
  budget_range: string | null;
  contact_preference: string | null;
  message: string | null;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
}

/**
 * ClientInquiry type definition
 * Represents a project inquiry from authenticated clients
 * Stored in client_inquiries table with user_id required
 */
export interface ClientInquiry {
  id: string;
  user_id: string; // Required - must be authenticated
  content_type: string[] | null;
  platforms: string[] | null;
  goal: string | null;
  message: string;
  budget_range: string | null;
  contact_preference: string | null;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Status configuration for UI rendering
 * Defines labels, variants, and colors for each inquiry status
 * Used in admin and client dashboards for consistent status display
 */
export const inquiryStatusConfig = {
  new: { label: "New", variant: "default" as const, color: "blue" },
  responded: {
    label: "Responded",
    variant: "secondary" as const,
    color: "purple",
  },
  scheduled: {
    label: "Scheduled",
    variant: "secondary" as const,
    color: "green",
  },
  "in-progress": {
    label: "In Progress",
    variant: "secondary" as const,
    color: "orange",
  },
  completed: {
    label: "Completed",
    variant: "secondary" as const,
    color: "gray",
  },
  closed: { label: "Closed", variant: "outline" as const, color: "red" },
} as const;

/**
 * Type-safe status labels
 */
export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  new: "New",
  viewed: "Viewed",
  responded: "Responded",
  scheduled: "Scheduled",
  "in-progress": "In Progress",
  rejected: "Rejected",
  completed: "Completed",
  closed: "Closed",
};
