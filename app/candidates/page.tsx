"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { CandidateCard } from "@/components/candidate/CandidateCard";
import { useCandidates } from "@/context/CandidateContext";
import { useDebounce } from "@/hooks/useDebounce";

export default function CandidatesPage() {
  const searchParams = useSearchParams();
  const { 
    candidates, 
    issues, 
    isLoading, 
    filter, 
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
            {(filter.issueFilter || filter.partyFilter) && (
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                {(filter.issueFilter ? 1 : 0) + (filter.partyFilter ? 1 : 0)}
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
              {(filter.issueFilter || filter.partyFilter) && (
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
            
            {/* Issue Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Issues</h3>
              <div className="space-y-2">
                {issues.map(issue => (
                  <div 
                    key={issue.id} 
                    className="flex items-center"
                  >
                    <input
                      type="radio"
                      id={`issue-${issue.id}`}
                      name="issue"
                      checked={filter.issueFilter === issue.id}
                      onChange={() => setIssueFilter(
                        filter.issueFilter === issue.id ? null : issue.id
                      )}
                      className="mr-2"
                    />
                    <label 
                      htmlFor={`issue-${issue.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {issue.title}
                    </label>
                  </div>
                ))}
              </div>
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
            {(filter.issueFilter || filter.partyFilter) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filter.issueFilter && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Issue: {issues.find(i => i.id === filter.issueFilter)?.title}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                      onClick={() => setIssueFilter(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCandidates.map(candidate => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 