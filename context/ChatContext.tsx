"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

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
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Generate a mock chat for demonstration
const generateMockChat = (id: string, title: string, messageCount: number = 3): Chat => {
  const messages: Message[] = [];
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 10));

  // First message is always from user
  messages.push({
    id: `${id}-msg-1`,
    content: "Hi Clara, can you tell me about the election?",
    role: "user",
    timestamp: new Date(createdAt.getTime() + 1000)
  });

  // Add assistant response
  messages.push({
    id: `${id}-msg-2`,
    content: "Hello! I'd be happy to help with information about the upcoming election. What specific aspects are you interested in learning about?",
    role: "assistant",
    timestamp: new Date(createdAt.getTime() + 5000)
  });

  // Add additional message pairs if requested
  if (messageCount > 2) {
    const topics = [
      "candidates", 
      "voting process", 
      "key issues", 
      "election timeline", 
      "debate schedule"
    ];
    
    for (let i = 3; i <= messageCount; i += 2) {
      const topicIndex = Math.floor(Math.random() * topics.length);
      
      messages.push({
        id: `${id}-msg-${i}`,
        content: `I'd like to know more about the ${topics[topicIndex]}.`,
        role: "user",
        timestamp: new Date(createdAt.getTime() + (i * 10000))
      });
      
      if (i + 1 <= messageCount) {
        messages.push({
          id: `${id}-msg-${i + 1}`,
          content: `Here's some information about the ${topics[topicIndex]}...`,
          role: "assistant",
          timestamp: new Date(createdAt.getTime() + ((i + 1) * 10000))
        });
      }
    }
  }

  return {
    id,
    title,
    messages,
    createdAt,
    updatedAt: new Date(createdAt.getTime() + (messageCount * 10000))
  };
};

const generateMockChats = (): Chat[] => {
  return [
    generateMockChat("chat-1", "Election Information", 6),
    generateMockChat("chat-2", "Healthcare Policies", 4),
    generateMockChat("chat-3", "Environmental Issues", 8),
    generateMockChat("chat-4", "Economic Platforms", 4),
    generateMockChat("chat-5", "Voter Registration", 2)
  ];
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChatState] = useState<Chat | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(true);

  // Load chats from local storage or initialize with mock data when user is authenticated
  useEffect(() => {
    const loadChats = async () => {
      setIsLoadingChats(true);
      
      if (user) {
        // Try to get saved chats from localStorage
        const savedChats = localStorage.getItem(`clara_chats_${user.id}`);
        
        if (savedChats) {
          try {
            const parsedChats = JSON.parse(savedChats);
            // Convert string dates back to Date objects
            const formattedChats = parsedChats.map((chat: any) => ({
              ...chat,
              createdAt: new Date(chat.createdAt),
              updatedAt: new Date(chat.updatedAt),
              messages: chat.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
              }))
            }));
            setChats(formattedChats);
          } catch (error) {
            console.error("Failed to parse saved chats", error);
            const mockChats = generateMockChats();
            setChats(mockChats);
            saveChatsToStorage(mockChats);
          }
        } else {
          // If no saved chats, use mock data
          const mockChats = generateMockChats();
          setChats(mockChats);
          saveChatsToStorage(mockChats);
        }
      } else {
        // No user logged in, clear chats
        setChats([]);
      }
      
      setIsLoadingChats(false);
    };
    
    loadChats();
  }, [user]);
  
  // Save chats to localStorage when they change
  const saveChatsToStorage = (currentChats: Chat[]) => {
    if (user) {
      localStorage.setItem(`clara_chats_${user.id}`, JSON.stringify(currentChats));
    }
  };
  
  useEffect(() => {
    if (chats.length > 0 && user) {
      saveChatsToStorage(chats);
    }
  }, [chats, user]);
  
  // Create a new chat
  const createChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: "New Conversation",
      messages: [{
        id: `welcome-${Date.now()}`,
        content: "Hello! I'm Clara, your election assistant. Ask me about candidates, issues, or policies, and I'll help you find information.",
        role: "assistant",
        timestamp: new Date()
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setChats(prev => [newChat, ...prev]);
    setCurrentChatState(newChat);
  };
  
  // Update a chat
  const updateChat = (chatId: string, updates: Partial<Omit<Chat, "id">>) => {
    setChats(prev => {
      const updatedChats = prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, ...updates, updatedAt: new Date() } 
          : chat
      );
      return updatedChats;
    });
    
    // If current chat is being updated, update it as well
    if (currentChat?.id === chatId) {
      setCurrentChatState(prev => 
        prev ? { ...prev, ...updates, updatedAt: new Date() } : null
      );
    }
  };
  
  // Delete a chat
  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    
    // If current chat is being deleted, clear current chat
    if (currentChat?.id === chatId) {
      setCurrentChatState(null);
    }
  };
  
  // Set current chat
  const setCurrentChat = (chatId: string | null) => {
    if (chatId === null) {
      setCurrentChatState(null);
      return;
    }
    
    const chat = chats.find(c => c.id === chatId) || null;
    setCurrentChatState(chat);
  };
  
  // Add message to current chat
  const addMessageToCurrentChat = (message: Omit<Message, "id">) => {
    if (!currentChat) return;
    
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    // Update the current chat
    const updatedChat: Chat = {
      ...currentChat,
      messages: [...currentChat.messages, newMessage],
      updatedAt: new Date()
    };
    
    // Update the title if this is the first user message
    let updatedTitle = updatedChat.title;
    if (updatedChat.title === "New Conversation" && message.role === "user") {
      // Use the first ~25 chars of the first user message as the chat title
      updatedTitle = message.content.substring(0, 25) + (message.content.length > 25 ? "..." : "");
      updatedChat.title = updatedTitle;
    }
    
    setCurrentChatState(updatedChat);
    
    // Update the chat in the chats array
    setChats(prev => 
      prev.map(chat => 
        chat.id === currentChat.id ? updatedChat : chat
      )
    );
  };
  
  // Clear current chat
  const clearCurrentChat = () => {
    setCurrentChatState(null);
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
        clearCurrentChat
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