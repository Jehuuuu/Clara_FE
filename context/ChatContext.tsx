"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAllChats, addChat, getChatQandA, deleteChat as apiDeleteChat } from "../lib/api/chat";
import { AddQuestionRequest, addQuestion } from "../lib/api/question";
import { fetchResearchByPoliticianAndPosition, ResearchResponse, fetchResearchById, fetchPoliticianDetails } from "../lib/api/research";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface CreateChatParams {
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
  id: number | string;
  chat: number;
  question: string;
  answer: string;
  created_at: string;
}

export interface Chat {
  id: number;
  politician: string;
  politician_image?: string;
  politician_party?: string;
  user: number;
  research_report: number;
  qanda_set: QAndA[];
  created_at: string;
}

export type ResearchData = ResearchResponse;

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  isLoadingChats: boolean;
  createChat: (params: CreateChatParams, token: string | null) => Promise<void>;
  deleteChat: (chatId: number) => void;
  setCurrentChat: (chatId: number | null, token: string) => void;
  addMessageToCurrentChat: (question: string) => void;
  clearCurrentChat: () => void;
  clearAllChats: () => void;

  researchData: ResearchData | null;
  isResearchLoading: boolean;
  isResearchPanelCollapsed: boolean;
  currentPoliticianName: string | null;
  currentPosition: string | null;
  fetchResearchData: (politician: string, position: string) => Promise<void>;
  toggleResearchPanel: () => void;
  refreshResearchData: () => Promise<void>;
  clearResearchData: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user, getToken } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChatState] = useState<Chat | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(true);

  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [isResearchLoading, setIsResearchLoading] = useState(false);
  const [isResearchPanelCollapsed, setIsResearchPanelCollapsed] = useState(false);
  const [currentPoliticianName, setCurrentPoliticianName] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState<string | null>(null);

  const formatDates = (chat: any): Chat => ({
    id: chat.id,
    politician: chat.politician,
    politician_image: chat.politician_image,
    politician_party: chat.politician_party,
    user: chat.user,
    research_report: chat.research_report,
    qanda_set: chat.qanda_set || [],
    created_at: chat.created_at,
  });

  const fetchResearchData = async (politician: string, position: string): Promise<void> => {
    setIsResearchLoading(true);
    setCurrentPoliticianName(politician);
    setCurrentPosition(position);

    try {
      const data = await fetchResearchByPoliticianAndPosition(politician, position);
      setResearchData(data);
      console.log("Research data fetched:", data);
    } catch (error) {
      console.error("Failed to fetch research data:", error);
      setResearchData(null);
    } finally {
      setIsResearchLoading(false);
    }
  };

  const toggleResearchPanel = () => {
    setIsResearchPanelCollapsed(!isResearchPanelCollapsed);
  };

  const refreshResearchData = async (): Promise<void> => {
    if (currentPoliticianName && currentPosition) {
      await fetchResearchData(currentPoliticianName, currentPosition);
    }
  };

  const clearResearchData = () => {
    setResearchData(null);
    setCurrentPoliticianName(null);
    setCurrentPosition(null);
    setIsResearchLoading(false);
  };

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) {
        setIsLoadingChats(false);
        return;
      }

      try {
        const chats = await getAllChats(user.refreshToken || null);
        setChats(chats);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      } finally {
        setIsLoadingChats(false);
      }
    };

    fetchChats();
  }, [user]);

  const createChat = async (params: CreateChatParams, token: string | null): Promise<void> => {
    clearResearchData();

    if (!token) {
      console.log('User not authenticated — cannot create persistent chat.');
      return;
    }

    try {
      const newChat = await addChat(params, token);
      setChats(prevChats => [...prevChats, formatDates(newChat)]);
      setCurrentChatState(formatDates(newChat));
      await fetchResearchData(params.politician, params.position);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const deleteChat = async (chatId: number) => {
    if (!user) {
      console.error("Guest users cannot delete chats");
      return;
    }

    const token = user.refreshToken;
    if (!token) {
      console.error("No token available for deleting chat");
      return;
    }

    try {
      await apiDeleteChat(chatId, token);
      setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));

      if (currentChat?.id === chatId) {
        setCurrentChatState(null);
        clearResearchData();
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
      throw error;
    }
  };

  const setCurrentChat = async (chatId: number | null, token: string) => {
    clearResearchData();

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

    try {
      const qanda = await getChatQandA(chatId, token);
      chat.qanda_set = qanda;
      setCurrentChatState(chat);

      if (chat.research_report) {
        // Accepting ask_improvements_fe block fully:
        const researchData = await fetchResearchById(chat.research_report, false);
        console.log("Fetched research data:", researchData);

        if (!researchData.politician_image) {
          if (chat.politician_image) {
            researchData.politician_image = chat.politician_image;
          } else {
            try {
              const politicianId = researchData.politician_id || null;
              if (politicianId) {
                const politicianData = await fetchPoliticianDetails(politicianId);
                console.log("Fetched politician details:", politicianData);

                if (politicianData && politicianData.data && politicianData.data.image_url) {
                  researchData.politician_image = politicianData.data.image_url;
                  chat.politician_image = politicianData.data.image_url;
                  console.log("Fetched politician image:", politicianData.data.image_url);
                }

                if (politicianData && politicianData.data && politicianData.data.party) {
                  researchData.politician_party = politicianData.data.party;
                  chat.politician_party = politicianData.data.party;
                  console.log("Fetched politician party:", politicianData.data.party);
                }
              }
            } catch (error) {
              console.error("Failed to fetch politician details:", error);
            }
          }
        }

        setResearchData(researchData);
        setCurrentPoliticianName(chat.politician);
        setCurrentPosition(researchData.position || "Unknown");
      }
    } catch (err) {
      console.error(err);
    }

    console.log("Current chat set to:", chat);
  };

  const addMessageToCurrentChat = async (question: string) => {
    if (!currentChat) {
      console.error("No current chat selected.");
      return;
    }

    const token = localStorage.getItem("refreshToken") || user?.refreshToken || null;
    if (!token) {
      console.error("User must be authenticated to add a message.");
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const tempQuestion: QAndA = {
      id: tempId,
      chat: currentChat.id,
      question: question,
      answer: "",
      created_at: new Date().toISOString(),
    };

    setCurrentChatState(prevChat => {
      if (!prevChat) return null;
      return {
        ...prevChat,
        qanda_set: [...prevChat.qanda_set, tempQuestion]
      };
    });

    try {
      const payload: AddQuestionRequest = {
        chat_id: currentChat.id,
        question,
      };

      const response = await addQuestion(payload, token);

      setCurrentChatState(prevChat => {
        if (!prevChat) return null;
        return {
          ...prevChat,
          qanda_set: prevChat.qanda_set.map(qa =>
            qa.id === tempId ? response : qa
          )
        };
      });

      console.log("Message added to current chat:", response);
    } catch (error) {
      console.error("Failed to add message to chat:", error);
    }
  };

  const clearCurrentChat = () => {
    setCurrentChatState(null);
    clearResearchData();
  };

  const clearAllChats = async () => {
    // Implementation here (if needed)
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        isLoadingChats,
        createChat,
        deleteChat,
        setCurrentChat,
        addMessageToCurrentChat,
        clearCurrentChat,
        clearAllChats,
        researchData,
        isResearchLoading,
        isResearchPanelCollapsed,
        currentPoliticianName,
        currentPosition,
        fetchResearchData,
        toggleResearchPanel,
        refreshResearchData,
        clearResearchData,
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
