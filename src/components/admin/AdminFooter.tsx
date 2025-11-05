"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Mail, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function AdminFooter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [formData, setFormData] = useState({
    subject: "",
    type: "bug" as "bug" | "feature" | "other",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const mailtoLink = `mailto:alemardevs@gmail.com?subject=${encodeURIComponent(
        `[${formData.type.toUpperCase()}] ${formData.subject}`
      )}&body=${encodeURIComponent(
        `Type: ${formData.type}\n\nMessage:\n${formData.message}\n\n---\nSent from Lumi Loops Admin Dashboard`
      )}`;

      window.location.href = mailtoLink;
      setSubmitStatus("success");

      setTimeout(() => {
        setIsOpen(false);
        setFormData({ subject: "", type: "bug", message: "" });
        setSubmitStatus("idle");
      }, 1500);
    } catch (error) {
      setSubmitStatus("error");
      console.error("Error submitting contact form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-border bg-card mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Support Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Support</h3>
            <p className="text-sm text-muted-foreground">
              Need help? Report bugs, suggest features, or share feedback with
              the development team.
            </p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Developer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Report Issue or Suggest Feature</DialogTitle>
                  <DialogDescription>
                    Help us improve by sharing your feedback directly with the
                    development team.
                  </DialogDescription>
                </DialogHeader>

                {submitStatus === "success" ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <CheckCircle className="w-12 h-12 text-primary" />
                    <p className="text-center text-foreground font-medium">
                      Thank you for your feedback!
                    </p>
                    <p className="text-center text-sm text-muted-foreground">
                      Your email client is opening. If it doesn&apos;t, please
                      send an email to
                      <br />
                      <span className="font-semibold text-foreground">
                        alemardevs@gmail.com
                      </span>
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Type Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Report Type
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["bug", "feature", "other"] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, type })}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                              formData.type === type
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {type === "bug" && "🐛 Bug"}
                            {type === "feature" && "✨ Feature"}
                            {type === "other" && "💡 Other"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="text-sm font-medium text-foreground"
                      >
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        placeholder="Brief description of the issue or feature"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        required
                        className="border-border"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-medium text-foreground"
                      >
                        Details *
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Provide detailed information about your report or suggestion..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                        rows={5}
                        className="border-border resize-none"
                      />
                    </div>

                    {/* Info Box */}
                    <div className="bg-muted/50 border border-border rounded-md p-3 flex gap-3">
                      <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        Your email client will open with the pre-filled form.
                        Review it before sending to ensure all information is
                        correct.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          isSubmitting || !formData.subject || !formData.message
                        }
                        className="flex-1"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Sending..." : "Send Report"}
                      </Button>
                    </div>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Quick Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Developer Info
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Email</p>
                <a
                  href="mailto:alemardevs@gmail.com"
                  className="text-primary hover:underline font-medium"
                >
                  alemardevs@gmail.com
                </a>
              </div>
              <div>
                <p className="text-muted-foreground">Response Time</p>
                <p className="text-foreground font-medium">
                  Usually within 24-48 hours
                </p>
              </div>
            </div>
          </div>

          {/* What to Report */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              What to Report
            </h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Bugs or crashes</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Feature requests</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Performance issues</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>UI/UX improvements</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © 2024 Lumi Loops Admin Dashboard. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Dashboard Version: 1.0.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
