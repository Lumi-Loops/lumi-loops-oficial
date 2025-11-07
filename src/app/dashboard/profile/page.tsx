"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { ClientProfile } from "@/components/client/ClientProfile";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Profile</h1>
            <SignOutButton />
          </div>
          {/* Fuente única de verdad para el formulario de perfil */}
          <ClientProfile />
        </div>
      </div>
    </AuthGuard>
  );
}
