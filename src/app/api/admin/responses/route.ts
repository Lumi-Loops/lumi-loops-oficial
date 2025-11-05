import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });

    const { data: session } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { ticketId, responseText, downloadLink, sendEmail } = body;

    if (!ticketId || !responseText || responseText.length < 10) {
      return NextResponse.json(
        { error: "Invalid input: response must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Create response
    const { data: response, error: responseError } = await supabase
      .from("admin_responses")
      .insert({
        support_ticket_id: ticketId,
        admin_id: session.user.id,
        response_text: responseText,
        download_link: downloadLink || null,
        email_sent: false,
        email_sent_at: null,
        viewed_by_user: false,
        viewed_at: null,
        link_clicked: false,
        link_clicked_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (responseError) throw responseError;

    // Queue notification if send_email
    if (sendEmail && response?.id) {
      const { data: ticket } = await supabase
        .from("support_tickets")
        .select("inquiry_id, visitor_inquiries:inquiry_id(user_id)")
        .eq("id", ticketId)
        .single();

      if (ticket?.visitor_inquiries?.user_id) {
        await supabase.from("admin_notifications_queue").insert({
          response_id: response.id,
          recipient_user_id: ticket.visitor_inquiries.user_id,
          notification_type: "response",
          status: "queued",
          retry_count: 0,
          max_retries: 3,
          error_message: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    // Update ticket status
    await supabase
      .from("support_tickets")
      .update({
        status: "resolved",
        updated_at: new Date().toISOString(),
      })
      .eq("id", ticketId);

    // Log audit
    await supabase.from("admin_audit_log").insert({
      admin_id: session.user.id,
      action: "create",
      target_type: "admin_response",
      target_id: response.id,
      changes: {
        response_text: responseText,
        download_link: downloadLink,
        send_email: sendEmail,
      },
      ip_address: request.headers.get("x-forwarded-for") || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ response }, { status: 201 });
  } catch (error) {
    console.error("Error creating response:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });

    const { data: session } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const ticketId = searchParams.get("ticketId");

    let query = supabase.from("admin_responses").select("*");

    if (ticketId) {
      query = query.eq("support_ticket_id", ticketId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    return NextResponse.json({ responses: data });
  } catch (error) {
    console.error("Error fetching responses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
