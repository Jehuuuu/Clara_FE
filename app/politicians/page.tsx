"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, X, ArrowRightLeft, Star } from "lucide-react";
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

// Compact Politician Card component for the grouped layout - matching My Picks exactly
interface CompactPoliticianCardProps {
  politician: Politician;
  isSelected: boolean;
  onSelect: () => void;
}

function CompactPoliticianCard({ politician, isSelected, onSelect }: CompactPoliticianCardProps) {
  return (
    <div
      className={`relative group cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-primary ring-offset-2' 
          : 'hover:scale-105'
      }`}
      onClick={onSelect}
    >
      <Card className="p-2 h-full">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {politician.image_url ? (
              <Image
                src={politician.image_url}
                alt={politician.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-xs font-medium">
                  {politician.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-1 min-h-0 flex-1">
            <h3 className="font-medium text-xs leading-tight line-clamp-2">
              {politician.name}
            </h3>
            
            {politician.latest_research?.position && (
              <p className="text-xs text-muted-foreground leading-tight">
                {politician.latest_research.position}
              </p>
            )}
          </div>
          
          {isSelected && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Star className="h-3 w-3 text-primary-foreground fill-current" />
            </div>
          )}
        </div>
      </Card>
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
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const filteredPoliticians = getFilteredPoliticians();
  
  // Toggle sidebar on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <Button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {(filter.partyFilter || filter.positionFilter) && (
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                {(filter.partyFilter ? 1 : 0) + (filter.positionFilter ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </div>
        
        {/* Filter Sidebar */}
        <div 
          className={`
            ${isSidebarOpen ? "block" : "hidden"} 
            md:block w-full md:w-64 transition-all
          `}
        >
          <div className="p-4 border rounded-lg sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              {(filter.partyFilter || filter.positionFilter) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="h-8 px-2"
                >
                  Clear All
                </Button>
              )}
            </div>
            
            {/* Party Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Parties</h3>
              <div className="space-y-2">
                {uniqueParties.map(party => (
                  <div 
                    key={party} 
                    className="flex items-center"
                  >
                    <input
                      type="radio"
                      id={`party-${party}`}
                      name="party"
                      checked={filter.partyFilter === party}
                      onChange={() => setPartyFilter(
                        filter.partyFilter === party ? null : party
                      )}
                      className="mr-2"
                    />
                    <label 
                      htmlFor={`party-${party}`}
                      className="text-sm cursor-pointer"
                    >
                      {party}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Position Filter */}
            <div>
              <h3 className="text-sm font-medium mb-2">Positions</h3>
              <div className="space-y-2">
                {uniquePositions.map(position => (
                  <div 
                    key={position} 
                    className="flex items-center"
                  >
                    <input
                      type="radio"
                      id={`position-${position}`}
                      name="position"
                      checked={filter.positionFilter === position}
                      onChange={() => setPositionFilter(
                        filter.positionFilter === position ? null : position
                      )}
                      className="mr-2"
                    />
                    <label 
                      htmlFor={`position-${position}`}
                      className="text-sm cursor-pointer"
                    >
                      {position}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search politicians by name or party"
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
            {localSearchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => {
                  setLocalSearchTerm("");
                  setSearchTerm("");
                }}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Results */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Politicians</h1>
              <div className="text-sm text-muted-foreground">
                {filteredPoliticians.length} {filteredPoliticians.length === 1 ? 'politician' : 'politicians'} found
              </div>
            </div>
            
            {/* Active Filters */}
            {(filter.partyFilter || filter.positionFilter) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filter.partyFilter && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Party: {filter.partyFilter}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => setPartyFilter(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {filter.positionFilter && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Position: {filter.positionFilter}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => setPositionFilter(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6"
                  onClick={clearFilters}
                >
                  Clear all
                </Button>
              </div>
            )}
            
            {/* Compare Button (if politicians selected) */}
            {selectedPoliticians.length > 0 && (
              <div className="flex items-center justify-end mb-4">
                <span className="mr-2 text-sm text-muted-foreground">
                  {selectedPoliticians.length}/2 selected
                </span>
                <Button
                  disabled={selectedPoliticians.length < 2}
                  asChild={selectedPoliticians.length === 2}
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
            
            {isLoading ? (
              <div className="text-center py-12">Loading politicians...</div>
            ) : filteredPoliticians.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">
                  No politicians found matching your criteria.
                </p>
                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="mt-2"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {positionGroups.map(group => (
                  <div key={group.position} className="mb-4">
                    <div className="mb-2">
                      <h2 className="text-base font-semibold border-b pb-1">
                        {group.position}
                        <span className="text-xs font-normal text-muted-foreground ml-2">
                          ({group.politicians.length})
                        </span>
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {group.politicians.map(politician => (
                        <CompactPoliticianCard
                          key={politician.id}
                          politician={politician}
                          isSelected={selectedPoliticians.includes(politician.id)}
                          onSelect={() => handlePoliticianSelect(politician.id)}
                        />
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