import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/invite-codes/list
 * Lists all invite codes (admin only)
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify user is authenticated and is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get limit from query params (default 50)
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");

    // Fetch invite codes
    const { data: inviteCodes, error } = await supabase
      .from("invite_codes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching invite codes:", error);
      return NextResponse.json(
        { error: "Failed to fetch invite codes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ inviteCodes: inviteCodes || [] });
  } catch (error) {
    console.error("Error listing invite codes:", error);
    return NextResponse.json(
      { error: "Failed to list invite codes" },
      { status: 500 }
    );
  }
}
