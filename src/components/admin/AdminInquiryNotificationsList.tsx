"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, Eye, EyeOff, Trash2 } from "lucide-react";
import { formatNotificationTime } from "@/utils/notifications";
import { useRouter } from "next/navigation";

interface AdminInquiryNotification {
  id: string;
  admin_user_id: string;
  inquiry_id: string;
  inquiry_type: string;
  title: string;
  message: string | null;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export function AdminInquiryNotificationsList() {
  const supabase = createClient();
  const router = useRouter();
  const [notifications, setNotifications] = useState<
    AdminInquiryNotification[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filterRead, setFilterRead] = useState<"all" | "read" | "unread">(
    "all"
  );

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("admin_inquiry_notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkAsRead = async (id: string, currentRead: boolean) => {
    try {
      await supabase
        .from("admin_inquiry_notifications")
        .update({ read: !currentRead })
        .eq("id", id);
      fetchNotifications();
    } catch (err) {
      console.error("Error updating notification:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from("admin_inquiry_notifications").delete().eq("id", id);
      fetchNotifications();
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const handleNavigateToInquiry = (inquiryId: string) => {
    router.push(`/admin?tab=inquiries&id=${inquiryId}`);
  };

  const getFilteredNotifications = () => {
    if (filterRead === "all") return notifications;
    if (filterRead === "read") return notifications.filter((n) => n.read);
    return notifications.filter((n) => !n.read);
  };

  const filtered = getFilteredNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  const renderContent = () => {
    if (loading) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading notifications...</p>
          </CardContent>
        </Card>
      );
    }

    if (filtered.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground">
              {filterRead === "all" && "No notifications found"}
              {filterRead === "read" && "No read notifications"}
              {filterRead === "unread" && "No unread notifications"}
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {filtered.map((notification) => (
          <Card
            key={notification.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              !notification.read
                ? "border-l-4 border-l-primary bg-muted/20"
                : ""
            }`}
            onClick={() => handleNavigateToInquiry(notification.inquiry_id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <Badge variant="destructive" className="h-5 px-2 text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  {notification.message && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatNotificationTime(notification.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification.id, notification.read);
                    }}
                    title={
                      notification.read ? "Mark as unread" : "Mark as read"
                    }
                  >
                    {notification.read ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.id);
                    }}
                    title="Delete"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Inquiry Notifications</h2>
        <p className="text-muted-foreground">
          Notifications for new client inquiries
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Total
            </div>
            <div className="text-2xl font-bold mt-1">
              {notifications.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Unread
            </div>
            <div className="text-2xl font-bold mt-1 text-primary">
              {unreadCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">
              Read
            </div>
            <div className="text-2xl font-bold mt-1 text-muted-foreground">
              {readCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      {notifications.length > 0 && (
        <div className="flex gap-2 border-b">
          {[
            { value: "all" as const, label: "All" },
            { value: "unread" as const, label: `Unread (${unreadCount})` },
            { value: "read" as const, label: `Read (${readCount})` },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterRead(tab.value)}
              className={`pb-2 px-2 font-medium text-sm transition-colors ${
                filterRead === tab.value
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {renderContent()}
    </div>
  );
}
