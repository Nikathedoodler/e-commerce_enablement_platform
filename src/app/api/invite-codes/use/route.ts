import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/invite-codes/use
 * Marks an invite code as used after successful registration
 * This should be called after user signs up successfully
 */
export async function POST(req: NextRequest) {
  try {
    const { code, userId } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Invite code is required" },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the invite code
    const { data: inviteCode, error: fetchError } = await supabase
      .from("invite_codes")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .single();

    if (fetchError || !inviteCode) {
      return NextResponse.json(
        { error: "Invite code not found" },
        { status: 404 }
      );
    }

    // Check if code is still valid
    if (!inviteCode.is_active) {
      return NextResponse.json(
        { error: "Invite code is not active" },
        { status: 400 }
      );
    }

    if (
      inviteCode.max_uses &&
      inviteCode.current_uses >= inviteCode.max_uses
    ) {
      return NextResponse.json(
        { error: "Invite code has reached maximum uses" },
        { status: 400 }
      );
    }

    // Update invite code usage
    const { error: updateError } = await supabase
      .from("invite_codes")
      .update({
        used_by: userId,
        used_at: new Date().toISOString(),
        current_uses: (inviteCode.current_uses || 0) + 1,
        // If single-use code, deactivate it
        is_active:
          inviteCode.max_uses === 1
            ? false
            : inviteCode.current_uses + 1 < inviteCode.max_uses,
      })
      .eq("id", inviteCode.id);

    if (updateError) {
      console.error("Error updating invite code:", updateError);
      return NextResponse.json(
        { error: "Failed to update invite code" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error using invite code:", error);
    return NextResponse.json(
      { error: "Failed to use invite code" },
      { status: 500 }
    );
  }
}
