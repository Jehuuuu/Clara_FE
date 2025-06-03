import React from "react";
import { Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useChat, Chat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";

function getSidebarChatTitle(politician: string) {
  return politician || "Untitled Chat";
}

export function ChatSidebar() {
  const {
    chats,
    currentChat,
    deleteChat,
    setCurrentChat,
    isLoadingChats,
  } = useChat();
  const { user } = useAuth();
  const [menuOpenFor, setMenuOpenFor] = React.useState<number | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string>("");

  const handleChatSelect = (chatId: number) => {
    setMenuOpenFor(null);
    setError("");
    setCurrentChat(chatId, user?.refreshToken || "");
    console.log("Selected chat:", chatId);
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: number) => {
    e.stopPropagation();
    setMenuOpenFor(null);
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

  const toggleMenu = (e: React.MouseEvent, chatId: number) => {
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
      {/* Error Message */}
      {error && (
        <div className="p-2 m-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
          <button 
            onClick={() => setError("")}
            className="text-xs text-red-500 hover:text-red-700 mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
            <p>No conversations yet</p>
            <p className="text-sm mt-2">Start a new research to begin</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {chats
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                  className={`group relative flex flex-col rounded-md p-3 text-sm transition-colors ${
                    currentChat?.id === chat.id
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted/50 cursor-pointer"
                  } ${isDeleting === chat.id ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className="font-medium truncate"
                      title={getSidebarChatTitle(chat.politician)}
                    >
                      {getSidebarChatTitle(chat.politician)}
                    </span>
                    <button
                      onClick={(e) => toggleMenu(e, chat.id)}
                      className="opacity-0 group-hover:opacity-100 ml-2 p-1 rounded-md hover:bg-accent"
                      disabled={isDeleting === chat.id}
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
                        onClick={(e) => handleDeleteChat(e, chat.id)}
                        className="flex w-full items-center px-2 py-1 text-left text-sm text-destructive hover:bg-accent rounded-sm"
                        disabled={isDeleting === chat.id}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {isDeleting === chat.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground mt-1 truncate">
                    {chat.qanda_set && chat.qanda_set.length > 1
                      ? `${chat.qanda_set.length} exchanges`
                      : "1 exchange"}{" "}
                    ·{" "}
                    {formatDistanceToNow(new Date(chat.created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
