"use client";

import { useEffect, useState } from "react";
import type React from "react";
import { useAppDispatch } from "@/store/hooks";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Paperclip, Mic2 } from "lucide-react";
import { clearChatHistory } from "@/store/slices/historySlice";
import { Textarea } from "@/components/ui/textarea";
import Sidebar from "@/components/Sidebar";
import { setExtractedText } from "@/store/slices/fileUploadSlice";
import axios from "axios";
import { UserButton } from "@clerk/nextjs";

export default function HomePage() {
  const params = useParams();
  const chatID = params.id as string;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const chatId = Date.now().toString();
      router.push(`/chat/${chatId}?message=${encodeURIComponent(inputValue)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
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
    dispatch(clearChatHistory(chatID));
  }, [dispatch]);

  return (
    <div className="flex h-screen text-white">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#212121]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">ChatGPT</span>
            <Button variant="ghost" size="sm" className="text-gray-400">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>

          <UserButton />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-white to-gray-700/80 bg-clip-text text-center text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-semibold leading-none text-transparent dark:from-black dark:to-slate-300/10 mb-16">
            What's on the agenda today?
          </span>

          {/* Input Area */}
          <div className="w-full max-w-3xl">
            <div className="bg-[#303030] rounded-3xl p-2">
              <form onSubmit={handleSubmit} className="mb-0">
                <div className="flex items-center gap-2">
                  <Textarea
                    autoFocus
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything"
                    className="flex-1 bg-transparent border-0 text-white placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                    rows={1}
                  />
                  <Button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="bg-white text-gray-900 hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 rounded-full p-2 flex-shrink-0"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
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
        </div>
      </div>
    </div>
  );
}
