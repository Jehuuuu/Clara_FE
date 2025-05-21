"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { candidates } from "@/lib/dummy-data";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ChevronDown, ChevronUp, ArrowLeft, Plus } from "lucide-react";

// Define the candidate structure based on actual data
interface CandidateIssue {
  stance: string;
  explanation: string;
  summary: string;
  keyProposals: string[];
}

interface EnhancedCandidate {
  id: string;
  name: string;
  party: string;
  color: string;
  issues: Record<string, CandidateIssue>;
}

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<string>("economy");
  const [isLoading, setIsLoading] = useState(false);

  // Treat candidates as EnhancedCandidate type
  const typedCandidates = candidates as unknown as EnhancedCandidate[];

  // Process URL parameters on load
  useEffect(() => {
    const ids = searchParams.get('ids');
    if (ids) {
      const idArray = ids.split(',');
      setSelectedCandidates(idArray.filter(id => 
        typedCandidates.some(candidate => candidate.id === id)
      ).slice(0, 3));
    }
  }, [searchParams, typedCandidates]);

  const issues = [
    { id: "economy", label: "Economy" },
    { id: "healthcare", label: "Healthcare" },
    { id: "environment", label: "Environment" },
    { id: "education", label: "Education" },
    { id: "immigration", label: "Immigration" },
  ];

  const handleCandidateToggle = (candidateId: string) => {
    setSelectedCandidates(prev => {
      const newSelection = prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : prev.length >= 3 ? prev : [...prev, candidateId];
      
      // Update URL with the new selection
      router.push(`/compare?ids=${newSelection.join(',')}`);
      return newSelection;
    });
  };

  const handleCompare = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/candidates" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to all candidates
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Compare Candidates</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Select Candidates</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Choose up to 3 candidates to compare their positions
            </p>
            
            <div className="space-y-2 mb-6">
              {typedCandidates.map(candidate => (
                <div 
                  key={candidate.id}
                  className={`
                    flex items-center p-2 rounded-md cursor-pointer transition-colors
                    ${selectedCandidates.includes(candidate.id) 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'hover:bg-accent'
                    }
                  `}
                  onClick={() => handleCandidateToggle(candidate.id)}
                >
                  <div 
                    className="w-6 h-6 rounded-full mr-3 flex-shrink-0"
                    style={{ backgroundColor: candidate.color }}
                  />
                  <div className="flex-grow">
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-xs text-muted-foreground">{candidate.party}</p>
                  </div>
                  {selectedCandidates.includes(candidate.id) && (
                    <div className="text-primary text-sm font-medium">Selected</div>
                  )}
                </div>
              ))}
            </div>
            
            {selectedCandidates.length > 0 && (
              <div className="mb-6">
                <Button 
                  variant="outline" 
                  className="w-full mb-2" 
                  asChild
                >
                  <Link href="/my-picks">
                    View My Saved Candidates
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  asChild
                >
                  <Link href="/candidates">
                    <Plus className="h-4 w-4 mr-1" />
                    Find More Candidates
                  </Link>
                </Button>
              </div>
            )}
            
            <h2 className="text-xl font-semibold mb-4">Select Issue</h2>
            <div className="space-y-2 mb-6">
              {issues.map(issue => (
                <div 
                  key={issue.id}
                  className={`
                    flex items-center p-2 rounded-md cursor-pointer transition-colors
                    ${selectedIssue === issue.id 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'hover:bg-accent'
                    }
                  `}
                  onClick={() => setSelectedIssue(issue.id)}
                >
                  <div className="font-medium">{issue.label}</div>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full" 
              disabled={selectedCandidates.length < 2 || isLoading}
              onClick={handleCompare}
            >
              {isLoading ? "Loading..." : "Compare Candidates"}
            </Button>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          {selectedCandidates.length > 0 ? (
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-6">Comparison Results</h2>
              
              {selectedCandidates.length < 2 ? (
                <p className="text-muted-foreground">Select at least 2 candidates to compare</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1"></div>
                      {selectedCandidates.map(id => {
                        const candidate = typedCandidates.find(c => c.id === id);
                        return (
                          <div key={id} className="text-center">
                            <div 
                              className="w-12 h-12 rounded-full mx-auto mb-2"
                              style={{ backgroundColor: candidate?.color }}
                            />
                            <p className="font-medium">{candidate?.name}</p>
                            <p className="text-xs text-muted-foreground">{candidate?.party}</p>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium mb-4 capitalize">{selectedIssue}</h3>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium">Position</div>
                        {selectedCandidates.map(id => {
                          const candidate = typedCandidates.find(c => c.id === id);
                          // Use optional chaining and type assertion
                          const position = candidate?.issues[selectedIssue] as CandidateIssue | undefined;
                          
                          return (
                            <div key={id} className="text-sm">
                              {position ? position.summary : 'No position stated'}
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="font-medium">Key Proposals</div>
                        {selectedCandidates.map(id => {
                          const candidate = typedCandidates.find(c => c.id === id);
                          // Use optional chaining and type assertion
                          const position = candidate?.issues[selectedIssue] as CandidateIssue | undefined;
                          
                          return (
                            <div key={id} className="text-sm">
                              {position?.keyProposals && position.keyProposals.length > 0 ? (
                                <ul className="list-disc list-inside">
                                  {position.keyProposals.map((proposal, idx) => (
                                    <li key={idx} className="mb-1">{proposal}</li>
                                  ))}
                                </ul>
                              ) : (
                                'No key proposals available'
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-lg">
                Select candidates to compare their positions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 