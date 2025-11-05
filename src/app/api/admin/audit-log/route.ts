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
    const adminId = searchParams.get("adminId");
    const action = searchParams.get("action");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const format = searchParams.get("format");

    let query = supabase
      .from("admin_audit_log")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (adminId) {
      query = query.eq("admin_id", adminId);
    }

    if (action) {
      query = query.eq("action", action);
    }

    if (startDate) {
      query = query.gte("created_at", new Date(startDate).toISOString());
    }

    if (endDate) {
      query = query.lte("created_at", new Date(endDate).toISOString());
    }

    // Handle CSV export
    if (format === "csv") {
      const { data, error } = await query;

      if (error) throw error;

      const headers = [
        "ID",
        "Admin ID",
        "Action",
        "Target Type",
        "Target ID",
        "Changes",
        "IP Address",
        "User Agent",
        "Created At",
      ];

      const rows = (data || []).map((log: any) => [
        log.id,
        log.admin_id,
        log.action,
        log.target_type,
        log.target_id,
        JSON.stringify(log.changes),
        log.ip_address,
        log.user_agent,
        new Date(log.created_at).toISOString(),
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="audit-log-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // Regular JSON response with pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    return NextResponse.json({
      logs: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
