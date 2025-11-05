"use client";

import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const ADMIN_EMAIL = "alemardevs@gmail.com";

export function ClientContactButton() {
  const { user } = useAuth();

  const handleContact = () => {
    const subject = encodeURIComponent(`Support Request from ${user?.email}`);
    const body = encodeURIComponent(
      `Hello,\n\nI am writing to request support regarding my project.\n\n\nThank you,\n${user?.email}`
    );

    const mailtoLink = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  return (
    <Button
      onClick={handleContact}
      variant="default"
      className="w-full justify-start"
    >
      <Mail className="w-4 h-4 mr-2" />
      Contact Support
    </Button>
  );
}
