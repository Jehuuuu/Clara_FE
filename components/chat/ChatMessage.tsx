import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/common/Avatar";
import { Bot, User } from "lucide-react";

export type MessageRole = "user" | "assistant";

export interface ChatMessageProps {
  content: string;
  role: MessageRole;
  timestamp?: Date;
}

export function ChatMessage({ content, role, timestamp }: ChatMessageProps) {
  const isUser = role === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6 px-4`}>
      <div className={`flex max-w-[70%] ${isUser ? "flex-row-reverse" : "flex-row"} gap-3`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-blue-600" : "bg-gray-600"
          }`}>
            {isUser ? (
              <User className="h-4 w-4 text-white" />
            ) : (
              <Bot className="h-4 w-4 text-white" />
            )}
          </div>
        </div>
        
        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
          <div 
            className={`px-4 py-3 rounded-2xl ${
              isUser 
                ? "bg-blue-600 text-white rounded-tr-md" 
                : "bg-white border border-gray-200 text-gray-800 rounded-tl-md shadow-sm"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          </div>
          
          {/* Timestamp */}
          {timestamp && (
            <p className="text-xs text-gray-500 mt-1 px-1">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 