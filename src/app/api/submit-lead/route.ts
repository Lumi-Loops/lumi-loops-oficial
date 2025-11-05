import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  business_name: z.string().optional(),
  content_type: z.array(z.string()).optional(),
  platforms: z.array(z.string()).optional(),
  examples: z.array(z.string()).optional(),
  goal: z.string().optional(),
  budget_range: z.string().optional(),
  contact_preference: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request data
    const validatedData = leadFormSchema.parse(body);

    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });

    // Get current user if authenticated (for linking inquiries to users)
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;

    // 1. Store in visitor_inquiries table
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
        user_id: userId,
        status: "new",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (inquiryError) {
      console.error("Error storing inquiry:", inquiryError);
      throw new Error("Failed to store inquiry");
    }

    // 2. Create admin notification in queue
    const { data: adminSession } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin")
      .single();

    if (adminSession) {
      const { error: notificationError } = await supabase
        .from("admin_notifications_queue")
        .insert({
          inquiry_id: inquiry.id,
          recipient_user_id: adminSession.id,
          notification_type: "new_inquiry",
          status: "queued",
          retry_count: 0,
          max_retries: 3,
          error_message: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (notificationError) {
        console.error("Error creating notification:", notificationError);
        // Don't throw error - inquiry was saved successfully, notification is secondary
      }
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
          details: error.errors,
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
