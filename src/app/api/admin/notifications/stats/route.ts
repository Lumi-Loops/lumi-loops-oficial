import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
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
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("admin_notifications_queue")
      .select("status");

    if (error) throw error;

    const stats = {
      queued: 0,
      sending: 0,
      sent: 0,
      failed: 0,
      total: data?.length || 0,
    };

    (data || []).forEach((item: any) => {
      if (item.status in stats) {
        stats[item.status as keyof typeof stats]++;
      }
    });

    const failureRate =
      stats.total > 0 ? ((stats.failed / stats.total) * 100).toFixed(2) : "0";

    return NextResponse.json({
      stats: {
        ...stats,
        failureRate: parseFloat(failureRate as string),
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
