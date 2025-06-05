"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { PoliticianCard } from "@/components/politician/PoliticianCard";
import { usePoliticians } from "@/context/PoliticianContext";
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

export default function MyPicksPage() {
  const { user } = useAuth();
  const { politicians, selectedPoliticians, toggleSelection } = usePoliticians();
  
  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [partyFilter, setPartyFilter] = useState<string>("all");
  
  // Get unique parties for the filter dropdown
  const getUniqueParties = () => {
    const parties = politicians
      .map(politician => politician.latest_research?.politician_party)
      .filter(party => party !== null && party !== undefined);
    return ["all", ...Array.from(new Set(parties))];
  };

  const uniqueParties = getUniqueParties();
  
  // Filter politicians based on search and filters
  const filteredPoliticians = politicians.filter(politician => {
    const matchesSearch = politician.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = positionFilter === "all" || 
      politician.latest_research?.position === positionFilter;
    const matchesParty = partyFilter === "all" || 
      politician.latest_research?.politician_party === partyFilter;
    
    return matchesSearch && matchesPosition && matchesParty;
  });

  // Get selected politicians
  const mySelectedPoliticians = politicians.filter(politician => 
    selectedPoliticians.includes(politician.id)
  );

  // Helper function for data implementation
  const getBookmarksByPosition = (position: string) => {
    return mySelectedPoliticians.filter(politician => 
      politician.latest_research?.position === position
    );
  };

  return (
    <ProtectedRoute>
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        <div className="container mx-auto py-8 px-4 pb-16 min-h-full max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Politician Picks</h1>
            <p className="text-muted-foreground">
              Manage your saved politicians and create comparisons
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/politicians">
                Find More Politicians
              </Link>
            </Button>
            
            {mySelectedPoliticians.length >= 2 && (
              <Button asChild>
                <Link href={`/compare?ids=${selectedPoliticians.slice(0, 3).join(',')}`}>
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Compare Selected ({Math.min(selectedPoliticians.length, 3)})
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search politicians..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {POSITION_CATEGORIES.map((category) => (
                <SelectItem key={category.position} value={category.position}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={partyFilter} onValueChange={setPartyFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by party" />
            </SelectTrigger>
            <SelectContent>
              {uniqueParties.map((party) => (
                <SelectItem key={party} value={party}>
                  {party === "all" ? "All Parties" : party}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Politicians Section */}
        {mySelectedPoliticians.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                My Selected Politicians ({mySelectedPoliticians.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
              {mySelectedPoliticians.map((politician) => (
                <PoliticianCard
                  key={politician.id}
                  politician={politician}
                  isSelected={true}
                  onSelect={() => toggleSelection(politician.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Politicians Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              All Researched Politicians ({filteredPoliticians.length})
            </h2>
          </div>
          
          {filteredPoliticians.length === 0 ? (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">No Politicians Found</h3>
              <p className="text-muted-foreground mb-4">
                {politicians.length === 0 
                  ? "You haven't researched any politicians yet."
                  : "No politicians match your current filters."
                }
              </p>
              {politicians.length === 0 && (
                <Button asChild>
                  <Link href="/ask">
                    Start Researching Politicians
                  </Link>
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPoliticians.map((politician) => (
                <PoliticianCard
                  key={politician.id}
                  politician={politician}
                  isSelected={selectedPoliticians.includes(politician.id)}
                  onSelect={() => toggleSelection(politician.id)}
                />
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 
