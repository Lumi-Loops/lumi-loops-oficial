"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { InputTags } from "@/components/ui/input-tags";

// Validación con Zod (debe coincidir con el backend)
const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  business_name: z.string().optional(),
  content_type: z.array(z.string()).optional(),
  platforms: z.array(z.string()).optional(),
  examples: z.array(z.string()).optional(),
  goal: z.enum(["Sales", "Engagement", "Trust", "Launch", "Other"]).optional(),
  budget_range: z
    .enum(["Under $100", "$100-$300", "$300-$500", "$500-$1000", "$1000+"])
    .optional(),
  contact_preference: z
    .enum(["Email proposal", "Book call", "Not sure"])
    .optional(),
  message: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export function LeadForm({
  onSuccess,
  onError,
  className = "",
}: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);

    // Show loading toast
    const loadingToast = toast.loading("Sending your request...");

    try {
      // Use test endpoint in development (Windows compatibility)
      const endpoint =
        process.env.NODE_ENV === "development"
          ? "/api/submit-lead-test"
          : "/api/submit-lead";

      // Convert arrays to JSON strings for backend
      const payload = {
        ...data,
        content_type: data.content_type?.length ? data.content_type : undefined,
        platforms: data.platforms?.length ? data.platforms : undefined,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
        message?: string;
        id?: number;
      };

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit form");
      }

      // Success toast
      toast.success("Thank you! We'll contact you soon.", {
        description: "Your request has been submitted successfully.",
        duration: 5000,
      });

      // Reset form
      reset();
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Error toast
      toast.error("Failed to submit request", {
        description: errorMessage,
        duration: 5000,
      });

      onError?.(errorMessage);
    } finally {
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`mx-auto w-full max-w-2xl ${className}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Contact Information
          </h3>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-white"
            >
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              className="border-input bg-background focus:ring-ring w-full rounded-lg border px-4 py-2 transition-all focus:border-transparent focus:ring-2"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-white"
            >
              Email <span className="text-red-400">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="border-input bg-background focus:ring-ring w-full rounded-lg border px-4 py-2 transition-all focus:border-transparent focus:ring-2"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Business Name */}
          <div>
            <label
              htmlFor="business_name"
              className="mb-2 block text-sm font-medium text-white"
            >
              Business Name (optional)
            </label>
            <input
              {...register("business_name")}
              type="text"
              id="business_name"
              className="border-input bg-background focus:ring-ring w-full rounded-lg border px-4 py-2 transition-all focus:border-transparent focus:ring-2"
              placeholder="My Company Inc."
            />
          </div>
        </div>

        {/* Content Type */}
        <div>
          <label className="mb-3 block text-sm font-medium text-white">
            What type of content do you need? (optional)
          </label>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                value="Short Videos"
                {...register("content_type")}
                className="border-input text-primary focus:ring-ring h-4 w-4 rounded focus:ring-2"
              />
              <span className="text-sm text-white">
                Short Videos (TikTok, Reels, Shorts)
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                value="Long Videos"
                {...register("content_type")}
                className="border-input text-primary focus:ring-ring h-4 w-4 rounded focus:ring-2"
              />
              <span className="text-sm text-white">Long Videos (YouTube)</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                value="Stories"
                {...register("content_type")}
                className="border-input text-primary focus:ring-ring h-4 w-4 rounded focus:ring-2"
              />
              <span className="text-sm text-white">
                Stories / Ephemeral Content
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                value="Educational"
                {...register("content_type")}
                className="border-input text-primary focus:ring-ring h-4 w-4 rounded focus:ring-2"
              />
              <span className="text-sm text-white">Educational / Tutorial</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                value="Promotional"
                {...register("content_type")}
                className="border-input text-primary focus:ring-ring h-4 w-4 rounded focus:ring-2"
              />
              <span className="text-sm text-white">Promotional / Ads</span>
            </label>
          </div>
        </div>

        {/* Platforms */}
        <div>
          <label className="mb-3 block text-sm font-medium text-white">
            Which platforms will you use? (optional)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                value="Instagram"
                {...register("platforms")}
                className="border-input text-primary focus:ring-ring h-4 w-4 rounded focus:ring-2"
              />
              <span className="text-sm text-white">Instagram</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                value="TikTok"
                {...register("platforms")}
                className="border-input text-primary focus:ring-ring h-4 w-4 rounded focus:ring-2"
              />
              <span className="text-sm text-white">TikTok</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                value="YouTube"
                {...register("platforms")}
                className="border-input text-primary focus:ring-ring h-4 w-4 rounded focus:ring-2"
              />
              <span className="text-sm text-white">YouTube</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                value="Facebook"
                {...register("platforms")}
                className="border-input text-primary focus:ring-ring h-4 w-4 rounded focus:ring-2"
              />
              <span className="text-sm text-white">Facebook</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                value="LinkedIn"
                {...register("platforms")}
                className="border-input text-primary focus:ring-ring h-4 w-4 rounded focus:ring-2"
              />
              <span className="text-sm text-white">LinkedIn</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                value="Twitter/X"
                {...register("platforms")}
                className="border-input text-primary focus:ring-ring h-4 w-4 rounded focus:ring-2"
              />
              <span className="text-sm text-white">Twitter/X</span>
            </label>
          </div>
        </div>

        {/* Examples */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Share examples you like (optional)
          </label>
          <Controller
            name="examples"
            control={control}
            render={({ field }) => (
              <InputTags
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Paste URL and click Add (or press Enter)"
                maxTags={10}
              />
            )}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Add up to 10 URLs of videos or content that inspire you
          </p>
        </div>

        {/* Goal */}
        <div>
          <label
            htmlFor="goal"
            className="mb-2 block text-sm font-medium text-white"
          >
            What&apos;s your main goal?
          </label>
          <select
            {...register("goal")}
            id="goal"
            className="border-input bg-background focus:ring-ring w-full rounded-lg border px-4 py-2 transition-all focus:border-transparent focus:ring-2"
          >
            <option value="">Select an option</option>
            <option value="Sales">Increase Sales</option>
            <option value="Engagement">Boost Engagement</option>
            <option value="Trust">Build Trust</option>
            <option value="Launch">Launch Product</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Budget */}
        <div>
          <label
            htmlFor="budget_range"
            className="mb-2 block text-sm font-medium text-white"
          >
            Budget Range
          </label>
          <select
            {...register("budget_range")}
            id="budget_range"
            className="border-input bg-background focus:ring-ring w-full rounded-lg border px-4 py-2 transition-all focus:border-transparent focus:ring-2"
          >
            <option value="">Select a range</option>
            <option value="Under $100">Under $100</option>
            <option value="$100-$300">$100 - $300</option>
            <option value="$300-$500">$300 - $500</option>
            <option value="$500-$1000">$500 - $1,000</option>
            <option value="$1000+">$1,000+</option>
          </select>
        </div>

        {/* Contact Preference */}
        <div>
          <label
            htmlFor="contact_preference"
            className="mb-2 block text-sm font-medium text-white"
          >
            How would you like us to contact you?
          </label>
          <select
            {...register("contact_preference")}
            id="contact_preference"
            className="border-input bg-background focus:ring-ring w-full rounded-lg border px-4 py-2 transition-all focus:border-transparent focus:ring-2"
          >
            <option value="">Select an option</option>
            <option value="Email proposal">Email Proposal</option>
            <option value="Book call">Book a Call</option>
            <option value="Not sure">Not Sure</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-white"
          >
            Additional Message (optional)
          </label>
          <textarea
            {...register("message")}
            id="message"
            rows={4}
            className="border-input bg-background focus:ring-ring w-full resize-none rounded-lg border px-4 py-2 transition-all focus:border-transparent focus:ring-2"
            placeholder="Tell us more about your project..."
          />
        </div>

        {/* Submit Button */}
        <div className="space-y-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all duration-200 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
            {isSubmitting ? "Sending..." : "Submit Request"}
          </button>

          {/* Privacy Notice */}
          <p className="text-center text-xs text-white/60 leading-relaxed">
            By submitting this form, you agree to our{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 underline hover:text-white transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 underline hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            . We use cookies to enhance your experience and protect your data.
          </p>
        </div>
      </form>
    </div>
  );
}
