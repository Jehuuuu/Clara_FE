"use client";

import React, { useState, useRef, useEffect } from "react";
import { SendIcon, XCircle, Menu, X } from "lucide-react";
import { ChatMessage as ChatMessageComponent } from "@/components/chat/ChatMessage";
import { SuggestionList } from "@/components/chat/SuggestionList";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { useChat, Message } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { candidates } from "@/lib/dummy-data";

// Keywords that trigger candidate suggestions based on issues
const ISSUE_KEYWORDS: Record<string, string[]> = {
  economy: ["economy", "jobs", "taxes", "wages", "business", "economic", "unemployment", "inflation"],
  healthcare: ["healthcare", "health", "medical", "insurance", "hospital", "doctors", "medicine", "prescription"],
  environment: ["environment", "climate", "pollution", "energy", "green", "renewable", "sustainability", "carbon"],
  education: ["education", "school", "college", "student", "university", "teacher", "tuition", "learning"],
  immigration: ["immigration", "border", "immigrant", "migration", "citizenship", "visa", "asylum", "refugee"]
};

export function EnhancedChatInterface() {
  const { user } = useAuth();
  const { 
    currentChat,
    createChat,
    addMessageToCurrentChat,
    clearCurrentChat
  } = useChat();
  
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<{
    candidates: typeof candidates;
    matchedIssue?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  // Focus input on load and when current chat changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentChat]);
  
  // Create a new chat if there is no current chat
  useEffect(() => {
    if (user && !currentChat) {
      createChat();
    }
  }, [user, currentChat, createChat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentChat || isLoading) return;
    
    // Add user message to current chat
    const userMessage: Omit<Message, "id"> = {
      content: input,
      role: "user",
      timestamp: new Date()
    };
    
    addMessageToCurrentChat(userMessage);
    setInput("");
    setIsLoading(true);
    
    // Process the message to generate suggestions with loading state
    setTimeout(() => {
      generateResponse(input);
      setIsLoading(false);
    }, 1000);
  };
  
  const generateResponse = (question: string) => {
    // Identify relevant issues from keywords
    const matchedIssues = findMatchedIssues(question.toLowerCase());
    const primaryIssue = matchedIssues.length > 0 ? matchedIssues[0] : undefined;
    
    // Generate AI response
    let responseContent = "";
    if (matchedIssues.length > 0) {
      responseContent = `I found some candidates with positions on ${matchedIssues.join(", ")}. You might want to check their profiles for more details.`;
      
      // Filter candidates based on matched issues
      const relevantCandidates = candidates.filter(candidate => 
        matchedIssues.some(issue => issue in candidate.issues)
      ).slice(0, 3); // Limit to 3 suggestions
      
      setSuggestions({
        candidates: relevantCandidates,
        matchedIssue: primaryIssue
      });
    } else {
      responseContent = "I'm not sure I understand which political issues you're interested in. Try asking about specific topics like economy, healthcare, education, etc.";
      setSuggestions(null);
    }
    
    // Add assistant response to current chat
    const assistantMessage: Omit<Message, "id"> = {
      content: responseContent,
      role: "assistant",
      timestamp: new Date()
    };
    
    addMessageToCurrentChat(assistantMessage);
  };
  
  const findMatchedIssues = (text: string): string[] => {
    const matches: string[] = [];
    
    // Check each issue's keywords against the text
    Object.entries(ISSUE_KEYWORDS).forEach(([issue, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        matches.push(issue);
      }
    });
    
    return matches;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // If there's no user or current chat, show a placeholder
  if (!user || !currentChat) {
    return (
      <Card className="flex flex-col w-full h-[80vh] max-h-[700px] overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Welcome to Clara</h2>
            {!user ? (
              <div>
                <p className="text-muted-foreground mb-6">Sign in to start chatting</p>
                <Button asChild>
                  <a href="/auth/login">Log In</a>
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground mb-6">Loading your conversation...</p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="flex w-full h-[80vh] max-h-[700px] overflow-hidden">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-20 left-4 md:hidden z-30">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="bg-background shadow-md"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Sidebar for chat history */}
      <div 
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          transition-transform duration-200 absolute md:relative z-20 md:translate-x-0
          w-64 lg:w-80 h-full bg-background
        `}
      >
        <ChatSidebar />
      </div>
      
      {/* Chat interface */}
      <Card className="flex flex-col flex-1 w-full h-full overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">{currentChat.title}</h2>
            <p className="text-sm text-muted-foreground">Ask about candidates and issues</p>
          </div>
          <Button
            variant="ghost" 
            size="icon"
            onClick={clearCurrentChat}
            className="text-muted-foreground"
            title="New conversation"
          >
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {currentChat.messages.map(message => (
            <ChatMessageComponent
              key={message.id}
              content={message.content}
              role={message.role}
              timestamp={message.timestamp}
            />
          ))}
          
          {suggestions && (
            <SuggestionList
              title="Suggested Candidates"
              candidates={suggestions.candidates}
              matchedIssue={suggestions.matchedIssue}
            />
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t mt-auto">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={isLoading ? "Clara is thinking..." : "Ask about candidates or issues..."}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
} 