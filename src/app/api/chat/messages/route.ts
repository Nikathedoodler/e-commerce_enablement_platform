import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/chat/messages
 * Retrieves chat messages for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch messages for the user, ordered by creation time
    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("id, role, content, message_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching chat messages:", error);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    // Transform messages to format expected by useChat hook
    const formattedMessages = (messages || []).map((msg) => ({
      id: msg.message_id || msg.id,
      role: msg.role,
      content: msg.content,
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error("Chat messages API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/messages
 * Saves chat messages for the authenticated user
 * Body: { messages: Array<{ id?, role, content }> }
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Delete existing messages for this user (we're replacing the entire history)
    // This is simpler than trying to sync individual messages
    const { error: deleteError } = await supabase
      .from("chat_messages")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting existing messages:", deleteError);
      // Continue anyway - this is not critical
    }

    // Prepare messages for insertion (filter out system messages if any)
    const messagesToInsert = messages
      .filter((msg: any) => msg.role !== "system")
      .map((msg: any) => {
        // Extract content - handle both string and parts array format
        let content = "";
        if (typeof msg.content === "string") {
          content = msg.content;
        } else if (Array.isArray(msg.parts)) {
          content = msg.parts
            .filter((part: any) => part.type === "text")
            .map((part: any) => part.text || part.content || "")
            .join("");
        } else if (msg.content) {
          content = String(msg.content);
        }

        return {
          user_id: user.id,
          role: msg.role,
          content: content,
          message_id: msg.id,
        };
      })
      .filter((msg: any) => msg.content && msg.role); // Filter out empty messages

    if (messagesToInsert.length === 0) {
      return NextResponse.json({ success: true, saved: 0 });
    }

    // Insert messages
    const { error: insertError } = await supabase
      .from("chat_messages")
      .insert(messagesToInsert);

    if (insertError) {
      console.error("Error saving chat messages:", insertError);
      return NextResponse.json(
        { error: "Failed to save messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      saved: messagesToInsert.length,
    });
  } catch (error) {
    console.error("Chat messages API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}