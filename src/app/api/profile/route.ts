import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { digitsOnly } from "@/lib/phone";

// US phone regex shared across handlers to match UI validation
const usPhoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(profile);
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const profileCreateSchema = z.object({
      first_name: z
        .string()
        .min(1, "First name is required")
        .max(100)
        .optional(),
      last_name: z.string().min(1, "Last name is required").max(100).optional(),
      full_name: z.string().max(200).optional(),
      business_name: z.string().max(200).optional(),
      // avatar_url no se usa por ahora; mantener opcional si llega pero sin persistir
      avatar_url: z.string().url().max(500).optional(),
      business_phone: z
        .string()
        .regex(
          usPhoneRegex,
          "Company phone must be in the format (XXX) XXX-XXXX"
        )
        .optional(),
      address_line1: z.string().max(200).optional(),
      address_line2: z.string().max(200).optional(),
      address_city: z.string().max(100).optional(),
      address_state: z.string().max(100).optional(),
      address_zip: z.string().max(20).optional(),
      phone: z
        .string()
        .regex(usPhoneRegex, "Phone must be in the format (XXX) XXX-XXXX")
        .optional(),
      country: z.string().max(100).optional(),
      city: z.string().max(100).optional(),
    });

    const parsed = profileCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = parsed.data;
    const derivedFullName =
      payload.full_name ||
      [payload.first_name, payload.last_name].filter(Boolean).join(" ");

    // Normalizar teléfonos: almacenar solo dígitos (10) para consistencia
    const normalizedPhone =
      payload.phone && payload.phone.length > 0
        ? digitsOnly(payload.phone)
        : null;
    const normalizedBusinessPhone =
      payload.business_phone && payload.business_phone.length > 0
        ? digitsOnly(payload.business_phone)
        : null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .insert([
        {
          id: user.id,
          email: user.email,
          first_name: payload.first_name ?? null,
          last_name: payload.last_name ?? null,
          full_name: derivedFullName || null,
          business_name: payload.business_name ?? null,
          // avatar_url: no persistimos por ahora
          business_phone: normalizedBusinessPhone,
          address_line1: payload.address_line1 ?? null,
          address_line2: payload.address_line2 ?? null,
          address_city: payload.address_city ?? null,
          address_state: payload.address_state ?? null,
          address_zip: payload.address_zip ?? null,
          phone: normalizedPhone,
          country: payload.country ?? null,
          city: payload.city ?? null,
          name_needs_review: false,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(profile, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const profileUpdateSchema = z.object({
      first_name: z
        .string()
        .min(1, "First name is required")
        .max(100)
        .optional(),
      last_name: z.string().min(1, "Last name is required").max(100).optional(),
      full_name: z.string().max(200).optional(),
      business_name: z.string().max(200).optional(),
      // avatar_url no se usa por ahora; mantener opcional si llega pero sin persistir
      avatar_url: z.string().url().max(500).optional(),
      business_phone: z
        .string()
        .regex(
          usPhoneRegex,
          "Company phone must be in the format (XXX) XXX-XXXX"
        )
        .optional(),
      address_line1: z.string().max(200).optional(),
      address_line2: z.string().max(200).optional(),
      address_city: z.string().max(100).optional(),
      address_state: z.string().max(100).optional(),
      address_zip: z.string().max(20).optional(),
      phone: z
        .string()
        .regex(usPhoneRegex, "Phone must be in the format (XXX) XXX-XXXX")
        .optional(),
      country: z.string().max(100).optional(),
      city: z.string().max(100).optional(),
    });

    const parsed = profileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = parsed.data;

    // If first_name/last_name provided, derive full_name when not explicitly set
    const derivedFullName =
      payload.full_name ||
      [payload.first_name, payload.last_name].filter(Boolean).join(" ");

    // Build update object only with provided fields
    type ProfileUpdate = {
      first_name?: string | null;
      last_name?: string | null;
      full_name?: string | null;
      business_name?: string | null;
      // avatar_url?: string | null;
      business_phone?: string | null;
      address_line1?: string | null;
      address_line2?: string | null;
      address_city?: string | null;
      address_state?: string | null;
      address_zip?: string | null;
      phone?: string | null;
      country?: string | null;
      city?: string | null;
      name_needs_review?: boolean;
    };
    const updates: ProfileUpdate = {};
    if (payload.first_name !== undefined)
      updates.first_name = payload.first_name || null;
    if (payload.last_name !== undefined)
      updates.last_name = payload.last_name || null;
    if (payload.business_name !== undefined)
      updates.business_name = payload.business_name || null;
    // No actualizamos avatar_url por ahora
    if (payload.business_phone !== undefined)
      updates.business_phone =
        payload.business_phone && payload.business_phone.length > 0
          ? digitsOnly(payload.business_phone)
          : null;
    if (payload.address_line1 !== undefined)
      updates.address_line1 = payload.address_line1 || null;
    if (payload.address_line2 !== undefined)
      updates.address_line2 = payload.address_line2 || null;
    if (payload.address_city !== undefined)
      updates.address_city = payload.address_city || null;
    if (payload.address_state !== undefined)
      updates.address_state = payload.address_state || null;
    if (payload.address_zip !== undefined)
      updates.address_zip = payload.address_zip || null;
    if (payload.phone !== undefined)
      updates.phone =
        payload.phone && payload.phone.length > 0
          ? digitsOnly(payload.phone)
          : null;
    if (payload.country !== undefined)
      updates.country = payload.country || null;
    if (payload.city !== undefined) updates.city = payload.city || null;

    // Keep full_name in sync if we have name parts or explicit full_name
    if (derivedFullName) {
      updates.full_name = derivedFullName;
      // Clear name_needs_review when user explicitly provides complete name parts
      if (
        (payload.first_name && payload.last_name) ||
        (payload.full_name && payload.full_name.trim().length > 0)
      ) {
        updates.name_needs_review = false;
      }
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(profile);
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
