"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Validación con Zod
const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  business_name: z.string().optional(),
  budget_range: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
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
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simular envío (reemplazar con API real)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Form data:", data);

      setSubmitStatus("success");
      reset();
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setSubmitStatus("error");
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`mx-auto w-full max-w-2xl ${className}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>

          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Full Name <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("name")}
              type="text"
              id="name"
              placeholder="John Doe"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-destructive mt-1 text-sm">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("email")}
              type="email"
              id="email"
              placeholder="john@example.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-destructive mt-1 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Business Name */}
          <div>
            <label
              htmlFor="business_name"
              className="mb-2 block text-sm font-medium"
            >
              Business Name (Optional)
            </label>
            <Input
              {...register("business_name")}
              type="text"
              id="business_name"
              placeholder="Your Company"
            />
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Project Details</h3>

          {/* Budget Range */}
          <div>
            <label
              htmlFor="budget_range"
              className="mb-2 block text-sm font-medium"
            >
              Budget Range (Optional)
            </label>
            <Select onValueChange={(value) => setValue("budget_range", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Under $100">Under $100</SelectItem>
                <SelectItem value="$100-$300">$100-$300</SelectItem>
                <SelectItem value="$300-$500">$300-$500</SelectItem>
                <SelectItem value="$500-$1000">$500-$1000</SelectItem>
                <SelectItem value="$1000+">$1000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium">
              Tell us about your project{" "}
              <span className="text-destructive">*</span>
            </label>
            <Textarea
              {...register("message")}
              id="message"
              placeholder="Describe your video content needs, goals, and any specific requirements..."
              rows={5}
              className={errors.message ? "border-destructive" : ""}
            />
            {errors.message && (
              <p className="text-destructive mt-1 text-sm">
                {errors.message.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Request"
          )}
        </Button>

        {/* Status Messages */}
        {submitStatus === "success" && (
          <div className="bg-primary/10 border-primary/20 text-primary rounded-lg border p-4 text-center">
            <p className="font-semibold">
              Thank you! We&apos;ll contact you soon.
            </p>
            <p className="text-sm">
              Your request has been submitted successfully.
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-lg border p-4 text-center">
            <p className="font-semibold">Failed to submit request</p>
            <p className="text-sm">Please try again later.</p>
          </div>
        )}
      </form>
    </div>
  );
}
