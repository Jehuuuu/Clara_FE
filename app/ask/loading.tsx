import React from 'react';

// Chat message skeleton component
function ChatMessageSkeleton({ isUser, delay }: { isUser: boolean; delay: number }) {
  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 opacity-0 animate-fade-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[85%] gap-3`}>
        {/* Avatar skeleton */}
        <div className="w-8 h-8 bg-gray-200" />

        {/* Message content skeleton */}
        <div className={`${
          isUser 
            ? 'bg-primary/10'
            : 'bg-gray-100'
        } rounded-lg p-4 space-y-2 animate-pulse`}>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300" />
            <div className="h-4 bg-gray-300" />
            <div className="h-4 bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Sidebar chat item skeleton
function SidebarChatSkeleton({ delay }: { delay: number }) {
  return (
    <div 
      className="p-3 rounded-md space-y-2 animate-pulse opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-300" />
        <div className="w-4 h-4 bg-gray-300" />
      </div>
      <div className="h-3 bg-gray-200" />
    </div>
  );
}

// Sidebar time group skeleton
function SidebarTimeGroupSkeleton({ title, count, delay }: { title: string; count: number; delay: number }) {
  return (
    <div 
      className="opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Time group header */}
      <div className="flex items-center justify-between px-3 py-2 mb-2">
        <div className="h-4 bg-gray-400" />
        <div className="w-4 h-4 bg-gray-300" />
      </div>

      {/* Chat items */}
      <div className="space-y-1 px-1">
        {Array.from({ length: count }, (_, i) => (
          <SidebarChatSkeleton key={i} delay={delay + (i * 50)} />
        ))}
      </div>
    </div>
  );
}

export default function AskPageLoading() {
  return (
    <div className="app-container">
      <div className="main-layout">
        {/* Left Sidebar Skeleton */}
        <div className="sidebar-container">
          <div className="h-full flex flex-col border-r bg-white">
            {/* Sidebar header */}
            <div className="p-4 border-b opacity-0 animate-fade-in">
              <div className="h-6 bg-gray-300" />
            </div>

            {/* Chat history groups */}
            <div className="flex-1 overflow-y-auto p-2 space-y-4">
              <SidebarTimeGroupSkeleton title="Today" count={3} delay={100} />
              <SidebarTimeGroupSkeleton title="Yesterday" count={2} delay={200} />
              <SidebarTimeGroupSkeleton title="This Week" count={4} delay={300} />
              <SidebarTimeGroupSkeleton title="Last Week" count={2} delay={400} />
            </div>
          </div>
        </div>

        {/* Main Chat Area Skeleton */}
        <div className="flex-1">
          <div className="chat-container h-full flex flex-col">
            {/* Chat header */}
            <div className="border-b p-4 opacity-0 animate-fade-in" style={{ animationDelay: '150ms' }}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-300" />
                  <div className="h-4 bg-gray-200" />
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gray-200" />
                  <div className="w-8 h-8 bg-gray-200" />
                </div>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                {/* Welcome message skeleton */}
                <div className="text-center py-8 opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <div className="w-16 h-16 bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-300" />
                    <div className="h-4 bg-gray-200" />
                  </div>
                </div>

                {/* Sample chat messages */}
                <ChatMessageSkeleton isUser={false} delay={250} />
                <ChatMessageSkeleton isUser={true} delay={300} />
                <ChatMessageSkeleton isUser={false} delay={350} />
                <ChatMessageSkeleton isUser={true} delay={400} />
                <ChatMessageSkeleton isUser={false} delay={450} />
              </div>
            </div>

            {/* Chat input skeleton */}
            <div className="border-t p-4 opacity-0 animate-fade-in" style={{ animationDelay: '500ms' }}>
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end gap-3">
                  <div className="flex-1 min-h-[44px] bg-gray-100" />
                  <div className="w-10 h-10 bg-primary/20 rounded-md animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
