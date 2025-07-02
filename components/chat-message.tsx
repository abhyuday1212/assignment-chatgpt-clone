"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Edit, Check, X, User, Bot } from "lucide-react"

interface ChatMessageProps {
  message: {
    id: number
    sender: string
    message: string
  }
  onEdit: (id: number) => void
  onCopy: (message: string) => void
  isEditing: boolean
  onSendEdit: (message: string) => void
  onCancelEdit: () => void
}

export function ChatMessage({ message, onEdit, onCopy, isEditing, onSendEdit, onCancelEdit }: ChatMessageProps) {
  const [editText, setEditText] = useState(message.message)
  const [showActions, setShowActions] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopy(message.message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendEdit = () => {
    onSendEdit(editText)
  }

  const isUser = message.sender === "user"

  if (isEditing) {
    return (
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[120px] resize-none bg-gray-700 border-gray-600 text-white rounded-xl"
          />
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleSendEdit} className="bg-white text-gray-900 hover:bg-gray-100">
              <Check className="h-4 w-4 mr-2" />
              Send
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancelEdit}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group" onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isUser ? "bg-blue-500" : "bg-green-600"
            }`}
          >
            {isUser ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div
            className={`rounded-2xl p-4 ${
              isUser ? "bg-blue-600 text-white ml-auto max-w-3xl" : "bg-gray-800 text-gray-100 mr-auto max-w-4xl"
            }`}
          >
            <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{message.message}</p>
          </div>

          {/* Action buttons for user messages */}
          {showActions && isUser && (
            <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(message.id)}
                className="h-8 px-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="h-8 px-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 mr-1 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
