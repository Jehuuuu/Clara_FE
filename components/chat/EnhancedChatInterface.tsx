"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { SendIcon, XCircle, FileSearch, User, RotateCcw, Sparkles, MessageSquare, Zap } from "lucide-react";
import { ChatMessage as ChatMessageComponent } from "@/components/chat/ChatMessage";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { useChat, Message } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { CreateChatParams } from "@/context/ChatContext";

import Link from "next/link";
import { set } from "date-fns";

// Enhanced loading indicator with animations
function ResearchLoadingIndicator() {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { text: "Finding candidate information", icon: FileSearch },
    { text: "Gathering policy positions", icon: User },
    { text: "Preparing detailed report", icon: Sparkles }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 text-center opacity-0 animate-fade-in">
      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
        <Zap className="h-8 w-8 text-primary animate-bounce" />
      </div>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Researching politician...
      </h2>
      <ul className="max-w-md mx-auto space-y-3 text-gray-600">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <li 
              key={index}
              className={`flex items-center justify-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                isActive ? 'bg-primary/5' : ''
              }`}
            >
              <div className={`transition-all duration-300 ${
                isCompleted 
                  ? 'text-green-500' 
                  : isActive 
                    ? 'text-primary animate-pulse' 
                    : 'text-gray-400'
              }`}>
                {isCompleted ? (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                ) : isActive ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span className={`transition-all duration-300 ${
                isActive ? 'font-medium text-primary' : ''
              }`}>
                {step.text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Enhanced modal with better animations
function PoliticianSelectionModal({ onSubmit, onClose }: { 
  onSubmit: (data: CreateChatParams) => void; 
  onClose: () => void;
}) {
  const [politician, setName] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!politician.trim()) {
      setError("Please enter a politician name");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit({ politician, position });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-md transform transition-all duration-300 animate-slide-up">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Research a Politician</h2>
          </div>
          <p className="text-sm text-gray-600">
            Enter the name and position of the politician you want to learn about.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Politician Name
              </label>
              <input 
                type="text" 
                value={politician}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300"
                placeholder="e.g., John Smith"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Position (optional)
              </label>
              <input 
                type="text" 
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300"
                placeholder="e.g., Senator, Mayor, Governor"
                disabled={isSubmitting}
              />
            </div>
            
            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}
            
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
                className="transition-all duration-200 hover:scale-105"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="transition-all duration-200 hover:scale-105 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Starting Research...
                  </div>
                ) : (
                  "Start Research"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Debug log to verify component is loading
  useEffect(() => {
    console.log("🚀 Enhanced Chat Interface loaded with improvements!");
  }, []);
  
  // Improved scroll to bottom function with more robust container handling
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    // Try multiple approaches to ensure scroll works in all layout scenarios
    const scrollAttempts = [
      () => {
        // Method 1: Use messagesEndRef directly
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ 
            behavior,
            block: "end",
            inline: "nearest"
          });
        }
      },
      () => {
        // Method 2: Use the scrollable container directly
        const scrollContainer = messagesContainerRef.current?.parentElement;
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      },
      () => {
        // Method 3: Find the nearest scrollable ancestor
        let element = messagesEndRef.current?.parentElement;
        while (element) {
          const styles = window.getComputedStyle(element);
          if (styles.overflowY === 'auto' || styles.overflowY === 'scroll') {
            element.scrollTop = element.scrollHeight;
            break;
          }
          element = element.parentElement;
        }
      }
    ];

    // Execute all scroll attempts in sequence for maximum reliability
    scrollAttempts.forEach((attempt, index) => {
      setTimeout(attempt, index * 50);
    });
  }, []);

  // Enhanced auto-scroll with multiple timing strategies for different scenarios
  useEffect(() => {
    const messages = currentChat?.qanda_set || guestMessages;
    if (messages.length === 0) return;

    // Determine if this is a page refresh/initial load vs new message
    const isPageRefresh = typeof window !== 'undefined' && 
                         (document.referrer === '' || document.referrer === window.location.href);
    
    // Use immediate scroll for page refresh, delayed for new messages
    const scrollTiming = isPageRefresh ? [0, 100, 300, 800] : [50, 200];
    const scrollBehavior = isPageRefresh ? "auto" : "smooth";

    // Multiple scroll attempts with different timings for maximum reliability
    scrollTiming.forEach(delay => {
      setTimeout(() => scrollToBottom(scrollBehavior), delay);
    });

  }, [currentChat?.qanda_set, guestMessages, scrollToBottom]);

  // Additional effect specifically for handling layout changes and container resizing
  useEffect(() => {
    if (currentChat?.qanda_set && currentChat.qanda_set.length > 0) {
      // Force scroll to bottom when chat changes (e.g., sidebar toggle, panel resize)
      const forceScrollToBottom = () => {
        // Use requestAnimationFrame to ensure DOM is fully updated
        requestAnimationFrame(() => {
          setTimeout(() => scrollToBottom("auto"), 0);
          setTimeout(() => scrollToBottom("auto"), 100);
          setTimeout(() => scrollToBottom("auto"), 300);
        });
      };
      
      forceScrollToBottom();

      // Also listen for resize events that might affect layout
      const handleResize = () => {
        setTimeout(() => scrollToBottom("auto"), 100);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [currentChat?.id, scrollToBottom]);

  // Additional effect to handle ResizableSplitPane layout changes
  useEffect(() => {
    const handleLayoutChange = () => {
      setTimeout(() => scrollToBottom("auto"), 50);
    };

    // Listen for custom events that might indicate layout changes
    window.addEventListener('splitpane-resize', handleLayoutChange);
    return () => window.removeEventListener('splitpane-resize', handleLayoutChange);
  }, [scrollToBottom]);

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
    
    const token = user?.refreshToken || null;
    createChat(data, token);
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
    return "Political Research Assistant";
  };
  
  // Render the chat interface
  return (
    <div className="chat-interface h-full flex flex-col bg-white">
      {showModal && (
        <PoliticianSelectionModal 
          onSubmit={handlePoliticianSelect}
          onClose={() => setShowModal(false)}
        />
      )}
      
      {/* Enhanced Chat Header */}
      <div className="chat-header border-b border-gray-200">
        <div className="chat-header-content flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-semibold text-gray-900" title={getChatTitle()}>
            {getChatTitle()}
          </h2>
                <p className="text-sm text-gray-600">
            {chatStarted
              ? "Ask questions about this politician's positions and background"
              : "Start researching a politician to learn more"}
          </p>
              </div>
            </div>
        </div>
        
          {/* Header Actions */}
        {chatStarted && (
            <div className="flex items-center gap-2">
          <Button
            variant="ghost" 
                size="sm"
            onClick={handleNewResearch}
                className="transition-all duration-200 hover:scale-105"
          >
                <RotateCcw className="h-4 w-4 mr-2" />
                New Research
          </Button>
            </div>
        )}
        </div>
      </div>
      
      {/* Enhanced Messages Area */}
      <div className="chat-messages-area flex-1 overflow-y-auto bg-gray-50">
        <div 
          ref={messagesContainerRef}
          className="chat-messages-container max-w-4xl mx-auto px-6 py-6 h-full flex flex-col"
        >
          {/* Spacer to push content to bottom when there's not enough content to fill the container */}
          <div className="flex-grow"></div>
          
        {/* Show chat history if currentChat exists and has messages */}
          {currentChat && currentChat.qanda_set && currentChat.qanda_set.length > 0 ? (
            <div className="space-y-6 opacity-0 animate-fade-in">
              {currentChat.qanda_set
                .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) // Sort by timestamp: oldest first
                .map((qanda: any, index: number) => (
                <div 
                  key={qanda.id}
                  className="opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
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
              </div>
            ))}
              {/* Always ensure this ref is at the very bottom */}
              <div 
                ref={messagesEndRef} 
                className="h-1 w-full flex-shrink-0" 
                style={{ scrollMarginBottom: '20px' }}
              />
          </div>
        ) : !chatStarted ? (
            /* Enhanced Welcome Screen */
            <div className="h-full flex flex-col items-center justify-center py-16 opacity-0 animate-fade-in">
              <div className="text-center max-w-2xl">
                {/* Animated Icon */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <FileSearch className="h-12 w-12 text-blue-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900">
                  Start Your Political Research
                </h3>
                <p className="text-lg text-gray-600">
              Begin by researching a politician to get a comprehensive report on their background, 
                  policies, and positions. Then engage in an interactive conversation to learn more.
                </p>
                
                {/* Feature highlights */}
                <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
                  <div className="flex flex-col items-center p-4 rounded-lg bg-white">
                    <div className="w-10 h-10 bg-blue-100">
                      <FileSearch className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">Deep Research</h4>
                    <p className="text-sm text-gray-600">Comprehensive background and policy analysis</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 rounded-lg bg-white">
                    <div className="w-10 h-10 bg-green-100">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">Interactive Chat</h4>
                    <p className="text-sm text-gray-600">Ask specific questions and get detailed answers</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 rounded-lg bg-white">
                    <div className="w-10 h-10 bg-purple-100">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">AI-Powered</h4>
                    <p className="text-sm text-gray-600">Intelligent analysis with up-to-date information</p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleStartChat} 
                  size="lg" 
                  className="shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
              Start New Research
            </Button>
            
            {!user && (
                  <p className="mt-8 text-sm text-gray-500">
                    <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 underline transition-colors">
                  Sign in
                    </Link> to save your research history and access advanced features
              </p>
            )}
          </div>
            </div>
          ) : isResearchLoading ? (
            <div className="py-16">
          <ResearchLoadingIndicator />
            </div>
        ) : (
            // Guest user chat history or active chat
            <div className="space-y-6 opacity-0 animate-fade-in">
            {guestMessages.map((message, idx) => (
                <div 
                  key={`${message.id}-${idx}`}
                  className="opacity-0 animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
              <ChatMessageComponent
                content={message.content}
                role={message.role}
                timestamp={message.timestamp}
              />
                </div>
              ))}
              {/* Message end reference for guest chat */}
              <div 
                ref={messagesEndRef} 
                className="h-1 w-full flex-shrink-0" 
                style={{ scrollMarginBottom: '20px' }}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Enhanced Input Area */}
      {(chatStarted || currentChat) && !isResearchLoading && (
        <div className="chat-input-area border-t border-gray-200">
          <div className="chat-input-container max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask about ${selectedPolitician?.politician || currentPoliticianName || 'this politician'}...`}
                  className="w-full px-4 py-3 pr-12 border border-gray-300"
              disabled={isLoading}
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-[48px] w-[48px] transition-all duration-200 hover:scale-105 disabled:opacity-50"
              >
                <SendIcon className="h-5 w-5" />
            </Button>
          </form>
            
            {/* Input hints */}
            <div className="mt-3 flex flex-wrap gap-2">
              {!isLoading && (
                <>
                  <button 
                    type="button"
                    onClick={() => setInput("What are their key policy positions?")}
                    className="text-xs px-3 py-1 bg-gray-100"
                  >
                    Policy positions
                  </button>
                  <button 
                    type="button"
                    onClick={() => setInput("What is their voting record?")}
                    className="text-xs px-3 py-1 bg-gray-100"
                  >
                    Voting record
                  </button>
                  <button 
                    type="button"
                    onClick={() => setInput("Tell me about their background")}
                    className="text-xs px-3 py-1 bg-gray-100"
                  >
                    Background
                  </button>
                </>
              )}
            </div>
          </div>
          </div>
        )}
      </div>
  );
} 
