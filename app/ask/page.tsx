"use client";

import { EnhancedChatInterface } from "@/components/chat/EnhancedChatInterface";
import { ClientSidebar } from "@/components/chat/ClientSidebar";
import { ResearchPanelWrapper } from "@/components/chat/ResearchPanelWrapper";
import { useChat } from "@/context/ChatContext";

function AskPageContent() {
  const { researchData, isResearchLoading, currentChat, currentPoliticianName } = useChat();
  
  // Check if research panel should be shown
  const shouldShowPanel = researchData || isResearchLoading || currentChat || currentPoliticianName;
  
  return (
    <div className="container py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Ask Clara</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Ask questions about candidates, policies, or issues to get personalized information and discover candidates who align with your views.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            <b>Note:</b> You can use the chat even without an account, but your conversation history won't be saved. 
            Sign in to save your chats and access them later.
          </p>
        </div>
        
        <div className={`grid grid-cols-1 gap-6 ${
          shouldShowPanel 
            ? 'lg:grid-cols-12' 
            : 'lg:grid-cols-4'
        }`}>
          <div className={shouldShowPanel ? 'lg:col-span-3' : 'lg:col-span-1'}>
            <ClientSidebar />
          </div>
          <div className={shouldShowPanel ? 'lg:col-span-6' : 'lg:col-span-3'}>
            <EnhancedChatInterface />
          </div>
          {shouldShowPanel && (
            <div className="lg:col-span-3">
              <ResearchPanelWrapper />
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Sample Questions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-medium">Policy Questions</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>"What do candidates think about healthcare reform?"</li>
                <li>"Who supports renewable energy policies?"</li>
                <li>"Which candidates prioritize education funding?"</li>
              </ul>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-medium">Candidate Questions</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li>"Tell me about a candidate's economic policies"</li>
                <li>"What is the current President's stance on immigration?"</li>
                <li>"Which candidates have experience in healthcare?"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AskPage() {
  return <AskPageContent />;
} 