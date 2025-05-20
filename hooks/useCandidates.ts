"use client";

import { useContext } from "react";
import { useCandidates as useCandidatesContext } from "@/context/CandidateContext";
import { useBookmarks } from "@/context/BookmarkContext";
import { Candidate } from "@/lib/dummy-data";

/**
 * Custom hook that combines candidate data with bookmark functionality
 */
export function useCandidateData() {
  const candidateContext = useCandidatesContext();
  const bookmarkContext = useBookmarks();
  
  /**
   * Get both bookmarked status and candidate data in one call
   */
  const getCandidateWithBookmarkStatus = (id: string): { candidate: Candidate | undefined; isBookmarked: boolean } => {
    const candidate = candidateContext.candidates.find(c => c.id === id);
    const isBookmarked = bookmarkContext.isBookmarked(id);
    return { candidate, isBookmarked };
  };
  
  /**
   * Get all bookmarked candidates
   */
  const getBookmarkedCandidates = (): Candidate[] => {
    return candidateContext.candidates.filter(candidate => 
      bookmarkContext.bookmarkedCandidates.includes(candidate.id)
    );
  };
  
  /**
   * Get candidates selected for comparison
   */
  const getComparisonCandidates = (): Candidate[] => {
    return candidateContext.candidates.filter(candidate => 
      candidateContext.selectedCandidates.includes(candidate.id)
    );
  };
  
  return {
    ...candidateContext,
    ...bookmarkContext,
    getCandidateWithBookmarkStatus,
    getBookmarkedCandidates,
    getComparisonCandidates,
  };
}

// Define candidate type
export interface Candidate {
  id: string;
  name: string;
  party: string;
  position: string;
  bio: string;
  imageUrl: string;
  policyPositions: {
    [key: string]: {
      stance: string;
      description: string;
    };
  };
  websiteUrl: string;
  socialMedia: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

export function useCandidates() {
  const { candidates: contextCandidates } = useCandidatesContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    // Use the candidates from context as our source of truth
    if (contextCandidates && contextCandidates.length > 0) {
      setCandidates(contextCandidates);
      setLoading(false);
    } else {
      setError("No candidates found");
      setLoading(false);
    }
  }, [contextCandidates]);

  // Function to get a candidate by ID
  const getCandidateById = (id: string): Candidate | undefined => {
    return candidates.find(candidate => candidate.id === id);
  };

  // Function to filter candidates by party
  const getCandidatesByParty = (party: string): Candidate[] => {
    return candidates.filter(candidate => candidate.party === party);
  };

  // Function to search candidates by name
  const searchCandidates = (query: string): Candidate[] => {
    const lowercaseQuery = query.toLowerCase();
    return candidates.filter(candidate => 
      candidate.name.toLowerCase().includes(lowercaseQuery) ||
      candidate.position.toLowerCase().includes(lowercaseQuery) ||
      candidate.party.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    candidates,
    loading,
    error,
    getCandidateById,
    getCandidatesByParty,
    searchCandidates
  };
} 