"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/utils";

// Dynamically import ReactMarkdown to reduce initial bundle size
// Only loads when chatbot is rendered (lazy-loaded component)
const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-2">
      <div className="h-4 w-full bg-muted rounded" />
      <div className="h-4 w-5/6 bg-muted rounded" />
      <div className="h-4 w-4/6 bg-muted rounded" />
    </div>
  ),
});

type ChatbotProps = {
  className?: string;
  sizeControls?: React.ReactNode;
  noCard?: boolean;
};

type ChatMessage = {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string | unknown;
  parts?: Array<{ type: string; text?: string; content?: string }>;
  text?: string;
};

// Chat component that uses useChat - separated to allow conditional rendering
// This ensures useChat only initializes AFTER we have the initial messages
function ChatContent({ initialMessages }: { initialMessages: ChatMessage[] }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ensure messages are in the correct format for useChat
  // useChat expects: { id: string, role: 'user' | 'assistant' | 'system', content: string }
  // Format messages once and create a stable reference
  const formattedInitialMessages = useMemo(() => {
    if (!initialMessages || initialMessages.length === 0) return [];
    // Map and deduplicate messages by id
    const messageMap = new Map();
    initialMessages.forEach((msg, index) => {
      const id = msg.id || `msg-${Date.now()}-${index}-${Math.random()}`;
      // Only keep the first occurrence of each id
      if (!messageMap.has(id)) {
        messageMap.set(id, {
          id,
          role: msg.role as "user" | "assistant" | "system",
          content:
            typeof msg.content === "string"
              ? msg.content
              : String(msg.content || ""),
        });
      }
    });
    return Array.from(messageMap.values());
  }, [initialMessages]);

  // Debug: Log initial messages to verify they're being passed correctly
  useEffect(() => {
    console.log(
      "ChatContent initialized with messages:",
      formattedInitialMessages
    );
    console.log("Formatted messages count:", formattedInitialMessages.length);
  }, [formattedInitialMessages]);

  const { messages, sendMessage, status, error, setMessages } = useChat({
    // @ts-expect-error - api property exists in runtime but types may be outdated
    api: "/api/chat",
    initialMessages: formattedInitialMessages,
  });

  // Manually set messages if useChat didn't pick them up from initialMessages
  // This is a workaround for cases where initialMessages aren't properly initialized
  useEffect(() => {
    console.log("useChat hook initialized");
    console.log("useChat initialMessages prop:", formattedInitialMessages);
    console.log("useChat current messages:", messages);

    // If formattedInitialMessages exist but useChat messages are empty, set them manually
    // Only do this once on mount (when messages are empty but we have initialMessages)
    if (formattedInitialMessages.length > 0 && messages.length === 0) {
      console.log("Attempting to set messages manually");
      if (setMessages) {
        console.log("Using setMessages function");
        // Deduplicate messages by id before setting
        const uniqueMessages = formattedInitialMessages.filter(
          (msg, index, self) => index === self.findIndex((m) => m.id === msg.id)
        );
        setMessages(uniqueMessages);
      } else {
        console.warn("setMessages not available from useChat hook");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom when messages change or when streaming
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Debug: Log messages from useChat hook
  useEffect(() => {
    console.log("useChat messages:", messages);
    console.log("useChat messages length:", messages.length);
  }, [messages]);

  // Save messages to database whenever they change (debounced)
  useEffect(() => {
    if (messages.length > 0) {
      const timeoutId = setTimeout(async () => {
        try {
          const response = await fetch("/api/chat/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages }),
          });
          if (!response.ok) {
            console.error(
              "Failed to save chat messages:",
              await response.text()
            );
          }
        } catch (error) {
          console.error("Failed to save chat messages:", error);
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // @ts-expect-error - sendMessage accepts content in this format at runtime
    sendMessage({ content: input });
    setInput("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-0 min-h-0 pr-2 pt-0">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p className="mb-2">Ask me anything about the platform!</p>
            <p className="text-sm">
              I can help with orders, inventory, shipping, integrations, and
              more.
            </p>
          </div>
        )}
        {messages
          .filter((message, index, self) => {
            // Deduplicate messages by id - keep only the first occurrence
            return index === self.findIndex((m) => m.id === message.id);
          })
          .map((message, index) => {
            // Extract content - handle both string content and parts array format
            // UIMessage from @ai-sdk/react can have content as string or in parts array
            // Use type assertion to access properties that may exist at runtime
            const msg = message as unknown as {
              content?: string | unknown;
              parts?: Array<{ type: string; text?: string; content?: string }>;
              text?: string;
            };
            
            let content = "";
            if (typeof msg.content === "string") {
              content = msg.content;
            } else if (Array.isArray(msg.parts)) {
              // Extract text from parts array
              content = msg.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text || part.content || "")
                .join("");
            } else if (msg.content) {
              content = String(msg.content);
            } else if (typeof msg.text === "string") {
              content = msg.text;
            }

            // Don't render empty messages
            if (!content && message.role !== "user") {
              return null;
            }

            // Ensure unique key by combining id with index as fallback
            const uniqueKey = message.id || `msg-${index}-${Date.now()}`;

            return (
              <div
                key={uniqueKey}
                className={cn(
                  "flex flex-col gap-2",
                  message.role === "user" ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-[80%]",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside mb-2">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside mb-2">
                              {children}
                            </ol>
                          ),
                          code: ({ children, className }) => {
                            const isInline = !className;
                            return isInline ? (
                              <code className="bg-muted-foreground/20 px-1 py-0.5 rounded text-sm">
                                {children}
                              </code>
                            ) : (
                              <code className="block bg-muted-foreground/20 p-2 rounded text-sm overflow-x-auto">
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{content}</p>
                  )}
                </div>
              </div>
            );
          })}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="bg-muted rounded-lg px-4 py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2 text-sm text-destructive">
            Error: {error.message || "Failed to get response"}
          </div>
        )}
        {/* Scroll anchor for auto-scroll */}
        <div ref={messagesEndRef} className="h-0" />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-2 mb-0">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a question..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}

export function Chatbot({
  className,
  sizeControls,
  noCard = false,
}: ChatbotProps) {
  const [initialMessages, setInitialMessages] = useState<ChatMessage[] | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Load messages from database on mount
  useEffect(() => {
    async function loadMessages() {
      try {
        const response = await fetch("/api/chat/messages");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched messages from API:", data.messages);
          setInitialMessages(data.messages || []);
        } else {
          console.error("Failed to fetch messages, status:", response.status);
          setInitialMessages([]);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
        setInitialMessages([]);
      } finally {
        setIsLoadingHistory(false);
      }
    }
    loadMessages();
  }, []);

  // Format messages before passing to ChatContent to ensure they're ready
  // MUST be called before any early returns to follow Rules of Hooks
  const formattedMessages = useMemo(() => {
    if (!initialMessages || initialMessages.length === 0) return [];
    // Map and deduplicate messages by id
    const messageMap = new Map();
    initialMessages.forEach((msg, index) => {
      const id = msg.id || `msg-${Date.now()}-${index}-${Math.random()}`;
      // Only keep the first occurrence of each id
      if (!messageMap.has(id)) {
        messageMap.set(id, {
          id,
          role: msg.role as "user" | "assistant" | "system",
          content:
            typeof msg.content === "string"
              ? msg.content
              : String(msg.content || ""),
        });
      }
    });
    return Array.from(messageMap.values());
  }, [initialMessages]);

  // Show loading state while fetching history
  // We MUST wait for messages to load before initializing useChat
  // because useChat only reads initialMessages on first render
  if (isLoadingHistory || initialMessages === null) {
    if (noCard) {
      return (
        <div className={cn("flex flex-col h-full", className)}>
          <div className="flex flex-col flex-1 min-h-0 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </div>
      );
    }

    return (
      <Card className={cn("flex flex-col h-full", className)}>
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 min-h-0 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (noCard) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        <div className="flex flex-col flex-1 min-h-0 px-4">
          {/* Pass formatted messages to ensure useChat receives them correctly */}
          {/* Only render ChatContent once messages are loaded (no key to avoid remounting) */}
          <ChatContent initialMessages={formattedMessages} />
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader className="pb-3 pt-1 flex flex-row items-center justify-between">
        <CardTitle>AI Assistant</CardTitle>
        {sizeControls && <div className="flex gap-1">{sizeControls}</div>}
      </CardHeader>
      <CardContent className="flex flex-col flex-1 min-h-0 pb-0 pt-0 px-4">
        {/* Pass formatted messages to ensure useChat receives them correctly */}
        {/* Only render ChatContent once messages are loaded (no key to avoid remounting) */}
        <ChatContent initialMessages={formattedMessages} />
      </CardContent>
    </Card>
  );
}
