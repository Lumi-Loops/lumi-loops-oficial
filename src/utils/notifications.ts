export type NotificationType =
  | "new_inquiry" // Visitor inquiry received
  | "new_client_inquiry" // Client project inquiry
  | "inquiry_status_change" // Inquiry status updated
  | "appointment_scheduled" // Appointment created
  | "payment_received" // Payment completed
  | "other";

export interface NotificationRecord {
  id: string;
  recipient_user_id: string;
  notification_type: NotificationType;
  status: "queued" | "sent" | "failed";
  read?: boolean;
  inquiry_id?: string;
  response_id?: string;
  appointment_id?: string;
  payment_id?: string;
  created_at: string;
  sent_at?: string;
}

export interface NotificationDisplay {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionUrl: string;
  icon: string;
}

const notificationConfig: Record<
  NotificationType,
  {
    title: string;
    icon: string;
    getUrl: (id?: string) => string;
  }
> = {
  new_inquiry: {
    title: "New Visitor Inquiry",
    icon: "📋",
    getUrl: () => "/admin?tab=inquiries",
  },
  new_client_inquiry: {
    title: "New Client Project Inquiry",
    icon: "🎯",
    getUrl: () => "/admin?tab=inquiries",
  },
  inquiry_status_change: {
    title: "Inquiry Status Updated",
    icon: "✅",
    getUrl: (id) => `/admin?tab=inquiries&id=${id}`,
  },
  appointment_scheduled: {
    title: "Appointment Scheduled",
    icon: "📅",
    getUrl: () => "/dashboard",
  },
  payment_received: {
    title: "Payment Received",
    icon: "💰",
    getUrl: () => "/dashboard",
  },
  other: {
    title: "Notification",
    icon: "🔔",
    getUrl: () => "/dashboard",
  },
};

export const getNotificationConfig = (type: NotificationType) => {
  return notificationConfig[type] || notificationConfig.other;
};

export const formatNotificationTime = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString();
};
