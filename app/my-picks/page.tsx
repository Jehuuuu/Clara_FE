"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useCandidateData } from "@/hooks/useCandidates";
import { CandidateCard } from "@/components/candidate/CandidateCard";
import Link from "next/link";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { 
  Search, 
  Filter,
  ArrowRightLeft,
  Star 
} from "lucide-react";
import { Input } from "@/components/common/Input";
import { GovernmentPosition, CandidateBookmark } from "@/context/BookmarkContext";
import { Candidate } from "@/lib/dummy-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/Select";
import Image from "next/image";
import { Badge } from "@/components/common/Badge";

// Custom extended government position type that includes all needed positions
type ExtendedPosition = GovernmentPosition | "Party-list Representative" | "District Representative" | "Vice Governor" | "Vice Mayor" | "Councilor";

// Define the categories to display based on Philippine electoral system
const POSITION_CATEGORIES = [
  // National Level
  { position: "President", label: "President" },
  { position: "Vice President", label: "Vice President" },
  { position: "Senator", label: "Senator" },
  
  // House of Representatives
  { position: "Party-list Representative", label: "Party-list Representative" },
  { position: "District Representative", label: "District Representative" },
  
  // Provincial Level
  { position: "Governor", label: "Governor" },
  { position: "Vice Governor", label: "Vice Governor" },
  
  // City/Municipal Level
  { position: "Mayor", label: "Mayor" },
  { position: "Vice Mayor", label: "Vice Mayor" },
  { position: "Councilor", label: "Councilor" },
  
  // Other
  { position: "Other", label: "Other Positions" }
];

