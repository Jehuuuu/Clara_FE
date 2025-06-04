"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the Politician interface based on the API response
interface Politician {
  id: number;
  name: string;
  image_url: string | null;
  created_at: string;
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
  party: string | null;
}

interface Issue {
  id: string;
  title: string;
  description: string;
}

interface PoliticianContextType {
  // Data
  politicians: Politician[];
  issues: Issue[];
  isLoading: boolean;
  error: string | null;
  
  // Selected politicians (for comparison)
  selectedPoliticians: number[];
  selectPolitician: (id: number) => void;
  unselectPolitician: (id: number) => void;
  toggleSelection: (id: number) => void;
  clearSelectedPoliticians: () => void;
  
  // Filtering
  filter: {
    searchTerm: string;
    issueFilter: string | null;
    partyFilter: string | null;
    positionFilter: string | null;
  };
  setSearchTerm: (term: string) => void;
  setIssueFilter: (issueId: string | null) => void;
  setPartyFilter: (party: string | null) => void;
  setPositionFilter: (position: string | null) => void;
  clearFilters: () => void;
  
  // Getters
  getFilteredPoliticians: () => Politician[];
  getUniqueParties: () => string[];
  getUniquePositions: () => string[];
}

const PoliticianContext = createContext<PoliticianContextType | undefined>(undefined);

export function PoliticianProvider({ children }: { children: ReactNode }) {
  // State
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPoliticians, setSelectedPoliticians] = useState<number[]>([]);
  const [filter, setFilter] = useState({
    searchTerm: "",
    issueFilter: null as string | null,
    partyFilter: null as string | null,
    positionFilter: null as string | null,
  });

  // Fetch politicians from API
  useEffect(() => {
    async function fetchPoliticians() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch("http://127.0.0.1:8000/api/politicians/");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setPoliticians(data.results);
        } else {
          throw new Error(data.error || "Failed to fetch politicians");
        }
      } catch (error) {
        console.error("Error fetching politicians:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch politician data");
        setPoliticians([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPoliticians();
  }, []);

  // Politician selection methods
  const selectPolitician = (id: number) => {
    if (selectedPoliticians.includes(id)) return;
    
    // Limit to max 2 politicians for comparison
    if (selectedPoliticians.length >= 2) {
      setSelectedPoliticians([selectedPoliticians[1], id]);
    } else {
      setSelectedPoliticians([...selectedPoliticians, id]);
    }
  };

  const unselectPolitician = (id: number) => {
    setSelectedPoliticians(selectedPoliticians.filter(politicianId => politicianId !== id));
  };

  const toggleSelection = (id: number) => {
    if (selectedPoliticians.includes(id)) {
      unselectPolitician(id);
    } else {
      selectPolitician(id);
    }
  };

  const clearSelectedPoliticians = () => {
    setSelectedPoliticians([]);
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

  const setPositionFilter = (position: string | null) => {
    setFilter(prev => ({ ...prev, positionFilter: position }));
  };

  const clearFilters = () => {
    setFilter({
      searchTerm: "",
      issueFilter: null,
      partyFilter: null,
      positionFilter: null,
    });
  };

  // Filtered politicians
  const getFilteredPoliticians = () => {
    return politicians.filter(politician => {
      // Apply search term filter
      if (
        filter.searchTerm &&
        !politician.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) &&
        !(politician.party || "").toLowerCase().includes(filter.searchTerm.toLowerCase()) &&
        !(politician.latest_research?.position || "").toLowerCase().includes(filter.searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Apply party filter - use the correct party field from main politician object
      if (filter.partyFilter && politician.party !== filter.partyFilter) {
        return false;
      }

      // Apply position filter
      if (filter.positionFilter && politician.latest_research?.position !== filter.positionFilter) {
        return false;
      }

      return true;
    });
  };

  // Get unique parties - use the correct party field from main politician object
  const getUniqueParties = () => {
    const parties = politicians
      .map(politician => politician.party)
      .filter(party => party && party.trim() !== "");
    return Array.from(new Set(parties)) as string[];
  };

  // Get unique positions
  const getUniquePositions = () => {
    const positions = politicians
      .map(politician => politician.latest_research?.position)
      .filter(position => position && position.trim() !== "");
    return Array.from(new Set(positions)) as string[];
  };

  return (
    <PoliticianContext.Provider
      value={{
        politicians,
        issues,
        isLoading,
        error,
        selectedPoliticians,
        selectPolitician,
        unselectPolitician,
        toggleSelection,
        clearSelectedPoliticians,
        filter,
        setSearchTerm,
        setIssueFilter,
        setPartyFilter,
        setPositionFilter,
        clearFilters,
        getFilteredPoliticians,
        getUniqueParties,
        getUniquePositions,
      }}
    >
      {children}
    </PoliticianContext.Provider>
  );
}

export function usePoliticians() {
  const context = useContext(PoliticianContext);
  if (context === undefined) {
    throw new Error("usePoliticians must be used within a PoliticianProvider");
  }
  return context;
} 