"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from './AuthContext';

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

  // Selection mode
  selectionMode: 'compare' | 'add-to-picks' | 'normal';
  setSelectionMode: (mode: 'compare' | 'add-to-picks' | 'normal') => void;
  setSelectionModeWithClear: (mode: 'compare' | 'add-to-picks' | 'normal') => void;

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
  const [selectionMode, setSelectionMode] = useState<'compare' | 'add-to-picks' | 'normal'>('normal');
  const [filter, setFilter] = useState({
    searchTerm: "",
    issueFilter: null as string | null,
    partyFilter: null as string | null,
    positionFilter: null as string | null,
  });
  const { user } = useAuth();

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

  // Fetch user's selected politicians from API
  useEffect(() => {
    const fetchUserPicks = async () => {
      if (!user?.refreshToken) return;

      try {
        console.log("Fetching user picks...");
        const response = await fetch('http://127.0.0.1:8000/api/auth/politicians/picks/', {
          headers: {
            'Authorization': `Bearer ${user.refreshToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("User picks response:", data);

          // Handle different possible response formats
          let pickedIds: number[] = [];

          if (data.politicians && Array.isArray(data.politicians)) {
            // Format: { politicians: [{ id: number, name: string }] }
            pickedIds = data.politicians.map((politician: { id: number }) => politician.id).filter(Boolean);
          } else if (Array.isArray(data)) {
            // If the API returns an array of objects with id property
            pickedIds = data.map((pick: any) => pick.id || (typeof pick === 'number' ? pick : null))
              .filter((id: any) => id !== null);
          } else if (data.results && Array.isArray(data.results)) {
            // If the API returns a wrapper object with results array
            pickedIds = data.results.map((pick: any) => pick.id || (typeof pick === 'number' ? pick : null))
              .filter((id: any) => id !== null);
          }

          console.log("Processed picked IDs:", pickedIds);
          setSelectedPoliticians(pickedIds);
        } else {
          console.error("Failed to fetch picks:", await response.text());
        }
      } catch (error) {
        console.error('Error fetching politician picks:', error);
      }
    };

    fetchUserPicks();
  }, [user?.refreshToken]);

  // Politician selection methods
  const selectPolitician = (id: number) => {
    if (selectedPoliticians.includes(id)) return;

    // Apply selection limits based on mode
    if (selectionMode === 'compare') {
      // Limit to max 2 politicians for comparison
      if (selectedPoliticians.length >= 2) {
        setSelectedPoliticians([selectedPoliticians[1], id]);
      } else {
        setSelectedPoliticians([...selectedPoliticians, id]);
      }
    } else if (selectionMode === 'add-to-picks') {
      // No limit for add-to-picks mode
      setSelectedPoliticians([...selectedPoliticians, id]);
    } else {
      // Normal mode - shouldn't be selecting politicians
      setSelectedPoliticians([id]);
    }
  };

  const unselectPolitician = (id: number) => {
    setSelectedPoliticians(selectedPoliticians.filter(politicianId => politicianId !== id));
  };

  const toggleSelection = async (politicianId: number) => {
    if (!user?.refreshToken) return;

    const isCurrentlySelected = selectedPoliticians.includes(politicianId);
    const endpoint = isCurrentlySelected 
      ? `/api/auth/politicians/remove/${politicianId}/`
      : `/api/auth/politicians/add/${politicianId}/`;

    try {
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.refreshToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update local state after successful API call
        setSelectedPoliticians(prev => 
          isCurrentlySelected
            ? prev.filter(id => id !== politicianId)
            : [...prev, politicianId]
        );
      }
    } catch (error) {
      console.error('Error updating politician pick:', error);
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

  // Clear selections and set mode atomically to avoid timing issues
  const setSelectionModeWithClear = (mode: 'compare' | 'add-to-picks' | 'normal') => {
    setSelectedPoliticians([]);
    setSelectionMode(mode);
  };

  return (
    <PoliticianContext.Provider
      value={{
        politicians,
        issues,
        isLoading,
        error,
        selectionMode,
        setSelectionMode,
        setSelectionModeWithClear,
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
