"use client";

import { EnhancedChatInterface } from "@/components/chat/EnhancedChatInterface";
import { ClientSidebar } from "@/components/chat/ClientSidebar";
import { ResearchPanelWrapper } from "@/components/chat/ResearchPanelWrapper";
import { ResizableSplitPane } from "@/components/common/ResizableSplitPane";
import { useChat } from "@/context/ChatContext";

function AskPageContent() {
  const { researchData, isResearchLoading, currentChat, currentPoliticianName, isResearchPanelCollapsed } = useChat();
  
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