// DUMMY CANDIDATE DATA - Using Philippine electoral positions
const DUMMY_CANDIDATES: Candidate[] = [
  {
    id: "pres-1",
    name: "Maria Santos",
    party: "Progressive Party",
    position: "President",
    image: "/placeholder-candidate.jpg",
    bio: "Former Governor with 20 years of public service experience. Focused on economic growth, healthcare reform, and education.",
    issues: {
      "Economy": { 
        stance: "Supports progressive taxation and increased minimum wage", 
        explanation: "Plans to implement wealth tax on ultra-high net worth individuals and corporations."
      },
      "Healthcare": { 
        stance: "Advocates for universal healthcare system", 
        explanation: "Will push for expanded PhilHealth coverage and reduced medicine costs." 
      },
      "Education": { 
        stance: "Free college tuition at state universities", 
        explanation: "Prioritizes education funding and teacher salary increases." 
      },
      "Environment": { 
        stance: "Supports renewable energy transition", 
        explanation: "Plans for carbon neutrality by 2045 and investment in green technology." 
      }
    },
    education: ["J.D. University of the Philippines", "M.P.A. Harvard Kennedy School"],
    experience: ["Governor (2015-2023)", "State Senator (2007-2015)", "Mayor (2000-2007)"],
    endorsements: ["Teachers Union", "Healthcare Workers Association", "Environmental Coalition"],
    website: "https://example.com/mariasantos"
  },
  {
    id: "pres-2",
    name: "Antonio Reyes",
    party: "Nationalist Party",
    position: "President",
    image: "/placeholder-candidate.jpg",
    bio: "Business leader and former Senator with expertise in economic policy and foreign relations. Advocates for strong national security and economic liberalization.",
    issues: {
      "Economy": { 
        stance: "Supports free market policies and reduced regulation", 
        explanation: "Plans to cut corporate taxes and reduce bureaucratic red tape." 
      },
      "Foreign Policy": { 
        stance: "Prioritizes strengthening international alliances", 
        explanation: "Will assert sovereignty in territorial disputes while maintaining diplomatic relations." 
      },
      "Crime": { 
        stance: "Tough on crime approach with police investment", 
        explanation: "Plans to increase police funding and modernize law enforcement." 
      },
      "Infrastructure": { 
        stance: "Massive infrastructure development program", 
        explanation: "Will allocate 7% of GDP to infrastructure development over 6 years." 
      }
    },
    education: ["MBA Stanford University", "B.S. Economics Ateneo de Manila"],
    experience: ["Senator (2010-2022)", "CEO of Reyes Holdings (2000-2010)", "Trade Secretary (1998-2000)"],
    endorsements: ["Business Leaders Association", "National Security Coalition", "Economic Development Forum"],
    website: "https://example.com/antonioreyes"
  },
  {
    id: "vp-1",
    name: "Elena Cruz",
    party: "Progressive Party",
    position: "Vice President",
    image: "/placeholder-candidate.jpg",
    bio: "Human rights attorney and social justice advocate with experience in constitutional law. Champion of marginalized communities.",
    issues: {
      "Justice Reform": { 
        stance: "Supports comprehensive judicial system overhaul", 
        explanation: "Plans to address court backlogs and ensure equal access to justice." 
      },
      "Human Rights": { 
        stance: "Advocates for strengthening human rights protections", 
        explanation: "Will establish independent human rights monitoring mechanisms." 
      },
      "Indigenous Peoples": { 
        stance: "Champion of indigenous rights and autonomy", 
        explanation: "Supports full implementation of Indigenous Peoples Rights Act." 
      },
      "Government Transparency": { 
        stance: "Promotes freedom of information and anti-corruption", 
        explanation: "Plans to strengthen whistleblower protections and create ethics commission." 
      }
    },
    education: ["LL.M. Yale University", "J.D. University of the Philippines"],
    experience: ["Constitutional Commissioner (2018-2023)", "Human Rights Commissioner (2012-2018)", "Private Law Practice (2005-2012)"],
    endorsements: ["Human Rights Coalition", "Indigenous Peoples Alliance", "Legal Reform Network"],
    website: "https://example.com/elenacruz"
  },
  {
    id: "sen-1",
    name: "Rafael Aquino",
    party: "Labor Alliance",
    position: "Senator",
    image: "/placeholder-candidate.jpg",
    bio: "Former labor union leader and advocate for workers' rights. Expert in labor law and employment policy with grassroots organizing background.",
    issues: {
      "Labor Rights": { 
        stance: "Advocates for strengthened collective bargaining", 
        explanation: "Plans to end contractualization and improve worker protections." 
      },
      "Healthcare": { 
        stance: "Supports universal healthcare coverage", 
        explanation: "Will expand PhilHealth coverage and reduce out-of-pocket costs." 
      },
      "Wages": { 
        stance: "Fights for living wage implementation nationwide", 
        explanation: "Plans to gradually increase minimum wage to match living costs." 
      },
      "Social Security": { 
        stance: "Champions expanded pension and social security", 
        explanation: "Will reform SSS to ensure long-term stability and increased benefits." 
      }
    },
    education: ["M.A. Labor Studies, University of the Philippines", "J.D. Ateneo Law School"],
    experience: ["Labor Secretary (2016-2022)", "Union President (2008-2016)", "Labor Lawyer (2000-2008)"],
    endorsements: ["National Workers Alliance", "Public Sector Union", "Healthcare Workers Coalition"],
    website: "https://example.com/rafaelaquino"
  },
  {
    id: "sen-2",
    name: "Olivia Mendoza",
    party: "Education First",
    position: "Senator",
    image: "/placeholder-candidate.jpg",
    bio: "Education reformer and former university president with expertise in curriculum development and educational policy.",
    issues: {
      "Education Reform": { 
        stance: "Advocates for curriculum modernization", 
        explanation: "Plans to revise K-12 curriculum to focus on critical thinking and practical skills." 
      },
      "Teacher Support": { 
        stance: "Champions increased teacher salaries and training", 
        explanation: "Will increase teacher salary by 30% and provide continuous professional development." 
      },
      "Educational Access": { 
        stance: "Supports expanded scholarship programs", 
        explanation: "Plans to increase tertiary education access through needs-based scholarships." 
      },
      "Digital Learning": { 
        stance: "Promotes technology integration in education", 
        explanation: "Will ensure all schools have internet access and technology resources." 
      }
    },
    education: ["Ph.D. Education Policy, Stanford University", "M.A. Educational Leadership, UP Diliman"],
    experience: ["University President (2015-2023)", "Education Secretary (2010-2015)", "School Administrator (2005-2010)"],
    endorsements: ["National Teachers Association", "Educational Reform Coalition", "Student Leaders Alliance"],
    website: "https://example.com/oliviamendoza"
  },
  {
    id: "gov-1",
    name: "Carlos Villanueva",
    party: "Local Development",
    position: "Governor",
    image: "/placeholder-candidate.jpg",
    bio: "Urban planner and local government expert with experience in sustainable development and infrastructure projects.",
    issues: {
      "Infrastructure": { 
        stance: "Prioritizes sustainable infrastructure development", 
        explanation: "Plans to improve road networks, water systems, and public facilities." 
      },
      "Disaster Preparedness": { 
        stance: "Champions comprehensive disaster risk reduction", 
        explanation: "Will implement early warning systems and resilient infrastructure." 
      },
      "Local Economy": { 
        stance: "Supports SME development and agricultural modernization", 
        explanation: "Plans to establish SME support centers and agricultural technology hubs." 
      },
      "Tourism": { 
        stance: "Advocates for eco-tourism development", 
        explanation: "Will develop sustainable tourism sites while protecting natural resources." 
      }
    },
    education: ["M.S. Urban Planning, University of Tokyo", "B.S. Civil Engineering, UP Diliman"],
    experience: ["Provincial Board Member (2016-2023)", "City Planner (2010-2016)", "Civil Engineer (2004-2010)"],
    endorsements: ["Local Developers Association", "Engineers Guild", "Tourism Industry Alliance"],
    website: "https://example.com/carlosvillanueva"
  },
  {
    id: "mayor-1",
    name: "Isabela Torres",
    party: "Community First",
    position: "Mayor",
    image: "/placeholder-candidate.jpg",
    bio: "Community organizer and public health advocate with experience in local governance and urban poor issues.",
    issues: {
      "Public Health": { 
        stance: "Prioritizes preventive healthcare and access", 
        explanation: "Plans to expand community health centers and preventive care programs." 
      },
      "Housing": { 
        stance: "Supports affordable housing development", 
        explanation: "Will implement in-city relocation and housing subsidy programs." 
      },
      "Public Safety": { 
        stance: "Advocates for community-based policing", 
        explanation: "Plans to establish neighborhood watch programs and police-community partnerships." 
      },
      "Environment": { 
        stance: "Champions urban greening and waste management", 
        explanation: "Will implement comprehensive waste management and urban reforestation." 
      }
    },
    education: ["M.P.H. University of the Philippines", "B.S. Community Development, UP Diliman"],
    experience: ["City Councilor (2016-2023)", "NGO Director (2010-2016)", "Community Health Worker (2005-2010)"],
    endorsements: ["Urban Poor Alliance", "Healthcare Professionals Association", "Environmental Network"],
    website: "https://example.com/isabelatorres"
  },
  {
    id: "rep-1",
    name: "Marco Diaz",
    party: "Progressive Party",
    position: "District Representative",
    image: "/placeholder-candidate.jpg",
    bio: "Experienced legislator with background in community development and legal advocacy.",
    issues: {
      "Local Development": { 
        stance: "Advocates for equitable district funding", 
        explanation: "Plans to ensure fair allocation of resources for district infrastructure and services."
      },
      "Education": { 
        stance: "Supports increased education funding", 
        explanation: "Will fight for more school buildings and scholarships in the district."
      },
      "Healthcare": { 
        stance: "Proposes district health centers", 
        explanation: "Plans to establish more accessible healthcare facilities within the district."
      },
      "Employment": { 
        stance: "Job creation through local industries", 
        explanation: "Will support local businesses and attract investments to create more jobs."
      }
    },
    education: ["J.D. Ateneo Law School", "B.A. Political Science, University of the Philippines"],
    experience: ["City Councilor (2016-2022)", "Community Organizer (2010-2016)", "Legal Aid Lawyer (2005-2010)"],
    endorsements: ["District Teachers Association", "Local Business Federation", "Community Leaders Council"],
    website: "https://example.com/marcodiaz"
  },
  {
    id: "partylist-1",
    name: "Youth Empowerment Party",
    party: "Youth Empowerment Party",
    position: "Party-list Representative",
    image: "/placeholder-candidate.jpg",
    bio: "Advocacy group focused on youth representation, education reform, and employment opportunities for young Filipinos.",
    issues: {
      "Youth Representation": { 
        stance: "Advocates for youth participation in governance", 
        explanation: "Will establish youth councils and promote young leadership in government."
      },
      "Education": { 
        stance: "Supports education modernization", 
        explanation: "Plans to integrate digital literacy and career preparation in school curricula."
      },
      "Employment": { 
        stance: "Promotes youth entrepreneurship", 
        explanation: "Will establish startup grants and mentorship programs for young entrepreneurs."
      },
      "Mental Health": { 
        stance: "Champions youth mental health services", 
        explanation: "Plans to increase mental health support in schools and communities."
      }
    },
    education: ["Various youth leaders with degrees in Policy, Education, and Social Work"],
    experience: ["Youth advocacy (2010-present)", "Community organizing", "Legislative consultancy"],
    endorsements: ["National Student Council Federation", "Youth Leaders Network", "Educational Reform Coalition"],
    website: "https://example.com/youthempowerment"
  }
];

