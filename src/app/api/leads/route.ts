import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const result = await req.json();

    if (!result.email || typeof result.email !== "string") {
      return NextResponse.json(
        {
          error: "Email is required",
        },
        { status: 400 }
      );
    }

    const email = result.email.trim().toLowerCase();
    const source = result.source.trim().toLowerCase();
    const { error } = await supabase.from("leads").insert({ email, source });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "email could not be inserted" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "email registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Failed to register email",
      },
      { status: 500 }
    );
  }
}
