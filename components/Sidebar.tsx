"use client";

import React from "react";
import { Button } from "./ui/button";
import { MessageSquare, Plus, Search, Settings, User } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { useParams, useRouter } from "next/navigation";
import { clearChatHistory } from "@/store/slices/historySlice";
import { UserButton } from "@clerk/nextjs";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const param = useParams();
  const chatID = param.id as string;

  const handleNewChat = () => {
    dispatch(clearChatHistory(chatID));
    router.push(`/`);
  };

  const recentChats = [
    "Odd sum handling fix",
    "Perfect Sum Issue",
    "NextAuth Redirect Loop Fix",
    "OrderSlice and Cart API",
    "TLE Fix with Memoization",
    "Verification Status Filtering",
  ];

  return (
    <div className="w-64 bg-[#181818] flex flex-col">
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

      <div className="p-2 border-t border-gray-700 flex items-center justify-between text-gray-50">
        <UserButton
          showName
          appearance={{
            elements: {
              userButtonText: "text-white",
              userButtonBox: "text-white",
              avatarBox: "text-white",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