// DUMMY BOOKMARKED CANDIDATES DATA - Added for preview purposes
const DUMMY_BOOKMARKS = [
  {
    candidateId: "pres-1",
    position: "President",
    notes: "Strong economic policies and good track record on education reform.",
    dateAdded: new Date().toISOString()
  },
  {
    candidateId: "pres-2",
    position: "President",
    notes: "I like their foreign policy stance and commitment to climate action.",
    dateAdded: new Date(Date.now() - 86400000).toISOString() // Yesterday
  },
  {
    candidateId: "vp-1",
    position: "Vice President",
    notes: "Experienced public servant with good legislative background.",
    dateAdded: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  },
  {
    candidateId: "sen-1",
    position: "Senator",
    notes: "Strong advocate for healthcare reform which I support.",
    dateAdded: new Date(Date.now() - 259200000).toISOString() // 3 days ago
  },
  {
    candidateId: "sen-2",
    position: "Senator",
    notes: "Focused on education policies and teacher support.",
    dateAdded: new Date(Date.now() - 345600000).toISOString() // 4 days ago
  },
  {
    candidateId: "gov-1",
    position: "Governor",
    notes: "Has good plans for local infrastructure and development.",
    dateAdded: new Date(Date.now() - 432000000).toISOString() // 5 days ago
  },
  {
    candidateId: "mayor-1",
    position: "Mayor",
    notes: "Strong on local issues and community engagement.",
    dateAdded: new Date(Date.now() - 518400000).toISOString() // 6 days ago
  },
  {
    candidateId: "rep-1",
    position: "District Representative",
    notes: "Good focus on local development and community needs.",
    dateAdded: new Date(Date.now() - 604800000).toISOString() // 7 days ago
  },
  {
    candidateId: "partylist-1",
    position: "Party-list Representative",
    notes: "Strong advocacy for youth issues and education reform.",
    dateAdded: new Date(Date.now() - 691200000).toISOString() // 8 days ago
  }
];

