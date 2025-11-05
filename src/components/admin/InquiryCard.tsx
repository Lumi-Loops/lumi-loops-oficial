"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, MessageSquare } from "lucide-react";
import { InquiryStatus } from "@/types/inquiry";

interface InquiryCardProps {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  businessName?: string;
  message?: string;
  contentType?: string[];
  platforms?: string[];
  goal?: string;
  budgetRange?: string;
  contactPreference?: string;
  status: InquiryStatus;
  createdAt: string;
  onRespond?: () => void;
  onSchedule?: () => void;
  onClose?: () => void;
  compact?: boolean;
}

const statusConfig: Record<
  InquiryStatus,
  { label: string; variant: "default" | "secondary" | "outline"; color: string }
> = {
  new: {
    label: "New",
    variant: "default",
    color: "bg-blue-100 text-blue-800",
  },
  viewed: {
    label: "Viewed",
    variant: "secondary",
    color: "bg-cyan-100 text-cyan-800",
  },
  responded: {
    label: "Responded",
    variant: "secondary",
    color: "bg-purple-100 text-purple-800",
  },
  scheduled: {
    label: "Scheduled",
    variant: "secondary",
    color: "bg-green-100 text-green-800",
  },
  "in-progress": {
    label: "In Progress",
    variant: "secondary",
    color: "bg-orange-100 text-orange-800",
  },
  rejected: {
    label: "Rejected",
    variant: "outline",
    color: "bg-red-100 text-red-800",
  },
  completed: {
    label: "Completed",
    variant: "secondary",
    color: "bg-emerald-100 text-emerald-800",
  },
  closed: {
    label: "Closed",
    variant: "outline",
    color: "bg-gray-100 text-gray-800",
  },
};

export function InquiryCard({
  _id,
  name,
  email,
  businessName,
  message,
  contentType,
  platforms,
  goal,
  budgetRange,
  contactPreference,
  status,
  createdAt,
  onRespond,
  onSchedule,
  onClose,
  compact = false,
}: InquiryCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground truncate">
                  {name}
                </h3>
                <Badge variant={statusConfig[status].variant}>
                  {statusConfig[status].label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">{email}</p>
              {businessName && (
                <p className="text-xs text-muted-foreground mt-1">
                  {businessName}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {formattedDate}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              {status === "new" && onRespond && (
                <Button size="sm" variant="default" onClick={onRespond}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
              )}
              {onSchedule && (
                <Button size="sm" variant="outline" onClick={onSchedule}>
                  <Calendar className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{email}</CardDescription>
          </div>
          <Badge variant={statusConfig[status].variant}>
            {statusConfig[status].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-3">
          {businessName && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Business
              </p>
              <p className="text-sm text-foreground">{businessName}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              Submitted
            </p>
            <p className="text-sm text-foreground">{formattedDate}</p>
          </div>
        </div>

        {/* Content & Platforms */}
        <div className="grid grid-cols-2 gap-4">
          {contentType && contentType.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Content Type
              </p>
              <div className="flex flex-wrap gap-1">
                {contentType.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {platforms && platforms.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Platforms
              </p>
              <div className="flex flex-wrap gap-1">
                {platforms.map((platform) => (
                  <Badge key={platform} variant="secondary" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Goals & Budget */}
        <div className="grid grid-cols-2 gap-4">
          {goal && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Goal
              </p>
              <p className="text-sm text-foreground">{goal}</p>
            </div>
          )}
          {budgetRange && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Budget
              </p>
              <p className="text-sm text-foreground">{budgetRange}</p>
            </div>
          )}
        </div>

        {/* Contact Preference */}
        {contactPreference && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              Preferred Contact
            </p>
            <p className="text-sm text-foreground">{contactPreference}</p>
          </div>
        )}

        {/* Message */}
        {message && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Message
            </p>
            <p className="text-sm text-foreground bg-muted/50 p-3 rounded-md">
              {message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-border">
          {status === "new" && onRespond && (
            <Button onClick={onRespond} className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Respond
            </Button>
          )}
          {onSchedule && (
            <Button onClick={onSchedule} variant="outline" className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Call
            </Button>
          )}
          {onClose && status !== "closed" && (
            <Button onClick={onClose} variant="ghost" className="flex-1">
              Mark Closed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
