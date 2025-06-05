"use client";

import React, { useState, useRef, useEffect } from "react";
import { SendIcon, XCircle, FileSearch, User, RotateCcw } from "lucide-react";
import { ChatMessage as ChatMessageComponent } from "@/components/chat/ChatMessage";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { useChat, Message } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { CreateChatParams } from "@/context/ChatContext";

import Link from "next/link";
import { set } from "date-fns";

// Modal component for politician selection
function PoliticianSelectionModal({ onSubmit, onClose }: { 
  onSubmit: (data: CreateChatParams) => void; 
  onClose: () => void;
}) {
  const [politician, setName] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!politician.trim()) {
      setError("Please enter a politician name");
      return;
    }
    onSubmit({ politician, position });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Research a Politician</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Enter the name and position of the politician you want to learn about.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">
                Politician Name
              </label>
              <input 
                type="text" 
                value={politician}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g., John Smith"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">
                Position (optional)
              </label>
              <input 
                type="text" 
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g., Senator, Mayor, Governor"
              />
            </div>
            
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">Research</Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

// Loading indicator component
function ResearchLoadingIndicator() {
  return (
    <div className="p-6">
      <h2 className="mb-2 text-lg font-semibold dark:text-white">Researching politician:</h2>
      <ul className="max-w-md space-y-2 text-gray-500 list-inside dark:text-gray-400">
        <li className="flex items-center">
          <svg className="w-4 h-4 me-2 text-green-500 dark:text-green-400 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
          </svg>
          Finding candidate information
        </li>
        <li className="flex items-center">
          <svg className="w-4 h-4 me-2 text-green-500 dark:text-green-400 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
          </svg>
          Gathering policy positions
        </li>
        <li className="flex items-center">
          <div role="status">
            <svg aria-hidden="true" className="w-4 h-4 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
          Preparing detailed report
        </li>
      </ul>
    </div>
  );
}

