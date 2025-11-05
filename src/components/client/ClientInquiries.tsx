"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  business_name: string | null;
  message: string | null;
  status: "new" | "responded" | "scheduled" | "in-progress" | "completed";
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  new: { label: "New", variant: "default" as const },
  responded: { label: "Responded", variant: "secondary" as const },
  scheduled: { label: "Scheduled", variant: "secondary" as const },
  "in-progress": { label: "In Progress", variant: "secondary" as const },
  completed: { label: "Completed", variant: "secondary" as const },
};

export function ClientInquiries() {
  const supabase = createClient();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        const { data: session } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        const { data, error } = await supabase
          .from("visitor_inquiries")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setInquiries(data || []);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, [supabase]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Inquiries</h2>
        <p className="text-muted-foreground">
          Track the status of your inquiries and requests
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Loading inquiries...
          </CardContent>
        </Card>
      ) : inquiries.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground">No inquiries yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <Card
              key={inquiry.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{inquiry.name}</h3>
                      <Badge variant={statusConfig[inquiry.status].variant}>
                        {statusConfig[inquiry.status].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {inquiry.email}
                    </p>
                    {inquiry.business_name && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {inquiry.business_name}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {new Date(inquiry.created_at).toLocaleDateString()}
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
                    Last updated:{" "}
                    {new Date(inquiry.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
