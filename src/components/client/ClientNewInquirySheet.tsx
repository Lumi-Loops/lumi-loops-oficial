"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientNewInquirySheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  content_type: string[];
  platforms: string[];
  goal: string;
  message: string;
  budget_range: string;
  contact_preference: string;
}

interface SubmitStatus {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
}

export function ClientNewInquirySheet({
  isOpen,
  onClose,
  onSuccess,
}: ClientNewInquirySheetProps) {
  const { user: _ } = useAuth(); // user exists but not currently used in form
  const [formData, setFormData] = useState<FormData>({
    content_type: [],
    platforms: [],
    goal: "",
    message: "",
    budget_range: "",
    contact_preference: "email",
  });

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    status: "idle",
  });

  const contentTypeOptions = [
    { value: "video", label: "🎥 Video" },
    { value: "photography", label: "📸 Photography" },
    { value: "graphic_design", label: "🎨 Graphic Design" },
    { value: "animation", label: "✨ Animation" },
    { value: "social_media", label: "📱 Social Media" },
    { value: "branding", label: "🏷️ Branding" },
  ];

  const platformOptions = [
    { value: "instagram", label: "Instagram" },
    { value: "tiktok", label: "TikTok" },
    { value: "youtube", label: "YouTube" },
    { value: "facebook", label: "Facebook" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "website", label: "Website" },
  ];

  const budgetOptions = [
    { value: "under_500", label: "Under $500" },
    { value: "500_1000", label: "$500 - $1,000" },
    { value: "1000_5000", label: "$1,000 - $5,000" },
    { value: "5000_10000", label: "$5,000 - $10,000" },
    { value: "over_10000", label: "Over $10,000" },
  ];

  const toggleContentType = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      content_type: prev.content_type.includes(value)
        ? prev.content_type.filter((item) => item !== value)
        : [...prev.content_type, value],
    }));
  };

  const togglePlatform = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(value)
        ? prev.platforms.filter((item) => item !== value)
        : [...prev.platforms, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.message.trim()) {
      setSubmitStatus({
        status: "error",
        message: "Please describe your project",
      });
      return;
    }

    setSubmitStatus({ status: "loading" });

    try {
      const response = await fetch("/api/submit-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: formData.content_type,
          platforms: formData.platforms,
          goal: formData.goal || null,
          message: formData.message,
          budget_range: formData.budget_range || null,
          contact_preference: formData.contact_preference,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setSubmitStatus({
        status: "success",
        message: "Inquiry submitted successfully!",
      });

      setTimeout(() => {
        setFormData({
          content_type: [],
          platforms: [],
          goal: "",
          message: "",
          budget_range: "",
          contact_preference: "email",
        });
        setSubmitStatus({ status: "idle" });
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (error) {
      setSubmitStatus({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to submit inquiry",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[90vw] sm:w-[500px] md:w-[550px] overflow-y-auto p-0"
      >
        <SheetHeader className="mb-6 px-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>New Project Inquiry</SheetTitle>
              <SheetDescription>
                Tell us about your next project
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {submitStatus.status === "success" ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
            <p className="text-center font-medium text-foreground">
              {submitStatus.message}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-6 px-6 pb-6">
            {/* Content Type - Multi-select */}
            <div className="space-y-3">
              <Label>What type of content? *</Label>
              <div className="grid grid-cols-2 gap-2">
                {contentTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleContentType(option.value)}
                    className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                      formData.content_type.includes(option.value)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/50 text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Platforms - Multi-select */}
            <div className="space-y-3">
              <Label>Which platforms? *</Label>
              <div className="grid grid-cols-2 gap-2">
                {platformOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => togglePlatform(option.value)}
                    className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                      formData.platforms.includes(option.value)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/50 text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div className="space-y-2">
              <Label htmlFor="goal">Project Goal (Optional)</Label>
              <Input
                id="goal"
                placeholder="e.g., Increase engagement, Launch new product"
                value={formData.goal}
                onChange={(e) =>
                  setFormData({ ...formData, goal: e.target.value })
                }
                className="border-border"
              />
            </div>

            {/* Budget Range */}
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range (Optional)</Label>
              <Select
                value={formData.budget_range}
                onValueChange={(value) =>
                  setFormData({ ...formData, budget_range: value })
                }
              >
                <SelectTrigger id="budget" className="border-border">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  {budgetOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Project Details *</Label>
              <Textarea
                id="message"
                placeholder="Describe your project and requirements..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={4}
                className="border-border resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {formData.message.length} characters
              </p>
            </div>

            {/* Contact Preference */}
            <div className="space-y-2">
              <Label htmlFor="contact">Preferred Contact</Label>
              <Select
                value={formData.contact_preference}
                onValueChange={(value) =>
                  setFormData({ ...formData, contact_preference: value })
                }
              >
                <SelectTrigger id="contact" className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="meeting">Video Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Error Message */}
            {submitStatus.status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-3">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{submitStatus.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitStatus.status === "loading"}
                className="flex-1"
              >
                {submitStatus.status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
