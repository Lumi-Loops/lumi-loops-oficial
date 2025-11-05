"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, FileText, Package } from "lucide-react";

export function ClientDashboardOverview() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    activeInquiries: 0,
    upcomingAppointments: 0,
    activePackages: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        const userId = session.user.id;

        // Get active inquiries
        const { count: inquiriesCount } = await supabase
          .from("visitor_inquiries")
          .select("*", { count: "exact" })
          .eq("user_id", userId)
          .in("status", ["new", "responded", "scheduled"]);

        // Get upcoming appointments
        const { count: appointmentsCount } = await supabase
          .from("appointments")
          .select("*", { count: "exact" })
          .eq("user_id", userId)
          .gte("scheduled_at", new Date().toISOString());

        // Get active packages
        const { count: packagesCount } = await supabase
          .from("packages")
          .select("*", { count: "exact" })
          .eq("user_id", userId)
          .eq("status", "active");

        // Get total spent
        const { data: payments } = await supabase
          .from("payments")
          .select("amount")
          .eq("user_id", userId)
          .eq("status", "paid");

        const totalSpent =
          payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

        setStats({
          activeInquiries: inquiriesCount || 0,
          upcomingAppointments: appointmentsCount || 0,
          activePackages: packagesCount || 0,
          totalSpent,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, [supabase]);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Active Inquiries
                </p>
                <p className="text-3xl font-bold">{stats.activeInquiries}</p>
              </div>
              <FileText className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Upcoming Appointments
                </p>
                <p className="text-3xl font-bold">
                  {stats.upcomingAppointments}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Active Packages
                </p>
                <p className="text-3xl font-bold">{stats.activePackages}</p>
              </div>
              <Package className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Spent
                </p>
                <p className="text-3xl font-bold">
                  ${stats.totalSpent.toLocaleString()}
                </p>
              </div>
              <div className="w-8 h-8 text-primary opacity-50">💰</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can do right now</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.activeInquiries > 0 && (
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm">
                  You have {stats.activeInquiries} active inquiries
                </p>
                <p className="text-xs text-muted-foreground">
                  Check the status and next steps
                </p>
              </div>
              <Button size="sm" variant="outline">
                View
              </Button>
            </div>
          )}

          {stats.upcomingAppointments === 0 && (
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm">Schedule an appointment</p>
                <p className="text-xs text-muted-foreground">
                  Book a meeting with our team
                </p>
              </div>
              <Button size="sm" variant="outline">
                Schedule
              </Button>
            </div>
          )}

          {stats.activePackages > 0 && (
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Package className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm">View your active packages</p>
                <p className="text-xs text-muted-foreground">
                  Check deliverables and progress
                </p>
              </div>
              <Button size="sm" variant="outline">
                View
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Need help?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Welcome to your client dashboard! Here you can manage your projects,
            view appointments, track payments, and download your deliverables.
          </p>
          <div className="space-y-2">
            <p className="font-medium">What you can do:</p>
            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
              <li>View and track your inquiries</li>
              <li>Schedule and view appointments</li>
              <li>Check your package details</li>
              <li>Download files and proposals</li>
              <li>Track your payments</li>
              <li>Contact your account manager</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
