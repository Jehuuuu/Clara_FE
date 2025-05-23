"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useCandidateData } from "@/hooks/useCandidates";
import { CandidateCard } from "@/components/candidate/CandidateCard";
import Link from "next/link";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { 
  Search, 
  Filter,
  ArrowRightLeft,
  Star 
} from "lucide-react";
import { Input } from "@/components/common/Input";
import { GovernmentPosition, CandidateBookmark } from "@/context/BookmarkContext";
import { Candidate } from "@/lib/dummy-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/Select";
import Image from "next/image";
import { Badge } from "@/components/common/Badge";

// Custom extended government position type that includes all needed positions
type ExtendedPosition = GovernmentPosition | "Party-list Representative" | "District Representative" | "Vice Governor" | "Vice Mayor" | "Councilor";

// Define the categories to display based on Philippine electoral system
const POSITION_CATEGORIES = [
  // National Level
  { position: "President", label: "President" },
  { position: "Vice President", label: "Vice President" },
  { position: "Senator", label: "Senator" },
  
  // House of Representatives
  { position: "Party-list Representative", label: "Party-list Representative" },
  { position: "District Representative", label: "District Representative" },
  
  // Provincial Level
  { position: "Governor", label: "Governor" },
  { position: "Vice Governor", label: "Vice Governor" },
  
  // City/Municipal Level
  { position: "Mayor", label: "Mayor" },
  { position: "Vice Mayor", label: "Vice Mayor" },
  { position: "Councilor", label: "Councilor" },
  
  // Other
  { position: "Other", label: "Other Positions" }
];

// Compact Candidate Card component for the My Picks page
const CompactCandidateCard = ({ 
  candidate, 
  isSelected, 
  onSelect 
}: { 
  candidate: Candidate & { notes?: string }; 
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
          {candidate.notes && (
            <p className="mt-auto line-clamp-1 text-muted-foreground italic">
              {candidate.notes}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default function MyPicksPage() {
  const { user } = useAuth();
  
  // Replace dummy data with empty arrays 
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [bookmarkedCandidates, setBookmarkedCandidates] = useState<CandidateBookmark[]>([]);
  
  // State for selected candidates (limit to 2)
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  
  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [partyFilter, setPartyFilter] = useState<string>("all");
  
  // Get unique parties for the filter dropdown
  const getUniqueParties = () => {
    const parties = candidates.map(candidate => candidate.party);
    return ["all", ...Array.from(new Set(parties))];
  };
  
  const uniqueParties = getUniqueParties();
  
  // Function to get candidate by ID
  const getCandidateById = (id: string): Candidate | undefined => {
    return candidates.find(c => c.id === id);
  };
  
  // Function to toggle candidate selection (limit to 2)
  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidates(prev => {
      // If already selected, remove it
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      }
      
      // If not selected and less than 2 selections, add it
      if (prev.length < 2) {
        return [...prev, candidateId];
      }
      
      // If already have 2 selections, replace the first one
      return [prev[1], candidateId];
    });
  };
  
  // Helper function for data implementation
  const getBookmarksByPosition = (position: any): CandidateBookmark[] => {
    return bookmarkedCandidates.filter(bookmark => bookmark.position === position);
  };
  
  // Group and filter bookmarked candidates by position
  const getFilteredBookmarksByCategory = () => {
    return POSITION_CATEGORIES
      .map(category => {
        let positionBookmarks = getBookmarksByPosition(category.position as any);
        
        // Apply position filter if needed
        if (positionFilter !== "all" && positionFilter !== category.position) {
          positionBookmarks = [];
        }
        
        // Get full candidate data
        let candidatesInCategory = positionBookmarks
          .map(bookmark => {
            const candidate = getCandidateById(bookmark.candidateId);
            return candidate 
              ? { ...candidate, notes: bookmark.notes, dateAdded: bookmark.dateAdded } 
              : undefined;
          })
          .filter(Boolean) as (Candidate & { notes: string, dateAdded: string })[];
        
        // Apply party filter if needed
        if (partyFilter !== "all") {
          candidatesInCategory = candidatesInCategory.filter(
            candidate => candidate.party === partyFilter
          );
        }
        
        // Apply search filter if needed
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          candidatesInCategory = candidatesInCategory.filter(
            c => c.name.toLowerCase().includes(query) || 
                 c.party.toLowerCase().includes(query) ||
                 (c.notes && c.notes.toLowerCase().includes(query))
          );
        }
        
        return {
          ...category,
          candidates: candidatesInCategory
        };
      })
      .filter(category => category.candidates.length > 0); // Only show categories with candidates
  };
  
  const bookmarksByCategory = getFilteredBookmarksByCategory();
  
  // Split categories into pairs for two-column layout
  const categoryPairs = [];
  for (let i = 0; i < bookmarksByCategory.length; i += 2) {
    if (i + 1 < bookmarksByCategory.length) {
      categoryPairs.push([bookmarksByCategory[i], bookmarksByCategory[i+1]]);
    } else {
      categoryPairs.push([bookmarksByCategory[i]]);
    }
  }
  
  // Check if there are any bookmarks
  const hasBookmarks = bookmarkedCandidates.length > 0;
  
  // Helper function to check if a candidate is selected
  const isSelected = (candidateId: string) => {
    return selectedCandidates.includes(candidateId);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setPositionFilter("all");
    setPartyFilter("all");
  };

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">My Saved Candidates</h1>
          <p className="text-muted-foreground mb-8">
            View and compare your saved candidates
          </p>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-wrap gap-4 items-center mb-8">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {/* Position Filter */}
            <div className="w-full md:w-auto">
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {POSITION_CATEGORIES.map(cat => (
                    <SelectItem key={cat.position} value={cat.position}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Party Filter */}
            <div className="w-full md:w-auto">
              <Select value={partyFilter} onValueChange={setPartyFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by party" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Parties</SelectItem>
                  {uniqueParties.filter(party => party !== "all").map(party => (
                    <SelectItem key={party} value={party}>
                      {party}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Clear Filters Button */}
            {(searchQuery || positionFilter !== "all" || partyFilter !== "all") && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearFilters}
                className="h-10"
              >
                Clear Filters
              </Button>
            )}
            
            {/* Compare Button */}
            {selectedCandidates.length > 0 && (
              <div className="ml-auto flex items-center">
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
          </div>
          
          {hasBookmarks ? (
            <div className="space-y-6">
              {/* Two-column grid layout for position categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookmarksByCategory.map(category => (
                  <div key={category.position} className="mb-4">
                    <div className="mb-2">
                      <h2 className="text-base font-semibold border-b pb-1">
                        {category.label}
                        <span className="text-xs font-normal text-muted-foreground ml-2">
                          ({category.candidates.length})
                        </span>
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {category.candidates.map(candidate => (
                        <CompactCandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          isSelected={isSelected(candidate.id)}
                          onSelect={() => toggleCandidateSelection(candidate.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No Saved Candidates Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start saving candidates to build your personalized list for the upcoming election.
              </p>
              <Button asChild>
                <Link href="/candidates">Browse Candidates</Link>
              </Button>
            </div>
          )}
          
          {/* Show message if search/filter returns no results */}
          {hasBookmarks && bookmarksByCategory.length === 0 && (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No Matching Candidates</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <Button asChild>
                <Link href="/candidates">Browse Candidates</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 