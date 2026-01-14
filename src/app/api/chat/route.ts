import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /api/chat
 * Streaming chat endpoint using Vercel AI SDK
 * 
 * Body:
 * - messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>
 */
export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    console.log("Full request body:", JSON.stringify(body, null, 2));
    
    // The useChat hook sends messages in the body
    const messages = body.messages || body;

    if (!messages || !Array.isArray(messages)) {
      console.error("Messages validation failed:", { 
        messages, 
        isArray: Array.isArray(messages),
        bodyKeys: Object.keys(body || {})
      });
      return new Response("Messages array is required", { status: 400 });
    }

    if (messages.length === 0) {
      return new Response("At least one message is required", { status: 400 });
    }

    console.log("Received messages:", JSON.stringify(messages, null, 2));

    // Validate message structure
    const validMessages = messages.filter(msg => {
      if (!msg || typeof msg !== 'object') return false;
      // Check if it has role and content (UI message format)
      if (msg.role && (msg.content !== undefined || msg.parts)) return true;
      return false;
    });

    if (validMessages.length === 0) {
      console.error("No valid messages after filtering:", messages);
      return new Response("No valid messages found", { status: 400 });
    }

    console.log("Valid messages:", JSON.stringify(validMessages, null, 2));

    // Manually convert UI messages to ModelMessages format
    // streamText expects messages in the format: { role: 'user'|'assistant'|'system', content: string }
    type MessagePart = {
      type: string;
      text?: string;
    };

    const modelMessages = validMessages.map((msg) => {
      // Extract content - could be a string or in parts array
      let content = '';
      if (typeof msg.content === 'string') {
        content = msg.content;
      } else if (Array.isArray(msg.parts)) {
        // If content is in parts, extract text from parts
        content = (msg.parts as MessagePart[])
          .filter((part: MessagePart) => part.type === 'text')
          .map((part: MessagePart) => part.text || '')
          .join('');
      } else if (msg.content) {
        content = String(msg.content);
      }

      // Return in ModelMessage format
      return {
        role: msg.role,
        content: content,
      };
    }).filter(msg => msg.content && msg.role); // Filter out any invalid messages
    
    console.log("Converted model messages:", JSON.stringify(modelMessages, null, 2));
    
    if (modelMessages.length === 0) {
      return new Response("No valid messages after conversion", { status: 400 });
    }

    // System prompt with platform context
    const systemPrompt = `You are a helpful AI assistant for an e-commerce fulfillment platform. Your role is to help users with questions about:

**Platform Features:**
- Orders Management: Viewing all orders, pending orders, fulfilled orders, creating orders manually, tracking order status
- Inventory Management: Viewing inventory items, tracking stock levels, low stock alerts, adding new items, updating quantities
- Receiving: Logging incoming inventory, viewing receiving history
- Shipping: Generating shipping labels via DHL integration, calculating shipping rates
- Integrations: Connecting and managing Shopify stores, syncing orders from Shopify
- Settings: Managing user profile, company information, billing and subscriptions

**How to Help:**
- Answer questions about how to use platform features
- Guide users to the right sections of the dashboard
- Explain workflow processes (e.g., receiving inventory, fulfilling orders)
- Provide tips and best practices
- If you don't know something specific or need real-time data access, suggest they check the relevant section in the dashboard or contact support

**Tone:**
- Be friendly, professional, and concise
- Use clear, actionable language
- Break down complex processes into steps when helpful
- Acknowledge limitations (you can't access their real-time data or make changes)

Remember: You're here to guide and assist, not to access or modify user data directly.`;

    // Stream the response using Vercel AI SDK
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages: modelMessages,
    });

    // Pass originalMessages so the useChat hook can properly match the streamed response
    return result.toUIMessageStreamResponse({
      originalMessages: validMessages,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage, error);
    return new Response(
      JSON.stringify({ error: "Failed to generate chat response", details: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}