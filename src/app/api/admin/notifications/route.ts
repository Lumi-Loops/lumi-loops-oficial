import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseEnv } from "@/utils/env";

export async function GET(request: NextRequest) {
  try {
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

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = supabase
      .from("admin_notifications_queue")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ notifications: data });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
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

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, action } = body;

    if (!notificationId || !action) {
      return NextResponse.json(
        { error: "notificationId and action required" },
        { status: 400 }
      );
    }

    if (action === "retry") {
      const { data, error } = await supabase
        .from("admin_notifications_queue")
        .update({
          status: "queued",
          retry_count: 0,
          error_message: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", notificationId)
        .select()
        .single();

      if (error) throw error;

      // Log audit
      await supabase.from("admin_audit_log").insert({
        admin_id: user.id,
        action: "update",
        target_type: "notification_queue",
        target_id: notificationId,
        changes: { action: "retry" },
        ip_address: request.headers.get("x-forwarded-for") || "unknown",
        user_agent: request.headers.get("user-agent") || "unknown",
        created_at: new Date().toISOString(),
      });

      return NextResponse.json({ notification: data });
    }

    if (action === "skip") {
      const { data, error } = await supabase
        .from("admin_notifications_queue")
        .update({
          status: "failed",
          error_message: "Omitida por admin",
          updated_at: new Date().toISOString(),
        })
        .eq("id", notificationId)
        .select()
        .single();

      if (error) throw error;

      // Log audit
      await supabase.from("admin_audit_log").insert({
        admin_id: user.id,
        action: "update",
        target_type: "notification_queue",
        target_id: notificationId,
        changes: { action: "skip" },
        ip_address: request.headers.get("x-forwarded-for") || "unknown",
        user_agent: request.headers.get("user-agent") || "unknown",
        created_at: new Date().toISOString(),
      });

      return NextResponse.json({ notification: data });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
