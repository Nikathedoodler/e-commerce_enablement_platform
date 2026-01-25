import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * POST /api/invite-codes/validate
 * Validates an invite code for registration
 * Uses service role client to allow anonymous validation
 */
export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Invite code is required", valid: false },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS for anonymous validation
    const supabase = createServiceRoleClient();

    // Check if invite code exists and is valid
    const { data: inviteCode, error } = await supabase
      .from("invite_codes")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !inviteCode) {
      return NextResponse.json(
        { error: "Invalid invite code", valid: false },
        { status: 404 }
      );
    }

    // Check if code has expired
    if (inviteCode.expires_at) {
      const expiresAt = new Date(inviteCode.expires_at);
      if (expiresAt < new Date()) {
        return NextResponse.json(
          { error: "Invite code has expired", valid: false },
          { status: 400 }
        );
      }
    }

    // Check if code has reached max uses
    if (
      inviteCode.max_uses &&
      inviteCode.current_uses >= inviteCode.max_uses
    ) {
      return NextResponse.json(
        { error: "Invite code has reached maximum uses", valid: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      code: inviteCode.code,
      maxUses: inviteCode.max_uses,
      currentUses: inviteCode.current_uses,
    });
  } catch (error) {
    console.error("Error validating invite code:", error);
    return NextResponse.json(
      { error: "Failed to validate invite code", valid: false },
      { status: 500 }
    );
  }
}
