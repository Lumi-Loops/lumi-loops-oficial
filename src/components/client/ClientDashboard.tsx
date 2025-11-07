"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import {
  BarChart3,
  Bell,
  Calendar,
  Download,
  FileText,
  LogOut,
  Menu,
  Package,
  Settings,
  X,
} from "lucide-react";
import { ClientDashboardOverview } from "./ClientDashboardOverview";
import { ClientInquiries } from "./ClientInquiries";
import {
  ClientAppointments,
  ClientDownloads,
  ClientPackages,
  ClientPayments,
} from "./ClientStubs";
import { ClientProfile } from "./ClientProfile";
import { ClientNotifications } from "./ClientNotifications";
import { ClientContactButton } from "./ClientContactButton";
import { NotificationBell } from "@/components/NotificationBell";

type ActiveTab =
  | "overview"
  | "inquiries"
  | "appointments"
  | "packages"
  | "downloads"
  | "notifications"
  | "payments"
  | "profile";

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: "overview",
    label: "Dashboard",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    id: "inquiries",
    label: "My Inquiries",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: "appointments",
    label: "Appointments",
    icon: <Calendar className="w-5 h-5" />,
  },
  { id: "packages", label: "Packages", icon: <Package className="w-5 h-5" /> },
  {
    id: "downloads",
    label: "Downloads",
    icon: <Download className="w-5 h-5" />,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="w-5 h-5" />,
  },
  {
    id: "payments",
    label: "Payments",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  { id: "profile", label: "Profile", icon: <Settings className="w-5 h-5" /> },
];

export function ClientDashboard() {
  const { user, signOut } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [displayBusiness, setDisplayBusiness] = useState<string>("");

  // Read tab and notification id from URL
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const notificationIdParam = searchParams.get("id");

    if (
      tabParam &&
      (
        [
          "overview",
          "inquiries",
          "appointments",
          "packages",
          "downloads",
          "notifications",
          "payments",
          "profile",
        ] as ActiveTab[]
      ).includes(tabParam as ActiveTab)
    ) {
      setActiveTab(tabParam as ActiveTab);
    }

    if (notificationIdParam) {
      setSelectedNotificationId(notificationIdParam);
    }
  }, [searchParams]);

  const handleSignOut = async () => {
    await signOut();
  };

  // Fetch profile info for header display
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) return;
        const p = await res.json();
        const name =
          p.full_name || [p.first_name, p.last_name].filter(Boolean).join(" ");
        setDisplayName(name || (user?.email ? user.email.split("@")[0] : ""));
        setDisplayBusiness(p.business_name || "");
      } catch (e) {
        console.warn("Failed to load profile header info", e);
      }
    };
    loadProfile();
  }, [user?.id, user?.email]);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <ClientDashboardOverview />;
      case "inquiries":
        return <ClientInquiries />;
      case "appointments":
        return <ClientAppointments />;
      case "packages":
        return <ClientPackages />;
      case "downloads":
        return <ClientDownloads />;
      case "notifications":
        return (
          <ClientNotifications
            selectedNotificationId={selectedNotificationId}
          />
        );
      case "payments":
        return <ClientPayments />;
      case "profile":
        return <ClientProfile />;
      default:
        return <ClientDashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Logo />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <ClientContactButton />
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-card border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <div>
              <h1 className="text-2xl font-bold">
                {displayName ? `Hola, ${displayName}` : "Welcome back"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {displayBusiness || user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <span className="hidden sm:inline text-sm text-muted-foreground">
              {user?.email?.split("@")[0]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6">{renderContent()}</div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
