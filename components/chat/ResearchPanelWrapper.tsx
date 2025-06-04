"use client";

import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { ResearchPanel } from "./ResearchPanel";
import { useAuth } from "@/context/AuthContext";

// Simple research modal component
function QuickResearchModal({ onSubmit, onClose }: { 
  onSubmit: (politician: string, position: string) => void; 
  onClose: () => void;
}) {
  const [politician, setPolitician] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!politician.trim()) {
      setError("Please enter a politician name");
      return;
    }
    onSubmit(politician, position);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Quick Research</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter the name and position of the politician you want to research.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">
              Politician Name
            </label>
            <input 
              type="text" 
              value={politician}
              onChange={(e) => setPolitician(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g., John Smith"
              autoFocus
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
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Research
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ResearchPanelWrapper() {
  const { user } = useAuth();
  const {
    researchData,
    isResearchLoading,
    isResearchPanelCollapsed,
    currentPoliticianName,
    currentChat,
    toggleResearchPanel,
    refreshResearchData,
    fetchResearchData,
    createChat,
  } = useChat();

  const [showQuickResearchModal, setShowQuickResearchModal] = useState(false);

  const handleStartResearch = () => {
    setShowQuickResearchModal(true);
  };

  const handleQuickResearch = async (politician: string, position: string) => {
    // If user is authenticated, create a chat
    if (user) {
      await createChat({ politician, position }, user.refreshToken || null);
    } else {
      // For guest users, just fetch research data
      await fetchResearchData(politician, position);
    }
  };

  // Only show the research panel if:
  // 1. There's research data
  // 2. Research is currently loading
  // 3. There's an active chat
  // 4. There's a current politician name (research in progress)
  const shouldShowPanel = researchData || isResearchLoading || currentChat || currentPoliticianName;

  if (!shouldShowPanel) {
    return null; // Don't render anything if no research is active
  }

  // Get politician data from either current chat or research data
  const politicianImage = currentChat?.politician_image || researchData?.politician_image || undefined;
  const politicianParty = currentChat?.politician_party || researchData?.politician_party || undefined;

  return (
    <>
      {showQuickResearchModal && (
        <QuickResearchModal
          onSubmit={handleQuickResearch}
          onClose={() => setShowQuickResearchModal(false)}
        />
      )}
      
      <ResearchPanel
        researchData={researchData}
        isLoading={isResearchLoading}
        isCollapsed={isResearchPanelCollapsed}
        onToggleCollapse={toggleResearchPanel}
        onRefreshResearch={refreshResearchData}
        onStartResearch={handleStartResearch}
        politicianName={currentPoliticianName || undefined}
        politicianImage={politicianImage}
        politicianParty={politicianParty}
      />
    </>
  );
} 