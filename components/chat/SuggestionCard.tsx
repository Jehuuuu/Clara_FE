import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Candidate } from "@/lib/dummy-data";
import { truncate } from "@/lib/utils";

interface SuggestionCardProps {
  candidate: Candidate;
  matchedIssue?: string;
  relevanceScore?: number; // 0-100
}

export function SuggestionCard({ candidate, matchedIssue, relevanceScore }: SuggestionCardProps) {
  // Get the relevant issue if provided
  const issueDetails = matchedIssue && candidate.issues[matchedIssue];
  
  return (
    <Link href={`/candidate/${candidate.id}`}>
      <Card className="cursor-pointer mb-2 overflow-hidden transition-all hover:shadow-md border-l-4 border-l-primary">
        <div className="flex">
          <div className="relative h-24 w-24 flex-shrink-0">
            <Image
              src={candidate.image || "/placeholder-candidate.jpg"}
              alt={candidate.name}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="py-3 px-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{candidate.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {candidate.party}
                </Badge>
              </div>
              {relevanceScore && (
                <Badge variant="secondary" className="text-xs">
                  {relevanceScore}% match
                </Badge>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground mb-2">{candidate.position}</p>
            
            {issueDetails ? (
              <div className="mt-1">
                <Badge variant="default" className="text-xs mb-1">
                  {matchedIssue}
                </Badge>
                <p className="text-xs">
                  <span className="font-medium">Position:</span> {truncate(issueDetails.stance, 80)}
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {truncate(candidate.bio, 100)}
              </p>
            )}
          </CardContent>
        </div>
      </Card>
    </Link>
  );
} 