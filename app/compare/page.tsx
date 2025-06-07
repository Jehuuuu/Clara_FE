"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ChevronDown, ChevronUp, ArrowLeft, Plus } from "lucide-react";
import { usePoliticians } from "@/context/PoliticianContext";

// Define the politician structure for comparison
interface PoliticianIssue {
  stance: string;
  explanation: string;
  summary: string;
  keyProposals: string[];
}

function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { politicians } = usePoliticians();
  const [selectedPoliticians, setSelectedPoliticians] = useState<number[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<string>("economy");
  const [isLoading, setIsLoading] = useState(false);

  // Process URL parameters on load
  useEffect(() => {
    const ids = searchParams.get('ids');
    if (ids) {
      const idArray = ids.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      setSelectedPoliticians(idArray.filter(id => 
        politicians.some(politician => politician.id === id)
      ).slice(0, 3));
    }
  }, [searchParams, politicians]);

  const issues = [
    { id: "economy", label: "Economy" },
    { id: "healthcare", label: "Healthcare" },
    { id: "environment", label: "Environment" },
    { id: "education", label: "Education" },
    { id: "immigration", label: "Immigration" },
  ];

  const handlePoliticianToggle = (politicianId: number) => {
    setSelectedPoliticians(prev => {
      const newSelection = prev.includes(politicianId)
        ? prev.filter(id => id !== politicianId)
        : prev.length >= 3 ? prev : [...prev, politicianId];
      
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

  if (politicians.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/politicians" className="flex items-center text-blue-600 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to all politicians
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Compare Politicians</h1>
        
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Politicians Available</h2>
          <p className="text-muted-foreground mb-6">
            You need to research politicians first before you can compare them.
          </p>
          <Button asChild>
            <Link href="/ask">
              <Plus className="h-4 w-4 mr-2" />
              Start Researching Politicians
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/politicians" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to all politicians
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Compare Politicians</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Select Politicians</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Choose up to 3 politicians to compare their positions
            </p>
            
            <div className="space-y-2 mb-6">
              {politicians.map(politician => (
                <div 
                  key={politician.id}
                  className={`
                    flex items-center p-2 rounded-md cursor-pointer transition-colors
                    ${selectedPoliticians.includes(politician.id) 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'hover:bg-accent'
                    }
                  `}
                  onClick={() => handlePoliticianToggle(politician.id)}
                >
                  <div 
                    className="w-6 h-6 rounded-full mr-3 flex-shrink-0 bg-primary/20"
                  />
                  <div className="flex-grow">
                    <p className="font-medium">{politician.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {politician.latest_research?.politician_party || "Independent"}
                    </p>
                  </div>
                  {selectedPoliticians.includes(politician.id) && (
                    <div className="text-primary text-sm font-medium">Selected</div>
                  )}
                </div>
              ))}
            </div>
            
            {selectedPoliticians.length > 0 && (
              <div className="mb-6">
                <Button 
                  variant="outline" 
                  className="w-full mb-2" 
                  asChild
                >
                  <Link href="/my-picks">
                    View My Saved Politicians
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  asChild
                >
                  <Link href="/politicians">
                    <Plus className="h-4 w-4 mr-1" />
                    Find More Politicians
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
              disabled={selectedPoliticians.length < 2 || isLoading}
              onClick={handleCompare}
            >
              {isLoading ? "Loading..." : "Compare Politicians"}
            </Button>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          {selectedPoliticians.length > 0 ? (
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-6">Comparison Results</h2>
              
              {selectedPoliticians.length < 2 ? (
                <p className="text-muted-foreground">Select at least 2 politicians to compare</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1"></div>
                      {selectedPoliticians.map(id => {
                        const politician = politicians.find(p => p.id === id);
                        return (
                          <div key={id} className="text-center">
                            <div className="w-12 h-12 rounded-full mx-auto mb-2 bg-primary/20" />
                            <p className="font-medium">{politician?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {politician?.latest_research?.politician_party || "Independent"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Position on {issues.find(i => i.id === selectedIssue)?.label}</h3>
                      
                      {selectedPoliticians.map(id => {
                        const politician = politicians.find(p => p.id === id);
                        return (
                          <div key={id} className="border rounded-lg p-4">
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 mr-3" />
                              <div>
                                <p className="font-medium">{politician?.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {politician?.latest_research?.politician_party || "Independent"}
                                </p>
                              </div>
                            </div>
                            
                            <div className="ml-11">
                              <p className="text-sm text-muted-foreground">
                                {politician?.latest_research?.summary || 
                                 "Detailed position data not available. Research more about this politician to get their stance on specific issues."}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Select Politicians to Compare</h2>
              <p className="text-muted-foreground mb-6">
                Choose politicians from the list on the left to see detailed comparisons of their positions.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ComparePageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComparePage />
    </Suspense>
  );
}
