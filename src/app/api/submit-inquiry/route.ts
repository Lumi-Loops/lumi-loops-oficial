import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { getSupabaseEnv, getSupabaseServiceKey } from "@/utils/env";

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

    // 2. Create admin notification using RPC function with service role key
    try {
      // Get admin using regular supabase client
      const { data: admin } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "admin")
        .single();

      if (admin) {
        console.info(
          "Creating notification for admin:",
          admin.id,
          "inquiry:",
          inquiry.id
        );

        // Fetch client profile for richer notification content
        const { data: clientProfile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .single();

        // Create admin-privileged client for notification creation
        const { createClient } = await import("@supabase/supabase-js");
        const { url, serviceKey } = getSupabaseServiceKey();
        const supabaseAdmin = createClient(url, serviceKey);

        // Build dynamic title and message with client info
        const clientName = clientProfile?.full_name || "Unknown Client";
        const clientEmail = clientProfile?.email || "unknown@email.com";
        const contentTypesText = validatedData.content_type?.length
          ? validatedData.content_type.join(", ")
          : "General inquiry";

        // Use RPC function with SECURITY DEFINER to bypass RLS
        const { data: notifData, error: notifError } = await supabaseAdmin.rpc(
          "create_admin_inquiry_notification",
          {
            p_admin_user_id: admin.id,
            p_inquiry_id: inquiry.id,
            p_inquiry_type: "client",
            p_title: `New inquiry from ${clientName}`,
            p_message: `${clientName} (${clientEmail}) submitted a new project inquiry requesting: ${contentTypesText}`,
          }
        );

        if (notifError) {
          console.error(
            "Error creating admin notification:",
            JSON.stringify(notifError, null, 2)
          );
        } else {
          console.info(
            "Admin inquiry notification created successfully:",
            notifData
          );
        }
      }
    } catch (err) {
      console.error("Error in notification creation:", err);
      // Don't fail the request - inquiry was saved
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
