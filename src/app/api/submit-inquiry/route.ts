import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { getSupabaseEnv } from "@/utils/env";

const clientInquirySchema = z.object({
  content_type: z.array(z.string()).optional(),
  platforms: z.array(z.string()).optional(),
  goal: z.string().nullable().optional(),
  message: z.string().min(1, "Message is required"),
  budget_range: z.string().nullable().optional(),
  contact_preference: z.string().nullable().optional(),
});

// ClientInquiryData type removed - not used, validation handled by schema.parse()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request data
    const validatedData = clientInquirySchema.parse(body);

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

    // Get current user - REQUIRED for this endpoint
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required. Please log in to submit an inquiry.",
        },
        { status: 401 }
      );
    }

    // 1. Store in client_inquiries table
    const { data: inquiry, error: inquiryError } = await supabase
      .from("client_inquiries")
      .insert({
        user_id: user.id,
        content_type: validatedData.content_type || [],
        platforms: validatedData.platforms || [],
        goal: validatedData.goal || null,
        message: validatedData.message,
        budget_range: validatedData.budget_range || null,
        contact_preference: validatedData.contact_preference || null,
        status: "new",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (inquiryError) {
      console.error("Error storing client inquiry:", inquiryError);
      throw new Error("Failed to store inquiry");
    }

    // 2. Create admin notification
    const { data: admin } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin")
      .single();

    if (admin) {
      const { error: notifError } = await supabase
        .from("admin_notifications_queue")
        .insert({
          response_id: inquiry.id, // Link to the inquiry
          recipient_user_id: admin.id,
          notification_type: "new_client_inquiry",
          status: "sent",
          read: false,
          created_at: new Date().toISOString(),
        });

      if (notifError) {
        console.error("Error creating admin notification:", notifError);
        // Don't fail the request - inquiry was saved
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your project inquiry has been submitted successfully!",
        id: inquiry.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting client inquiry:", error);

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
