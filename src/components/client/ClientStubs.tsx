"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

// ClientAppointments - List and calendar view of appointments
export function ClientAppointments() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Appointments</h2>
        <p className="text-muted-foreground">
          View and manage your scheduled appointments
        </p>
      </div>
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
          <p className="text-muted-foreground">No appointments scheduled yet</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ClientPackages - Display purchased packages
export function ClientPackages() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Packages</h2>
        <p className="text-muted-foreground">
          View your purchased services and deliverables
        </p>
      </div>
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
          <p className="text-muted-foreground">No active packages</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ClientDownloads - File browser for downloads
export function ClientDownloads() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Downloads</h2>
        <p className="text-muted-foreground">
          Access proposals, contracts, and delivered files
        </p>
      </div>
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
          <p className="text-muted-foreground">No files available yet</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ClientNotifications moved to ClientNotifications.tsx
// This is now imported from there in ClientDashboard

// ClientPayments - Invoice and payment history
export function ClientPayments() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payments</h2>
        <p className="text-muted-foreground">
          View your invoices and payment history
        </p>
      </div>
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
          <p className="text-muted-foreground">No payments yet</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ClientProfile - Profile settings and information
export function ClientProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="text-muted-foreground">
          Manage your account settings and information
        </p>
      </div>
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
          <p className="text-muted-foreground">Loading profile...</p>
        </CardContent>
      </Card>
    </div>
  );
}
