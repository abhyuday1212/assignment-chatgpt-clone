"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addChatHistoryEntry,
  updateChatHistoryEntry,
  clearChatHistory,
} from "@/lib/historySlice";
import { ChatDisplay } from "@/components/chat-display";
import { ChatInput } from "@/components/chat-input";

import type { Message } from "@/components/chat-display";
import Sidebar from "@/components/Sidebar";

function ChatContent() {
  const params = useParams();
  const chatID = params.id;
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const chatHistory: Message[] = useAppSelector(
    (state) => state.chatHistory.value
  );
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initializedRef = useRef(false);
  const processingInitialMessage = useRef(false);

  useEffect(() => {
    const initialMessage = searchParams.get("message");

    if (
      initialMessage &&
      !initializedRef.current &&
      !processingInitialMessage.current
    ) {
      processingInitialMessage.current = true;
      initializedRef.current = true;

      dispatch(clearChatHistory());

      setTimeout(() => {
        handleSendMessage(initialMessage);
      }, 0);
    }
  }, [searchParams]);

  const handleSendMessage = async (
    message: string,
    isEdit = false,
    editId?: number
  ) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const messages = chatHistory.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.message,
      }));
      messages.push({ role: "user", content: message });

      if (isEdit && editId) {
        dispatch(updateChatHistoryEntry({ id: editId, message }));
        setEditingMessageId(null);

        const newUserMessage = {
          id: Date.now(),
          sender: "user",
          message: `[Edited] ${message}`,
        };
        dispatch(addChatHistoryEntry(newUserMessage));
      } else {
        const userMessage = {
          id: Date.now(),
          sender: "user",
          message,
        };
        dispatch(addChatHistoryEntry(userMessage));
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, chatID }),
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
      processingInitialMessage.current = false;
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
    <div className="flex h-screen text-white">
      <Sidebar />

      {/* Main content: always centered in the viewport */}
      <div className="flex min-h-screen bg-[#212121] w-full">
        <div className="w-full max-w-4xl flex flex-col h-[100vh] px-4 py-2 mx-auto">
          {/* Chat Display Component */}
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
    </div>
  );
}

export default function ChatPage() {
  return (
    <>
      <ChatContent />
    </>
  );
}
