"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, X, ArrowRightLeft, Star, PanelLeftClose, PanelLeftOpen, RefreshCw } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { usePoliticians } from "@/context/PoliticianContext";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/common/Card";

// Define the categories to display based on political positions
const POSITION_CATEGORIES = [
  "President",
  "Vice President",
  "Senator",
  "Party-list Representative",
  "District Representative",
  "Governor",
  "Vice Governor",
  "Mayor",
  "Vice Mayor",
  "Councilor",
  "Other"
];

// Define the Politician interface based on the API response
interface Politician {
  id: number;
  name: string;
  image_url: string | null;
  created_at: string;
  party: string | null;
  latest_research: {
    id: number;
    position: string;
    background: string;
    accomplishments: string;
    criticisms: string;
    summary: string;
    sources: any;
    created_at: string;
    updated_at: string;
    politician_image: string | null;
    politician_party: string | null;
  } | null;
}

// Loading skeleton component
function PoliticianCardSkeleton() {
  return (
    <div className="w-[104px] h-[105px] animate-pulse">
      <Card className="p-2 h-full w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="flex flex-col items-center text-center space-y-1.5 h-full">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600"></div>
          <div className="space-y-0.5 min-h-0 flex-1 flex flex-col justify-center w-full">
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Highlight search terms in text
function HighlightedText({ text, searchTerm }: { text: string; searchTerm: string }) {
  if (!searchTerm) return <>{text}</>;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

// Compact Politician Card component with modern styling - maintains current size and aspect ratio
interface CompactPoliticianCardProps {
  politician: Politician;
  isSelected: boolean;
  onSelect: () => void;
  searchTerm: string;
}

function CompactPoliticianCard({ politician, isSelected, onSelect, searchTerm }: CompactPoliticianCardProps) {
  return (
    <div
      className={`
        relative group cursor-pointer transition-all duration-200 ease-in-out
        w-[104px] h-[105px]
        focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2
        ${isSelected 
          ? 'ring-2 ring-primary ring-offset-2 scale-105' 
          : 'hover:scale-105 hover:shadow-lg hover:-translate-y-1'
        }
      `}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Select ${politician.name}`}
    >
      {/* Modern card with enhanced styling and fixed dimensions */}
      <Card className="
        p-2 h-full w-full
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700
        rounded-xl
        shadow-sm hover:shadow-md
        transition-all duration-200 ease-in-out
        group-hover:border-gray-300 dark:group-hover:border-gray-600
        group-focus:border-primary dark:group-focus:border-primary
        backdrop-blur-sm
      ">
        <div className="flex flex-col items-center text-center space-y-1.5 h-full">
          {/* Politician avatar with modern styling */}
          <div className="
            relative w-10 h-10 rounded-full overflow-hidden 
            bg-gradient-to-br from-gray-200 to-gray-300 
            dark:from-gray-600 dark:to-gray-700
            flex-shrink-0
            ring-2 ring-gray-100 dark:ring-gray-600
            transition-all duration-200 ease-in-out
            group-hover:ring-gray-200 dark:group-hover:ring-gray-500
            group-focus:ring-primary dark:group-focus:ring-primary
            group-hover:scale-105
          ">
            {politician.image_url ? (
              <Image
                src={politician.image_url}
                alt={`${politician.name} - Profile Image`}
                fill
                className="object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
                sizes="40px"
              />
            ) : (
              <div className="
                w-full h-full 
                bg-gradient-to-br from-primary/20 to-primary/40
                flex items-center justify-center
                transition-all duration-200 ease-in-out
                group-hover:from-primary/30 group-hover:to-primary/50
              ">
                <span className="
                  text-primary font-semibold text-xs
                  transition-all duration-200 ease-in-out
                  group-hover:scale-105
                ">
                  {politician.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          {/* Politician information */}
          <div className="space-y-0.5 min-h-0 flex-1 flex flex-col justify-center">
            {/* Politician name with modern typography and highlighting */}
            <h3 className="
              font-medium text-[10px] leading-tight line-clamp-2
              text-gray-900 dark:text-gray-100
              transition-colors duration-200 ease-in-out
              group-hover:text-primary
            ">
              <HighlightedText text={politician.name} searchTerm={searchTerm} />
            </h3>
            
            {/* Party display with subtle styling and highlighting */}
            {politician.party && (
              <p className="
                text-[9px] text-gray-500 dark:text-gray-400 leading-tight line-clamp-1
                transition-colors duration-200 ease-in-out
                group-hover:text-gray-600 dark:group-hover:text-gray-300
              ">
                <HighlightedText text={politician.party} searchTerm={searchTerm} />
              </p>
            )}
          </div>
          
          {/* Selection indicator with modern design */}
          {isSelected && (
            <div className="
              absolute -top-1 -right-1 w-5 h-5 
              bg-gradient-to-r from-primary to-primary/80
              rounded-full flex items-center justify-center
              shadow-lg ring-2 ring-white dark:ring-gray-800
              animate-in zoom-in-50 duration-200
            ">
              <Star className="
                h-2.5 w-2.5 text-white fill-current
              " />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// Enhanced empty state component
function EmptyState({ hasFilters, onClearFilters }: { hasFilters: boolean; onClearFilters: () => void }) {
  return (
    <div className="text-center py-16 px-6 animate-in fade-in duration-300">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Search className="w-10 h-10 text-gray-400 animate-pulse" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {hasFilters ? "No politicians match your filters" : "No politicians found"}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {hasFilters 
            ? "Try adjusting your search criteria or clearing some filters to see more results."
            : "We couldn't find any politicians in our database at the moment."
          }
        </p>
        
        {hasFilters && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="inline-flex items-center gap-2 hover:scale-105 transition-transform duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Clear all filters
          </Button>
        )}
      </div>
    </div>
  );
}

export default function PoliticiansPage() {
  const searchParams = useSearchParams();
  const { 
    politicians, 
    issues, 
    isLoading, 
    filter, 
    selectedPoliticians,
    selectPolitician,
    unselectPolitician,
    setSearchTerm, 
    setIssueFilter,
    setPartyFilter,
    setPositionFilter,
    clearFilters,
    getFilteredPoliticians,
    getUniqueParties,
    getUniquePositions,
  } = usePoliticians();
  
  // Local search state to debounce
  const [localSearchTerm, setLocalSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);
  const uniqueParties = getUniqueParties();
  const uniquePositions = getUniquePositions();
  
  // Compare mode state
  const [isCompareMode, setIsCompareMode] = useState(false);
  
  // Apply debounced search term to filter
  useEffect(() => {
    if (filter.searchTerm !== debouncedSearchTerm) {
      setSearchTerm(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, filter.searchTerm, setSearchTerm]);
  
  // Apply URL search param on initial load
  useEffect(() => {
    const initialSearch = searchParams.get("search");
    if (initialSearch) {
      setLocalSearchTerm(initialSearch);
      setSearchTerm(initialSearch);
    }
  }, [searchParams, setSearchTerm]);
  
  const filteredPoliticians = getFilteredPoliticians();
  const totalPoliticians = politicians.length;
  const hasActiveFilters = !!(filter.partyFilter || filter.positionFilter || filter.searchTerm);
  
  // Function to get count for each party filter option
  const getPartyCount = (party: string) => {
    return politicians.filter(politician => politician.party === party).length;
  };

  // Function to get count for each position filter option  
  const getPositionCount = (position: string) => {
    return politicians.filter(politician => politician.latest_research?.position === position).length;
  };

  // Toggle sidebar state - like ask page
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Group politicians by position
  const getPoliticiansByPosition = () => {
    const groupedPoliticians: Record<string, Politician[]> = {};
    
    // Initialize categories
    POSITION_CATEGORIES.forEach(position => {
      groupedPoliticians[position] = [];
    });
    
    // Group politicians
    filteredPoliticians.forEach((politician: Politician) => {
      // Map position to an existing category, or use "Other"
      const position = politician.latest_research?.position && POSITION_CATEGORIES.includes(politician.latest_research.position) 
        ? politician.latest_research.position
        : "Other";
        
      groupedPoliticians[position].push(politician);
    });
    
    // Filter out empty categories
    return Object.entries(groupedPoliticians)
      .filter(([_, politicians]) => politicians.length > 0)
      .map(([position, politicians]) => ({
        position,
        politicians
      }));
  };
  
  const positionGroups = getPoliticiansByPosition();

  // Handle politician selection
  const handlePoliticianSelect = (id: number) => {
    if (selectedPoliticians.includes(id)) {
      unselectPolitician(id);
    } else {
      selectPolitician(id);
    }
  };

  // Handle politician click - redirect or select based on mode
  const handlePoliticianClick = (id: number) => {
    if (isCompareMode) {
      handlePoliticianSelect(id);
    } else {
      // Redirect to politician page
      window.location.href = `/politician/${id}`;
    }
  };

  // Toggle compare mode and clear selections when exiting
  const toggleCompareMode = () => {
    if (isCompareMode) {
      // Exiting compare mode - clear selections
      selectedPoliticians.forEach(id => unselectPolitician(id));
    }
    setIsCompareMode(!isCompareMode);
  };

  // Toggle sidebar collapse/expand
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Collapsible Filter Sidebar - styled like ask page sidebar */}
        {isSidebarCollapsed ? (
          <div className="
            w-[60px] bg-white dark:bg-gray-900 
            border-r border-gray-200 dark:border-gray-700
            flex flex-col items-center py-4 gap-3
            sticky top-0 h-screen
            transition-all duration-300 ease-in-out
            animate-in fade-in duration-200
          ">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="w-8 h-8 p-0 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-all duration-200 hover:scale-110"
              title="Open filters"
            >
              <PanelLeftOpen className="h-5 w-5 animate-in fade-in duration-200" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="w-8 h-8 p-0 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-all duration-200 hover:scale-110"
              title="Clear filters"
            >
              <Filter className="h-4 w-4 animate-in fade-in duration-200 delay-100" />
            </Button>
          </div>
        ) : (
          <div className="
            w-[280px] bg-white dark:bg-gray-900 
            border-r border-gray-200 dark:border-gray-700
            sticky top-0 h-screen
            flex flex-col
            transition-all duration-300 ease-in-out
            animate-in fade-in duration-200
          ">
            <div className="
              flex items-center justify-between 
              p-4 border-b border-gray-200 dark:border-gray-700
              animate-in fade-in duration-200 delay-100
            ">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500 animate-in zoom-in-95 duration-200 delay-200" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 animate-in fade-in duration-200 delay-300">
                  Filters
                </span>
              </div>
              <div className="flex items-center gap-1">
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-105 animate-in zoom-in-95 duration-200 delay-400"
                  >
                    Clear
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110 animate-in zoom-in-95 duration-200 delay-500"
                  title="Collapse filters"
                >
                  <PanelLeftClose className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="animate-in fade-in duration-200 delay-200">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors duration-200" />
                  <input
                    type="text"
                    placeholder="Search politicians..."
                    className="
                      w-full pl-9 pr-8 py-2.5 text-sm 
                      border border-gray-200 dark:border-gray-600
                      rounded-lg
                      bg-white dark:bg-gray-800
                      text-gray-900 dark:text-gray-100
                      placeholder-gray-500 dark:placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                      transition-all duration-200
                      hover:border-gray-300 dark:hover:border-gray-500
                    "
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                  />
                  {localSearchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 animate-in zoom-in-95 duration-200"
                      onClick={() => {
                        setLocalSearchTerm("");
                        setSearchTerm("");
                      }}
                      aria-label="Clear search"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="animate-in fade-in duration-200 delay-300">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Parties</h3>
                <div className="space-y-2">
                  {uniqueParties.map((party, index) => {
                    const count = getPartyCount(party);
                    return (
                      <label 
                        key={party}
                        className="
                          flex items-center justify-between p-2 rounded-md
                          hover:bg-gray-50 dark:hover:bg-gray-800
                          cursor-pointer transition-all duration-200
                          group hover:scale-[1.02]
                          animate-in fade-in duration-200
                        "
                        style={{ animationDelay: `${400 + (index * 50)}ms` }}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="party"
                            checked={filter.partyFilter === party}
                            onChange={() => setPartyFilter(
                              filter.partyFilter === party ? null : party
                            )}
                            className="
                              mr-3 h-4 w-4 text-primary 
                              border-gray-300 dark:border-gray-600
                              focus:ring-primary/20
                              transition-all duration-200
                            "
                          />
                          <span className="
                            text-sm text-gray-700 dark:text-gray-300
                            group-hover:text-gray-900 dark:group-hover:text-gray-100
                            transition-colors duration-200
                          ">
                            {party}
                          </span>
                        </div>
                        <span className="
                          text-xs text-gray-500 dark:text-gray-400
                          bg-gray-100 dark:bg-gray-700
                          px-2 py-1 rounded-full
                          group-hover:bg-gray-200 dark:group-hover:bg-gray-600
                          transition-all duration-200
                          group-hover:scale-105
                        ">
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="animate-in fade-in duration-200 delay-400">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Positions</h3>
                <div className="space-y-2">
                  {uniquePositions.map((position, index) => {
                    const count = getPositionCount(position);
                    return (
                      <label 
                        key={position}
                        className="
                          flex items-center justify-between p-2 rounded-md
                          hover:bg-gray-50 dark:hover:bg-gray-800
                          cursor-pointer transition-all duration-200
                          group hover:scale-[1.02]
                          animate-in fade-in duration-200
                        "
                        style={{ animationDelay: `${500 + (index * 50)}ms` }}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="position"
                            checked={filter.positionFilter === position}
                            onChange={() => setPositionFilter(
                              filter.positionFilter === position ? null : position
                            )}
                            className="
                              mr-3 h-4 w-4 text-primary 
                              border-gray-300 dark:border-gray-600
                              focus:ring-primary/20
                              transition-all duration-200
                            "
                          />
                          <span className="
                            text-sm text-gray-700 dark:text-gray-300
                            group-hover:text-gray-900 dark:group-hover:text-gray-100
                            transition-colors duration-200
                          ">
                            {position}
                          </span>
                        </div>
                        <span className="
                          text-xs text-gray-500 dark:text-gray-400
                          bg-gray-100 dark:bg-gray-700
                          px-2 py-1 rounded-full
                          group-hover:bg-gray-200 dark:group-hover:bg-gray-600
                          transition-all duration-200
                          group-hover:scale-105
                        ">
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - responsive to sidebar state */}
        <div className={`
          flex-1 transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'ml-0' : 'ml-0'}
        `}>
          <div className="p-6">
            {/* Header with Compare Mode Toggle and Real-time Stats */}
            <div className="flex justify-between items-center mb-6 animate-in fade-in-50 slide-in-from-top-4 duration-500">
              <div className="animate-in slide-in-from-left-4 duration-500 delay-100">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Politicians</h1>
                <div className="text-sm text-gray-600 dark:text-gray-400 transition-all duration-300">
                  {hasActiveFilters && (
                    <span className="text-primary font-medium animate-in fade-in duration-300">
                      {filteredPoliticians.length} of {totalPoliticians} 
                    </span>
                  )}
                  {!hasActiveFilters && (
                    <span className="animate-in fade-in duration-300">
                      {filteredPoliticians.length}
                    </span>
                  )}
                  {' '}
                  {filteredPoliticians.length === 1 ? 'politician' : 'politicians'} 
                  {hasActiveFilters ? ' match your filters' : ' found'}
                </div>
              </div>
              <Button
                variant={isCompareMode ? "default" : "outline"}
                onClick={toggleCompareMode}
                className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-500 delay-200 hover:scale-105 transition-all duration-200"
              >
                <ArrowRightLeft className={`h-4 w-4 transition-transform duration-200 ${isCompareMode ? 'rotate-180' : ''}`} />
                {isCompareMode ? "Exit Compare" : "Compare Mode"}
              </Button>
            </div>
            
            {/* Compare Mode Info */}
            {isCompareMode && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-in slide-in-from-top-4 duration-300 shadow-sm">
                <p className="text-sm text-blue-800">
                  <strong>Compare Mode Active:</strong> Click on politicians to select them for comparison. 
                  Select 2 politicians to compare their profiles.
                </p>
              </div>
            )}
            
            {/* Active Filters */}
            {(filter.partyFilter || filter.positionFilter) && (
              <div className="flex flex-wrap gap-2 mb-4 animate-in slide-in-from-left-4 duration-500">
                {filter.partyFilter && (
                  <Badge variant="secondary" className="flex items-center gap-1 animate-in zoom-in-95 duration-200 hover:scale-105 transition-transform">
                    Party: {filter.partyFilter}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-gray-200 transition-colors duration-200"
                      onClick={() => setPartyFilter(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {filter.positionFilter && (
                  <Badge variant="secondary" className="flex items-center gap-1 animate-in zoom-in-95 duration-200 delay-100 hover:scale-105 transition-transform">
                    Position: {filter.positionFilter}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-gray-200 transition-colors duration-200"
                      onClick={() => setPositionFilter(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6 animate-in zoom-in-95 duration-200 delay-200 hover:scale-105 transition-all duration-200"
                  onClick={clearFilters}
                >
                  Clear all
                </Button>
              </div>
            )}
            
            {/* Compare Button (if politicians selected in compare mode) */}
            {isCompareMode && selectedPoliticians.length > 0 && (
              <div className="flex items-center justify-end mb-4 animate-in slide-in-from-right-4 duration-300">
                <span className="mr-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  {selectedPoliticians.length}/2 selected
                </span>
                <Button
                  disabled={selectedPoliticians.length < 2}
                  asChild={selectedPoliticians.length === 2}
                  className={`transition-all duration-300 ${selectedPoliticians.length === 2 ? 'animate-pulse hover:scale-105' : ''}`}
                >
                  {selectedPoliticians.length === 2 ? (
                    <Link href={`/compare?ids=${selectedPoliticians.join(',')}`}>
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Compare Politicians
                    </Link>
                  ) : (
                    <>
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Select 2 to Compare
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {/* Politicians Grid with Loading States and Enhanced Empty State */}
            {isLoading ? (
              <div className={`
                grid 
                ${isSidebarCollapsed 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
                  : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
                }
              `}>
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="flex flex-col animate-in fade-in-50 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                    {index % 4 === 0 && (
                      <div className="mb-4">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
                      </div>
                    )}
                    <div className="grid grid-cols-4 gap-4 flex-1">
                      {Array.from({ length: 4 }).map((_, cardIndex) => (
                        <PoliticianCardSkeleton key={cardIndex} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPoliticians.length === 0 ? (
              <EmptyState hasFilters={hasActiveFilters} onClearFilters={clearFilters} />
            ) : (
              <div className={`
                grid 
                ${isSidebarCollapsed 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
                  : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
                }
              `}>
                {positionGroups.map((group, groupIndex) => (
                  <div key={group.position} className="flex flex-col animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${groupIndex * 100}ms` }}>
                    <div className="mb-4">
                      <h2 className="
                        text-lg font-semibold text-gray-900 dark:text-gray-100
                        border-b-2 border-gray-200 dark:border-gray-700 
                        pb-2 mb-4
                        flex items-center justify-between
                        transition-colors duration-300
                        hover:border-primary/50
                      ">
                        <span className="animate-in slide-in-from-left-4 duration-300">{group.position}</span>
                        <span className="
                          text-sm font-normal text-gray-500 dark:text-gray-400
                          bg-gray-100 dark:bg-gray-800
                          px-2 py-1 rounded-full
                          transition-all duration-300
                          hover:bg-gray-200 dark:hover:bg-gray-700
                          animate-in zoom-in-95 duration-300 delay-100
                        ">
                          {group.politicians.length}
                        </span>
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 flex-1">
                      {group.politicians.map((politician, politicianIndex) => (
                        <div
                          key={politician.id}
                          style={{ animationDelay: `${(groupIndex * 100) + (politicianIndex * 50)}ms` }}
                        >
                          <CompactPoliticianCard
                            politician={politician}
                            isSelected={isCompareMode && selectedPoliticians.includes(politician.id)}
                            onSelect={() => handlePoliticianClick(politician.id)}
                            searchTerm={filter.searchTerm || ""}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}