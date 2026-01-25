import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

/**
 * POST /api/invite-codes/generate
 * Generates a new invite code (admin only)
 * 
 * Body:
 * - maxUses?: number (default: 1)
 * - expiresInDays?: number (optional)
 * - notes?: string (optional)
 */
export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const maxUses = body.maxUses || 1;
    const expiresInDays = body.expiresInDays;
    const notes = body.notes;

    // Generate a random invite code (8 characters, alphanumeric)
    const code = crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()
      .slice(0, 8);

    // Calculate expiration date if provided
    let expiresAt: string | null = null;
    if (expiresInDays && typeof expiresInDays === "number") {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + expiresInDays);
      expiresAt = expirationDate.toISOString();
    }

    // Insert invite code
    const { data: inviteCode, error: insertError } = await supabase
      .from("invite_codes")
      .insert({
        code,
        created_by: user.id,
        max_uses: maxUses,
        expires_at: expiresAt,
        notes: notes || null,
        is_active: true,
        current_uses: 0,
      })
      .select()
      .single();

    if (insertError || !inviteCode) {
      console.error("Error creating invite code:", insertError);
      return NextResponse.json(
        { error: "Failed to create invite code" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      inviteCode: {
        code: inviteCode.code,
        maxUses: inviteCode.max_uses,
        expiresAt: inviteCode.expires_at,
        notes: inviteCode.notes,
        createdAt: inviteCode.created_at,
      },
    });
  } catch (error) {
    console.error("Error generating invite code:", error);
    return NextResponse.json(
      { error: "Failed to generate invite code" },
      { status: 500 }
    );
  }
}
