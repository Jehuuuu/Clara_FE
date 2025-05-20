"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface BookmarkContextType {
  // Bookmarked candidates
  bookmarkedCandidates: string[];
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (id: string) => void;
  clearBookmarks: () => void;
  
  // Saved comparisons
  savedComparisons: { id: string; candidateIds: [string, string] }[];
  saveComparison: (candidateIds: [string, string]) => void;
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
  const [bookmarkedCandidates, setBookmarkedCandidates] = useState<string[]>([]);
  const [savedComparisons, setSavedComparisons] = useState<
    { id: string; candidateIds: [string, string] }[]
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
        setBookmarkedCandidates(JSON.parse(storedBookmarks));
      }
      
      const storedComparisons = localStorage.getItem(STORAGE_KEYS.COMPARISONS);
      if (storedComparisons) {
        setSavedComparisons(JSON.parse(storedComparisons));
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
  const isBookmarked = (id: string) => bookmarkedCandidates.includes(id);

  const toggleBookmark = (id: string) => {
    if (isBookmarked(id)) {
      setBookmarkedCandidates(bookmarkedCandidates.filter((candidateId) => candidateId !== id));
    } else {
      setBookmarkedCandidates([...bookmarkedCandidates, id]);
    }
  };

  const clearBookmarks = () => {
    setBookmarkedCandidates([]);
  };

  // Comparison methods
  const saveComparison = (candidateIds: [string, string]) => {
    // Check if already saved
    const alreadySaved = savedComparisons.some(
      (comp) =>
        (comp.candidateIds[0] === candidateIds[0] && comp.candidateIds[1] === candidateIds[1]) ||
        (comp.candidateIds[0] === candidateIds[1] && comp.candidateIds[1] === candidateIds[0])
    );

    if (alreadySaved) return;

    const id = Math.random().toString(36).substring(2, 9);
    setSavedComparisons([...savedComparisons, { id, candidateIds }]);
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
        toggleBookmark,
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