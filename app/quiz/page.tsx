"use client";

import React from "react";
import { Quiz } from "@/components/quiz/Quiz";
import { QuizProvider } from "@/context/QuizContext";

export default function QuizPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Candidate Alignment Tool</h1>
        <p className="text-gray-600 mt-2">
          Find candidates who match your views on important issues
        </p>
      </div>
      
      <QuizProvider>
        <Quiz />
      </QuizProvider>
    </div>
  );
} 