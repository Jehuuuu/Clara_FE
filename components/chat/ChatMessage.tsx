import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/common/Avatar";

export type MessageRole = "user" | "assistant";

export interface ChatMessageProps {
  content: string;
  role: MessageRole;
  timestamp?: Date;
}

export function ChatMessage({ content, role, timestamp }: ChatMessageProps) {
  const isUser = role === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div className="flex-shrink-0 mr-2">
          <Avatar>
            <AvatarImage 
              src={isUser ? "/avatars/user.png" : "/avatars/assistant.png"} 
              alt={isUser ? "User" : "Clara Assistant"}
            />
            <AvatarFallback>{isUser ? "U" : "C"}</AvatarFallback>
          </Avatar>
        </div>
        <div 
          className={`px-4 py-3 rounded-lg ${
            isUser 
              ? "bg-primary text-primary-foreground rounded-tr-none" 
              : "bg-muted rounded-tl-none"
          }`}
        >
          <p className="text-sm">{content}</p>
          {timestamp && (
            <p className={`text-xs mt-1 ${isUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 