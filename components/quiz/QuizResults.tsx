"use client";

import React from "react";
import { useQuiz } from "@/context/QuizContext";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { AlignmentResult } from "@/context/QuizContext";
import Link from "next/link";
import Image from "next/image";

interface QuizResultsProps {
  results: AlignmentResult[];
  onReset: () => void;
}

export function QuizResults({ results, onReset }: QuizResultsProps) {
  if (results.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <p>No results available. Please complete the quiz first.</p>
          <Button onClick={onReset} className="mt-4">
            Take the Quiz
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Your Candidate Alignment Results</h1>
          <p className="text-gray-600 mt-2">
            Based on your answers, here's how you align with the candidates
          </p>
        </div>

        <div className="space-y-8 mt-6">
          {results.map((result, index) => (
            <div key={result.candidateId} className="border rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 relative h-16 w-16 overflow-hidden rounded-full border">
                  <Image
                    src={result.candidateImage}
                    alt={result.candidateName}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{result.candidateName}</h3>
                      <p className="text-sm text-gray-600">{result.candidateParty}</p>
                    </div>
                    <div className="bg-blue-100 px-3 py-1 rounded-full">
                      <span className="font-bold text-blue-800">{result.alignmentScore}% match</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${result.alignmentScore}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Link 
                      href={`/candidate/${result.candidateId}`} 
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View candidate profile →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={onReset} variant="outline">
            Take Quiz Again
          </Button>
          <Link href="/candidates">
            <Button variant="default">
              View All Candidates
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
} 