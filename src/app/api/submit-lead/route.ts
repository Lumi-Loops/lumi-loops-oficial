import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { getSupabaseEnv, getSupabaseServiceKey } from "@/utils/env";
import { sendVisitorConfirmationEmail } from "@/lib/email/sendVisitorConfirmationEmail";

const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  business_name: z.string().nullable().optional(),
  content_type: z.array(z.string()).optional(),
  platforms: z.array(z.string()).optional(),
  examples: z.array(z.string()).optional(),
  goal: z.string().nullable().optional(),
  budget_range: z.string().nullable().optional(),
  contact_preference: z.string().nullable().optional(),
  message: z.string().trim().min(1, "Message is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request data
    const validatedData = leadFormSchema.parse(body);

    // Normalize email to avoid CHECK constraint violations
    const normalizedEmail = validatedData.email.trim().toLowerCase();

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
        email: normalizedEmail,
        business_name: validatedData.business_name || null,
        content_type: validatedData.content_type || [],
        platforms: validatedData.platforms || [],
        examples: validatedData.examples || [],
        goal: validatedData.goal || null,
        budget_range: validatedData.budget_range || null,
        contact_preference: validatedData.contact_preference || null,
        message: validatedData.message,
        status: "new",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    // Helper to safely extract a readable error message without using 'any'
    const extractErrorMessage = (err: unknown): string | undefined => {
      if (err && typeof err === "object" && "message" in err) {
        const msg = (err as { message?: unknown }).message;
        return typeof msg === "string" ? msg : undefined;
      }
      return undefined;
    };

    if (inquiryError) {
      const readable = extractErrorMessage(inquiryError);
      console.error("Error storing inquiry:", readable ?? inquiryError);
      return NextResponse.json(
        {
          success: false,
          error:
            readable ?? "Invalid email format or data constraint violation",
        },
        { status: 400 }
      );
    }

    // 2. Send confirmation email to visitor
    try {
      await sendVisitorConfirmationEmail({
        name: validatedData.name,
        email: validatedData.email,
        inquiryId: inquiry.id,
      });
      console.info("Confirmation email sent to visitor:", validatedData.email);
    } catch (err) {
      console.error("Error sending visitor confirmation email:", err);
      // Don't fail the request - inquiry was saved
    }

    // 3. Create admin notification for visitor inquiry using RPC
    try {
      const { url, serviceKey } = getSupabaseServiceKey();
      const { createClient } = await import("@supabase/supabase-js");
      const supabaseAdmin = createClient(url, serviceKey);

      const { data: adminProfile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("role", "admin")
        .single();

      if (adminProfile) {
        console.warn("RPC Notification params:", {
          adminProfile,
          newInquiry: { id: inquiry.id, type: "visitor" },
        });
        const rpcResponse = await supabaseAdmin.rpc(
          "create_admin_inquiry_notification",
          {
            p_admin_user_id: adminProfile.id,
            p_inquiry_id: inquiry.id,
            p_inquiry_type: "visitor",
            p_title: `New visitor inquiry from ${validatedData.name}`,
            p_message: `${validatedData.name} (${validatedData.email}) submitted a visitor inquiry.`,
          }
        );
        console.warn("RPC result:", rpcResponse);
        console.info(
          "Admin notification created for visitor inquiry:",
          inquiry.id
        );
      }
    } catch (err) {
      console.error("Error creating admin notification:", err);
      // Don't fail the request - inquiry was saved and email was sent
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
