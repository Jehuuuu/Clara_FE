"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { usePoliticians } from "@/context/PoliticianContext";
import { ArrowLeft, ExternalLink, Calendar, MapPin, User, FileText } from "lucide-react";

export default function PoliticianDetailPage() {
  const params = useParams();
  const politicianId = parseInt(params.id as string);
  const { politicians, selectPolitician, unselectPolitician, selectedPoliticians } = usePoliticians();
  
  const [politician, setPolitician] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  const handleToggleSelection = () => {
    if (isSelected) {
      unselectPolitician(politicianId);
    } else {
      selectPolitician(politicianId);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">Loading politician information...</div>
      </div>
    );
  }
  
  if (!politician) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Politician Not Found</h1>
          <p className="mb-6">The politician you are looking for does not exist or has been removed.</p>
          <Link href="/politicians">
            <Button>View All Politicians</Button>
          </Link>
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
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/politicians" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to all politicians
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Politician info */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20">
            <div className="flex flex-col items-center">
              <div className="relative h-40 w-40 overflow-hidden rounded-full border mb-4">
                <Image
                  src={politician.image_url || politician.latest_research?.politician_image || "/placeholder-politician.jpg"}
                  alt={politician.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <h1 className="text-2xl font-bold text-center mb-1">{politician.name}</h1>
              {politician.latest_research?.position && (
                <p className="text-gray-600 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {politician.latest_research.position}
                </p>
              )}
              
              {politician.latest_research?.politician_party && (
                <Badge variant="outline" className="mb-4">
                  {politician.latest_research.politician_party}
                </Badge>
              )}
              
              <div className="w-full space-y-3">
                <Button 
                  variant={isSelected ? "default" : "outline"} 
                  className="w-full"
                  onClick={handleToggleSelection}
                >
                  {isSelected ? "Remove from Selection" : "Add to Selection"}
                </Button>
                
                <Link href={`/compare?ids=${politicianId}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Compare With Others
                  </Button>
                </Link>
                
                <Link href={`/my-picks`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View My Selected Politicians
                  </Button>
                </Link>
                
                <Link href={`/ask?about=${encodeURIComponent(politician.name)}`} className="w-full">
                  <Button variant="secondary" className="w-full">
                    Ask Clara About This Politician
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Right column - Politician details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Research Summary */}
          {politician.latest_research ? (
            <>
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Research Summary</h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(politician.latest_research.created_at)}
                  </div>
                </div>
                
                {politician.latest_research.summary && (
                  <Card className="p-4 mb-4">
                    <p className="text-gray-700">{politician.latest_research.summary}</p>
                  </Card>
                )}
              </section>
              
              {/* Background */}
              {politician.latest_research.background && (
                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Background
                  </h2>
                  <Card className="p-4">
                    <div className="prose prose-sm max-w-none text-gray-700">
                      {politician.latest_research.background.split('\n').map((paragraph: string, index: number) => (
                        <p key={index} className="mb-3">{paragraph}</p>
                      ))}
                    </div>
                  </Card>
                </section>
              )}
              
              {/* Accomplishments */}
              {politician.latest_research.accomplishments && (
                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Key Accomplishments
                  </h2>
                  <Card className="p-4">
                    <div className="prose prose-sm max-w-none text-gray-700">
                      {politician.latest_research.accomplishments.split('\n').map((paragraph: string, index: number) => (
                        <p key={index} className="mb-3">{paragraph}</p>
                      ))}
                    </div>
                  </Card>
                </section>
              )}
              
              {/* Criticisms */}
              {politician.latest_research.criticisms && (
                <section>
                  <h2 className="text-xl font-bold mb-4">Criticisms & Challenges</h2>
                  <Card className="p-4 border-orange-200 bg-orange-50">
                    <div className="prose prose-sm max-w-none text-gray-700">
                      {politician.latest_research.criticisms.split('\n').map((paragraph: string, index: number) => (
                        <p key={index} className="mb-3">{paragraph}</p>
                      ))}
                    </div>
                  </Card>
                </section>
              )}
            </>
          ) : (
            <section>
              <h2 className="text-xl font-bold mb-4">No Research Available</h2>
              <Card className="p-8 text-center">
                <p className="text-gray-600 mb-4">
                  No detailed research has been conducted on this politician yet.
                </p>
                <Link href={`/ask?about=${encodeURIComponent(politician.name)}`}>
                  <Button>
                    Research This Politician
                  </Button>
                </Link>
              </Card>
            </section>
          )}
          
          {/* Basic Information */}
          <section>
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Name:</strong> {politician.name}
                </div>
                {politician.latest_research?.position && (
                  <div>
                    <strong>Position:</strong> {politician.latest_research.position}
                  </div>
                )}
                {politician.latest_research?.politician_party && (
                  <div>
                    <strong>Party:</strong> {politician.latest_research.politician_party}
                  </div>
                )}
                <div>
                  <strong>Added to Database:</strong> {formatDate(politician.created_at)}
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
} 