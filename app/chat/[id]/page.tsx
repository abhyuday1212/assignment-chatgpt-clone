"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { useChat } from "ai/react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { addChatHistoryEntry, updateChatHistoryEntry, clearChatHistory } from "@/lib/historySlice"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatDisplay } from "@/components/chat-display"
import { ChatInput } from "@/components/chat-input"
import { Button } from "@/components/ui/button"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function ChatPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const chatHistory = useAppSelector((state) => state.chatHistory.value)
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null)
  const [initialized, setInitialized] = useState(false)

  // AI SDK useChat hook for streaming
  const {
    messages: aiMessages,
    input,
    handleInputChange,
    handleSubmit: handleAISubmit,
    isLoading,
    error,
    setMessages,
    append,
    reload,
    stop,
  } = useChat({
    api: "/api/chat",
    onResponse: (response) => {
      console.log("Received response:", response.status)
    },
    onFinish: (message) => {
      // Add the completed AI response to Redux store
      const aiResponse = {
        id: Date.now(),
        sender: "model",
        message: message.content,
      }
      dispatch(addChatHistoryEntry(aiResponse))
    },
    onError: (error) => {
      console.error("Chat error:", error)
    },
  })

  // Handle initial message from URL params
  useEffect(() => {
    const initialMessage = searchParams.get("message")
    if (initialMessage && !initialized) {
      setInitialized(true)
      handleSendMessage(initialMessage)
    }
  }, [searchParams, initialized])

  const handleSendMessage = async (message: string, isEdit = false, editId?: number) => {
    if (isEdit && editId) {
      // Update the existing message
      dispatch(updateChatHistoryEntry({ id: editId, message }))
      setEditingMessageId(null)

      // Add the edited message as a new entry at the bottom
      const newUserMessage = {
        id: Date.now(),
        sender: "user",
        message: `[Edited] ${message}`,
      }
      dispatch(addChatHistoryEntry(newUserMessage))

      // Send to AI with updated context
      await append({
        role: "user",
        content: message,
      })
    } else {
      // Add new user message to Redux
      const userMessage = {
        id: Date.now(),
        sender: "user",
        message,
      }
      dispatch(addChatHistoryEntry(userMessage))

      // Send to AI SDK for streaming response
      await append({
        role: "user",
        content: message,
      })
    }
  }

  const handleEditMessage = (id: number) => {
    setEditingMessageId(id)
  }

  const handleCopyMessage = (message: string) => {
    navigator.clipboard.writeText(message)
  }

  const handleClearChat = () => {
    dispatch(clearChatHistory())
    setMessages([])
  }

  const handleStopGeneration = () => {
    stop()
  }

  const handleRetry = () => {
    reload()
  }

  // Get the current streaming message if any
  const streamingMessage = aiMessages.find(
    (msg) => msg.role === "assistant" && !chatHistory.find((historyMsg) => historyMsg.message === msg.content),
  )

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-900 text-white">
        <ChatSidebar />

        <div className="flex-1 flex justify-center">
          {/* Centered container with 4xl max width */}
          <div className="w-full max-w-4xl flex flex-col h-full">
            {/* Header */}
            <div className="border-b border-gray-700 p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-white">ChatGPT</h1>
                <div className="flex items-center gap-2">
                  {isLoading && (
                    <Button
                      onClick={handleStopGeneration}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      Stop
                    </Button>
                  )}
                  {error && (
                    <Button
                      onClick={handleRetry}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      Retry
                    </Button>
                  )}
                  <Button
                    onClick={handleClearChat}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    Clear
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Plus</Button>
                </div>
              </div>
            </div>

            {/* Chat Display Component - Scrollable */}
            <ChatDisplay
              messages={chatHistory}
              streamingMessage={streamingMessage}
              isLoading={isLoading}
              error={error}
              onEdit={handleEditMessage}
              onCopy={handleCopyMessage}
              editingMessageId={editingMessageId}
              onSendEdit={handleSendMessage}
              onCancelEdit={() => setEditingMessageId(null)}
              onRetry={handleRetry}
            />

            {/* Input Area - Fixed at bottom */}
            <div className="border-t border-gray-700 p-4 flex-shrink-0">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} onStop={handleStopGeneration} />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
