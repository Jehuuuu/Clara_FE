"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Share2 } from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/common/Card";
import { Candidate } from "@/lib/dummy-data";
import { cn, truncate } from "@/lib/utils";
import { useBookmarks } from "@/context/BookmarkContext";

interface CandidateCardProps {
  candidate: Candidate;
  showActions?: boolean;
  className?: string;
  onSelect?: () => void;
  isSelected?: boolean;
}

export function CandidateCard({
  candidate,
  showActions = true,
  className,
  onSelect,
  isSelected = false,
}: CandidateCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(candidate.id);

  // Get the first 3 issues to highlight
  const topIssues = Object.entries(candidate.issues).slice(0, 3);
  
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(candidate.id);
  };
  
  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Copy link to clipboard
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(
        `${window.location.origin}/candidate/${candidate.id}`
      );
      
      // Could use toast notification here
      alert("Link copied to clipboard!");
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary",
        className
      )}
    >
      <Link href={`/candidate/${candidate.id}`}>
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-muted">
          <Image
            src={candidate.image || "/placeholder-candidate.jpg"}
            alt={candidate.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute bottom-4 left-4">
            <Badge variant="secondary" className="mb-2">
              {candidate.party}
            </Badge>
            <CardTitle className="text-white drop-shadow-sm">
              {candidate.name}
            </CardTitle>
            <p className="text-sm text-white/90">{candidate.position}</p>
          </div>
        </div>
        
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-4">
            {truncate(candidate.bio, 120)}
          </p>
          
          <h4 className="text-sm font-medium mb-2">Key Positions:</h4>
          <div className="flex flex-wrap gap-2">
            {topIssues.map(([issue, { stance }]) => (
              <Badge key={issue} variant="outline" className="text-xs">
                {issue}: {truncate(stance, 25)}
              </Badge>
            ))}
          </div>
        </CardContent>
        
        {showActions && (
          <CardFooter className="p-4 pt-0 justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSelect}
              className={cn(isSelected && "bg-primary/10")}
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleBookmarkClick}
                aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    bookmarked ? "fill-red-500 text-red-500" : "text-muted-foreground"
                  )}
                />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleShareClick}
                aria-label="Share candidate"
              >
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Link>
    </Card>
  );
} 