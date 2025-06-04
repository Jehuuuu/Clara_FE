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
import { Politician } from "@/lib/types";

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

// Compact Politician Card component for the grouped layout - matching My Picks exactly
const CompactPoliticianCard = ({ 
  politician, 
  isSelected, 
  onSelect 
}: { 
  politician: Politician; 
  isSelected: boolean; 
  onSelect: () => void;
}) => {
  return (
    <Link href={`/politician/${politician.id}`}>
      <Card className={`rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''} w-full aspect-[2/3] relative flex flex-col`}>
        <div 
          className="absolute top-1 right-1 z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect();
          }}
        >
          <Star 
            className={`h-3 w-3 cursor-pointer ${isSelected ? 'fill-primary text-primary' : 'text-black'}`}
          />
        </div>
        
        <div className="relative w-full h-16 overflow-hidden">
          <Image
            src={politician.image || politician.image_url || "/placeholder-politician.jpg"}
            alt={politician.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="p-1 flex-grow flex flex-col text-[10px]">
          <h3 className="font-medium truncate">{politician.name}</h3>
          <p className="text-muted-foreground truncate">{politician.party || 'No party'}</p>
          
          {/* Show position if available */}
          {politician.position && (
            <p className="mt-auto line-clamp-1 text-muted-foreground italic">
              {politician.position}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
};

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
    clearFilters,
    getFilteredPoliticians,
    getUniqueParties,
  } = usePoliticians();
  
  // Local search state to debounce
  const [localSearchTerm, setLocalSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);
  const uniqueParties = getUniqueParties();
  
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
      const position = politician.position && POSITION_CATEGORIES.includes(politician.position) 
        ? politician.position
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
  const handlePoliticianSelect = (id: string) => {
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
            {filter.partyFilter && (
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                1
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
              {filter.partyFilter && (
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
            <div>
              <h3 className="text-sm font-medium mb-2">Parties</h3>
              <div className="space-y-2">
                {uniqueParties.map((party: string) => (
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
            {filter.partyFilter && (
              <div className="flex flex-wrap gap-2 mb-4">
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
                          isSelected={selectedPoliticians.includes(politician.id.toString())}
                          onSelect={() => handlePoliticianSelect(politician.id.toString())}
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