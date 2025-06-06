"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Search, Filter, X, Star, PanelLeftClose, PanelLeftOpen, 
  RefreshCw, ChevronDown, ChevronUp, Heart, Users, Clock
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { usePoliticians } from "@/context/PoliticianContext";
import Image from "next/image";

// Types
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

interface SearchState {
  query: string;
  suggestions: string[];
  recentSearches: string[];
  isSearching: boolean;
  showSuggestions: boolean;
}

// Constants
const POSITION_CATEGORIES = [
  "President", "Vice President", "Senator", "Party-list Representative",
  "District Representative", "Governor", "Vice Governor", "Mayor",
  "Vice Mayor", "Councilor", "Other"
];

// Enhanced search utilities
class SearchEngine {
  private static normalizeText(text: string): string {
    return text.toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .trim();
  }

  private static getSearchableFields(politician: Politician): string[] {
    const fields = [
      politician.name,
      politician.party || '',
      politician.latest_research?.position || '',
      politician.latest_research?.background || '',
      politician.latest_research?.accomplishments || '',
      politician.latest_research?.summary || ''
    ];
    
    return fields.filter(Boolean);
  }

  static generateSuggestions(politicians: Politician[], query: string): string[] {
    if (!query || query.length < 2) return [];
    
    const normalizedQuery = this.normalizeText(query);
    const suggestions = new Set<string>();
    
    politicians.forEach(politician => {
      const fields = this.getSearchableFields(politician);
      
      fields.forEach(field => {
        const normalizedField = this.normalizeText(field);
        
        // Exact word matches
        const words = normalizedField.split(/\s+/);
        words.forEach(word => {
          if (word.includes(normalizedQuery) && word !== normalizedQuery) {
            suggestions.add(field.split(/\s+/).find(w => 
              this.normalizeText(w).includes(normalizedQuery)
            ) || '');
          }
        });
        
        // Phrase suggestions for names and positions
        if (politician.name.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(politician.name);
        }
        
        if (politician.latest_research?.position?.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(politician.latest_research.position);
        }
      });
    });
    
    return Array.from(suggestions)
      .filter(s => s.length > 0 && s.toLowerCase() !== query.toLowerCase())
      .slice(0, 5)
      .sort((a, b) => a.length - b.length);
  }

  static searchPoliticians(politicians: Politician[], query: string): Politician[] {
    if (!query || query.trim().length === 0) {
      return politicians;
    }

    const normalizedQuery = this.normalizeText(query);
    const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 0);
    
    if (queryWords.length === 0) return politicians;

    const scoredResults = politicians.map(politician => {
      const fields = this.getSearchableFields(politician);
      let score = 0;
      let matchDetails = {
        nameMatch: false,
        partyMatch: false,
        positionMatch: false,
        contentMatch: false
      };

      // Calculate relevance score
      queryWords.forEach(word => {
        fields.forEach((field, fieldIndex) => {
          const normalizedField = this.normalizeText(field);
          
          if (normalizedField.includes(word)) {
            // Weight scores by field importance
            let fieldWeight = 1;
            switch (fieldIndex) {
              case 0: // name
                fieldWeight = 10;
                matchDetails.nameMatch = true;
                break;
              case 1: // party
                fieldWeight = 5;
                matchDetails.partyMatch = true;
                break;
              case 2: // position
                fieldWeight = 7;
                matchDetails.positionMatch = true;
                break;
              default: // other fields
                fieldWeight = 2;
                matchDetails.contentMatch = true;
            }
            
            // Bonus for exact word matches
            if (normalizedField.split(/\s+/).includes(word)) {
              fieldWeight *= 2;
            }
            
            // Bonus for matches at beginning of field
            if (normalizedField.startsWith(word)) {
              fieldWeight *= 1.5;
            }
            
            score += fieldWeight;
          }
        });
      });

      return {
        politician,
        score,
        matchDetails
      };
    });

    // Filter and sort by relevance
    return scoredResults
      .filter(result => result.score > 0)
      .sort((a, b) => {
        // Primary sort by score
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        
        // Secondary sort by name match priority
        if (a.matchDetails.nameMatch && !b.matchDetails.nameMatch) return -1;
        if (!a.matchDetails.nameMatch && b.matchDetails.nameMatch) return 1;
        
        // Tertiary sort alphabetically
        return a.politician.name.localeCompare(b.politician.name);
      })
      .map(result => result.politician);
  }
}

