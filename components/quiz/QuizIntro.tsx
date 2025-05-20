"use client";

import React from "react";
import { useQuiz } from "@/context/QuizContext";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export function QuizIntro() {
  const { startQuiz, isLoading } = useQuiz();

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center">Candidate Alignment Quiz</h1>
        
        <p className="text-center text-gray-600">
          Find out which candidates share your views on important issues
        </p>
        
        <div className="my-8 space-y-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">How it works:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Answer questions about your position on key issues</li>
              <li>We'll calculate which candidates align with your views</li>
              <li>See a breakdown of how your positions match with each candidate</li>
            </ul>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Important notes:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>This quiz takes about 5 minutes to complete</li>
              <li>Your responses are private and not stored permanently</li>
              <li>Results are meant as a starting point for your research</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={startQuiz} 
            disabled={isLoading}
            size="lg"
            variant="default"
          >
            {isLoading ? "Loading quiz..." : "Start Quiz"}
          </Button>
        </div>
      </div>
    </Card>
  );
} 