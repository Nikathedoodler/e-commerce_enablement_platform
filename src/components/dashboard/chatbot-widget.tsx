"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Chatbot } from "./chatbot";
import { MessageCircle, X } from "lucide-react";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="w-[380px] h-[600px] shadow-lg animate-in slide-in-from-bottom-2 fade-in-0">
          <Chatbot className="h-full" />
        </div>
      )}
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