export function EnhancedChatInterface() {
  const { user } = useAuth();
  const { 
    currentChat, 
    createChat, 
    addMessageToCurrentChat, 
    clearCurrentChat, 
    updateChat, 
    setCurrentChat,
    isResearchLoading,
    currentPoliticianName
  } = useChat();
  
  // Chat states
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // New workflow states
  const [showModal, setShowModal] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [selectedPolitician, setSelectedPolitician] = useState<{politician: string, position: string} | null>(null);
  
  // Session chat state for guest users
  const [guestMessages, setGuestMessages] = useState<Message[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Helper to get chat title
  const getChatTitle = () => {
    if (selectedPolitician) {
      const base = selectedPolitician.position
        ? `${selectedPolitician.politician} (${selectedPolitician.position})`
        : selectedPolitician.politician;
      return base;
    }
    if (currentChat) {
      return currentChat.politician;
    }
    return "Politician Research";
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.qanda_set, guestMessages]);

  // Focus input on load and when current chat changes
  useEffect(() => {
    if (chatStarted && !isResearchLoading) {
      inputRef.current?.focus();
    }
  }, [chatStarted, isResearchLoading, currentChat, guestMessages]);

  useEffect(() => {
    if (currentChat) {
      // If the chat has Q&A items, consider the chat started
      if (currentChat.qanda_set && currentChat.qanda_set.length > 0) {
        setChatStarted(true);
      } else {
        setChatStarted(false);
      }

      // Set selectedPolitician based on the current chat
      if (currentChat.politician) {
        setSelectedPolitician({ politician: currentChat.politician, position: '' });
      }
      console.log("Current chat updated:", currentChat);
    }
  }, [currentChat]);

  const handleStartChat = () => {
    setShowModal(true);
  };

  const handlePoliticianSelect = (data: CreateChatParams) => {
    setShowModal(false);
    setSelectedPolitician(data);
    setChatStarted(true);
    
    // The createChat function in ChatContext will handle the research automatically
    createChat(data, user?.refreshToken || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Submit input:", input);
    e.preventDefault();
    console.log("input.trim():", input.trim());
    console.log("isLoading:", isLoading);
    console.log("chatStarted:", chatStarted);
    console.log("isResearchLoading:", isResearchLoading);
    
    if (!input.trim() || isLoading || isResearchLoading) return;

    console.log("user:", user);
    console.log("currentChat:", currentChat);
    if (user && currentChat) {
      // Authenticated user - add user message to saved chats
      addMessageToCurrentChat(input);
      console.log("Adding message to current chat:", input);
      setIsLoading(true);
      setInput("");
      // Simulate assistant response
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      // Handle guest user messages if needed
      const userMessage: Message = {
        id: Date.now(),
        content: input,
        role: "user",
        timestamp: new Date()
      };
      setGuestMessages(prev => [...prev, userMessage]);
      setInput("");
      
      // Generate response for guest users
      generateResponse(input);
    }
  };
  
  const generateResponse = (question: string) => {
    if (!selectedPolitician) return;
    
    // Generate response about needing to connect to the API
    const responseContent = `I need to connect to the research API to provide accurate information about ${selectedPolitician.politician}. \n\nWhen the backend API integration is complete, I'll be able to search for specific information about their positions on ${question.includes("economy") ? "economic policies" : question.includes("healthcare") ? "healthcare reform" : question.includes("education") ? "education initiatives" : "various political issues"}.\n\nWould you like me to look up something else about this politician?`;
    
      // Guest user - use local state only
      const assistantMessage: Message = {
      id: Date.now() + Math.random(),
        content: responseContent,
        role: "assistant",
        timestamp: new Date()
      };
      setGuestMessages(prev => [...prev, assistantMessage]);
  };

  // Start a new research session
  const handleNewResearch = () => {
    setChatStarted(false);
    setSelectedPolitician(null);
    if (user) {
      clearCurrentChat();
    } else {
      setGuestMessages([]);
    }
  };
  
  // Render the chat interface
  return (
    <div className="chat-interface">
      {showModal && (
        <PoliticianSelectionModal 
          onSubmit={handlePoliticianSelect}
          onClose={() => setShowModal(false)}
        />
      )}
      
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-content">
        <div className="min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 truncate" title={getChatTitle()}>
            {getChatTitle()}
          </h2>
            <p className="text-sm text-gray-600 mt-1">
            {chatStarted
              ? "Ask questions about this politician's positions and background"
              : "Start researching a politician to learn more"}
          </p>
        </div>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="chat-messages-area">
        <div className="chat-messages-container">
        {/* Show chat history if currentChat exists and has messages */}
          {currentChat && currentChat.qanda_set && currentChat.qanda_set.length > 0 ? (
            <div className="py-6 space-y-2">
            {currentChat.qanda_set.map((qanda: any) => (
                <React.Fragment key={qanda.id}>
                <ChatMessageComponent
                  content={qanda.question}
                  role="user"
                  timestamp={new Date(qanda.created_at)}
                />
                <ChatMessageComponent
                  content={qanda.answer}
                  role="assistant"
                  timestamp={new Date(qanda.created_at)}
                />
                </React.Fragment>
            ))}
          </div>
        ) : !chatStarted ? (
            <div className="h-full flex flex-col items-center justify-center py-16">
              <FileSearch className="h-20 w-20 mb-6 text-blue-500/20" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Start Your Research</h3>
              <p className="text-center text-gray-600 mb-8 max-w-md">
              Begin by researching a politician to get a comprehensive report on their background, 
              policies, and positions. Then you can ask questions to learn more.
            </p>
              <Button onClick={handleStartChat} size="lg" className="shadow-sm">
              Start New Research
            </Button>
            
            {!user && (
                <p className="mt-8 text-sm text-gray-500">
                  <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 underline">
                  Sign in
                </Link> to save your research history
              </p>
            )}
          </div>
          ) : isResearchLoading ? (
            <div className="py-16">
          <ResearchLoadingIndicator />
            </div>
        ) : (
            // Guest user chat history or empty chat
            <div className="py-6 space-y-2">
            {guestMessages.map((message, idx) => (
              <ChatMessageComponent
                key={`${message.id}-${idx}`}
                content={message.content}
                role={message.role}
                timestamp={message.timestamp}
              />
            ))}
            <div ref={messagesEndRef} />
            </div>
        )}
        </div>
      </div>
      
      {/* Input area */}
      {(chatStarted || currentChat) && !isResearchLoading && (
        <div className="chat-input-area">
          <div className="chat-input-container">
            <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask about ${selectedPolitician?.politician || currentPoliticianName || 'this politician'}...`}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
              <Button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-[48px] w-[48px]"
              >
                <SendIcon className="h-5 w-5" />
            </Button>
          </form>
          </div>
          </div>
        )}
      </div>
  );
} 