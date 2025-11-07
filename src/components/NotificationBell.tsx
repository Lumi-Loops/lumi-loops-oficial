"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { formatNotificationTime } from "@/utils/notifications";
import { useNotificationSound } from "@/hooks/useNotificationSound";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

// ClientNotif interface removed - not used, using NotificationData from hook instead

export function NotificationBell() {
  const supabase = createClient();
  const router = useRouter();
  const { playSound } = useNotificationSound();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setUserRole(data?.role || null);
      }
      setLoading(false);
    };
    checkUser();
  }, [supabase]);

  // Use robust hook with polling + realtime fallback
  const { notifications, refetch } = useRealtimeNotifications(
    user?.id,
    userRole,
    playSound // Callback to play sound on new notification
  );

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = async (notification: {
    id: string;
    read?: boolean;
    response_id?: string;
    inquiry_id?: string;
    visitor_inquiry_id?: string;
    notification_type?: string;
    action_url?: string;
    title?: string;
    message?: string;
  }) => {
    try {
      // Determine if it's a client or admin notification based on user role
      const isClientNotif = userRole !== "admin";
      const table = isClientNotif
        ? "client_notifications"
        : "admin_inquiry_notifications";

      // Mark as read
      await supabase
        .from(table)
        .update({ read: true })
        .eq("id", notification.id);

      // Navigate
      if (isClientNotif) {
        // For client notifications, navigate to client dashboard with notifications tab and notification id
        router.push(
          notification.action_url ||
            `/dashboard?tab=notifications&id=${notification.id}`
        );
      } else {
        // For admin inquiry notifications, navigate to the inquiry
        // Support both client and visitor inquiries
        const inquiryId =
          notification.inquiry_id ||
          notification.visitor_inquiry_id ||
          notification.response_id;
        if (inquiryId) {
          router.push(`/admin?tab=inquiries&id=${inquiryId}`);
        }
      }

      setIsOpen(false);
      // Refresh to update unread count
      refetch();
    } catch (err) {
      console.error("Error handling notification:", err);
    }
  };

  const renderNotificationContent = () => {
    if (loading) {
      return (
        <div className="p-4 text-center text-sm text-muted-foreground">
          Loading...
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="p-4 text-center text-sm text-muted-foreground">
          No notifications
        </div>
      );
    }

    return (
      <>
        {notifications.map((notification) => {
          // Determine if it's a client or admin notification based on user role
          const isClientNotif = userRole !== "admin";
          const isUnread = !notification.read;
          let title = "";
          let subtitle = "";
          let icon = "🔔";

          if (isClientNotif) {
            title = notification.title || "Notification";
            subtitle = notification.message || "";
            icon = "📢";
          } else {
            // For admin inquiry notifications, use title and message directly
            title = notification.title || "New Inquiry";
            subtitle = notification.message || "";
            icon = "📋"; // Inquiry icon for admin
          }

          return (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start cursor-pointer py-3 px-3 hover:bg-muted/80 ${
                isUnread ? "bg-muted/50" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-2 w-full">
                <span className="text-lg mt-0.5">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">{title}</p>
                    {isUnread && (
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  {subtitle && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                      {subtitle}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatNotificationTime(notification.created_at)}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="justify-center text-sm text-primary cursor-pointer py-2"
          onClick={() => {
            // Navigate based on user role
            if (userRole === "admin") {
              router.push("/admin?tab=notifications");
            } else {
              router.push("/dashboard?tab=notifications");
            }
            setIsOpen(false);
          }}
        >
          View all notifications
        </DropdownMenuItem>
      </>
    );
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          title="Notifications"
        >
          <Bell
            className={`h-5 w-5 transition-all ${
              unreadCount > 0 ? "animate-bounce text-yellow-500" : ""
            }`}
          />
          {unreadCount > 0 && (
            <Badge
              className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold animate-pulse"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="default" className="text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {renderNotificationContent()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
