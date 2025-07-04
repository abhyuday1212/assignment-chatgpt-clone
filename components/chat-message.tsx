"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Edit, Check, X, User } from "lucide-react";

interface ChatMessageProps {
  message: {
    id: number;
    sender: string;
    message: any;
  };
  onEdit: (id: number) => void;
  onCopy: (message: string) => void;
  isEditing: boolean;
  onSendEdit: (message: string) => void;
  onCancelEdit: () => void;
}

export function ChatMessage({
  message,
  onEdit,
  onCopy,
  isEditing,
  onSendEdit,
  onCancelEdit,
}: ChatMessageProps) {
  const [editText, setEditText] = useState(message.message);
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(message.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEdit = () => {
    onSendEdit(editText);
  };

  const isUser = message.sender === "user";

  if (isEditing) {
    return (
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#303030] flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[120px] resize-none bg-[#303030] border-gray-600 text-white rounded-xl"
          />
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={handleSendEdit}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
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
    );
  }

  return (
    <div
      className="group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex-1 space-y-2">
        <div className="relative">
          {/* New wrapper div */}
          <div
            className={`rounded-2xl p-4 ${
              isUser
                ? "bg-[#303030] text-white ml-auto max-w-2xl  min-w-[8rem]  w-fit"
                : "text-[#FFFFFF] mr-auto max-w-2xl min-w-[8rem] w-fit"
            }`}
          >
            <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
              {message.message}
            </p>
          </div>
          {/* Action buttons positioned relative to wrapper */}
          {showActions && isUser && (
            <div className="absolute top-0 right-0 flex opacity-0 group-hover:opacity-70 transition-opacity duration-200 z-10 items-center">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(message.id)}
                className="h-5 px-3 rounded-lg"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="h-5 px-3 rounded-lg"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
