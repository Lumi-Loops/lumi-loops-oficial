"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle, Clock, RotateCw } from "lucide-react";

interface NotificationQueueItem {
  id: string;
  response_id: string;
  recipient_user_id: string;
  notification_type: string;
  status: "queued" | "sending" | "sent" | "failed";
  retry_count: number;
  max_retries: number;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

const statusIcons: Record<string, JSX.Element> = {
  queued: <Clock className="w-4 h-4" />,
  sending: <RotateCw className="w-4 h-4 animate-spin" />,
  sent: <CheckCircle className="w-4 h-4" />,
  failed: <AlertCircle className="w-4 h-4" />,
};

const statusColors: Record<string, string> = {
  queued: "bg-blue-100 text-blue-800",
  sending: "bg-purple-100 text-purple-800",
  sent: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

export function NotificationQueueAdmin() {
  const supabase = createClient();
  const [items, setItems] = useState<NotificationQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [stats, setStats] = useState({
    queued: 0,
    sending: 0,
    sent: 0,
    failed: 0,
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("admin_notifications_queue")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase error:", error.message || error);
        throw error;
      }

      setItems(data || []);

      const newStats = {
        queued: 0,
        sending: 0,
        sent: 0,
        failed: 0,
      };

      (data || []).forEach((item) => {
        if (item.status in newStats) {
          newStats[item.status as keyof typeof newStats]++;
        }
      });

      setStats(newStats);
    } catch (error: any) {
      console.error("Error fetching notifications:", error?.message || error);
      setItems([]);
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
  }, [filterStatus]);

  const retryNotification = async (itemId: string) => {
    try {
      await supabase
        .from("admin_notifications_queue")
        .update({
          status: "queued",
          retry_count: 0,
          error_message: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", itemId);

      fetchNotifications();
    } catch (error) {
      console.error("Error retrying notification:", error);
    }
  };

  const skipNotification = async (itemId: string) => {
    try {
      await supabase
        .from("admin_notifications_queue")
        .update({
          status: "failed",
          error_message: "Omitida por admin",
          updated_at: new Date().toISOString(),
        })
        .eq("id", itemId);

      fetchNotifications();
    } catch (error) {
      console.error("Error skipping notification:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Queue</CardTitle>
        <CardDescription>
          Manage email notifications and delivery status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4 space-y-1">
            <div className="text-sm font-medium text-gray-600">Queued</div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.queued}
            </div>
          </div>
          <div className="border rounded-lg p-4 space-y-1">
            <div className="text-sm font-medium text-gray-600">Sending</div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.sending}
            </div>
          </div>
          <div className="border rounded-lg p-4 space-y-1">
            <div className="text-sm font-medium text-gray-600">Sent</div>
            <div className="text-2xl font-bold text-green-600">
              {stats.sent}
            </div>
          </div>
          <div className="border rounded-lg p-4 space-y-1">
            <div className="text-sm font-medium text-gray-600">Failed</div>
            <div className="text-2xl font-bold text-red-600">
              {stats.failed}
            </div>
          </div>
        </div>

        <div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="queued">Queued</SelectItem>
              <SelectItem value="sending">Sending</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Retries</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No notifications found
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {statusIcons[item.status]}
                        <Badge className={statusColors[item.status]}>
                          {item.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.notification_type}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {item.recipient_user_id.substring(0, 12)}...
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.retry_count} / {item.max_retries}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(item.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {item.status === "failed" &&
                          item.retry_count < item.max_retries && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => retryNotification(item.id)}
                              title="Retry"
                            >
                              Retry
                            </Button>
                          )}
                        {item.status !== "sent" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => skipNotification(item.id)}
                            title="Skip"
                          >
                            Skip
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {items.some((item) => item.error_message) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
            <div className="font-medium text-red-900">
              Mensajes de Error Recientes:
            </div>
            {items
              .filter((item) => item.error_message)
              .slice(0, 3)
              .map((item) => (
                <div key={item.id} className="text-sm text-red-800">
                  <span className="font-mono text-xs">
                    {item.id.substring(0, 8)}...
                  </span>
                  : {item.error_message}
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
