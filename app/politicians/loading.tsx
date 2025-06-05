import { Filter, Search } from "lucide-react";

// Skeleton component for individual politician cards
function PoliticianCardSkeleton() {
  return (
    <div className="w-[104px] h-[105px] animate-pulse">
      <div className="p-2 h-full w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
        <div className="flex flex-col items-center text-center space-y-1.5 h-full">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
          <div className="space-y-0.5 min-h-0 flex-1 flex flex-col justify-center w-full">
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-full animate-pulse"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton for position group headers
function PositionGroupSkeleton() {
  return (
    <div className="flex flex-col animate-in fade-in duration-200">
      <div className="mb-4">
        <div className="flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
          <div className="h-6 w-8 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 flex-1">
        {Array.from({ length: 8 }).map((_, index) => (
          <PoliticianCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

// Sidebar skeleton
function SidebarSkeleton() {
  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 sticky top-0 h-screen flex flex-col animate-in fade-in duration-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-300 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Search skeleton */}
        <div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-3 animate-pulse"></div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 animate-pulse" />
            <div className="w-full h-10 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg animate-pulse"></div>
          </div>
        </div>
        
        {/* Parties skeleton */}
        <div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-3 animate-pulse"></div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-md">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded mr-3 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20 animate-pulse"></div>
                </div>
                <div className="h-4 w-6 bg-gray-100 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Positions skeleton */}
        <div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-3 animate-pulse"></div>
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-md">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded mr-3 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24 animate-pulse"></div>
                </div>
                <div className="h-4 w-6 bg-gray-100 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Header skeleton
function HeaderSkeleton() {
  return (
    <div className="flex justify-between items-center mb-6 animate-in fade-in duration-200">
      <div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar Skeleton */}
        <SidebarSkeleton />
        
        {/* Main Content Skeleton */}
        <div className="flex-1 transition-all duration-300">
          <div className="p-6">
            {/* Header Skeleton */}
            <HeaderSkeleton />
            
            {/* Content Loading Animation */}
            <div className="space-y-8">
              {/* Multiple position groups */}
              {Array.from({ length: 3 }).map((_, groupIndex) => (
                <div key={groupIndex} className="animate-in fade-in duration-300" style={{ animationDelay: `${groupIndex * 100}ms` }}>
                  <PositionGroupSkeleton />
                </div>
              ))}
            </div>
            
            {/* Floating loading indicator */}
            <div className="fixed bottom-8 right-8 animate-in fade-in duration-300 delay-300">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 flex items-center gap-3">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Loading politicians...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 