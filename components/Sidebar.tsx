"use client";

import React from "react";
import { Button } from "./ui/button";
import { MessageSquare, Plus, Search, X } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { useParams, useRouter } from "next/navigation";
import { clearChatHistory } from "@/store/slices/historySlice";
import { UserButton } from "@clerk/nextjs";
import { recentChats } from "@/lib/data/sidebar-chats";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = useParams();
  const chatID = id as string;

  const handleNewChat = () => {
    dispatch(clearChatHistory(chatID));
    router.push(`/`);
    onClose();
  };

  return (
    <>
      {/* Desktop (always visible on md+) */}
      <div className="hidden md:flex w-64 bg-[#181818] flex-col">
        <SidebarContent onNewChat={handleNewChat} />
      </div>

      {/* Mobile Drawer */}
      <div className="fixed inset-0 z-50 flex md:hidden pointer-events-none">
        {/* backdrop */}
        <div
          onClick={onClose}
          className={`
            absolute inset-0 bg-black
            transition-opacity duration-300 ease-in-out
            ${isOpen ? "opacity-50 pointer-events-auto" : "opacity-0"}
          `}
        />

        {/* panel */}
        <div
          className={`
            relative w-64 bg-[#181818] flex flex-col z-10
            transform transition-transform duration-300 ease-in-out
            ${
              isOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full"
            }
          `}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h1 className="text-xl font-semibold">ChatGPT</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <SidebarContent onNewChat={handleNewChat} />
        </div>
      </div>
    </>
  );
}

function SidebarContent({ onNewChat }: { onNewChat: () => void }) {
  return (
    <>
      <div className="p-4">
        <Button
          onClick={onNewChat}
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
          {recentChats.map((chat, i) => (
            <Button
              key={i}
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
    </>
  );
}
