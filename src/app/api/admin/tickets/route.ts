import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

    let query = supabase.from("support_tickets").select(
      `id, inquiry_id, status, priority, assigned_to, created_at, updated_at,
         visitor_inquiries:inquiry_id(name, email, message, user_id)`
    );

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (priority && priority !== "all") {
      query = query.eq("priority", priority);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    // Client-side filtering for search
    let filtered = data || [];
    if (search) {
      filtered = filtered.filter(
        (t: any) =>
          t.visitor_inquiries?.name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          t.visitor_inquiries?.email
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    return NextResponse.json({ tickets: filtered });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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
    const { ticketId, status, priority, assignedTo } = body;

    if (!ticketId) {
      return NextResponse.json({ error: "ticketId required" }, { status: 400 });
    }

    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    if (assignedTo) updates.assigned_to = assignedTo;

    const { data, error } = await supabase
      .from("support_tickets")
      .update(updates)
      .eq("id", ticketId)
      .select()
      .single();

    if (error) throw error;

    // Log audit trail
    await supabase.from("admin_audit_log").insert({
      admin_id: session.user.id,
      action: "update",
      target_type: "support_ticket",
      target_id: ticketId,
      changes: updates,
      ip_address: request.headers.get("x-forwarded-for") || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ ticket: data });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
