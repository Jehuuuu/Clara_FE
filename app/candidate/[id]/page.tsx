"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { getCandidate, Candidate, getIssue } from "@/lib/dummy-data";
import { useQuiz } from "@/context/QuizContext";
import { ArrowLeft, ExternalLink, CheckCircle } from "lucide-react";

export default function CandidateDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const candidateId = params.id as string;
  const { getResults, isCompleted } = useQuiz();
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alignmentScore, setAlignmentScore] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const candidateData = await getCandidate(candidateId);
        
        if (candidateData) {
          setCandidate(candidateData);
          
          // Check if user came from quiz results and has a completed quiz
          if (isCompleted) {
            const results = getResults();
            const candidateResult = results.find(result => result.candidateId === candidateId);
            if (candidateResult) {
              setAlignmentScore(candidateResult.alignmentScore);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching candidate:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [candidateId, isCompleted, getResults]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">Loading candidate information...</div>
      </div>
    );
  }
  
  if (!candidate) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Candidate Not Found</h1>
          <p className="mb-6">The candidate you are looking for does not exist or has been removed.</p>
          <Link href="/candidates">
            <Button>View All Candidates</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/candidates" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to all candidates
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Candidate info */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20">
            <div className="flex flex-col items-center">
              <div className="relative h-40 w-40 overflow-hidden rounded-full border mb-4">
                <Image
                  src={candidate.image}
                  alt={candidate.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <h1 className="text-2xl font-bold text-center mb-1">{candidate.name}</h1>
              <p className="text-gray-600 mb-2">{candidate.position}</p>
              
              <Badge variant="outline" className="mb-4">
                {candidate.party}
              </Badge>
              
              {/* Show alignment score if available */}
              {alignmentScore !== null && (
                <div className="w-full mb-6 bg-blue-50 p-4 rounded-md">
                  <h3 className="font-semibold text-center mb-1">Your Match</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${alignmentScore}%` }}
                    ></div>
                  </div>
                  <p className="text-center font-bold text-blue-800">{alignmentScore}% alignment</p>
                  <p className="text-xs text-center text-gray-600 mt-1">Based on your quiz responses</p>
                </div>
              )}
              
              <Link href={candidate.website} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Visit Website
                </Button>
              </Link>
            </div>
          </Card>
        </div>
        
        {/* Right column - Candidate details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bio section */}
          <section>
            <h2 className="text-xl font-bold mb-4">About {candidate.name}</h2>
            <p className="text-gray-700 mb-4">{candidate.bio}</p>
            
            {/* Education */}
            <h3 className="font-semibold mb-2">Education</h3>
            <ul className="list-disc pl-5 mb-4">
              {candidate.education.map((edu, index) => (
                <li key={index} className="mb-1">{edu}</li>
              ))}
            </ul>
            
            {/* Experience */}
            <h3 className="font-semibold mb-2">Experience</h3>
            <ul className="list-disc pl-5 mb-4">
              {candidate.experience.map((exp, index) => (
                <li key={index} className="mb-1">{exp}</li>
              ))}
            </ul>
            
            {/* Endorsements */}
            <h3 className="font-semibold mb-2">Endorsements</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {candidate.endorsements.map((endorsement, index) => (
                <Badge key={index} variant="secondary">
                  {endorsement}
                </Badge>
              ))}
            </div>
          </section>
          
          {/* Issues section */}
          <section>
            <h2 className="text-xl font-bold mb-4">Positions on Issues</h2>
            <div className="space-y-6">
              {Object.entries(candidate.issues).map(([issueKey, issueData]) => (
                <div key={issueKey} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 capitalize">{issueKey}</h3>
                  <div className="mb-2">
                    <Badge>{issueData.stance}</Badge>
                  </div>
                  <p className="text-gray-700">{issueData.explanation}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Take the quiz CTA if they haven't done it yet */}
          {alignmentScore === null && (
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Not sure if this candidate aligns with your views?</h3>
                <p className="mb-4">Take our quick quiz to find out which candidates best match your positions.</p>
                <Link href="/quiz">
                  <Button>Take the Alignment Quiz</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 