import React from "react";
import { Trash2, MoreVertical, ChevronDown, ChevronRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useChat, Chat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow, isToday, isYesterday, isThisWeek, isThisMonth, startOfWeek, startOfMonth, subWeeks, subMonths } from "date-fns";

function getSidebarChatTitle(politician: string) {
  return politician || "Untitled Chat";
}

// Custom date checking functions for better time grouping
function isLastWeek(date: Date): boolean {
  const now = new Date();
  const lastWeekStart = startOfWeek(subWeeks(now, 1));
  const lastWeekEnd = startOfWeek(now);
  return date >= lastWeekStart && date < lastWeekEnd;
}

function isLastMonth(date: Date): boolean {
  const now = new Date();
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = startOfMonth(now);
  return date >= lastMonthStart && date < lastMonthEnd;
}

// Time-based grouping logic
function groupChatsByTime(chats: Chat[]) {
  const groups: { [key: string]: Chat[] } = {
    today: [],
    yesterday: [],
    thisWeek: [],
    lastWeek: [],
    thisMonth: [],
    lastMonth: [],
    older: []
  };

  chats.forEach(chat => {
    const date = new Date(chat.created_at);
    
    if (isToday(date)) {
      groups.today.push(chat);
    } else if (isYesterday(date)) {
      groups.yesterday.push(chat);
    } else if (isThisWeek(date)) {
      groups.thisWeek.push(chat);
    } else if (isLastWeek(date)) {
      groups.lastWeek.push(chat);
    } else if (isThisMonth(date)) {
      groups.thisMonth.push(chat);
    } else if (isLastMonth(date)) {
      groups.lastMonth.push(chat);
    } else {
      groups.older.push(chat);
    }
  });

  return groups;
}

