"use client";

import { AdminGuard } from "@/components/auth/AdminGuard";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { useAuth } from "@/hooks/useAuth";

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  );
}

function AdminContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <SignOutButton />
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Welcome Admin</h2>
            <p className="text-muted-foreground">Email: {user?.email}</p>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-4">Admin Features</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ View all user profiles</li>
              <li>✓ Manage user roles</li>
              <li>✓ System administration</li>
              <li>✓ Analytics and reporting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
