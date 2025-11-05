"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Briefcase, Package, ShoppingCart, Users } from "lucide-react";

interface DashboardStats {
  totalCustomers: number;
  totalPackages: number;
  totalSales: number;
  totalAppointments: number;
}

interface UserProfile {
  email: string;
  full_name: string | null;
}

export function AdminHeader() {
  const supabase = createClient();
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalPackages: 0,
    totalSales: 0,
    totalAppointments: 0,
  });
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get current user
      const { data: session } = await supabase.auth.getSession();
      if (session.session?.user.id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", session.session.user.id)
          .single();

        if (profile) {
          setUser(profile);
        }
      }

      // Fetch total customers (non-admin users)
      const { count: customersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .neq("role", "admin");

      // Fetch total packages
      const { count: packagesCount } = await supabase
        .from("packages")
        .select("*", { count: "exact" });

      // Fetch total sales (payments with status 'paid')
      const { count: salesCount } = await supabase
        .from("payments")
        .select("*", { count: "exact" })
        .eq("status", "paid");

      // Fetch total appointments
      const { count: appointmentsCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact" });

      setStats({
        totalCustomers: customersCount || 0,
        totalPackages: packagesCount || 0,
        totalSales: salesCount || 0,
        totalAppointments: appointmentsCount || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      setSigningOut(false);
    }
  };

  return (
    <div className="bg-card text-foreground">
      {/* Top Navigation Bar */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* Mobile Header */}
          <div className="md:hidden flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <Link
                href="/"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
              >
                <div className="relative h-6 w-24">
                  <Image
                    src="/logo/lumiloops-logo-name.png"
                    alt="Lumi Loops"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
              <Button
                onClick={handleSignOut}
                disabled={signingOut}
                variant="outline"
                size="sm"
              >
                {signingOut ? "..." : "Sign Out"}
              </Button>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage your business
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-medium truncate">
                {user?.full_name || user?.email || "Admin"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center gap-4 hover:opacity-80 transition-opacity"
            >
              <div className="relative h-8 w-28">
                <Image
                  src="/logo/lumiloops-logo-name.png"
                  alt="Lumi Loops"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your business
                </p>
              </div>
            </Link>

            {/* User Info and Actions */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">
                  {user?.full_name || user?.email || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                onClick={handleSignOut}
                disabled={signingOut}
                variant="outline"
              >
                {signingOut ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Customers Card */}
          <div className="bg-card border border-border rounded-lg p-3 sm:p-6 hover:border-primary/40 transition">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div>
                <p className="text-primary text-xs sm:text-sm font-medium">
                  Total Customers
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">
                  {loading ? "-" : stats.totalCustomers}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
            </div>
          </div>

          {/* Packages Card */}
          <div className="bg-card border border-border rounded-lg p-3 sm:p-6 hover:border-accent/40 transition">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div>
                <p className="text-accent text-xs sm:text-sm font-medium">
                  Packages Available
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">
                  {loading ? "-" : stats.totalPackages}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
            </div>
          </div>

          {/* Sales Card */}
          <div className="bg-card border border-border rounded-lg p-3 sm:p-6 hover:border-chart-1/40 transition">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div>
                <p className="text-chart-1 text-xs sm:text-sm font-medium">
                  Sales Completed
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">
                  {loading ? "-" : stats.totalSales}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-chart-1/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-chart-1" />
              </div>
            </div>
          </div>

          {/* Appointments Card */}
          <div className="bg-card border border-border rounded-lg p-3 sm:p-6 hover:border-chart-2/40 transition">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div>
                <p className="text-chart-2 text-xs sm:text-sm font-medium">
                  Total Appointments
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">
                  {loading ? "-" : stats.totalAppointments}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-chart-2/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-chart-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
