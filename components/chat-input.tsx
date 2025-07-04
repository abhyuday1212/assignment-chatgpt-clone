"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Mic, Square, Mic2 } from "lucide-react";
import axios from "axios";
import { setExtractedText } from "@/store/slices/fileUploadSlice";
import { useAppDispatch } from "@/store/hooks";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
  setIsLoading,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setIsLoading(true);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data.data;

      if (!res.status) {
        console.error("Upload failed:", data.message);
        alert("Failed to upload file. Please try again.");
        dispatch(setExtractedText(""));
        return;
      }

      const extractedText = data.extractedText;
      if (extractedText) {
        dispatch(setExtractedText(extractedText));
      }
      console.log("Upload response:", data);
    } catch (error) {
      console.error("Upload error:", error);
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
              disabled={!message.trim() || isLoading}
              className="bg-white text-gray-900 hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 rounded-full p-2 flex-shrink-0 w-8 h-8 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              )}
            </Button>
          </div>
        </form>

        <div className="flex justify-start items-center gap-2">
          {/* PDF Input */}
          <label className="text-gray-400 hover:text-white flex-shrink-0 cursor-pointer flex ml-2">
            <Paperclip className="h-4 w-4" />
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  console.log("Selected file:", file);
                  await handleUpload(file);
                }
              }}
            />
          </label>

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
