"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Tabs components removed - not currently used in this component
import {
  formatDateTime,
  getStatusConfig,
  inquiryStatusConfigAdvanced,
} from "@/utils/inquiry-status";
import { AlertCircle, Loader2 } from "lucide-react";

type InquiryType = "visitor" | "client";

interface UnifiedInquiry {
  id: string;
  type: InquiryType;
  name?: string; // visitor only
  email: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  platforms?: string[];
  goal?: string;
  budget_range?: string;
  user_id?: string; // client inquiries only
}

export function AdminInquiriesManagement() {
  const supabase = createClient();
  const [inquiries, setInquiries] = useState<UnifiedInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<UnifiedInquiry[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<"all" | InquiryType>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, selectedStatus, inquiries]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);

      // Fetch visitor inquiries
      const { data: visitorData, error: visitorError } = await supabase
        .from("visitor_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      // Fetch client inquiries
      const { data: clientData, error: clientError } = await supabase
        .from("client_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (visitorError) {
        console.error("Error fetching visitor inquiries:", visitorError);
      }
      if (clientError) {
        console.error("Error fetching client inquiries:", clientError);
      }

      const visitorInquiries: UnifiedInquiry[] = (visitorData || []).map(
        (item) => ({
          ...item,
          type: "visitor" as const,
          email: item.email,
        })
      );

      const clientInquiries: UnifiedInquiry[] = (clientData || []).map(
        (item) => ({
          ...item,
          type: "client" as const,
          email: "", // clients don't have email field in client_inquiries
        })
      );

      setInquiries([...visitorInquiries, ...clientInquiries]);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...inquiries];

    if (selectedType !== "all") {
      filtered = filtered.filter((i) => i.type === selectedType);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((i) => i.status === selectedStatus);
    }

    setFilteredInquiries(filtered);
  };

  const updateInquiryStatus = async (
    inquiryId: string,
    newStatus: string,
    type: InquiryType
  ) => {
    try {
      setUpdatingId(inquiryId);
      const tableName =
        type === "visitor" ? "visitor_inquiries" : "client_inquiries";

      const { error } = await supabase
        .from(tableName)
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", inquiryId);

      if (error) throw error;

      // If it's a client inquiry, create a notification for the client
      if (type === "client") {
        const inquiry = inquiries.find((i) => i.id === inquiryId);
        if (inquiry) {
          await createClientNotification(
            inquiry.user_id || "",
            inquiryId,
            newStatus
          );
          // Also send email
          await sendStatusChangeEmail(inquiry.user_id || "", newStatus);
        }
      }

      // Update local state
      setInquiries(
        inquiries.map((i) =>
          i.id === inquiryId ? { ...i, status: newStatus } : i
        )
      );
    } catch (error) {
      console.error("Error updating inquiry status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const sendStatusChangeEmail = async (userId: string, newStatus: string) => {
    try {
      // Get client email and name
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", userId)
        .single();

      if (!profile?.email) return;

      // Send email via API
      const response = await fetch("/api/send-inquiry-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          clientEmail: profile.email,
          clientName: profile.full_name || profile.email.split("@")[0],
          status: newStatus,
        }),
      });

      if (!response.ok) {
        console.error("Failed to send email");
      }
    } catch (err) {
      console.error("Error in sendStatusChangeEmail:", err);
    }
  };

  const createClientNotification = async (
    userId: string,
    inquiryId: string,
    newStatus: string
  ) => {
    try {
      const statusMessages: Record<string, { title: string; message: string }> =
        {
          viewed: {
            title: "Your inquiry has been reviewed",
            message: "Our team has reviewed your project inquiry",
          },
          "in-progress": {
            title: "We're working on your project",
            message: "Your inquiry is now in progress",
          },
          responded: {
            title: "We've sent you a response",
            message: "Check your email for our detailed response",
          },
          scheduled: {
            title: "Meeting scheduled",
            message: "Your meeting has been scheduled. Check your calendar",
          },
          completed: {
            title: "Your project is complete",
            message: "Your project has been completed successfully",
          },
          rejected: {
            title: "Update on your inquiry",
            message: "We've sent you an update on your inquiry",
          },
        };

      const notifContent = statusMessages[newStatus] || {
        title: "Your inquiry status has been updated",
        message: `Your inquiry status is now: ${newStatus}`,
      };

      const { error } = await supabase.from("client_notifications").insert({
        user_id: userId,
        inquiry_id: inquiryId,
        type: "status_change",
        title: notifContent.title,
        message: notifContent.message,
        action_url: "/dashboard?tab=inquiries",
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error creating client notification:", error);
      }
    } catch (err) {
      console.error("Error in createClientNotification:", err);
    }
  };

  const statusOptions = Object.entries(inquiryStatusConfigAdvanced).map(
    ([key, value]) => ({
      value: key,
      label: value.label,
    })
  );

  const renderResults = () => {
    if (loading) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading inquiries...</p>
          </CardContent>
        </Card>
      );
    }

    if (filteredInquiries.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground">No inquiries found</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {filteredInquiries.map((inquiry) => {
          const statusConfig = getStatusConfig(inquiry.status);
          const StatusIcon = statusConfig.icon;

          return (
            <Card
              key={inquiry.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  {/* Info */}
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                      {inquiry.type === "visitor" ? "Visitor" : "Client"}
                    </h3>
                    <p className="font-medium">
                      {inquiry.name || "Project Inquiry"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {inquiry.email}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                      Status
                    </h3>
                    <Badge
                      className={`${statusConfig.bgColor} ${statusConfig.textColor}`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>

                  {/* Date/Time */}
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                      Received
                    </h3>
                    <p className="text-sm font-mono">
                      {formatDateTime(inquiry.created_at)}
                    </p>
                  </div>

                  {/* Details */}
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                      Details
                    </h3>
                    <div className="space-y-1 text-sm">
                      {inquiry.goal && <p>Goal: {inquiry.goal}</p>}
                      {inquiry.budget_range && (
                        <p>Budget: {inquiry.budget_range}</p>
                      )}
                      {inquiry.platforms && inquiry.platforms.length > 0 && (
                        <p>Platforms: {inquiry.platforms.join(", ")}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message */}
                {inquiry.message && (
                  <div className="mb-4 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm text-foreground">{inquiry.message}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground mr-auto">
                    Update Status:
                  </span>
                  <Select
                    value={inquiry.status}
                    onValueChange={(newStatus) =>
                      updateInquiryStatus(inquiry.id, newStatus, inquiry.type)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {updatingId === inquiry.id && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Inquiry Management</h2>
        <p className="text-muted-foreground">
          Manage visitor and client inquiries in one place
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🔍 Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Type</label>
            <Select
              value={selectedType}
              onValueChange={(v) => setSelectedType(v as "all" | InquiryType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="visitor">Visitors</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedType("all");
                setSelectedStatus("all");
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {renderResults()}
    </div>
  );
}
