import { useBookmarks as useBookmarksContext } from "@/context/BookmarkContext";
import { usePoliticians } from "@/context/PoliticianContext";

// Define politician interface for this hook
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
}

/**
 * Enhanced hook for working with bookmarks while accessing full politician data
 */
export function useBookmarkData() {
  const bookmarkContext = useBookmarksContext();
  const politicianContext = usePoliticians();
  
  /**
   * Get full politician objects for all selected politicians
   */
  const getSelectedPoliticiansData = (): Politician[] => {
    return politicianContext.politicians.filter(politician => 
      politicianContext.selectedPoliticians.includes(politician.id)
    );
  };
  
  /**
   * Get full politician objects for a saved comparison
   */
  const getComparisonPoliticiansData = (comparisonId: string): [Politician | undefined, Politician | undefined] | null => {
    const comparison = bookmarkContext.savedComparisons.find(comp => comp.id === comparisonId);
    if (!comparison) return null;
    
    const politicianA = politicianContext.politicians.find(p => p.id.toString() === comparison.candidateIds[0]);
    const politicianB = politicianContext.politicians.find(p => p.id.toString() === comparison.candidateIds[1]);
    
    return [politicianA, politicianB];
  };
  
  /**
   * Get all saved comparisons with full politician data
   */
  const getSavedComparisonsWithData = (): Array<{
    id: string;
    politicians: [Politician | undefined, Politician | undefined];
  }> => {
    return bookmarkContext.savedComparisons.map(comparison => ({
      id: comparison.id,
      politicians: [
        politicianContext.politicians.find(p => p.id.toString() === comparison.candidateIds[0]),
        politicianContext.politicians.find(p => p.id.toString() === comparison.candidateIds[1])
      ] as [Politician | undefined, Politician | undefined]
    }));
  };
  
  /**
   * Get quiz result with full politician data
   */
  const getQuizResultWithPoliticianData = () => {
    if (!bookmarkContext.savedQuizResult) return null;
    
    return {
      date: bookmarkContext.savedQuizResult.date,
      topMatches: bookmarkContext.savedQuizResult.topMatches.map(match => ({
        ...match,
        politician: politicianContext.politicians.find(p => p.id.toString() === match.candidateId)
      }))
    };
  };
  
  return {
    ...bookmarkContext,
    getSelectedPoliticiansData,
    getComparisonPoliticiansData,
    getSavedComparisonsWithData,
    getQuizResultWithPoliticianData
  };
} 