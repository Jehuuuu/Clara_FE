"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Candidate, Issue, getCandidates, getIssues } from "@/lib/dummy-data";

interface CandidateContextType {
  // Data
  candidates: Candidate[];
  issues: Issue[];
  isLoading: boolean;
  error: string | null;
  
  // Selected candidates (for comparison)
  selectedCandidates: string[];
  selectCandidate: (id: string) => void;
  unselectCandidate: (id: string) => void;
  clearSelectedCandidates: () => void;
  
  // Filtering
  filter: {
    searchTerm: string;
    issueFilter: string | null;
    partyFilter: string | null;
  };
  setSearchTerm: (term: string) => void;
  setIssueFilter: (issueId: string | null) => void;
  setPartyFilter: (party: string | null) => void;
  clearFilters: () => void;
  
  // Getters
  getFilteredCandidates: () => Candidate[];
  getUniqueParties: () => string[];
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

export function CandidateProvider({ children }: { children: ReactNode }) {
  // State
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [filter, setFilter] = useState({
    searchTerm: "",
    issueFilter: null as string | null,
    partyFilter: null as string | null,
  });

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [candidatesData, issuesData] = await Promise.all([
          getCandidates(),
          getIssues(),
        ]);

        setCandidates(candidatesData);
        setIssues(issuesData);
      } catch (error) {
        setError("Failed to fetch candidate data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Candidate selection methods
  const selectCandidate = (id: string) => {
    if (selectedCandidates.includes(id)) return;
    
    // Limit to max 2 candidates for comparison
    if (selectedCandidates.length >= 2) {
      setSelectedCandidates([selectedCandidates[1], id]);
    } else {
      setSelectedCandidates([...selectedCandidates, id]);
    }
  };

  const unselectCandidate = (id: string) => {
    setSelectedCandidates(selectedCandidates.filter(candidateId => candidateId !== id));
  };

  const clearSelectedCandidates = () => {
    setSelectedCandidates([]);
  };

  // Filter methods
  const setSearchTerm = (term: string) => {
    setFilter(prev => ({ ...prev, searchTerm: term }));
  };

  const setIssueFilter = (issueId: string | null) => {
    setFilter(prev => ({ ...prev, issueFilter: issueId }));
  };

  const setPartyFilter = (party: string | null) => {
    setFilter(prev => ({ ...prev, partyFilter: party }));
  };

  const clearFilters = () => {
    setFilter({
      searchTerm: "",
      issueFilter: null,
      partyFilter: null,
    });
  };

  // Filtered candidates
  const getFilteredCandidates = () => {
    return candidates.filter(candidate => {
      // Apply search term filter
      if (
        filter.searchTerm &&
        !candidate.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) &&
        !candidate.party.toLowerCase().includes(filter.searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Apply party filter
      if (filter.partyFilter && candidate.party !== filter.partyFilter) {
        return false;
      }

      // Apply issue filter (all candidates have all issues in our demo)
      return true;
    });
  };

  // Get unique parties
  const getUniqueParties = () => {
    const parties = candidates.map(candidate => candidate.party);
    return [...new Set(parties)];
  };

  return (
    <CandidateContext.Provider
      value={{
        candidates,
        issues,
        isLoading,
        error,
        selectedCandidates,
        selectCandidate,
        unselectCandidate,
        clearSelectedCandidates,
        filter,
        setSearchTerm,
        setIssueFilter,
        setPartyFilter,
        clearFilters,
        getFilteredCandidates,
        getUniqueParties,
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
}

export function useCandidates() {
  const context = useContext(CandidateContext);
  if (context === undefined) {
    throw new Error("useCandidates must be used within a CandidateProvider");
  }
  return context;
} 