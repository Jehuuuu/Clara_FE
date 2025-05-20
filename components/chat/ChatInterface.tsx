"use client";

import React, { useState, useRef, useEffect } from "react";
import { SendIcon } from "lucide-react";
import { ChatMessage, MessageRole } from "@/components/chat/ChatMessage";
import { SuggestionList } from "@/components/chat/SuggestionList";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { candidates } from "@/lib/dummy-data";

interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
}

// Keywords that trigger candidate suggestions based on issues
const ISSUE_KEYWORDS: Record<string, string[]> = {
  economy: ["economy", "jobs", "taxes", "wages", "business", "economic", "unemployment", "inflation"],
  healthcare: ["healthcare", "health", "medical", "insurance", "hospital", "doctors", "medicine", "prescription"],
  environment: ["environment", "climate", "pollution", "energy", "green", "renewable", "sustainability", "carbon"],
  education: ["education", "school", "college", "student", "university", "teacher", "tuition", "learning"],
  immigration: ["immigration", "border", "immigrant", "migration", "citizenship", "visa", "asylum", "refugee"]
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm Clara, your election assistant. Ask me about candidates, issues, or policies, and I'll help you find information.",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<{
    candidates: typeof candidates;
    matchedIssue?: string;
  } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Process the message to generate suggestions
    setTimeout(() => generateResponse(input), 500);
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
    
    // Add assistant response
    const assistantMessage: Message = {
      id: Date.now().toString(),
      content: responseContent,
      role: "assistant",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
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
  
  return (
    <Card className="flex flex-col w-full h-[80vh] max-h-[700px] overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Ask Clara</h2>
        <p className="text-sm text-muted-foreground">Get information about candidates and issues</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(message => (
          <ChatMessage
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
            placeholder="Ask about candidates or issues..."
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" size="icon">
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </Card>
  );
} 