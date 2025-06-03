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

export function ClientSidebar() {
  const { user } = useAuth();
  const { chats, currentChat, setCurrentChat, createChat } = useChat();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [showChatBrowser, setShowChatBrowser] = useState(false);
  
  // Handle custom event for opening research modal from chat browser
  useEffect(() => {
    const handleOpenResearchModal = () => {
      setShowResearchModal(true);
    };
    
    document.addEventListener('openResearchModal', handleOpenResearchModal);
    
    return () => {
      document.removeEventListener('openResearchModal', handleOpenResearchModal);
    };
  }, []);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleChatSelect = (chatId: number) => {
    if (isCollapsed) {
      setIsCollapsed(false); // Auto-expand when selecting a chat
    }
    setCurrentChat(chatId, user?.refreshToken || "");
  };

  const handleNewResearch = () => {
    setShowResearchModal(true);
  };

  const handlePoliticianSelect = (data: CreateChatParams) => {
    setShowResearchModal(false);
    // Create the chat using the same function as the main interface
    createChat(data, user?.refreshToken || null);
  };

  const handleOpenChatBrowser = () => {
    setShowChatBrowser(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Collapsed view - like ChatGPT
  if (isCollapsed) {
    return (
      <>
        {showResearchModal && (
          <PoliticianSelectionModal
            onSubmit={handlePoliticianSelect}
            onClose={() => setShowResearchModal(false)}
          />
        )}
        
        <div className="sidebar-collapsed">
          {/* Top buttons row */}
          <div className="sidebar-collapsed-top">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="sidebar-toggle-btn"
              title="Open sidebar"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewResearch}
              className="sidebar-new-research-btn"
              title="New research"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Guest user expanded view
  if (!user) {
    return (
      <>
        {showResearchModal && (
          <PoliticianSelectionModal
            onSubmit={handlePoliticianSelect}
            onClose={() => setShowResearchModal(false)}
          />
        )}
        
        <div className="sidebar-expanded">
          {/* Header with close button */}
          <div className="sidebar-header">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="sidebar-close-btn"
              title="Close sidebar"
            >
              <PanelLeftClose className="h-5 w-5" />
            </Button>
          </div>
          
          {/* New Research Button */}
          <div className="sidebar-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewResearch}
              className="sidebar-new-research-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Research
            </Button>
          </div>
          
          {/* Guest content */}
          <div className="sidebar-guest-content">
            <p className="text-sm text-gray-600 mb-4">Sign in to save your chat history</p>
            <Button size="sm" asChild className="w-full">
              <a href="/auth/login">
                <LogIn className="h-4 w-4 mr-2" />
                Log In
              </a>
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Authenticated user expanded view
  return (
    <>
      {showResearchModal && (
        <PoliticianSelectionModal
          onSubmit={handlePoliticianSelect}
          onClose={() => setShowResearchModal(false)}
        />
      )}
      
      {showChatBrowser && (
        <ChatBrowserModal
          onClose={() => setShowChatBrowser(false)}
        />
      )}
      
      <div className="sidebar-expanded">
        {/* Header with close button */}
        <div className="sidebar-header">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="sidebar-close-btn"
            title="Close sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Action buttons */}
        <div className="sidebar-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewResearch}
            className="sidebar-new-research-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Research
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenChatBrowser}
            className="sidebar-search-btn"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        {/* Chat history */}
        <div className="sidebar-content">
          <ChatSidebar />
        </div>
      </div>
    </>
  );
} 