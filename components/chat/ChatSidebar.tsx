import React from "react";
import { Plus, Trash2, Edit, MoreVertical } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useChat, Chat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";

export function ChatSidebar() {
  const { chats, currentChat, createChat, deleteChat, setCurrentChat, isLoadingChats, updateChat } = useChat();
  const { user } = useAuth();
  const [editMode, setEditMode] = React.useState<string | null>(null);
  const [chatTitle, setChatTitle] = React.useState("");
  const [menuOpenFor, setMenuOpenFor] = React.useState<string | null>(null);

  const handleCreateChat = () => {
    createChat();
  };

  const handleChatSelect = (chatId: string) => {
    setMenuOpenFor(null);
    setEditMode(null);
    setCurrentChat(chatId);
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setMenuOpenFor(null);
    deleteChat(chatId);
  };

  const handleEditClick = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    setMenuOpenFor(null);
    setEditMode(chat.id);
    setChatTitle(chat.title);
  };

  const handleEditSubmit = (e: React.FormEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (chatTitle.trim()) {
      updateChat(chatId, { title: chatTitle.trim() });
    }
    
    setEditMode(null);
  };

  const toggleMenu = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setMenuOpenFor(menuOpenFor === chatId ? null : chatId);
  };

  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
        <p className="mb-4">Sign in to view your chat history</p>
        <Button size="sm" asChild>
          <a href="/auth/login">Log In</a>
        </Button>
      </div>
    );
  }

  if (isLoadingChats) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-sm text-muted-foreground">Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-4 border-b">
        <Button onClick={handleCreateChat} className="w-full justify-start gap-2">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
            <p>No conversations yet</p>
            <p className="text-sm mt-2">Start a new chat to begin</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`
                  group relative flex flex-col rounded-md p-3 text-sm transition-colors
                  ${currentChat?.id === chat.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted/50 cursor-pointer'
                  }
                `}
              >
                {editMode === chat.id ? (
                  <form onSubmit={(e) => handleEditSubmit(e, chat.id)} className="flex w-full">
                    <input
                      type="text"
                      value={chatTitle}
                      onChange={(e) => setChatTitle(e.target.value)}
                      className="flex-1 bg-background rounded px-2 py-1 text-sm focus:outline-none"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button type="submit" size="sm" variant="ghost" className="h-auto px-2 py-1">
                      Save
                    </Button>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium truncate">{chat.title}</span>
                      <button
                        onClick={(e) => toggleMenu(e, chat.id)}
                        className="opacity-0 group-hover:opacity-100 ml-2 p-1 rounded-md hover:bg-accent"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {menuOpenFor === chat.id && (
                      <div 
                        className="absolute right-2 top-10 z-10 bg-background rounded-md shadow-md border p-1 min-w-[120px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => handleEditClick(e, chat)}
                          className="flex w-full items-center px-2 py-1 text-left text-sm hover:bg-accent rounded-sm"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Rename
                        </button>
                        <button
                          onClick={(e) => handleDeleteChat(e, chat.id)}
                          className="flex w-full items-center px-2 py-1 text-left text-sm text-destructive hover:bg-accent rounded-sm"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
                
                <div className="text-xs text-muted-foreground mt-1 truncate">
                  {chat.messages.length > 1
                    ? `${chat.messages.length - 1} messages`
                    : "1 message"
                  }
                  {" · "}
                  {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 