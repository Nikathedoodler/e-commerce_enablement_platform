"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Chatbot } from "./chatbot";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils/utils";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Keep Chatbot mounted but hide it when closed to preserve state */}
      <div
        className={cn(
          "w-[380px] h-[600px] shadow-lg transition-all duration-200",
          isOpen ? "block" : "hidden"
        )}
      >
        <Chatbot className="h-full w-full" />
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