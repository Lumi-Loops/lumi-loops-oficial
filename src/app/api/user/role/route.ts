import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Supabase error fetching profile:", error);
      return NextResponse.json(
        { error: "Failed to fetch user role", details: error.message },
        { status: 500 }
      );
    }

    if (!profile) {
      console.warn("No profile found for user:", user.id);
      return NextResponse.json({ role: "client" });
    }

    return NextResponse.json({ role: profile.role || "client" });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    console.error("Error in /api/user/role:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
