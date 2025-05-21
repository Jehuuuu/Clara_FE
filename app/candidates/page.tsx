"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, X, ArrowRightLeft, Star } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { useCandidates } from "@/context/CandidateContext";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/common/Card";
import { Candidate } from "@/lib/dummy-data";

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

// Compact Candidate Card component for the grouped layout - matching My Picks exactly
const CompactCandidateCard = ({ 
  candidate, 
  isSelected, 
  onSelect 
}: { 
  candidate: Candidate; 
  isSelected: boolean; 
  onSelect: () => void;
}) => {
  return (
    <Link href={`/candidate/${candidate.id}`}>
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
            src={candidate.image || "/placeholder-candidate.jpg"}
            alt={candidate.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="p-1 flex-grow flex flex-col text-[10px]">
          <h3 className="font-medium truncate">{candidate.name}</h3>
          <p className="text-muted-foreground truncate">{candidate.party}</p>
          
          {/* Key stance highlight */}
          {Object.entries(candidate.issues)[0] && (
            <p className="mt-auto line-clamp-1 text-muted-foreground italic">
              {Object.keys(candidate.issues)[0]}: {Object.values(candidate.issues)[0].stance}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default function CandidatesPage() {
  const searchParams = useSearchParams();
  const { 
    candidates, 
    issues, 
    isLoading, 
    filter, 
    selectedCandidates,
    selectCandidate,
    unselectCandidate,
    setSearchTerm, 
    setIssueFilter,
    setPartyFilter,
    clearFilters,
    getFilteredCandidates,
    getUniqueParties,
  } = useCandidates();
  
  // Local search state to debounce
  const [localSearchTerm, setLocalSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);
  const uniqueParties = getUniqueParties();
  
  // Apply debounced search term to filter
  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);
  
  // Apply URL search param on initial load
  useEffect(() => {
    const initialSearch = searchParams.get("search");
    if (initialSearch) {
      setLocalSearchTerm(initialSearch);
      setSearchTerm(initialSearch);
    }
  }, [searchParams, setSearchTerm]);
  
  const filteredCandidates = getFilteredCandidates();
  
  // Toggle sidebar on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Group candidates by position
  const getCandidatesByPosition = () => {
    const groupedCandidates = {} as Record<string, Candidate[]>;
    
    // Initialize categories
    POSITION_CATEGORIES.forEach(position => {
      groupedCandidates[position] = [];
    });
    
    // Group candidates
    filteredCandidates.forEach(candidate => {
      // Map position to an existing category, or use "Other"
      const position = POSITION_CATEGORIES.includes(candidate.position) 
        ? candidate.position
        : "Other";
        
      groupedCandidates[position].push(candidate);
    });
    
    // Filter out empty categories
    return Object.entries(groupedCandidates)
      .filter(([_, candidates]) => candidates.length > 0)
      .map(([position, candidates]) => ({
        position,
        candidates
      }));
  };
  
  const positionGroups = getCandidatesByPosition();

  // Handle candidate selection
  const handleCandidateSelect = (id: string) => {
    if (selectedCandidates.includes(id)) {
      unselectCandidate(id);
    } else {
      selectCandidate(id);
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
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search candidates by name or party"
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
              <h1 className="text-2xl font-bold">Candidates</h1>
              <div className="text-sm text-muted-foreground">
                {filteredCandidates.length} {filteredCandidates.length === 1 ? 'candidate' : 'candidates'} found
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
            
            {/* Compare Button (if candidates selected) */}
            {selectedCandidates.length > 0 && (
              <div className="flex items-center justify-end mb-4">
                <span className="mr-2 text-sm text-muted-foreground">
                  {selectedCandidates.length}/2 selected
                </span>
                <Button
                  disabled={selectedCandidates.length < 2}
                  asChild={selectedCandidates.length === 2}
                >
                  {selectedCandidates.length === 2 ? (
                    <Link href={`/compare?ids=${selectedCandidates.join(',')}`}>
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Compare Candidates
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
              <div className="text-center py-12">Loading candidates...</div>
            ) : filteredCandidates.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">
                  No candidates found matching your criteria.
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
                          ({group.candidates.length})
                        </span>
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {group.candidates.map(candidate => (
                        <CompactCandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          isSelected={selectedCandidates.includes(candidate.id)}
                          onSelect={() => handleCandidateSelect(candidate.id)}
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