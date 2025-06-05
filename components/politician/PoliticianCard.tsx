"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Star, MapPin, Calendar, ExternalLink } from "lucide-react";

// Define the Politician interface based on the API response
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

interface PoliticianCardProps {
  politician: Politician;
  isSelected?: boolean;
  onSelect?: () => void;
  variant?: "default" | "compact";
}

export function PoliticianCard({ 
  politician, 
  isSelected = false, 
  onSelect,
  variant = "default" 
}: PoliticianCardProps) {
  
  if (variant === "compact") {
    return (
      <Link href={`/politician/${politician.id}`}>
        <Card className={`rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''} w-full aspect-[2/3] relative flex flex-col`}>
          <div 
            className="absolute top-1 right-1 z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect && onSelect();
            }}
          >
            <Star 
              className={`h-3 w-3 cursor-pointer ${isSelected ? 'fill-primary text-primary' : 'text-black'}`}
            />
          </div>
          
          <div className="relative w-full h-16 overflow-hidden">
            <Image
              src={politician.image_url || politician.latest_research?.politician_image || "/placeholder-politician.jpg"}
              alt={politician.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="p-1 flex-grow flex flex-col text-[10px]">
            <h3 className="font-medium truncate">{politician.name}</h3>
            <p className="text-muted-foreground truncate">{politician.latest_research?.politician_party || "No Party"}</p>
            
            {/* Position highlight */}
            {politician.latest_research?.position && (
              <p className="mt-auto line-clamp-1 text-muted-foreground italic">
                {politician.latest_research.position}
              </p>
            )}
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-primary' : ''} h-[450px] flex flex-col`}>
      {/* Header with image and basic info */}
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex-shrink-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={politician.image_url || politician.latest_research?.politician_image || "/placeholder-politician.jpg"}
            alt={politician.name}
            width={120}
            height={120}
            className="rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>
        
        {/* Selection button */}
        {onSelect && (
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                onSelect();
              }}
            >
              <Star 
                className={`h-4 w-4 ${isSelected ? 'fill-primary text-primary' : 'text-gray-600'}`}
              />
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Name and Party */}
        <div className="text-center mb-4 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{politician.name}</h3>
          {politician.latest_research?.politician_party && (
            <Badge variant="secondary" className="mb-2">
              {politician.latest_research.politician_party}
            </Badge>
          )}
          {politician.latest_research?.position && (
            <div className="flex items-center justify-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {politician.latest_research.position}
            </div>
          )}
        </div>

        {/* Flexible content area */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Summary */}
            {politician.latest_research?.summary && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {politician.latest_research.summary}
                </p>
              </div>
            )}

            {/* Research date */}
            {politician.latest_research?.created_at && (
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <Calendar className="h-3 w-3 mr-1" />
                Research from {new Date(politician.latest_research.created_at).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Actions - always at bottom */}
          <div className="flex gap-2 mt-auto">
            <Button asChild className="flex-1">
              <Link href={`/politician/${politician.id}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default PoliticianCard; 
