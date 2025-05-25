"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { getAllChats, addChat } from "../lib/api/chat"; // Adjust the import path as needed

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface CreateChatParams {
  politician: string;
  position: string;
}

export interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface QAndA {
  id: number;
  chat: number;
  question: string;
  answer: string;
  created_at: string;
}

export interface Chat {
  id: number;
  politician: string;
  user: number;
  research_report: number;
  qanda_set: QAndA[]; // or just `any[]` if structure is unknown
  created_at: string;
}


interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  isLoadingChats: boolean;
  createChat: (params: CreateChatParams, token: string | null) => Promise<void>;
  updateChat: (chatId: number, updates: Partial<Omit<Chat, "id">>) => void;
  deleteChat: (chatId: number) => void;
  setCurrentChat: (chatId: number) => void;
  addMessageToCurrentChat: (message: Omit<Message, "id">) => void;
  clearCurrentChat: () => void;
  clearAllChats: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user, getToken } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChatState] = useState<Chat | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(true);

  // Helper function to convert API dates to Date objects
  const formatDates = (chat: any): Chat => ({
    id: chat.id,
    politician: chat.politician,
    user: chat.user,
    research_report: chat.research_report,
    qanda_set: chat.qanda_set || [],
    created_at: chat.created_at,
  });


  // Helper function to get authorization header
  const getAuthHeader = async () => {
    const token = await getToken();
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  // Load chats from API when user is authenticated
  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;

      console.log("Fetching chats for user:", user.username);
      console.log("User token:", user.refreshToken);

      try {
        const chats = await getAllChats(user.refreshToken || null);
        setChats(chats);
        console.log("Fetched chats:", chats);
        setIsLoadingChats(false);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      }
    };

    fetchChats();
  }, [user]);
  
  // Create a new chat
  const createChat = async (
    params: CreateChatParams,
    token: string | null
  ): Promise<void> => {
    if (!token) {
      console.log('User not authenticated — cannot create persistent chat.');
      return;
    }

    try {
      const newChat = await addChat(params, token);
      console.log('Chat created successfully:', newChat);
      // Optionally update state or UI here
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };
  
  // Update a chat
  const updateChat = async (chatId: number, updates: Partial<Omit<Chat, "id">>) => {
    // Only allow authenticated users to update chats
    
  };
  
  // Delete a chat
  const deleteChat = async (chatId: number) => {
    // Only allow authenticated users to delete chats
    
  };
  
  // Set current chat
  const setCurrentChat = async (chatId: number | null) => {
    // Only allow authenticated users to switch between saved chats
    if (!user) {
      console.log("Guest users cannot switch between persistent chats");
      return;
    }
    if (chatId === null) {
      setCurrentChatState(null);
      return;
    }
    const chat = chats.find(c => c.id === chatId);
    if (!chat) {
      console.error(`Chat with ID ${chatId} not found`);
      return;
    }
    setCurrentChatState(chat);
    console.log("Current chat set to:", chat);
  };
  
  // Add message to current chat
  const addMessageToCurrentChat = async (message: Omit<Message, "id">) => {
    // Only allow authenticated users to add messages to persistent chats
    
  };
  
  // Clear current chat
  const clearCurrentChat = () => {
    // Only allow authenticated users to clear their current chat
    if (!user) {
      console.log("Guest users cannot clear persistent chats");
      return;
    }
    
    setCurrentChatState(null);
  };
  
  // Clear all chats from storage and state
  const clearAllChats = async () => {
    
  };
  
  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        isLoadingChats,
        createChat,
        updateChat,
        deleteChat,
        setCurrentChat,
        addMessageToCurrentChat,
        clearCurrentChat,
        clearAllChats
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
} 