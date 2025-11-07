"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus } from "lucide-react";
import { ClientInquiry } from "@/types/inquiry";
import { formatDateTime, getStatusConfig } from "@/utils/inquiry-status";
import { useAuth } from "@/hooks/useAuth";
import { ClientNewInquirySheet } from "./ClientNewInquirySheet";

type UnifiedClientInquiry = {
  id: string;
  status: ClientInquiry["status"];
  created_at: string;
  updated_at: string;
  message: string | null;
  goal: string | null;
  budget_range: string | null;
  platforms: string[] | null;
  source: "client" | "visitor";
};

export function ClientInquiries() {
  const supabase = createClient();
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<UnifiedClientInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewInquirySheet, setShowNewInquirySheet] = useState(false);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        if (!user?.id) return;

        // Fetch client inquiries
        const { data: clientData, error: clientError } = await supabase
          .from("client_inquiries")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (clientError) throw clientError;

        const mappedClient: UnifiedClientInquiry[] = (clientData || []).map(
          (ci) => ({
            id: ci.id,
            status: ci.status,
            created_at: ci.created_at,
            updated_at: ci.updated_at,
            message: ci.message,
            goal: ci.goal,
            budget_range: ci.budget_range,
            platforms: ci.platforms,
            source: "client",
          })
        );

        // Fetch linked visitor inquiries
        const { data: visitorData, error: visitorError } = await supabase
          .from("visitor_inquiries")
          .select(
            "id, status, created_at, updated_at, message, goal, budget_range, platforms, linked_user_id"
          )
          .eq("linked_user_id", user.id)
          .order("created_at", { ascending: false });

        if (visitorError) throw visitorError;

        const mappedVisitor: UnifiedClientInquiry[] = (visitorData || []).map(
          (vi) => ({
            id: vi.id,
            status: vi.status,
            created_at: vi.created_at,
            updated_at: vi.updated_at,
            message: vi.message,
            goal: vi.goal,
            budget_range: vi.budget_range,
            platforms: vi.platforms,
            source: "visitor",
          })
        );

        // Combine and sort by created_at desc
        const combined = [...mappedVisitor, ...mappedClient].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setInquiries(combined);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchInquiries();
    }
  }, [supabase, user?.id]);

  const renderContent = () => {
    if (loading) {
      return (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Loading inquiries...
          </CardContent>
        </Card>
      );
    }

    if (inquiries.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground">No inquiries yet</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {inquiries.map((inquiry) => {
          const statusConfig = getStatusConfig(inquiry.status);
          const StatusIcon = statusConfig.icon;

          return (
            <Card
              key={inquiry.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">Project Inquiry</h3>
                      <Badge
                        className={`${statusConfig.bgColor} ${statusConfig.textColor}`}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                      {/* Source indicator */}
                      {inquiry.source === "visitor" && (
                        <Badge variant="secondary" className="ml-2">
                          Linked from Visitor
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {statusConfig.description}
                    </p>
                    {inquiry.goal && (
                      <p className="text-sm text-muted-foreground">
                        Goal: {inquiry.goal}
                      </p>
                    )}
                    {inquiry.budget_range && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Budget: {inquiry.budget_range}
                      </p>
                    )}
                    {inquiry.platforms && inquiry.platforms.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Platforms: {inquiry.platforms.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground font-mono">
                      {formatDateTime(inquiry.created_at)}
                    </p>
                  </div>
                </div>

                {inquiry.message && (
                  <div className="mb-4">
                    <p className="text-sm text-foreground bg-muted/50 p-3 rounded-md">
                      {inquiry.message}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <p className="text-xs text-muted-foreground">
                    Last updated: {formatDateTime(inquiry.updated_at)}
                  </p>
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Inquiries</h2>
          <p className="text-muted-foreground">
            Track the status of your inquiries and requests
          </p>
        </div>
        <Button onClick={() => setShowNewInquirySheet(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Inquiry
        </Button>
      </div>

      <ClientNewInquirySheet
        isOpen={showNewInquirySheet}
        onClose={() => setShowNewInquirySheet(false)}
        onSuccess={() => {
          // Refresh inquiries list
          const refetch = async () => {
            try {
              if (!user?.id) return;
              // Reuse the same combined fetch logic
              const { data: clientData } = await supabase
                .from("client_inquiries")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });
              const mappedClient: UnifiedClientInquiry[] = (
                clientData || []
              ).map((ci) => ({
                id: ci.id,
                status: ci.status,
                created_at: ci.created_at,
                updated_at: ci.updated_at,
                message: ci.message,
                goal: ci.goal,
                budget_range: ci.budget_range,
                platforms: ci.platforms,
                source: "client",
              }));

              const { data: visitorData } = await supabase
                .from("visitor_inquiries")
                .select(
                  "id, status, created_at, updated_at, message, goal, budget_range, platforms, linked_user_id"
                )
                .eq("linked_user_id", user.id)
                .order("created_at", { ascending: false });
              const mappedVisitor: UnifiedClientInquiry[] = (
                visitorData || []
              ).map((vi) => ({
                id: vi.id,
                status: vi.status,
                created_at: vi.created_at,
                updated_at: vi.updated_at,
                message: vi.message,
                goal: vi.goal,
                budget_range: vi.budget_range,
                platforms: vi.platforms,
                source: "visitor",
              }));

              const combined = [...mappedVisitor, ...mappedClient].sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              );

              setInquiries(combined);
            } catch (error) {
              console.error("Error fetching inquiries:", error);
            }
          };
          refetch();
        }}
      />
      {renderContent()}
    </div>
  );
}
