import { useBookmarks as useBookmarksContext } from "@/context/BookmarkContext";
import { useCandidates } from "@/context/CandidateContext";
import { Candidate } from "@/lib/dummy-data";

/**
 * Enhanced hook for working with bookmarks while accessing full candidate data
 */
export function useBookmarkData() {
  const bookmarkContext = useBookmarksContext();
  const candidateContext = useCandidates();
  
  /**
   * Get full candidate objects for all bookmarked candidates
   */
  const getBookmarkedCandidatesData = (): Candidate[] => {
    return candidateContext.candidates.filter(candidate => 
      bookmarkContext.bookmarkedCandidates.includes(candidate.id)
    );
  };
  
  /**
   * Get full candidate objects for a saved comparison
   */
  const getComparisonCandidatesData = (comparisonId: string): [Candidate | undefined, Candidate | undefined] | null => {
    const comparison = bookmarkContext.savedComparisons.find(comp => comp.id === comparisonId);
    if (!comparison) return null;
    
    const candidateA = candidateContext.candidates.find(c => c.id === comparison.candidateIds[0]);
    const candidateB = candidateContext.candidates.find(c => c.id === comparison.candidateIds[1]);
    
    return [candidateA, candidateB];
  };
  
  /**
   * Get all saved comparisons with full candidate data
   */
  const getSavedComparisonsWithData = (): Array<{
    id: string;
    candidates: [Candidate | undefined, Candidate | undefined];
  }> => {
    return bookmarkContext.savedComparisons.map(comparison => ({
      id: comparison.id,
      candidates: [
        candidateContext.candidates.find(c => c.id === comparison.candidateIds[0]),
        candidateContext.candidates.find(c => c.id === comparison.candidateIds[1])
      ] as [Candidate | undefined, Candidate | undefined]
    }));
  };
  
  /**
   * Get quiz result with full candidate data
   */
  const getQuizResultWithCandidateData = () => {
    if (!bookmarkContext.savedQuizResult) return null;
    
    return {
      date: bookmarkContext.savedQuizResult.date,
      topMatches: bookmarkContext.savedQuizResult.topMatches.map(match => ({
        ...match,
        candidate: candidateContext.candidates.find(c => c.id === match.candidateId)
      }))
    };
  };
  
  return {
    ...bookmarkContext,
    getBookmarkedCandidatesData,
    getComparisonCandidatesData,
    getSavedComparisonsWithData,
    getQuizResultWithCandidateData
  };
} 