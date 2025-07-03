"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Mic, Square, Mic2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  onStop?: () => void;
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
  onStop,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleStop = () => {
    if (onStop) {
      onStop();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="w-full max-w-3xl">
      <div className="bg-[#303030] rounded-3xl p-2">
        <form onSubmit={handleSubmit} className="mb-0">
          <div className="flex items-center">
            <Textarea
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything"
              className="flex-1 bg-transparent border-0 text-white placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-sm py-2 px-3 min-h-0"
              rows={1}
            />
            <Button
              type="submit"
              disabled={!message.trim()}
              className="bg-white text-gray-900 hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 rounded-full p-2 flex-shrink-0"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </Button>
          </div>
        </form>

        <div className="flex justify-start gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white flex-shrink-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white flex-shrink-0"
          >
            <Mic2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
