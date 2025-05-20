import React from "react";
import { SuggestionCard } from "@/components/chat/SuggestionCard";
import { Candidate } from "@/lib/dummy-data";

interface SuggestionListProps {
  title: string;
  candidates: Candidate[];
  matchedIssue?: string;
  className?: string;
}

export function SuggestionList({ title, candidates, matchedIssue, className = "" }: SuggestionListProps) {
  if (candidates.length === 0) return null;
  
  return (
    <div className={`mt-4 ${className}`}>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="space-y-2">
        {candidates.map((candidate, index) => (
          <SuggestionCard 
            key={candidate.id}
            candidate={candidate}
            matchedIssue={matchedIssue}
            relevanceScore={100 - (index * 10)} // Simple scoring mechanism for demo
          />
        ))}
      </div>
    </div>
  );
} 