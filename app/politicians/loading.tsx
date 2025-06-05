import { Filter, Search } from "lucide-react";

// Calculate realistic loading distribution based on screen capacity
// Assume typical screen can show 6-8 position groups with 4 cards each (24-32 cards total)
const TYPICAL_SCREEN_CAPACITY = 28; // cards that fit on typical screen
const CARDS_PER_ROW = 4;
const POSITION_GROUPS_COUNT = Math.floor(TYPICAL_SCREEN_CAPACITY / CARDS_PER_ROW); // 7 groups

// Generate dynamic position categories (each with 4 cards for complete rows)
const generateLoadingPositions = () => {
  const commonPositions = [
    "President", "Senator", "Mayor", "Governor", 
    "Representative", "Councilor", "Vice Mayor", "Other"
  ];
  
  return commonPositions.slice(0, POSITION_GROUPS_COUNT).map(position => ({
    position,
    count: CARDS_PER_ROW // Always 4 cards per position for complete rows
  }));
};

const LOADING_POSITION_GROUPS = generateLoadingPositions();

// Skeleton component for individual politician cards
function PoliticianCardSkeleton() {
  return (
    <div className="w-[104px] h-[105px] animate-pulse">
      <div className="p-2 h-full w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
        <div className="flex flex-col items-center text-center space-y-1.5 h-full">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600"></div>
          <div className="space-y-0.5 min-h-0 flex-1 flex flex-col justify-center w-full">
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton for position group headers (matches real header structure)
function PositionGroupSkeleton({ position, count, groupIndex }: { position: string, count: number, groupIndex: number }) {
  return (
    <div className="flex flex-col animate-in fade-in duration-200" style={{ animationDelay: `${groupIndex * 100}ms` }}>
      <div className="mb-4">
        {/* Header skeleton that matches real position headers */}
        <h2 className="
          text-lg font-semibold text-gray-900 dark:text-gray-100
          border-b-2 border-gray-200 dark:border-gray-700 
          pb-2 mb-4
          flex items-center justify-between
          transition-colors duration-200
        ">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
          <div className="
            h-6 w-8 
            bg-gray-100 dark:bg-gray-800
            rounded-full
            animate-pulse
          "></div>
        </h2>
      </div>
      
      {/* Cards grid that matches real structure - always 4 cards per row */}
      <div className="grid grid-cols-4 gap-4 flex-1">
        {Array.from({ length: count }).map((_, cardIndex) => (
          <div
            key={cardIndex}
            style={{ animationDelay: `${(groupIndex * 100) + (cardIndex * 50)}ms` }}
            className="animate-in fade-in duration-200"
          >
            <PoliticianCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

// Sidebar skeleton (matches expanded sidebar structure)
function SidebarSkeleton() {
  return (
    <div className="
      w-[280px] bg-white dark:bg-gray-900 
      border-r border-gray-200 dark:border-gray-700
      sticky top-0 h-screen
      flex flex-col
      animate-in fade-in duration-200
    ">
      {/* Header skeleton */}
      <div className="
        flex items-center justify-between 
        p-4 border-b border-gray-200 dark:border-gray-700
      ">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-300" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
        </div>
        <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      
      {/* Actions Section skeleton */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Search skeleton */}
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
            <div className="w-full h-10 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg animate-pulse"></div>
          </div>
        </div>
        
        {/* Parties skeleton (collapsible) */}
        <div>
          <div className="flex items-center justify-between p-2 rounded-md mb-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        
        {/* Positions skeleton (collapsible) */}
        <div>
          <div className="flex items-center justify-between p-2 rounded-md mb-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Header skeleton (matches real header structure)
function HeaderSkeleton() {
  return (
    <div className="flex justify-between items-center mb-6 animate-in fade-in duration-200">
      <div className="animate-in fade-in duration-200 delay-100">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
      </div>
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
        <div className="flex-1">
          <div className="p-6">
            {/* Header Skeleton */}
            <HeaderSkeleton />
            
            {/* Politicians Grid with Loading States - screen-appropriate distribution */}
            <div className="
              grid 
              grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6
            ">
              {LOADING_POSITION_GROUPS.map((group, groupIndex) => (
                <PositionGroupSkeleton
                  key={group.position}
                  position={group.position}
                  count={group.count}
                  groupIndex={groupIndex}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 