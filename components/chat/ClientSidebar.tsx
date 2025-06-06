"use client";

import { useState, useEffect } from "react";
import { Search, PanelLeftOpen, PanelLeftClose, Plus, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { useChat, CreateChatParams } from "@/context/ChatContext";

// Politician Selection Modal component
function PoliticianSelectionModal({ onSubmit, onClose }: { 
  onSubmit: (data: CreateChatParams) => void; 
  onClose: () => void;
}) {
  const [politician, setName] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");
  
  // Define available positions as a constant
  const availablePositions = [
    "City Councilor",
    "Vice Mayor",
    "City Mayor",
    "Provincial Board Member",
    "Vice Governor",
    "Governor",
    "House Representative",
    "Senator",
    "Vice President",
    "President"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate both fields are filled
    if (!politician.trim()) {
      setError("Please enter a politician name");
      return;
    }
    if (!position) {
      setError("Please select a position");
      return;
    }
    
    // Clear any errors and submit the form
    setError("");
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
                autoFocus
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">
                Position
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none bg-white"
              >
                <option value="">Select position</option>
                {availablePositions.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
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

// Chat Browser Modal Component - ChatGPT-style interface for browsing chats by date
function ChatBrowserModal({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { chats, setCurrentChat, createChat } = useChat();
  const { user } = useAuth();

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.politician.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group chats by date periods for better organization
  const groupChatsByDate = (chats: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dateGroups = {
      today: [] as any[],
      yesterday: [] as any[],
      lastWeek: [] as any[],
      older: [] as any[]
    };

    chats.forEach(chat => {
      const chatDate = new Date(chat.created_at);
      
      if (chatDate >= today) {
        dateGroups.today.push(chat);
      } else if (chatDate >= yesterday) {
        dateGroups.yesterday.push(chat);
      } else if (chatDate >= lastWeek) {
        dateGroups.lastWeek.push(chat);
      } else {
        dateGroups.older.push(chat);
      }
    });

    return dateGroups;
  };

  const chatGroups = groupChatsByDate(filteredChats);

  // Handle chat selection with proper state management
  const handleChatSelect = (chatId: number) => {
    setCurrentChat(chatId, user?.refreshToken || "");
    onClose();
  };

  // Handle new chat creation
  const handleNewChat = () => {
    onClose();
    // Trigger new research modal (will be handled by parent component)
    document.dispatchEvent(new CustomEvent('openResearchModal'));
  };

  // Render individual chat item with compact design
  const renderChatItem = (chat: any) => (
    <button
      key={chat.id}
      onClick={() => handleChatSelect(chat.id)}
      className="chat-browser-item group"
      title={`Chat about ${chat.politician}`}
    >
      <div className="chat-browser-item-content">
        <span className="chat-browser-politician-name">{chat.politician}</span>
        <span className="chat-browser-exchange-count">
          {chat.qanda_set?.length || 0} exchanges
        </span>
      </div>
    </button>
  );

  // Render date section with proper visual hierarchy
  const renderDateSection = (title: string, chats: any[]) => {
    if (chats.length === 0) return null;
    
    return (
      <div className="chat-browser-date-section">
        <h3 className="chat-browser-date-title">{title}</h3>
        <div className="chat-browser-chat-list">
          {chats.map(renderChatItem)}
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <Card className="chat-browser-modal">
        <div className="chat-browser-container">
          {/* Search Input - Top priority in visual hierarchy */}
          <div className="chat-browser-search-section">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="chat-browser-search-input"
              placeholder="Search chats..."
              autoFocus
            />
            <button 
              onClick={onClose}
              className="chat-browser-close-button"
              title="Close"
            >
              ×
            </button>
          </div>
          
          {/* New Chat Button - Secondary action */}
          <div className="chat-browser-actions-section">
            <button
              onClick={handleNewChat}
              className="chat-browser-new-chat-button"
            >
              <Plus className="h-4 w-4 mr-2" />
              New chat
            </button>
          </div>
          
          {/* Chat History with Date Groupings - Main content area */}
          <div className="chat-browser-content-area">
            {filteredChats.length > 0 ? (
              <>
                {renderDateSection("Today", chatGroups.today)}
                {renderDateSection("Yesterday", chatGroups.yesterday)}
                {renderDateSection("Last week", chatGroups.lastWeek)}
                {renderDateSection("Older", chatGroups.older)}
              </>
            ) : (
              <div className="chat-browser-empty-state">
                {searchQuery ? (
                  <p>No chats found matching "{searchQuery}"</p>
                ) : (
                  <p>No chat history yet. Start a new research to begin.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

// Research Progress Modal component
function ResearchProgressModal({ onClose }: { onClose: () => void }) {
  const handleClose = () => {
    // Close the modal
    onClose();
    // Redirect to /ask (effectively reloading the page)
    window.location.href = '/ask';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="text-center mb-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-primary border-r-transparent mb-4"></div>
            <h2 className="text-xl font-semibold">Clara is researching</h2>
          </div>
          <p className="text-center text-muted-foreground mb-6">
            This may take a while, around 4-6 minutes. We will notify you once the research is done.
          </p>
          <div className="flex justify-center">
            <Button 
              type="button"
              variant="ghost"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function ClientSidebar() {
  const { user } = useAuth();
  const { createChat, isResearchLoading } = useChat(); // Add isResearchLoading from useChat
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showChatBrowser, setShowChatBrowser] = useState(false);
  const [showResearchProgress, setShowResearchProgress] = useState(false);
  
  // Monitor research loading state
  useEffect(() => {
    console.log("Research loading state changed:", isResearchLoading);
    
    // Only update state if it actually changed to avoid render loops
    if (isResearchLoading && !showResearchProgress) {
      setShowResearchProgress(true);
    } 
    else if (!isResearchLoading && showResearchProgress && document.querySelector('.research-complete-flag')) {
      // Only hide progress modal when research is complete AND some flag element exists
      // This prevents premature closing
      setShowResearchProgress(false);
    }
  }, [isResearchLoading, showResearchProgress]);

  // Listen for modal open events from chat browser
  useEffect(() => {
    const handleOpenResearchModal = () => {
      setShowModal(true);
    };

    document.addEventListener('openResearchModal', handleOpenResearchModal);
    return () => {
      document.removeEventListener('openResearchModal', handleOpenResearchModal);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNewResearch = () => {
    setShowModal(true);
  };

  const handlePoliticianSelect = (data: CreateChatParams) => {
    // First set the modal state
    setShowModal(false);
    
    // Force the research progress modal to show regardless of the loading state
    setShowResearchProgress(true);
    
    // Use a small timeout to ensure the modal renders before any state changes from createChat
    setTimeout(() => {
      createChat(data, user?.refreshToken || null);
    }, 10);
    
    // Add logging to debug the issue
    console.log("Research started for:", data.politician);
  };

  const handleOpenChatBrowser = () => {
    setShowChatBrowser(true);
  };

  // Enhanced sidebar with consistent width management
  return (
    <>
      <div className={`${isCollapsed ? 'w-[60px]' : 'w-[280px]'} transition-all duration-300 bg-white border-r border-gray-200`}>
        {!isCollapsed ? (
          // Expanded sidebar - use our enhanced ChatSidebar
          <div className="h-full flex flex-col min-h-0">
            {/* Header with toggle and new research */}
            <div className="p-4 border-b border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="p-2"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewResearch}
                className="p-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Enhanced ChatSidebar with time-based grouping - takes remaining height */}
            <div className="flex-1" style={{ height: 0 }}>
              <ChatSidebar />
            </div>
          </div>
        ) : (
          // Collapsed sidebar - minimal interface
          <div className="h-full flex flex-col items-center py-4 space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-2"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewResearch}
              className="p-2"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenChatBrowser}
              className="p-2"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {showModal && (
        <PoliticianSelectionModal 
          onSubmit={handlePoliticianSelect}
          onClose={() => setShowModal(false)}
        />
      )}
      
      {showResearchProgress && (
        <ResearchProgressModal 
          onClose={() => setShowResearchProgress(false)}
        />
      )}
      
      {showChatBrowser && (
        <ChatBrowserModal 
          onClose={() => setShowChatBrowser(false)}
        />
      )}
    </>
  );
}
