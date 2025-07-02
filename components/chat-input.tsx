"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Mic, Square } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
  onStop?: () => void
}

export function ChatInput({ onSendMessage, isLoading = false, onStop }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleStop = () => {
    if (onStop) {
      onStop()
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end space-x-2 bg-gray-700 rounded-lg p-3">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="flex-shrink-0 text-gray-400 hover:text-white"
          disabled={isLoading}
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? "AI is responding..." : "Ask anything..."}
          className="flex-1 min-h-[40px] max-h-32 resize-none border-0 bg-transparent text-white placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          rows={1}
          disabled={isLoading}
        />

        <div className="flex space-x-1">
          {/* <Button
            type="button"
            size="sm"
            variant="ghost"
            className="flex-shrink-0 text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            <Mic className="h-4 w-4" />
          </Button> */}

          {isLoading ? (
            <Button
              type="button"
              size="sm"
              onClick={handleStop}
              className="flex-shrink-0 bg-red-600 text-white hover:bg-red-700 rounded-full p-2"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="sm"
              disabled={!message.trim()}
              className="flex-shrink-0 bg-white text-gray-900 hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 rounded-full p-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="absolute -top-8 left-0 text-xs text-gray-400 flex items-center">
          <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400 mr-2"></div>
          AI is generating response...
        </div>
      )}
    </form>
  )
}
