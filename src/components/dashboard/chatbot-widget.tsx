"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Chatbot } from "./chatbot";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils/utils";

type ChatSize = "small" | "large";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatSize, setChatSize] = useState<ChatSize>("small");

  // Size configuration for the whole bubble
  const sizeConfig = {
    small: {
      width: "w-[380px]",
      height: "h-[600px]",
    },
    large: {
      width: "w-[480px]",
      height: "h-[800px]",
    },
  };

  const currentSizeConfig = sizeConfig[chatSize];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Keep Chatbot mounted but hide it when closed to preserve state */}
      <div
        className={cn(
          currentSizeConfig.width,
          currentSizeConfig.height,
          "shadow-lg transition-all duration-200 rounded-lg overflow-hidden",
          isOpen ? "block" : "hidden"
        )}
      >
        <div className="relative h-full w-full">
          {/* Size controls in the header area */}
          <div className="absolute top-2 right-2 z-10 flex gap-1">
            <button
              onClick={() => setChatSize("small")}
              className={cn(
                "px-2 py-1 text-xs rounded border transition-colors",
                chatSize === "small"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background/80 border-border hover:bg-background/90 backdrop-blur-sm"
              )}
            >
              Small
            </button>
            <button
              onClick={() => setChatSize("large")}
              className={cn(
                "px-2 py-1 text-xs rounded border transition-colors",
                chatSize === "large"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background/80 border-border hover:bg-background/90 backdrop-blur-sm"
              )}
            >
              Large
            </button>
          </div>
          <Chatbot className="h-full w-full" />
        </div>
      </div>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className="rounded-full h-14 w-14 shadow-lg"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}
