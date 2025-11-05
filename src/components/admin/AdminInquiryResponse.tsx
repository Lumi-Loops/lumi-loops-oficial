"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { Inquiry } from "@/types/inquiry";

interface AdminInquiryResponseProps {
  inquiry: Inquiry;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminInquiryResponse({
  inquiry,
  isOpen,
  onClose,
  onSuccess,
}: AdminInquiryResponseProps) {
  const supabase = createClient();
  const [subject, setSubject] = useState(`Re: Inquiry from ${inquiry.name}`);
  const [message, setMessage] = useState("");
  const [nextAction, setNextAction] = useState<
    "responded" | "scheduled" | "in-progress"
  >("responded");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!message.trim()) {
      setErrorMessage("Please enter a message");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSubmitStatus("idle");

    try {
      // Open email client with pre-filled content
      const mailtoLink = `mailto:${inquiry.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(message + "\n\n---\nSent from Lumi Loops Admin Dashboard")}`;

      window.location.href = mailtoLink;

      // Update inquiry status in database
      const { error } = await supabase
        .from("visitor_inquiries")
        .update({
          status: nextAction,
          updated_at: new Date().toISOString(),
        })
        .eq("id", inquiry.id);

      if (error) throw error;

      setSubmitStatus("success");

      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error("Error sending response:", error);
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send response"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Respond to Inquiry</DialogTitle>
          <DialogDescription>
            Send a response email to {inquiry.name} ({inquiry.email})
          </DialogDescription>
        </DialogHeader>

        {submitStatus === "success" ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="w-12 h-12 text-primary" />
            <p className="text-center text-foreground font-medium">
              Response sent successfully!
            </p>
            <p className="text-center text-sm text-muted-foreground">
              The inquiry status has been updated to &quot;{nextAction}&quot;
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Recipient Info */}
            <div className="bg-muted/50 border border-border rounded-md p-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium">To:</span> {inquiry.email}
              </p>
              {inquiry.business_name && (
                <p className="text-sm">
                  <span className="font-medium">Business:</span>{" "}
                  {inquiry.business_name}
                </p>
              )}
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                className="border-border"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your response here..."
                rows={8}
                className="border-border resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {message.length} characters
              </p>
            </div>

            {/* Next Action */}
            <div className="space-y-2">
              <Label htmlFor="nextAction">Update Status To</Label>
              <Select
                value={nextAction}
                onValueChange={(value) =>
                  setNextAction(
                    value as "responded" | "scheduled" | "in-progress"
                  )
                }
              >
                <SelectTrigger id="nextAction" className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="scheduled">Scheduled for Call</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex gap-3">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                Your default email client will open with this message
                pre-filled. Review and send from there.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex gap-3">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-red-800">{errorMessage}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !message.trim()}
                className="flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Sending..." : "Send Response"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