// Compact Candidate Card component for the My Picks page
const CompactCandidateCard = ({ 
  candidate, 
  isSelected, 
  onSelect 
}: { 
  candidate: Candidate & { notes?: string }; 
  isSelected: boolean; 
  onSelect: () => void;
}) => {
  return (
    <Link href={`/candidate/${candidate.id}`}>
      <Card className={`rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''} w-full aspect-[2/3] relative flex flex-col`}>
        <div 
          className="absolute top-1 right-1 z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect();
          }}
        >
          <Star 
            className={`h-3 w-3 cursor-pointer ${isSelected ? 'fill-primary text-primary' : 'text-black'}`}
          />
        </div>
        
        <div className="relative w-full h-16 overflow-hidden">
          <Image
            src={candidate.image || "/placeholder-candidate.jpg"}
            alt={candidate.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="p-1 flex-grow flex flex-col text-[10px]">
          <h3 className="font-medium truncate">{candidate.name}</h3>
          <p className="text-muted-foreground truncate">{candidate.party}</p>
          {candidate.notes && (
            <p className="mt-auto line-clamp-1 text-muted-foreground italic">
              {candidate.notes}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default function MyPicksPage() {
  const { user } = useAuth();
  
  // Use local dummy data instead of fetching from hooks or context
  const [dummyCandidates] = useState<Candidate[]>(DUMMY_CANDIDATES);
  const [bookmarkedCandidates] = useState<CandidateBookmark[]>(DUMMY_BOOKMARKS as any);
  
  // State for selected candidates (limit to 2)
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  
  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [partyFilter, setPartyFilter] = useState<string>("all");
  
  // Get unique parties for the filter dropdown
  const getUniqueParties = () => {
    const parties = dummyCandidates.map(candidate => candidate.party);
    return ["all", ...Array.from(new Set(parties))];
  };
  
  const uniqueParties = getUniqueParties();
  
  // Function to get candidate by ID
  const getCandidateById = (id: string): Candidate | undefined => {
    return dummyCandidates.find(c => c.id === id);
  };
  
  // Function to toggle candidate selection (limit to 2)
  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidates(prev => {
      // If already selected, remove it
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      }
      
      // If not selected and less than 2 selections, add it
      if (prev.length < 2) {
        return [...prev, candidateId];
      }
      
      // If already have 2 selections, replace the first one
      return [prev[1], candidateId];
    });
  };
  
  // Helper function for dummy data implementation
  const getBookmarksByPosition = (position: any): CandidateBookmark[] => {
    return bookmarkedCandidates.filter(bookmark => bookmark.position === position);
  };
  
  // Group and filter bookmarked candidates by position
  const getFilteredBookmarksByCategory = () => {
    return POSITION_CATEGORIES
      .map(category => {
        let positionBookmarks = getBookmarksByPosition(category.position as any);
        
        // Apply position filter if needed
        if (positionFilter !== "all" && positionFilter !== category.position) {
          positionBookmarks = [];
        }
        
        // Get full candidate data
        let candidatesInCategory = positionBookmarks
          .map(bookmark => {
            const candidate = getCandidateById(bookmark.candidateId);
            return candidate 
              ? { ...candidate, notes: bookmark.notes, dateAdded: bookmark.dateAdded } 
              : undefined;
          })
          .filter(Boolean) as (Candidate & { notes: string, dateAdded: string })[];
        
        // Apply party filter if needed
        if (partyFilter !== "all") {
          candidatesInCategory = candidatesInCategory.filter(
            candidate => candidate.party === partyFilter
          );
        }
        
        // Apply search filter if needed
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          candidatesInCategory = candidatesInCategory.filter(
            c => c.name.toLowerCase().includes(query) || 
                 c.party.toLowerCase().includes(query) ||
                 (c.notes && c.notes.toLowerCase().includes(query))
          );
        }
        
        return {
          ...category,
          candidates: candidatesInCategory
        };
      })
      .filter(category => category.candidates.length > 0); // Only show categories with candidates
  };
  
  const bookmarksByCategory = getFilteredBookmarksByCategory();
  
  // Split categories into pairs for two-column layout
  const categoryPairs = [];
  for (let i = 0; i < bookmarksByCategory.length; i += 2) {
    if (i + 1 < bookmarksByCategory.length) {
      categoryPairs.push([bookmarksByCategory[i], bookmarksByCategory[i+1]]);
    } else {
      categoryPairs.push([bookmarksByCategory[i]]);
    }
  }
  
  // Check if there are any bookmarks
  const hasBookmarks = bookmarkedCandidates.length > 0;
  
  // Helper function to check if a candidate is selected
  const isSelected = (candidateId: string) => {
    return selectedCandidates.includes(candidateId);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setPositionFilter("all");
    setPartyFilter("all");
  };

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">My Saved Candidates</h1>
          <p className="text-muted-foreground mb-8">
            View and compare your saved candidates
          </p>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-wrap gap-4 items-center mb-8">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {/* Position Filter */}
            <div className="w-full md:w-auto">
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {POSITION_CATEGORIES.map(cat => (
                    <SelectItem key={cat.position} value={cat.position}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Party Filter */}
            <div className="w-full md:w-auto">
              <Select value={partyFilter} onValueChange={setPartyFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by party" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Parties</SelectItem>
                  {uniqueParties.filter(party => party !== "all").map(party => (
                    <SelectItem key={party} value={party}>
                      {party}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Clear Filters Button */}
            {(searchQuery || positionFilter !== "all" || partyFilter !== "all") && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearFilters}
                className="h-10"
              >
                Clear Filters
              </Button>
            )}
            
            {/* Compare Button */}
            {selectedCandidates.length > 0 && (
              <div className="ml-auto flex items-center">
                <span className="mr-2 text-sm text-muted-foreground">
                  {selectedCandidates.length}/2 selected
                </span>
                <Button
                  disabled={selectedCandidates.length < 2}
                  asChild={selectedCandidates.length === 2}
                >
                  {selectedCandidates.length === 2 ? (
                    <Link href={`/compare?ids=${selectedCandidates.join(',')}`}>
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Compare Candidates
                    </Link>
                  ) : (
                    <>
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Select 2 to Compare
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
          
          {hasBookmarks ? (
            <div className="space-y-6">
              {/* Two-column grid layout for position categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookmarksByCategory.map(category => (
                  <div key={category.position} className="mb-4">
                    <div className="mb-2">
                      <h2 className="text-base font-semibold border-b pb-1">
                        {category.label}
                        <span className="text-xs font-normal text-muted-foreground ml-2">
                          ({category.candidates.length})
                        </span>
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {category.candidates.map(candidate => (
                        <CompactCandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          isSelected={isSelected(candidate.id)}
                          onSelect={() => toggleCandidateSelection(candidate.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
          
          {/* Show message if search/filter returns no results */}
          {hasBookmarks && bookmarksByCategory.length === 0 && (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No Matching Candidates</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <Button asChild>
                <Link href="/candidates">Browse Candidates</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 