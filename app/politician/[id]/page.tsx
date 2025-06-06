"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { usePoliticians } from "@/context/PoliticianContext";
import { ArrowLeft, ExternalLink, Calendar, MapPin, User, FileText, Loader2 } from "lucide-react";

export default function PoliticianDetailPage() {
  // Force re-render with updated styles - v2
  const params = useParams();
  const politicianId = parseInt(params.id as string);
  const { 
    politicians, 
    selectedPoliticians, 
    toggleSelection // This is the API function we'll use
  } = usePoliticians();
  
  const [politician, setPolitician] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false); // New state for button loading
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // First try to find the politician in context
        const contextPolitician = politicians.find(p => p.id === politicianId);
        
        if (contextPolitician) {
          setPolitician(contextPolitician);
        } else {
          // If not in context, fetch from API
          const response = await fetch(`http://127.0.0.1:8000/api/politicians/${politicianId}/`);
          if (response.ok) {
            const data = await response.json();
            setPolitician(data);
          } else {
            setPolitician(null);
          }
        }
      } catch (error) {
        console.error("Error fetching politician:", error);
        setPolitician(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [politicianId, politicians]);
  
  const isSelected = selectedPoliticians.includes(politicianId);
  
  // Update this function to use the API-connected toggleSelection
  const handleToggleSelection = async () => {
    setIsToggling(true);
    try {
      await toggleSelection(politicianId);
    } catch (error) {
      console.error("Error toggling politician selection:", error);
      // You could add a toast notification here for errors
    } finally {
      setIsToggling(false);
    }
  };
  
  if (isLoading || !politician || !politician.id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto py-6 px-4">
            <Link 
              href="/politicians" 
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to all politicians
            </Link>
          </div>
        </div>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-12">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading politician information...</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-4">Politician Not Found</h1>
                <p className="mb-6 text-gray-600">The politician you are looking for does not exist or has been removed.</p>
                <Link href="/politicians">
                  <Button>View All Politicians</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4">
          <Link 
            href="/politicians" 
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all politicians
          </Link>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Politician info */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden bg-white shadow-lg border-0 sticky top-20">
              {/* Hero section with gradient background */}
              <div className="relative h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-blue-50">
                <div className="absolute inset-0 bg-black/5"></div>
              </div>
              
              {/* Profile section */}
              <div className="relative px-6 pb-6">
                {/* Profile image */}
                <div className="relative -mt-16 mb-4 flex justify-center">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-xl bg-white">
                    <Image
                      src={politician.image_url || politician.latest_research?.politician_image || "/placeholder-politician.jpg"}
                      alt={politician.name || 'Politician'}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                
                {/* Basic info */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{politician.name || 'Unknown Politician'}</h1>
                  
                  {politician.latest_research?.position && (
                    <div className="flex items-center justify-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">{politician.latest_research.position}</span>
                    </div>
                  )}
                  
                  {politician.latest_research?.politician_party && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-medium">
                      {politician.latest_research.politician_party}
                    </Badge>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="space-y-3">
                  <Button 
                    variant={isSelected ? "default" : "outline"} 
                    className="w-full font-medium"
                    onClick={handleToggleSelection}
                    disabled={isToggling}
                  >
                    {isToggling ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isSelected ? "Removing..." : "Adding..."}
                      </span>
                    ) : (
                      isSelected ? "✓ Added to Selection" : "Add to Selection"
                    )}
                  </Button>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Link href={`/my-picks`} className="w-full">
                      <Button variant="outline" className="w-full text-sm">
                        View My Selections
                      </Button>
                    </Link>
                  </div>
                  
                  <Link href={`/ask?about=${encodeURIComponent(politician.name || '')}`} className="w-full">
                    <Button variant="default" className="mt-10 w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 font-medium">
                      Ask Clara About {politician.name?.split(' ')[0] || 'Politician'}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
          {/* Right column - Politician details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Research Summary */}
            {politician.latest_research ? (
              <>
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Research Summary</h2>
                    <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(politician.latest_research.created_at)}
                    </div>
                  </div>
                  
                  {politician.latest_research.summary && (
                    <Card className="p-6 bg-white shadow-sm border-0 shadow-lg">
                      <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed text-justify">
                        <ReactMarkdown>
                          {politician.latest_research.summary}
                        </ReactMarkdown>
                      </div>
                    </Card>
                  )}
                </section>
                
                {/* Background */}
                {politician.latest_research.background && (
                  <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      Background
                    </h2>
                    <Card className="p-6 bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 shadow-lg border-0">
                      <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed text-justify">
                        <ReactMarkdown>
                          {politician.latest_research.background}
                        </ReactMarkdown>
                      </div>
                    </Card>
                  </section>
                )}
                
                {/* Accomplishments */}
                {politician.latest_research.accomplishments && (
                  <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      Key Accomplishments
                    </h2>
                    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg border-0">
                      <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed text-justify">
                        <ReactMarkdown>
                          {politician.latest_research.accomplishments}
                        </ReactMarkdown>
                      </div>
                    </Card>
                  </section>
                )}
                
                {/* Criticisms */}
                {politician.latest_research.criticisms && (
                  <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                        <ExternalLink className="h-4 w-4 text-amber-600" />
                      </div>
                      Criticisms & Challenges
                    </h2>
                    <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg border-0">
                      <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed text-justify">
                        <ReactMarkdown>
                          {politician.latest_research.criticisms}
                        </ReactMarkdown>
                      </div>
                    </Card>
                  </section>
                )}
              </>
            ) : (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">No Research Available</h2>
                <Card className="p-8 text-center bg-gray-50 border-0 shadow-lg">
                  <div className="max-w-md mx-auto">
                    <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-6">
                      No detailed research has been conducted on this politician yet.
                    </p>
                    <Link href={`/ask?about=${encodeURIComponent(politician.name || '')}`}>
                      <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80">
                        Research This Politician
                      </Button>
                    </Link>
                  </div>
                </Card>
              </section>
            )}
            
            {/* Basic Information */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
              <Card className="p-6 bg-white shadow-sm border-0 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Full Name</span>
                      <p className="text-gray-900 font-medium">{politician.name || 'Unknown'}</p>
                    </div>
                    {politician.latest_research?.position && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Position</span>
                        <p className="text-gray-900 font-medium">{politician.latest_research.position}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {politician.latest_research?.politician_party && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Political Party</span>
                        <p className="text-gray-900 font-medium">{politician.latest_research.politician_party}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-500">Added to Database</span>
                      <p className="text-gray-900 font-medium">{formatDate(politician.created_at)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}