// Individual chat item component
function ChatItem({ 
  chat, 
  isSelected, 
  onSelect, 
  onDelete, 
  isDeleting,
  exchangeCount,
  isMenuOpen,
  onMenuToggle
}: {
  chat: Chat;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
  isDeleting: boolean;
  exchangeCount: number;
  isMenuOpen: boolean;
  onMenuToggle: (isOpen: boolean) => void;
}) {
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMenuToggle(!isMenuOpen);
  };

  return (
    <div
      data-chat-id={chat.id}
      onClick={onSelect}
      className={`group relative flex flex-col rounded-lg p-3 text-sm transition-colors cursor-pointer
        ${isSelected
          ? "bg-primary/10"
          : "hover:bg-gray-50"
        } 
        ${isDeleting ? "opacity-50 pointer-events-none" : ""}
        transform transition-all duration-200 hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between w-full">
        <span
          className="font-medium truncate"
          title={getSidebarChatTitle(chat.politician)}
        >
          {getSidebarChatTitle(chat.politician)}
        </span>
        <button
          onClick={toggleMenu}
          className="opacity-0 group-hover:opacity-100 ml-2 p-1 rounded-md hover:bg-gray-200"
          disabled={isDeleting}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {isMenuOpen && (
        <div
          className="absolute right-2 top-10 z-50 bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onDelete}
            className="flex w-full items-center px-3 py-2 text-left text-sm text-red-600"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <Clock className="h-3 w-3" />
        {exchangeCount > 1 ? `${exchangeCount} exchanges` : "1 exchange"}{" "}
        ·{" "}
        {formatDistanceToNow(new Date(chat.created_at), {
          addSuffix: true,
        })}
      </div>
    </div>
  );
}

// Collapsible time group component
function TimeGroup({ 
  title, 
  chats, 
  isExpanded, 
  onToggle, 
  currentChatId, 
  onChatSelect, 
  onChatDelete, 
  isDeleting,
  exchangeCounts,
  openMenuId,
  onMenuToggle
}: {
  title: string;
  chats: Chat[];
  isExpanded: boolean;
  onToggle: () => void;
  currentChatId?: number;
  onChatSelect: (chatId: number) => void;
  onChatDelete: (e: React.MouseEvent, chatId: number) => void;
  isDeleting: number | null;
  exchangeCounts: { [chatId: number]: number };
  openMenuId: number | null;
  onMenuToggle: (chatId: number | null) => void;
}) {
  if (chats.length === 0) return null;

  return (
    <div className="mb-4 opacity-0 animate-fade-in">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700"
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{title}</span>
          <span className="text-xs text-gray-500">
            {chats.length}
          </span>
        </div>
        <div className="transform transition-transform duration-200 group-hover:scale-110">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="mt-2 space-y-1 pl-2 animate-fade-in">
          {chats
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isSelected={currentChatId === chat.id}
                onSelect={() => onChatSelect(chat.id)}
                onDelete={(e) => onChatDelete(e, chat.id)}
                isDeleting={isDeleting === chat.id}
                exchangeCount={exchangeCounts[chat.id] || 0}
                isMenuOpen={openMenuId === chat.id}
                onMenuToggle={(isOpen) => onMenuToggle(isOpen ? chat.id : null)}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export function ChatSidebar() {
  const {
    chats,
    currentChat,
    deleteChat,
    setCurrentChat,
    isLoadingChats,
    chatExchangeCounts,
  } = useChat();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string>("");
  const [openMenuId, setOpenMenuId] = React.useState<number | null>(null);
  
  // Ref for the scrollable container
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Collapsible state for time groups
  const [expandedGroups, setExpandedGroups] = React.useState<{ [key: string]: boolean }>({
    today: true,
    yesterday: true,
    thisWeek: false,
    lastWeek: false,
    thisMonth: false,
    lastMonth: false,
    older: false
  });

  const handleChatSelect = (chatId: number) => {
    setError("");
    setCurrentChat(chatId, user?.refreshToken || "");
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: number) => {
    e.stopPropagation();
    setIsDeleting(chatId);
    setError("");

    try {
      await deleteChat(chatId);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete chat");
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // Auto-scroll to active chat and expand its group
  React.useEffect(() => {
    if (currentChat && chats.length > 0 && !isLoadingChats) {
      // Find which group the current chat belongs to
      const groupedChats = groupChatsByTime(chats);
      let chatGroupKey = '';
      
      // Find the group containing the current chat
      Object.entries(groupedChats).forEach(([key, groupChats]) => {
        if (groupChats.find(chat => chat.id === currentChat.id)) {
          chatGroupKey = key;
        }
      });
      
      // Expand the group containing the current chat
      if (chatGroupKey) {
        setExpandedGroups(prev => ({
          ...prev,
          [chatGroupKey]: true
        }));
        
        // Scroll to the active chat after a short delay to ensure DOM is updated
        setTimeout(() => {
          const activeChatElement = document.querySelector(`[data-chat-id="${currentChat.id}"]`);
          if (activeChatElement && scrollContainerRef.current) {
            activeChatElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }
        }, 300);
      }
    }
  }, [currentChat?.id, chats.length, isLoadingChats]);

  // Close dropdown menus when clicking outside the sidebar
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (scrollContainerRef.current && !scrollContainerRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openMenuId]);

  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 text-center text-gray-600">
        <div className="w-16 h-16 bg-gray-100">
          <Calendar className="h-8 w-8 text-gray-400" />
        </div>
        <p className="mb-4 font-medium">Sign in to view your chat history</p>
        <Button size="sm" asChild className="transform transition-all duration-200 hover:scale-105">
          <a href="/auth/login">Log In</a>
        </Button>
      </div>
    );
  }

  if (isLoadingChats) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-sm text-gray-600">Loading chats...</p>
      </div>
    );
  }

  const groupedChats = groupChatsByTime(chats);
  const timeGroups = [
    { key: 'today', title: 'Today', chats: groupedChats.today },
    { key: 'yesterday', title: 'Yesterday', chats: groupedChats.yesterday },
    { key: 'thisWeek', title: 'This Week', chats: groupedChats.thisWeek },
    { key: 'lastWeek', title: 'Last Week', chats: groupedChats.lastWeek },
    { key: 'thisMonth', title: 'This Month', chats: groupedChats.thisMonth },
    { key: 'lastMonth', title: 'Last Month', chats: groupedChats.lastMonth },
    { key: 'older', title: 'Older', chats: groupedChats.older }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Error Message */}
      {error && (
        <div className="p-2 m-2 bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
          <button 
            onClick={() => setError("")}
            className="text-xs text-red-500"
          >
            Dismiss
          </button>
        </div>
      )}

      <div 
        ref={scrollContainerRef}
        className="flex-1"
        style={{ 
          height: 0
        }}
      >
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-600">
            <Calendar className="h-12 w-12 text-gray-300" />
            <p className="font-medium mb-2">No conversations yet</p>
            <p className="text-sm">Start a new research to begin</p>
          </div>
        ) : (
          <div className="p-3 space-y-2 relative min-h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            {timeGroups.map(({ key, title, chats: groupChats }) => (
              <TimeGroup
                key={key}
                title={title}
                chats={groupChats}
                isExpanded={expandedGroups[key]}
                onToggle={() => toggleGroup(key)}
                currentChatId={currentChat?.id}
                onChatSelect={handleChatSelect}
                onChatDelete={handleDeleteChat}
                isDeleting={isDeleting}
                exchangeCounts={chatExchangeCounts}
                openMenuId={openMenuId}
                onMenuToggle={setOpenMenuId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
