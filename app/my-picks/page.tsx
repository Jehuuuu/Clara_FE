"use client";

import React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useCandidateData } from "@/hooks/useCandidates";
import { CandidateCard } from "@/components/candidate/CandidateCard";
import Link from "next/link";
import { Button } from "@/components/common/Button";

export default function MyPicksPage() {
  const { user } = useAuth();
  const { candidates, getBookmarkedCandidates } = useCandidateData();
  
  // Get bookmarked candidates
  const savedCandidates = getBookmarkedCandidates();

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">My Saved Candidates</h1>
        <p className="text-center text-muted-foreground mb-8">
          Manage your saved candidates to compare and track during the election
        </p>
        
        {savedCandidates.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCandidates.map(candidate => (
                <CandidateCard 
                  key={candidate.id} 
                  candidate={candidate}
                  showActions={true}
                />
              ))}
            </div>
            
            {savedCandidates.length >= 2 && (
              <div className="mt-8 flex justify-center">
                <Button asChild>
                  <Link href="/compare">Compare Selected Candidates</Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No Saved Candidates Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start saving candidates to build your personalized list for the upcoming election.
            </p>
            <Button asChild>
              <Link href="/candidates">Browse Candidates</Link>
            </Button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 