// Local storage utilities for search history
const SearchHistory = {
  getRecentSearches(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('politician-recent-searches');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addSearch(query: string): void {
    if (typeof window === 'undefined' || !query.trim()) return;
    
    try {
      const recent = this.getRecentSearches();
      const updated = [query, ...recent.filter(s => s !== query)].slice(0, 10);
      localStorage.setItem('politician-recent-searches', JSON.stringify(updated));
    } catch {
      // Silently fail if localStorage is not available
    }
  },

  clearHistory(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('politician-recent-searches');
    } catch {
      // Silently fail
    }
  }
};

// Utility Components
function LoadingSkeleton() {
  return (
    <div className="w-[104px] h-[105px] animate-pulse">
      <Card className="p-2 h-full w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="flex flex-col items-center text-center space-y-1.5 h-full">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600" />
          <div className="space-y-0.5 min-h-0 flex-1 flex flex-col justify-center w-full">
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-full" />
            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mx-auto" />
          </div>
        </div>
      </Card>
    </div>
  );
}

function HighlightedText({ text, searchTerm }: { text: string; searchTerm: string }) {
  if (!searchTerm || !text) return <>{text}</>;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 px-0.5 rounded">
            {part}
          </mark>
        ) : part
      )}
    </>
  );
}

function SearchInput({
  searchState,
  onSearchChange,
  onSearchSubmit,
  onSuggestionClick,
  onClearSearch,
  politicians
}: {
  searchState: SearchState;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  onClearSearch: () => void;
  politicians: Politician[];
}) {
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearchSubmit(searchState.query);
    } else if (e.key === 'Escape') {
      onClearSearch();
      inputRef?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
    inputRef?.blur();
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        ref={setInputRef}
        type="text"
        placeholder="Search by name, party, position, or background..."
        className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
        value={searchState.query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => onSearchChange(searchState.query)} // Trigger suggestions on focus
      />
      
      {searchState.query && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
          onClick={onClearSearch}
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      {/* Search Suggestions Dropdown */}
      {searchState.showSuggestions && (searchState.suggestions.length > 0 || searchState.recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          
          {/* Recent Searches */}
          {searchState.recentSearches.length > 0 && !searchState.query && (
            <div className="p-2">
              <div className="flex items-center justify-between px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Recent searches
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 px-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    SearchHistory.clearHistory();
                    onSearchChange('');
                  }}
                >
                  Clear
                </Button>
              </div>
              {searchState.recentSearches.slice(0, 5).map((search, index) => (
                <button
                  key={`recent-${index}`}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => handleSuggestionClick(search)}
                >
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* Search Suggestions */}
          {searchState.suggestions.length > 0 && searchState.query && (
            <div className="p-2">
              {searchState.recentSearches.length > 0 && <div className="border-t border-gray-200 dark:border-gray-600 my-2" />}
              <div className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                Suggestions
              </div>
              {searchState.suggestions.map((suggestion, index) => (
                <button
                  key={`suggestion-${index}`}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <HighlightedText text={suggestion} searchTerm={searchState.query} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ hasFilters, hasSearch, onClearFilters, onClearSearch }: { 
  hasFilters: boolean; 
  hasSearch: boolean;
  onClearFilters: () => void;
  onClearSearch: () => void;
}) {
  return (
    <div className="text-center py-16 px-6">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Search className="w-10 h-10 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {hasFilters || hasSearch ? "No politicians match your criteria" : "No politicians found"}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {hasFilters || hasSearch
            ? "Try adjusting your search terms or clearing some filters to see more results."
            : "We couldn't find any politicians in our database at the moment."
          }
        </p>
        
        <div className="flex gap-2 justify-center">
          {hasSearch && (
            <Button onClick={onClearSearch} variant="outline" className="inline-flex items-center gap-2">
              <X className="w-4 h-4" />
              Clear search
            </Button>
          )}
          {hasFilters && (
            <Button onClick={onClearFilters} variant="outline" className="inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Components (FilterSidebar, PoliticianCard, and PoliticiansGrid remain the same)
function PoliticianCard({ 
  politician, 
  isSelected, 
  onSelect, 
  searchTerm 
}: {
  politician: Politician;
  isSelected: boolean;
  onSelect: () => void;
  searchTerm: string;
}) {
  const cardClasses = `
    relative group cursor-pointer transition-all duration-200 ease-in-out
    w-[104px] h-[105px] outline-none focus:outline-none
    ${isSelected ? 'scale-105' : 'hover:scale-105 hover:shadow-lg hover:-translate-y-1'}
  `;

  const cardBgClasses = `
    p-2 h-full w-full border rounded-xl shadow-sm hover:shadow-md
    transition-all duration-200 ease-in-out backdrop-blur-sm
    ${isSelected 
      ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }
  `;

  return (
    <div
      className={cardClasses}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? (e.preventDefault(), onSelect()) : null}
      tabIndex={0}
      role="button"
      aria-label={`Select ${politician.name}`}
    >
      <Card className={cardBgClasses}>
        <div className="flex flex-col items-center text-center space-y-1.5 h-full">
          {/* Avatar */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex-shrink-0 ring-2 ring-gray-100 dark:ring-gray-600">
            {politician.image_url ? (
              <Image
                src={politician.image_url}
                alt={`${politician.name} - Profile Image`}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <span className="text-primary font-semibold text-xs">
                  {politician.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          {/* Info */}
          <div className="space-y-0.5 min-h-0 flex-1 flex flex-col justify-center">
            <h3 className="font-medium text-[10px] leading-tight line-clamp-2 text-gray-900 dark:text-gray-100">
              <HighlightedText text={politician.name} searchTerm={searchTerm} />
            </h3>
            
            {politician.party && (
              <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight line-clamp-1">
                <HighlightedText text={politician.party} searchTerm={searchTerm} />
              </p>
            )}
          </div>
          
          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-800">
              <Star className="h-2.5 w-2.5 text-white fill-current" />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function FilterSidebar({
  isCollapsed,
  onToggle,
  filter,
  onPartyChange,
  onPositionChange,
  onClearFilters,
  uniqueParties,
  uniquePositions,
  politicians,
  hasActiveFilters,
  searchState,
  onSearchChange,
  onSearchSubmit,
  onSuggestionClick,
  onClearSearch
}: {
  isCollapsed: boolean;
  onToggle: () => void;
  filter: any;
  onPartyChange: (party: string | null) => void;
  onPositionChange: (position: string | null) => void;
  onClearFilters: () => void;
  uniqueParties: string[];
  uniquePositions: string[];
  politicians: Politician[];
  hasActiveFilters: boolean;
  searchState: SearchState;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  onClearSearch: () => void;
}) {
  const [partiesExpanded, setPartiesExpanded] = useState(false);
  const [positionsExpanded, setPositionsExpanded] = useState(false);

  const getPartyCount = (party: string) => 
    politicians.filter(p => p.party === party).length;

  const getPositionCount = (position: string) => 
    politicians.filter(p => p.latest_research?.position === position).length;

  if (isCollapsed) {
    return (
      <div className="w-[60px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 gap-3 sticky top-0 h-screen">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-8 h-8 p-0"
          title="Open filters"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="w-8 h-8 p-0"
          title="Clear filters"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-[280px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 sticky top-0 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Search & Filters</span>
        </div>
        <div className="flex items-center gap-1">
          {(hasActiveFilters || searchState.query) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                onClearFilters();
                onClearSearch();
              }} 
              className="h-7 px-2 text-xs"
            >
              Clear All
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-7 w-7 p-0">
            <PanelLeftClose className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Enhanced Search */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Search</h3>
          <SearchInput
            searchState={searchState}
            onSearchChange={onSearchChange}
            onSearchSubmit={onSearchSubmit}
            onSuggestionClick={onSuggestionClick}
            onClearSearch={onClearSearch}
            politicians={politicians}
          />
        </div>
        
        {/* Parties */}
        <div>
          <button 
            onClick={() => setPartiesExpanded(!partiesExpanded)}
            className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Parties</h3>
            {partiesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {partiesExpanded && (
            <div className="mt-2 space-y-2">
              {uniqueParties.map(party => (
                <label key={party} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="party"
                      checked={filter.partyFilter === party}
                      onChange={() => onPartyChange(filter.partyFilter === party ? null : party)}
                      className="mr-3 h-4 w-4 text-primary"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{party}</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {getPartyCount(party)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Positions */}
        <div>
          <button 
            onClick={() => setPositionsExpanded(!positionsExpanded)}
            className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Positions</h3>
            {positionsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {positionsExpanded && (
            <div className="mt-2 space-y-2">
              {uniquePositions.map(position => (
                <label key={position} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="position"
                      checked={filter.positionFilter === position}
                      onChange={() => onPositionChange(filter.positionFilter === position ? null : position)}
                      className="mr-3 h-4 w-4 text-primary"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{position}</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {getPositionCount(position)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PoliticiansGrid({ 
  politicians, 
  selectedPoliticians, 
  selectionMode, 
  onPoliticianClick, 
  searchTerm,
  isSidebarCollapsed 
}: {
  politicians: Politician[];
  selectedPoliticians: number[];
  selectionMode: string;
  onPoliticianClick: (id: number) => void;
  searchTerm: string;
  isSidebarCollapsed: boolean;
}) {
  const getPoliticiansByPosition = () => {
    const grouped: Record<string, Politician[]> = {};
    
    POSITION_CATEGORIES.forEach(position => {
      grouped[position] = [];
    });
    
    politicians.forEach(politician => {
      const position = politician.latest_research?.position && POSITION_CATEGORIES.includes(politician.latest_research.position) 
        ? politician.latest_research.position
        : "Other";
      grouped[position].push(politician);
    });
    
    return Object.entries(grouped)
      .filter(([_, pols]) => pols.length > 0)
      .map(([position, pols]) => ({ position, politicians: pols }));
  };

  const positionGroups = getPoliticiansByPosition();
  const gridCols = isSidebarCollapsed 
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
    : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6';

  return (
    <div className={`grid ${gridCols}`}>
      {positionGroups.map(group => (
        <div key={group.position} className="flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-4 flex items-center justify-between">
              <span>{group.position}</span>
              <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                {group.politicians.length}
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-4 gap-4 flex-1">
            {group.politicians.map(politician => (
              <PoliticianCard
                key={politician.id}
                politician={politician}
                isSelected={selectionMode !== 'normal' && selectedPoliticians.includes(politician.id)}
                onSelect={() => onPoliticianClick(politician.id)}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Main Component
export default function PoliticiansPage() {
  const { 
    politicians, 
    isLoading, 
    selectedPoliticians,
    selectPolitician,
    unselectPolitician,
    selectionMode,
    setSelectionModeWithClear,
    filter,
    setPartyFilter,
    setPositionFilter,
    clearFilters,
    getUniqueParties,
    getUniquePositions,
  } = usePoliticians();
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    suggestions: [],
    recentSearches: [],
    isSearching: false,
    showSuggestions: false
  });

  const searchParams = useSearchParams();

  // Enhanced search logic using our SearchEngine
  const filteredPoliticians = useMemo(() => {
    let results = politicians;
    
    // Apply filter criteria first
    if (filter.partyFilter) {
      results = results.filter(p => p.party === filter.partyFilter);
    }
    
    if (filter.positionFilter) {
      results = results.filter(p => p.latest_research?.position === filter.positionFilter);
    }
    
    // Then apply search
    if (searchState.query.trim()) {
      results = SearchEngine.searchPoliticians(results, searchState.query);
    }
    
    return results;
  }, [politicians, filter.partyFilter, filter.positionFilter, searchState.query]);

  const hasActiveFilters = !!(filter.partyFilter || filter.positionFilter);
  const hasActiveSearch = !!searchState.query.trim();
  
  // Search handlers
  const handleSearchChange = (query: string) => {
    setSearchState(prev => ({
      ...prev,
      query,
      suggestions: SearchEngine.generateSuggestions(politicians, query),
      showSuggestions: true,
      recentSearches: query ? prev.recentSearches : SearchHistory.getRecentSearches()
    }));
  };

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      SearchHistory.addSearch(query.trim());
      setSearchState(prev => ({
        ...prev,
        showSuggestions: false,
        recentSearches: SearchHistory.getRecentSearches()
      }));
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchState(prev => ({
      ...prev,
      query: suggestion,
      showSuggestions: false
    }));
    SearchHistory.addSearch(suggestion);
  };

  const handleClearSearch = () => {
    setSearchState(prev => ({
      ...prev,
      query: '',
      suggestions: [],
      showSuggestions: false
    }));
  };

  // Other handlers remain the same
  const handlePoliticianSelect = (id: number) => {
    selectedPoliticians.includes(id) ? unselectPolitician(id) : selectPolitician(id);
  };

  const handlePoliticianClick = (id: number) => {
    if (selectionMode === 'normal') {
      window.location.href = `/politician/${id}`;
    } else {
      handlePoliticianSelect(id);
    }
  };

  const handleExitMode = () => {
    setSelectionModeWithClear('normal');
  };

  // Effects
  useEffect(() => {
    const initialSearch = searchParams.get("search");
    if (initialSearch) {
      setSearchState(prev => ({
        ...prev,
        query: initialSearch
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    // Load recent searches on mount
    setSearchState(prev => ({
      ...prev,
      recentSearches: SearchHistory.getRecentSearches()
    }));
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setSearchState(prev => ({ ...prev, showSuggestions: false }));
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <FilterSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          filter={filter}
          onPartyChange={setPartyFilter}
          onPositionChange={setPositionFilter}
          onClearFilters={clearFilters}
          uniqueParties={getUniqueParties()}
          uniquePositions={getUniquePositions()}
          politicians={politicians}
          hasActiveFilters={hasActiveFilters}
          searchState={searchState}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          onSuggestionClick={handleSuggestionClick}
          onClearSearch={handleClearSearch}
        />
        
        <div className="flex-1">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Politicians</h1>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {(hasActiveFilters || hasActiveSearch) && (
                    <span className="text-primary font-medium">
                      {filteredPoliticians.length} of {politicians.length} 
                    </span>
                  )}
                  {!(hasActiveFilters || hasActiveSearch) && <span>{filteredPoliticians.length}</span>}
                  {' '}
                  {filteredPoliticians.length === 1 ? 'politician' : 'politicians'} 
                  {(hasActiveFilters || hasActiveSearch) ? ' match your criteria' : ' found'}
                </div>
              </div>
              
              {selectionMode !== 'normal' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                  {selectionMode === 'compare' ? <Users className="h-4 w-4 text-primary" /> : <Heart className="h-4 w-4 text-primary" />}
                  <span className="text-sm text-primary font-medium">
                    {selectionMode === 'compare' ? 'Compare Mode' : 'Add to Picks Mode'}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleExitMode} className="ml-2 h-6 px-2 text-xs">
                    Exit
                  </Button>
                </div>
              )}
            </div>
            
            {/* Active Filters */}
            {(filter.partyFilter || filter.positionFilter || searchState.query) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {searchState.query && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: "{searchState.query}"
                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={handleClearSearch}>
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {filter.partyFilter && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Party: {filter.partyFilter}
                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => setPartyFilter(null)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {filter.positionFilter && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Position: {filter.positionFilter}
                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => setPositionFilter(null)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-6" 
                  onClick={() => {
                    clearFilters();
                    handleClearSearch();
                  }}
                >
                  Clear all
                </Button>
              </div>
            )}
            
            {/* Content */}
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 12 }).map((_, i) => <LoadingSkeleton key={i} />)}
              </div>
            ) : filteredPoliticians.length === 0 ? (
              <EmptyState 
                hasFilters={hasActiveFilters} 
                hasSearch={hasActiveSearch}
                onClearFilters={clearFilters} 
                onClearSearch={handleClearSearch}
              />
            ) : (
              <PoliticiansGrid
                politicians={filteredPoliticians}
                selectedPoliticians={selectedPoliticians}
                selectionMode={selectionMode}
                onPoliticianClick={handlePoliticianClick}
                searchTerm={searchState.query}
                isSidebarCollapsed={isSidebarCollapsed}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}