"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InquiryCard } from "./InquiryCard";
import { AdminInquiryResponse } from "./AdminInquiryResponse";
import { AlertCircle, Filter } from "lucide-react";
import { Inquiry, InquiryStatus } from "@/types/inquiry";

type StatusFilter = "all" | InquiryStatus;

export function AdminInquiries() {
  const supabase = createClient();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [stats, setStats] = useState({
    new: 0,
    responded: 0,
    scheduled: 0,
    "in-progress": 0,
    completed: 0,
    closed: 0,
    total: 0,
  });

  useEffect(() => {
    fetchInquiries();
    // Poll for new inquiries every 30 seconds
    const interval = setInterval(() => {
      fetchInquiries();
    }, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const query = supabase
        .from("visitor_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching inquiries:", error);
        return;
      }

      setInquiries(data || []);

      // Calculate stats
      const newStats = {
        new: 0,
        responded: 0,
        scheduled: 0,
        "in-progress": 0,
        completed: 0,
        closed: 0,
        total: data?.length || 0,
      };

      (data || []).forEach((inquiry) => {
        if (inquiry.status in newStats) {
          newStats[inquiry.status as keyof typeof newStats]++;
        }
      });

      setStats(newStats);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (
    inquiryId: string,
    newStatus: Inquiry["status"]
  ) => {
    try {
      const { error } = await supabase
        .from("visitor_inquiries")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", inquiryId);

      if (error) throw error;

      // Update local state
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === inquiryId ? { ...inq, status: newStatus } : inq
        )
      );

      fetchInquiries();
    } catch (error) {
      console.error("Error updating inquiry status:", error);
    }
  };

  const filteredInquiries = inquiries.filter(
    (inquiry) => statusFilter === "all" || inquiry.status === statusFilter
  );

  const handleRespond = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setShowResponseModal(true);
  };

  const handleScheduleCall = (inquiry: Inquiry) => {
    // This would open a calendar/scheduling interface
    // For now, we'll just mark it as scheduled
    updateInquiryStatus(inquiry.id, "scheduled");
  };

  const handleClosedInquiry = (inquiry: Inquiry) => {
    updateInquiryStatus(inquiry.id, "closed");
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total
            </p>
            <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-medium text-blue-600">New</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              {stats.new}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-medium text-purple-600">
              Responded
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">
              {stats.responded}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-medium text-green-600">
              Scheduled
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              {stats.scheduled}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              Closed
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-600">
              {stats.closed}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Inquiries</SelectItem>
            <SelectItem value="new">New ({stats.new})</SelectItem>
            <SelectItem value="responded">
              Responded ({stats.responded})
            </SelectItem>
            <SelectItem value="scheduled">
              Scheduled ({stats.scheduled})
            </SelectItem>
            <SelectItem value="in-progress">
              In Progress ({stats["in-progress"]})
            </SelectItem>
            <SelectItem value="completed">
              Completed ({stats.completed})
            </SelectItem>
            <SelectItem value="closed">Closed ({stats.closed})</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchInquiries}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {loading && filteredInquiries.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading inquiries...</p>
            </CardContent>
          </Card>
        )}
        {!loading && filteredInquiries.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground">No inquiries found</p>
            </CardContent>
          </Card>
        )}
        {filteredInquiries.length > 0 && (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => (
              <InquiryCard
                key={inquiry.id}
                id={inquiry.id}
                name={inquiry.name}
                email={inquiry.email}
                businessName={inquiry.business_name || undefined}
                message={inquiry.message || undefined}
                contentType={inquiry.content_type || undefined}
                platforms={inquiry.platforms || undefined}
                goal={inquiry.goal || undefined}
                budgetRange={inquiry.budget_range || undefined}
                contactPreference={inquiry.contact_preference || undefined}
                status={inquiry.status}
                createdAt={inquiry.created_at}
                onRespond={() => handleRespond(inquiry)}
                onSchedule={() => handleScheduleCall(inquiry)}
                onClose={() => handleClosedInquiry(inquiry)}
                compact
              />
            ))}
          </div>
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedInquiry && (
        <AdminInquiryResponse
          inquiry={selectedInquiry}
          isOpen={showResponseModal}
          onClose={() => {
            setShowResponseModal(false);
            setSelectedInquiry(null);
          }}
          onSuccess={() => {
            fetchInquiries();
            setShowResponseModal(false);
            setSelectedInquiry(null);
          }}
        />
      )}
    </div>
  );
}
