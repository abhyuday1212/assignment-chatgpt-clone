"use client"

import { useRef, useEffect } from "react"
import { ChatMessage } from "@/components/chat-message"
import { Button } from "@/components/ui/button"

interface Message {
  id: number
  sender: string
  message: string
}

interface ChatDisplayProps {
  messages: Message[]
  streamingMessage?: {
    content: string
  }
  isLoading: boolean
  error?: Error | null
  onEdit: (id: number) => void
  onCopy: (message: string) => void
  editingMessageId: number | null
  onSendEdit: (message: string, isEdit: boolean, editId: number) => void
  onCancelEdit: () => void
  onRetry: () => void
}

export function ChatDisplay({
  messages,
  streamingMessage,
  isLoading,
  error,
  onEdit,
  onCopy,
  editingMessageId,
  onSendEdit,
  onCancelEdit,
  onRetry,
}: ChatDisplayProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage])

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="min-h-full px-6 py-8">
        {/* Empty state */}
        {messages.length === 0 && !isLoading && !streamingMessage && (
          <div className="flex items-center justify-center h-full min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-3xl font-medium text-gray-300 mb-4">How can I help you today?</h2>
              <p className="text-gray-500 text-lg">Start a conversation and I'll respond with AI-powered answers.</p>
              <p className="text-gray-600 text-sm mt-2">Note: Using mock responses due to API quota limits</p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-8">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-4xl w-full ${message.sender === "user" ? "pl-16" : "pr-16"}`}>
                <ChatMessage
                  message={message}
                  onEdit={onEdit}
                  onCopy={onCopy}
                  isEditing={editingMessageId === message.id}
                  onSendEdit={(msg) => onSendEdit(msg, true, message.id)}
                  onCancelEdit={onCancelEdit}
                />
              </div>
            </div>
          ))}

          {/* Streaming message */}
          {streamingMessage && (
            <div className="flex justify-start">
              <div className="max-w-4xl w-full pr-16">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-1.254.145a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.723V12a1 1 0 11-2 0v-1.277l-1.246-.855a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.277l1.246.855a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1.002 1.002 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.277V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364.372l.254.145V16a1 1 0 112 0v1.021l.254-.145a1 1 0 11.992 1.736l-1.735.992a.996.996 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-800 rounded-2xl p-4 text-gray-100">
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {streamingMessage.content}
                        {isLoading && <span className="inline-block w-2 h-6 bg-gray-400 ml-1 animate-pulse rounded" />}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex justify-center">
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-red-300 max-w-md">
                <p className="font-medium text-center mb-2">Something went wrong</p>
                <p className="text-sm opacity-80 text-center mb-4">{error.message}</p>
                <div className="flex justify-center">
                  <Button onClick={onRetry} size="sm" className="bg-red-600 hover:bg-red-700">
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
