"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { formatNotificationTime } from "@/utils/notifications";
import { useAuth } from "@/hooks/useAuth";

interface ClientNotification {
  id: string;
  user_id: string;
  inquiry_id: string;
  type: string;
  title: string;
  message?: string;
  read: boolean;
  action_url?: string;
  created_at: string;
  updated_at: string;
}

interface ClientNotificationsProps {
  selectedNotificationId?: string | null;
}

export function ClientNotifications({
  selectedNotificationId,
}: ClientNotificationsProps) {
  const supabase = createClient();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    ClientNotification[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "read">(
    "all"
  );

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("client_notifications")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, supabase]);

  const applyFilter = useCallback(() => {
    let filtered = [...notifications];

    if (activeFilter === "unread") {
      filtered = filtered.filter((n) => !n.read);
    } else if (activeFilter === "read") {
      filtered = filtered.filter((n) => n.read);
    }

    setFilteredNotifications(filtered);
  }, [notifications, activeFilter]);

  const getEmptyStateMessage = () => {
    if (activeFilter === "all") {
      return "No notifications yet";
    }
    if (activeFilter === "unread") {
      return "No unread notifications";
    }
    return "No read notifications";
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 animate-spin" />
              <span className="text-muted-foreground">
                Loading notifications...
              </span>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (filteredNotifications.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground">{getEmptyStateMessage()}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={`transition-all hover:shadow-md ${
              !notification.read
                ? "border-l-4 border-l-primary bg-muted/20"
                : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-full bg-primary/10">📢</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    {notification.message && (
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatNotificationTime(notification.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {notification.read ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsUnread(notification.id)}
                      title="Mark as unread"
                    >
                      <EyeOff className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                    title="Delete notification"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  };

  // Mark selected notification as read when component loads
  useEffect(() => {
    if (selectedNotificationId && notifications.length > 0) {
      const notification = notifications.find(
        (n) => n.id === selectedNotificationId
      );
      if (notification && !notification.read) {
        markAsRead(selectedNotificationId);
      }
    }
  }, [selectedNotificationId]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("client_notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAsUnread = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("client_notifications")
        .update({ read: false })
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, read: false } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as unread:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("client_notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications(notifications.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);

      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from("client_notifications")
        .update({ read: true })
        .in("id", unreadIds);

      if (error) throw error;

      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">
            Updates and messages from your account manager
          </p>
        </div>
        {notifications.length > 0 && (
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filters */}
      <Tabs
        value={activeFilter}
        onValueChange={(v) => setActiveFilter(v as "all" | "unread" | "read")}
      >
        <TabsList>
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="read">
            Read ({notifications.length - unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter} className="space-y-4">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
