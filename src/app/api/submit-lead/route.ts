import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { getSupabaseEnv } from "@/utils/env";

const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  business_name: z.string().nullable().optional(),
  content_type: z.array(z.string()).optional(),
  platforms: z.array(z.string()).optional(),
  examples: z.array(z.string()).optional(),
  goal: z.string().nullable().optional(),
  budget_range: z.string().nullable().optional(),
  contact_preference: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request data
    const validatedData = leadFormSchema.parse(body);

    const cookieStore = await cookies();
    const { url, anonKey } = getSupabaseEnv();
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore errors
          }
        },
      },
    });

    // Get current user - this endpoint is ONLY for visitors
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If user is authenticated, redirect them to use the client inquiry endpoint
    if (user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This endpoint is for visitors only. Please use your dashboard to submit project inquiries.",
          redirect: "/dashboard",
        },
        { status: 403 }
      );
    }

    // 1. Store in visitor_inquiries table (NO user_id - this is for visitors only)
    const { data: inquiry, error: inquiryError } = await supabase
      .from("visitor_inquiries")
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        business_name: validatedData.business_name || null,
        content_type: validatedData.content_type || [],
        platforms: validatedData.platforms || [],
        examples: validatedData.examples || [],
        goal: validatedData.goal || null,
        budget_range: validatedData.budget_range || null,
        contact_preference: validatedData.contact_preference || null,
        message: validatedData.message || null,
        status: "new",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (inquiryError) {
      console.error("Error storing inquiry:", inquiryError);
      throw new Error("Failed to store inquiry");
    }

    // 2. Create admin notification for visitor inquiry
    try {
      const { data: adminSession } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "admin")
        .single();

      if (adminSession) {
        // Note: For visitor inquiries, we create a notification pointing to client_inquiries
        // We need to create a placeholder record or handle this differently
        // For now, we'll skip notifications for visitor inquiries
        console.info("Visitor inquiry created:", inquiry.id);
      }
    } catch (err) {
      console.error("Error in notification creation:", err);
      // Don't fail the request - inquiry was saved
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Your inquiry has been submitted successfully. We will contact you soon!",
        id: inquiry.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting lead form:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid form data",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit form",
      },
      { status: 500 }
    );
  }
}
