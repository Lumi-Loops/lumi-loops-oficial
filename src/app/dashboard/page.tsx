"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ClientDashboard } from "@/components/client/ClientDashboard";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { role, loading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role === "admin") {
      router.push("/admin");
    }
  }, [role, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground">Preparing your dashboard</p>
        </div>
      </div>
    );
  }

  if (role === "admin") {
    return null; // Will redirect to /admin
  }

  return <ClientDashboard />;
}
