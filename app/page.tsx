"use client";
import { useEffect, useState } from "react";
import type React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Plus,
  Search,
  Library,
  Settings,
  User,
  Mic,
  Paperclip,
} from "lucide-react";
import { clearChatHistory } from "@/lib/historySlice";

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState("");

  const handleNewChat = () => {
    dispatch(clearChatHistory());
    router.push(`/`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const chatId = Date.now().toString();
      router.push(`/chat/${chatId}?message=${encodeURIComponent(inputValue)}`);
    }
  };

  useEffect(() => {
    dispatch(clearChatHistory());
    return () => {};
  }, [dispatch]);

  const recentChats = [
    "Odd sum handling fix",
    "Perfect Sum Issue",
    "NextAuth Redirect Loop Fix",
    "OrderSlice and Cart API",
    "TLE Fix with Memoization",
    "Verification Status Filtering",
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 flex flex-col">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">ChatGPT</h1>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={handleNewChat}
            className="w-full justify-start gap-2 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
          >
            <Plus className="h-4 w-4" />
            New chat
          </Button>
        </div>

        <div className="flex-1 px-4 overflow-y-auto">
          <div className="space-y-2 mb-6">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-700"
            >
              <Search className="h-4 w-4" />
              Search chats
            </Button>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">
              Chats
            </h3>
            {recentChats.map((chat, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-sm text-gray-300 hover:bg-gray-700 h-8 px-2"
              >
                <MessageSquare className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="truncate">{chat}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-700"
          >
            <User className="h-4 w-4" />
            Profile
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
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
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-medium text-white mb-8">
              What's on the agenda today?
            </h1>
          </div>

          {/* Input Area */}
          <div className="w-full max-w-3xl">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center bg-gray-700 rounded-lg p-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-black  mr-2"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>

                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything"
                  className="flex-1 bg-transparent border-0 text-white placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />

                <div className="flex items-center gap-2 ml-2">
                  <Button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="bg-white text-gray-900 hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 rounded-full p-2"
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
