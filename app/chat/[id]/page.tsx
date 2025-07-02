"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addChatHistoryEntry,
  updateChatHistoryEntry,
  clearChatHistory,
} from "@/lib/historySlice";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatDisplay } from "@/components/chat-display";
import { ChatInput } from "@/components/chat-input";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  useSidebar,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { Message } from "@/components/chat-display";

function ChatContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const chatHistory: Message[] = useAppSelector(
    (state) => state.chatHistory.value
  );
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { state, isMobile } = useSidebar();

  const initializedRef = useRef(false);
  const processingInitialMessage = useRef(false);

  // Determine if sidebar is expanded
  const sidebarExpanded = state === "expanded" && !isMobile;

  useEffect(() => {
    const initialMessage = searchParams.get("message");

    if (
      initialMessage &&
      !initializedRef.current &&
      !processingInitialMessage.current
    ) {
      processingInitialMessage.current = true;
      initializedRef.current = true;

      // Clear chat history first
      dispatch(clearChatHistory());

      // Use setTimeout to ensure Redux state is updated before sending message
      setTimeout(() => {
        handleSendMessage(initialMessage);
      }, 0);
    }
  }, [searchParams]); // Remove chatHistory.length from dependencies

  const handleSendMessage = async (
    message: string,
    isEdit = false,
    editId?: number
  ) => {
    if (isLoading) return; // Remove processingInitialMessage check here
    setIsLoading(true);

    try {
      // Build API request messages BEFORE adding to Redux to avoid duplication
      const messages = chatHistory.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.message,
      }));
      messages.push({ role: "user", content: message });

      if (isEdit && editId) {
        // Update the existing message
        dispatch(updateChatHistoryEntry({ id: editId, message }));
        setEditingMessageId(null);

        // Add the edited message as a new entry at the bottom
        const newUserMessage = {
          id: Date.now(),
          sender: "user",
          message: `[Edited] ${message}`,
        };
        dispatch(addChatHistoryEntry(newUserMessage));
      } else {
        // Add new user message to Redux
        const userMessage = {
          id: Date.now(),
          sender: "user",
          message,
        };
        dispatch(addChatHistoryEntry(userMessage));
      }

      // Send to backend for Gemini response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const data = await response.json();

      if (data.result) {
        const aiResponse = {
          id: Date.now() + 1,
          sender: "model",
          message: data.result,
        };
        dispatch(addChatHistoryEntry(aiResponse));
      } else if (data.error) {
        console.error("Gemini API error:", data.error);
      }
    } catch (err) {
      console.error("Failed to fetch Gemini response:", err);
    } finally {
      setIsLoading(false);
      processingInitialMessage.current = false; // Reset this flag
    }
  };

  const handleEditMessage = (id: number) => {
    setEditingMessageId(id);
  };

  const handleCopyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
  };

  const handleClearChat = () => {
    dispatch(clearChatHistory());
    initializedRef.current = false;
    processingInitialMessage.current = false;
  };
  return (
    <>
      {/* Sidebar: fixed on the left, only when expanded or on mobile */}
      {sidebarExpanded && (
        <div className="fixed inset-y-0 left-0 z-30 w-[260px] border-r border-gray-700 bg-gray-800">
          <ChatSidebar />
        </div>
      )}
      {/* SidebarRail: show as a small tab when sidebar is collapsed (desktop only) */}
      {!sidebarExpanded && !isMobile && (
        <SidebarRail className="fixed left-0 top-0 z-40 h-screen" />
      )}
      {/* Main content: always centered in the viewport */}
      <div className="flex min-h-screen bg-gray-900 text-white w-full">
        <div className="w-full max-w-2xl flex flex-col h-[100vh] px-4 py-2 mx-auto border border-gray-500 rounded-2xl">
          {/* Header */}
          {/* <div className="border-b border-gray-700 p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-white">ChatGPT</h1>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleClearChat}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  Clear
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Plus
                </Button>
              </div>
            </div>
          </div> */}

          {/* Chat Display Component - Scrollable */}
          <ChatDisplay
            messages={chatHistory}
            isLoading={false}
            error={null}
            onEdit={handleEditMessage}
            onCopy={handleCopyMessage}
            editingMessageId={editingMessageId}
            onSendEdit={handleSendMessage}
            onCancelEdit={() => setEditingMessageId(null)}
            onRetry={() => {}}
          />

          {/* Input Area - Fixed at bottom */}
          <div className="border-t border-gray-700 p-4 flex-shrink-0">
            <ChatInput onSendMessage={handleSendMessage} isLoading={false} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function ChatPage() {
  return (
    <SidebarProvider>
      <ChatContent />
    </SidebarProvider>
  );
}
