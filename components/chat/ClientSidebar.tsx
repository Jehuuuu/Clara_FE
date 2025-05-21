"use client";

import { useAuth } from "@/context/AuthContext";
import { ChatSidebar } from "@/components/chat/ChatSidebar";

export function ClientSidebar() {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="hidden md:block h-[80vh] max-h-[700px] overflow-y-auto border rounded-lg">
      <ChatSidebar />
    </div>
  );
} 