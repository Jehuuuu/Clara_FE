"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  isLoadingChats: boolean;
  createChat: () => void;
  updateChat: (chatId: string, updates: Partial<Omit<Chat, "id">>) => void;
  deleteChat: (chatId: string) => void;
  setCurrentChat: (chatId: string | null) => void;
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
    ...chat,
    id: chat.id.toString(),
    createdAt: new Date(chat.created_at),
    updatedAt: new Date(chat.updated_at),
    messages: chat.messages?.map((msg: any) => ({
      ...msg,
      id: msg.id.toString(),
      timestamp: new Date(msg.timestamp)
    })) || []
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
    const loadChats = async () => {
      setIsLoadingChats(true);
      
      if (user) {
        try {
          const authHeader = await getAuthHeader();
          const response = await axios.get(`${API_URL}/chats/`, authHeader);
          
          const formattedChats = response.data.map(formatDates);
          setChats(formattedChats);
        } catch (error) {
          console.error("Failed to fetch chats", error);
          setChats([]);
        }
      } else {
        // No user logged in, clear chats
        setChats([]);
      }
      
      setIsLoadingChats(false);
    };
    
    loadChats();
  }, [user]);
  
  // Create a new chat
  const createChat = async () => {
    // Only allow authenticated users to create persistent chats
    if (!user) {
      console.log("Guest users cannot create persistent chats");
      return;
    }
    
    try {
      const authHeader = await getAuthHeader();
      const response = await axios.post(
        `${API_URL}/chats/`, 
        {
          title: "New Conversation",
          welcome_message: "Hello! I'm Clara, your election assistant. Ask me about candidates, issues, or policies, and I'll help you find information."
        },
        authHeader
      );
      
      const newChat = formatDates(response.data);
      setChats(prev => [newChat, ...prev]);
      setCurrentChatState(newChat);
    } catch (error) {
      console.error("Failed to create chat", error);
    }
  };
  
  // Update a chat
  const updateChat = async (chatId: string, updates: Partial<Omit<Chat, "id">>) => {
    // Only allow authenticated users to update chats
    if (!user) {
      console.log("Guest users cannot update persistent chats");
      return;
    }
    
    try {
      const authHeader = await getAuthHeader();
      const response = await axios.put(
        `${API_URL}/chats/${chatId}/`,
        {
          title: updates.title
        },
        authHeader
      );
      
      const updatedChat = formatDates(response.data);
      
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? updatedChat : chat
      ));
      
      // If current chat is being updated, update it as well
      if (currentChat?.id === chatId) {
        setCurrentChatState(updatedChat);
      }
    } catch (error) {
      console.error("Failed to update chat", error);
    }
  };
  
  // Delete a chat
  const deleteChat = async (chatId: string) => {
    // Only allow authenticated users to delete chats
    if (!user) {
      console.log("Guest users cannot delete persistent chats");
      return;
    }
    
    try {
      const authHeader = await getAuthHeader();
      await axios.delete(`${API_URL}/chats/${chatId}/`, authHeader);
      
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      
      // If current chat is being deleted, clear current chat
      if (currentChat?.id === chatId) {
        setCurrentChatState(null);
      }
    } catch (error) {
      console.error("Failed to delete chat", error);
    }
  };
  
  // Set current chat
  const setCurrentChat = async (chatId: string | null) => {
    // Only allow authenticated users to switch between saved chats
    if (!user) {
      console.log("Guest users cannot switch between persistent chats");
      return;
    }
    
    if (chatId === null) {
      setCurrentChatState(null);
      return;
    }
    
    try {
      const authHeader = await getAuthHeader();
      const response = await axios.get(`${API_URL}/chats/${chatId}/`, authHeader);
      const chat = formatDates(response.data);
      setCurrentChatState(chat);
    } catch (error) {
      console.error("Failed to fetch chat details", error);
    }
  };
  
  // Add message to current chat
  const addMessageToCurrentChat = async (message: Omit<Message, "id">) => {
    // Only allow authenticated users to add messages to persistent chats
    if (!user || !currentChat) {
      console.log("Guest users cannot add messages to persistent chats");
      return;
    }
    
    try {
      const authHeader = await getAuthHeader();
      const response = await axios.post(
        `${API_URL}/chats/${currentChat.id}/messages/`,
        {
          content: message.content,
          role: message.role
        },
        authHeader
      );
      
      // Optimistically update the UI
      const newMessage = {
        id: response.data.id.toString(),
        content: message.content,
        role: message.role,
        timestamp: new Date(response.data.timestamp)
      };
      
      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, newMessage],
        updatedAt: new Date()
      };
      
      setCurrentChatState(updatedChat);
      
      // Update the chat in the chats array
      setChats(prev => 
        prev.map(chat => 
          chat.id === currentChat.id ? updatedChat : chat
        )
      );
    } catch (error) {
      console.error("Failed to add message", error);
    }
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
    if (user) {
      try {
        const authHeader = await getAuthHeader();
        await axios.delete(`${API_URL}/chats/clear/`, authHeader);
        
        // Clear from state
        setChats([]);
        setCurrentChatState(null);
      } catch (error) {
        console.error("Failed to clear all chats", error);
      }
    }
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