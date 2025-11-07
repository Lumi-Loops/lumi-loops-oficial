"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { z } from "zod";
import { digitsOnly, formatUSPhone, isValidUSPhone } from "@/lib/phone";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  first_name?: string | null;
  last_name?: string | null;
  business_name?: string | null;
  business_phone?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  address_city?: string | null;
  address_state?: string | null;
  address_zip?: string | null;
  phone?: string | null;
  name_needs_review?: boolean | null;
}

export function ClientProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessPhoneError, setBusinessPhoneError] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setFullName(data.full_name || "");
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setBusinessName(data.business_name || "");
        // Formatear números provenientes de la DB para mostrarlos como (XXX) XXX-XXXX
        setBusinessPhone(formatUSPhone(data.business_phone || ""));
        setAddressLine1(data.address_line1 || "");
        setAddressLine2(data.address_line2 || "");
        setAddressCity(data.address_city || "");
        setAddressState(data.address_state || "");
        setAddressZip(data.address_zip || "");
        setPhone(formatUSPhone(data.phone || ""));
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const usPhoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
      const schema = z.object({
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().min(1, "Last name is required"),
        full_name: z.string().optional(),
        phone: z
          .string()
          .regex(usPhoneRegex, "Phone must be in the format (XXX) XXX-XXXX")
          .optional(),
        business_name: z.string().optional(),
        business_phone: z
          .string()
          .regex(
            usPhoneRegex,
            "Company phone must be in the format (XXX) XXX-XXXX"
          )
          .optional(),
        address_line1: z.string().optional(),
        address_line2: z.string().optional(),
        address_city: z.string().optional(),
        address_state: z.string().optional(),
        address_zip: z.string().optional(),
      });

      const payload: Record<string, string> = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        full_name: fullName.trim(),
        phone: phone.trim(),
        business_name: businessName.trim(),
        business_phone: businessPhone.trim(),
        address_line1: addressLine1.trim(),
        address_line2: addressLine2.trim(),
        address_city: addressCity.trim(),
        address_state: addressState.trim(),
        address_zip: addressZip.trim(),
      };

      // Remove empty strings to satisfy optional validation
      Object.keys(payload).forEach((k) => {
        if (payload[k] === "") delete payload[k];
      });

      const parsed = schema.safeParse(payload);
      if (!parsed.success) {
        const msg = parsed.error.issues
          .map((issue: z.ZodIssue) => issue.message)
          .join(", ");
        setError(msg || "Invalid data");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setFullName(data.full_name || "");
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setBusinessName(data.business_name || "");
        setBusinessPhone(data.business_phone || "");
        setAddressLine1(data.address_line1 || "");
        setAddressLine2(data.address_line2 || "");
        setAddressCity(data.address_city || "");
        setAddressState(data.address_state || "");
        setAddressZip(data.address_zip || "");
        setPhone(data.phone || "");
        setSuccess("Profile updated successfully");
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {profile?.name_needs_review && (
        <div className="bg-yellow-50 text-yellow-900 p-3 rounded">
          {"Please review your name: we imported your data and it "}
          {"may require adjustments."}
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-900 p-3 rounded">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 text-green-900 p-3 rounded">
            {success}
          </div>
        )}

        {/* Section 1: Personal Data */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold">Personal Data</h3>
          <div>
            <Label>Email</Label>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>

          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                aria-required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                aria-required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">
              Phone (optional)
              <span className="ml-1 text-xs text-muted-foreground">
                Format: (XXX) XXX-XXXX
              </span>
            </Label>
            <Input
              id="phone"
              type="text"
              inputMode="tel"
              value={phone}
              onChange={(e) => {
                const formatted = formatUSPhone(e.target.value);
                setPhone(formatted);
                const digits = digitsOnly(formatted);
                if (digits.length > 0 && digits.length !== 10) {
                  setPhoneError("Phone must contain exactly 10 digits");
                } else {
                  setPhoneError("");
                }
              }}
              onBlur={() => {
                if (phone && !isValidUSPhone(phone)) {
                  setPhoneError("Phone must be in the format (XXX) XXX-XXXX");
                }
              }}
              aria-invalid={!!phoneError}
              aria-describedby="phone-help phone-error"
            />
            {phoneError && (
              <p id="phone-error" className="text-sm text-red-600 mt-1">
                {phoneError}
              </p>
            )}
          </div>

          {/* Avatar info placeholder */}
          <div className="text-sm text-muted-foreground">
            Coming soon: this will sync automatically when you link your account
            with Google, Apple or Facebook.
          </div>
        </div>

        {/* Section 2: Company Data (optional) */}
        <Accordion type="single" collapsible>
          <AccordionItem value="company">
            <AccordionTrigger>Company Data (optional)</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Company Name</Label>
                  <Input
                    id="businessName"
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="businessPhone">
                    Company Phone
                    <span className="ml-1 text-xs text-muted-foreground">
                      Format: (XXX) XXX-XXXX
                    </span>
                  </Label>
                  <Input
                    id="businessPhone"
                    type="text"
                    inputMode="tel"
                    value={businessPhone}
                    onChange={(e) => {
                      const formatted = formatUSPhone(e.target.value);
                      setBusinessPhone(formatted);
                      const digits = digitsOnly(formatted);
                      if (digits.length > 0 && digits.length !== 10) {
                        setBusinessPhoneError(
                          "Company phone must contain exactly 10 digits"
                        );
                      } else {
                        setBusinessPhoneError("");
                      }
                    }}
                    onBlur={() => {
                      if (businessPhone && !isValidUSPhone(businessPhone)) {
                        setBusinessPhoneError(
                          "Company phone must be in the format (XXX) XXX-XXXX"
                        );
                      }
                    }}
                    aria-invalid={!!businessPhoneError}
                    aria-describedby="business-phone-help business-phone-error"
                  />
                  {businessPhoneError && (
                    <p
                      id="business-phone-error"
                      className="text-sm text-red-600 mt-1"
                    >
                      {businessPhoneError}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="addressLine1">Address (Street)</Label>
                  <Input
                    id="addressLine1"
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="addressLine2">
                    Address line 2 (optional)
                  </Label>
                  <Input
                    id="addressLine2"
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="addressCity">City</Label>
                    <Input
                      id="addressCity"
                      type="text"
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="addressState">State/Province</Label>
                    <Input
                      id="addressState"
                      type="text"
                      value={addressState}
                      onChange={(e) => setAddressState(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="addressZip">ZIP Code</Label>
                    <Input
                      id="addressZip"
                      type="text"
                      value={addressZip}
                      onChange={(e) => setAddressZip(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
