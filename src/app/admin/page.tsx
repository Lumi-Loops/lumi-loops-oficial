"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTicketsInbox } from "@/components/admin/AdminTicketsInbox";
import { AdminAuditLog } from "@/components/admin/AdminAuditLog";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminCustomers } from "@/components/admin/AdminCustomers";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminFooter } from "@/components/admin/AdminFooter";
import { AdminInquiriesManagement } from "@/components/admin/AdminInquiriesManagement";
import { AdminInquiryNotificationsList } from "@/components/admin/AdminInquiryNotificationsList";

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  );
}

function AdminContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Read tab and notification id from URL
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const notificationIdParam = searchParams.get("id");

    if (tabParam) {
      setActiveTab(tabParam);
    }

    if (notificationIdParam) {
      setSelectedNotificationId(notificationIdParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="px-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 gap-1 mb-6 h-auto">
              <TabsTrigger value="overview" className="text-xs">
                Overview
              </TabsTrigger>
              <TabsTrigger value="inquiries" className="text-xs">
                Inquiries
              </TabsTrigger>
              <TabsTrigger value="customers" className="text-xs">
                Customers
              </TabsTrigger>
              <TabsTrigger value="tickets" className="text-xs">
                Tickets
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs">
                Notifications
              </TabsTrigger>
              <TabsTrigger value="audit" className="text-xs">
                Audit Log
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Welcome Admin</h2>
                  <p className="text-muted-foreground">Email: {user?.email}</p>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold mb-4">Admin Features</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>✓ Manage support tickets</li>
                    <li>✓ Monitor user activity</li>
                    <li>✓ Manage notifications queue</li>
                    <li>✓ View audit logs</li>
                    <li>✓ System administration</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Inquiries Tab */}
            <TabsContent value="inquiries">
              <AdminInquiriesManagement />
            </TabsContent>

            {/* Customers Tab */}
            <TabsContent value="customers">
              <AdminCustomers />
            </TabsContent>

            {/* Tickets Tab */}
            <TabsContent value="tickets">
              <AdminTicketsInbox />
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <AdminInquiryNotificationsList />
            </TabsContent>

            {/* Audit Log Tab */}
            <TabsContent value="audit">
              <AdminAuditLog />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <AdminSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <AdminFooter />
    </div>
  );
}
