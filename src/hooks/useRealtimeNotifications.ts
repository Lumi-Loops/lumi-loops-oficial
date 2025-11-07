import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export interface NotificationData {
  id: string;
  notification_type?: string;
  type?: string;
  read?: boolean;
  created_at: string;
  [key: string]: any;
}

export function useRealtimeNotifications(
  userId: string | undefined,
  userRole: string | null,
  onNewNotification?: () => void
) {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  // lastFetch state removed - not currently used
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const realtimeChannelRef = useRef<any>(null);

  // Determine which table and filter based on role
  const getQueryConfig = useCallback(() => {
    if (userRole === "admin") {
      return {
        table: "admin_inquiry_notifications",
        filter: `admin_user_id=eq.${userId}`,
        column: "admin_user_id",
      };
    } else {
      return {
        table: "client_notifications",
        filter: `user_id=eq.${userId}`,
        column: "user_id",
      };
    }
  }, [userId, userRole]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      const config = getQueryConfig();
      const { data, error } = await supabase
        .from(config.table)
        .select("*")
        .eq(config.column, userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      const newCount = (data || []).filter((n) => !n.read).length;
      const oldCount = notifications.filter((n) => !n.read).length;

      // If new unread notifications, trigger callback
      if (newCount > oldCount && onNewNotification) {
        onNewNotification();
      }

      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [
    userId,
    userRole,
    supabase,
    getQueryConfig,
    notifications,
    onNewNotification,
  ]);

  // Setup polling (every 5 seconds)
  useEffect(() => {
    if (!userId || !userRole) return;

    // Fetch immediately
    fetchNotifications();

    // Set up polling
    pollingIntervalRef.current = setInterval(() => {
      fetchNotifications();
    }, 5000); // Poll every 5 seconds

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [userId, userRole, fetchNotifications]);

  // Try to setup Realtime as a bonus (may not work on Cloudflare)
  useEffect(() => {
    if (!userId || !userRole) return;

    const setupRealtime = async () => {
      try {
        const config = getQueryConfig();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const channel = (supabase as any)
          .channel(`notifications:${userId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: config.table,
              filter: config.filter,
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (payload: any) => {
              console.info("Realtime update received:", payload);
              // Refetch on any change
              fetchNotifications();
              onNewNotification?.();
            }
          )
          .subscribe((status: string) => {
            console.info("Realtime channel status:", status);
          });

        realtimeChannelRef.current = channel;
      } catch (err) {
        console.warn("Realtime setup failed (expected on Cloudflare):", err);
      }
    };

    setupRealtime();

    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, [
    userId,
    userRole,
    getQueryConfig,
    supabase,
    fetchNotifications,
    onNewNotification,
  ]);

  return { notifications, refetch: fetchNotifications };
}
