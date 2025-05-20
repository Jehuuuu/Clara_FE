"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define a type for the Philippine government positions
export type GovernmentPosition = 
  | "President"
  | "Vice President"
  | "Senator"
  | "Representative" 
  | "Governor"
  | "Mayor" 
  | "Other";

// Define a type for a candidate bookmark with notes
export interface CandidateBookmark {
  candidateId: string;
  position: GovernmentPosition;
  notes: string;
  dateAdded: string;
}

interface BookmarkContextType {
  // Bookmarked candidates with positions and notes
  bookmarkedCandidates: CandidateBookmark[];
  isBookmarked: (id: string) => boolean;
  addBookmark: (candidateId: string, position: GovernmentPosition) => void;
  removeBookmark: (candidateId: string) => void;
  updateBookmarkNotes: (candidateId: string, notes: string) => void;
  updateBookmarkPosition: (candidateId: string, position: GovernmentPosition) => void;
  getBookmarksByPosition: (position: GovernmentPosition) => CandidateBookmark[];
  clearBookmarks: () => void;
  
  // Saved comparisons
  savedComparisons: { id: string; candidateIds: string[]; title: string; dateCreated: string }[];
  saveComparison: (candidateIds: string[], title: string) => void;
  removeComparison: (comparisonId: string) => void;
  clearComparisons: () => void;
  
  // Quiz results
  savedQuizResult: {
    date: string;
    topMatches: { candidateId: string; score: number }[];
  } | null;
  saveQuizResult: (topMatches: { candidateId: string; score: number }[]) => void;
  clearQuizResult: () => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BOOKMARKS: "clara_bookmarked_candidates",
  COMPARISONS: "clara_saved_comparisons",
  QUIZ_RESULT: "clara_quiz_result",
};

export function BookmarkProvider({ children }: { children: ReactNode }) {
  // State
  const [bookmarkedCandidates, setBookmarkedCandidates] = useState<CandidateBookmark[]>([]);
  const [savedComparisons, setSavedComparisons] = useState<
    { id: string; candidateIds: string[]; title: string; dateCreated: string }[]
  >([]);
  const [savedQuizResult, setSavedQuizResult] = useState<{
    date: string;
    topMatches: { candidateId: string; score: number }[];
  } | null>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      const storedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (storedBookmarks) {
        // Handle migrating from old format (string[]) to new format (CandidateBookmark[])
        const parsedData = JSON.parse(storedBookmarks);
        
        if (Array.isArray(parsedData)) {
          if (parsedData.length > 0 && typeof parsedData[0] === 'string') {
            // Old format: convert to new format
            const migratedBookmarks = parsedData.map((id: string) => ({
              candidateId: id,
              position: "Other" as GovernmentPosition,
              notes: "",
              dateAdded: new Date().toISOString()
            }));
            setBookmarkedCandidates(migratedBookmarks);
          } else {
            // Already in new format
            setBookmarkedCandidates(parsedData);
          }
        }
      }
      
      const storedComparisons = localStorage.getItem(STORAGE_KEYS.COMPARISONS);
      if (storedComparisons) {
        const parsedData = JSON.parse(storedComparisons);
        // Migrate old comparisons format if needed
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          if ('candidateIds' in parsedData[0] && !('title' in parsedData[0])) {
            const migratedComparisons = parsedData.map((comp: any) => ({
              ...comp,
              title: `Comparison ${comp.id}`,
              dateCreated: new Date().toISOString()
            }));
            setSavedComparisons(migratedComparisons);
          } else {
            setSavedComparisons(parsedData);
          }
        }
      }
      
      const storedQuizResult = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULT);
      if (storedQuizResult) {
        setSavedQuizResult(JSON.parse(storedQuizResult));
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(
        STORAGE_KEYS.BOOKMARKS,
        JSON.stringify(bookmarkedCandidates)
      );
    } catch (error) {
      console.error("Error saving bookmarks to localStorage:", error);
    }
  }, [bookmarkedCandidates]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(
        STORAGE_KEYS.COMPARISONS,
        JSON.stringify(savedComparisons)
      );
    } catch (error) {
      console.error("Error saving comparisons to localStorage:", error);
    }
  }, [savedComparisons]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      if (savedQuizResult) {
        localStorage.setItem(
          STORAGE_KEYS.QUIZ_RESULT,
          JSON.stringify(savedQuizResult)
        );
      } else {
        localStorage.removeItem(STORAGE_KEYS.QUIZ_RESULT);
      }
    } catch (error) {
      console.error("Error saving quiz result to localStorage:", error);
    }
  }, [savedQuizResult]);

  // Bookmark methods
  const isBookmarked = (id: string) => {
    return bookmarkedCandidates.some(bookmark => bookmark.candidateId === id);
  };

  const addBookmark = (candidateId: string, position: GovernmentPosition = "Other") => {
    if (isBookmarked(candidateId)) return;
    
    const newBookmark: CandidateBookmark = {
      candidateId,
      position,
      notes: "",
      dateAdded: new Date().toISOString()
    };
    
    setBookmarkedCandidates([...bookmarkedCandidates, newBookmark]);
  };

  const removeBookmark = (candidateId: string) => {
    setBookmarkedCandidates(
      bookmarkedCandidates.filter(bookmark => bookmark.candidateId !== candidateId)
    );
  };

  const updateBookmarkNotes = (candidateId: string, notes: string) => {
    setBookmarkedCandidates(
      bookmarkedCandidates.map(bookmark => 
        bookmark.candidateId === candidateId 
          ? { ...bookmark, notes } 
          : bookmark
      )
    );
  };

  const updateBookmarkPosition = (candidateId: string, position: GovernmentPosition) => {
    setBookmarkedCandidates(
      bookmarkedCandidates.map(bookmark => 
        bookmark.candidateId === candidateId 
          ? { ...bookmark, position } 
          : bookmark
      )
    );
  };

  // Get bookmarks by position
  const getBookmarksByPosition = (position: GovernmentPosition): CandidateBookmark[] => {
    return bookmarkedCandidates.filter(bookmark => bookmark.position === position);
  };

  const clearBookmarks = () => {
    setBookmarkedCandidates([]);
  };

  // Comparison methods
  const saveComparison = (candidateIds: string[], title: string = "Comparison") => {
    const id = Math.random().toString(36).substring(2, 9);
    const newComparison = { 
      id, 
      candidateIds, 
      title, 
      dateCreated: new Date().toISOString() 
    };
    
    setSavedComparisons([...savedComparisons, newComparison]);
  };

  const removeComparison = (comparisonId: string) => {
    setSavedComparisons(
      savedComparisons.filter((comparison) => comparison.id !== comparisonId)
    );
  };

  const clearComparisons = () => {
    setSavedComparisons([]);
  };

  // Quiz result methods
  const saveQuizResult = (topMatches: { candidateId: string; score: number }[]) => {
    setSavedQuizResult({
      date: new Date().toISOString(),
      topMatches,
    });
  };

  const clearQuizResult = () => {
    setSavedQuizResult(null);
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkedCandidates,
        isBookmarked,
        addBookmark,
        removeBookmark,
        updateBookmarkNotes,
        updateBookmarkPosition,
        getBookmarksByPosition,
        clearBookmarks,
        savedComparisons,
        saveComparison,
        removeComparison,
        clearComparisons,
        savedQuizResult,
        saveQuizResult,
        clearQuizResult,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
} 