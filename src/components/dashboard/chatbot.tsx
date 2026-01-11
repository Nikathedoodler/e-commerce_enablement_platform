"use client";

import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/utils";

type ChatbotProps = {
  className?: string;
};

export function Chatbot({ className }: ChatbotProps) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    api: "/api/chat",
  });

  const isLoading = status === "in_progress";

  // Debug logging
  useEffect(() => {
    console.log("Chatbot messages:", messages);
    console.log("Chatbot messages detailed:", JSON.stringify(messages, null, 2));
    console.log("Chatbot status:", status);
    console.log("Chatbot error:", error);
    
    // Check each message structure
    messages.forEach((msg, index) => {
      console.log(`Message ${index}:`, {
        id: msg.id,
        role: msg.role,
        content: msg.content,
        hasContent: !!msg.content,
        contentType: typeof msg.content,
        keys: Object.keys(msg),
      });
    });
  }, [messages, status, error]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    sendMessage({ content: input });
    setInput("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 min-h-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[300px] max-h-[600px] pr-2">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <p className="mb-2">Ask me anything about the platform!</p>
              <p className="text-sm">
                I can help with orders, inventory, shipping, integrations, and
                more.
              </p>
            </div>
          )}
          {messages.map((message) => {
            // Extract content - handle both string content and parts array format
            let content = '';
            if (typeof message.content === 'string') {
              content = message.content;
            } else if (Array.isArray(message.parts)) {
              // Extract text from parts array
              content = message.parts
                .filter((part: any) => part.type === 'text')
                .map((part: any) => part.text || part.content || '')
                .join('');
            } else if (message.content) {
              content = String(message.content);
            }

            // Don't render empty messages
            if (!content && message.role !== 'user') {
              return null;
            }

            return (
              <div
                key={message.id}
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
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
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
      </CardContent>
    </Card>
  );
}