"use client";

import { EnhancedChatInterface } from "@/components/chat/EnhancedChatInterface";
import { ClientSidebar } from "@/components/chat/ClientSidebar";
import { ResearchPanelWrapper } from "@/components/chat/ResearchPanelWrapper";
import { ResizableSplitPane } from "@/components/common/ResizableSplitPane";
import { useChat } from "@/context/ChatContext";
import { useState, useEffect } from "react";

// Import the loading component for reuse
import AskPageLoadingSkeleton from "./loading";

function AskPageContent() {
  const { researchData, isResearchLoading, currentChat, currentPoliticianName, isResearchPanelCollapsed, isLoadingChats } = useChat();
  
  // Client-side loading state for page refresh/initial load
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // Handle initial loading state - wait for chat context to determine current state
  useEffect(() => {
    // Wait for chats to finish loading, then determine if we should show loading
    if (!isLoadingChats) {
      // Give a small delay to ensure all context is properly initialized
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
      }, 300); // Short delay just for smooth transition
      
      return () => clearTimeout(timer);
    }
  }, [isLoadingChats]);
  
  // Show loading skeleton during initial load OR while chats are loading
  if (isInitialLoading || isLoadingChats) {
    return <AskPageLoadingSkeleton />;
  }
  
  // Check if research panel should be shown
  const shouldShowPanel = researchData || isResearchLoading || currentChat || currentPoliticianName;
  
  return (
    <div className="app-container">
      {/* Main Content Layout */}
      <div className="main-layout">
        {/* Left Sidebar */}
        <div className="sidebar-container">
          <ClientSidebar />
        </div>
        
        {/* Conditional Layout based on panel state */}
        {shouldShowPanel && !isResearchPanelCollapsed ? (
          // Show resizable split pane when panel is expanded
          <ResizableSplitPane
            leftPane={
              <div className="chat-container">
                <EnhancedChatInterface />
              </div>
            }
            rightPane={
              <div className="research-panel-container research-expanded">
                <ResearchPanelWrapper />
              </div>
            }
            defaultSplit={65}
            minSize={400}
            maxSize={1200}
            className="flex-1"
          />
        ) : shouldShowPanel && isResearchPanelCollapsed ? (
          // Show chat full width with collapsed panel overlay
          <div className="flex-1 relative">
            <div className="chat-container">
              <EnhancedChatInterface />
            </div>
            {/* Collapsed panel as overlay */}
            <div className="absolute top-0 right-0 h-full w-16 bg-white border-l border-gray-200 shadow-lg z-10">
              <ResearchPanelWrapper />
            </div>
          </div>
        ) : (
          // No research panel - chat takes full width
          <div className="flex-1">
            <div className="chat-container">
              <EnhancedChatInterface />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AskPage() {
  return <AskPageContent />;
} 
