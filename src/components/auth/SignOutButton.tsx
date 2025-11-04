"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export const SignOutButton = () => {
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSignOut} disabled={loading} variant="outline">
      {loading ? "Signing out..." : "Sign Out"}
    </Button>
  );
};
