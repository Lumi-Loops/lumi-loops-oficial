import {
  AlertCircle,
  Archive,
  CheckCircle,
  Clock,
  Eye,
  LucideIcon,
  XCircle,
} from "lucide-react";

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: LucideIcon;
  description: string;
}

export const inquiryStatusConfigAdvanced: Record<string, StatusConfig> = {
  new: {
    label: "New",
    color: "bg-blue-500",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    icon: AlertCircle,
    description: "Just received, waiting for review",
  },
  viewed: {
    label: "Viewed",
    color: "bg-purple-500",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    icon: Eye,
    description: "Admin has reviewed this inquiry",
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-orange-500",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    icon: Clock,
    description: "Currently being worked on",
  },
  responded: {
    label: "Responded",
    color: "bg-green-500",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    icon: CheckCircle,
    description: "Response sent to client",
  },
  scheduled: {
    label: "Scheduled",
    color: "bg-cyan-500",
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-700",
    icon: Clock,
    description: "Meeting or follow-up scheduled",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-500",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    icon: XCircle,
    description: "Not a good fit",
  },
  completed: {
    label: "Completed",
    color: "bg-emerald-500",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    icon: CheckCircle,
    description: "Project completed successfully",
  },
  closed: {
    label: "Closed",
    color: "bg-gray-500",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    icon: Archive,
    description: "Archived/Closed",
  },
};

export const getStatusConfig = (status: string): StatusConfig => {
  return (
    inquiryStatusConfigAdvanced[status] || inquiryStatusConfigAdvanced["new"]
  );
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  const dateStr = d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeStr = d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateStr} ${timeStr}`;
};
