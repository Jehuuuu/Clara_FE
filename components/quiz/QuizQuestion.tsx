"use client";

import React from "react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    alignment: {
      [candidateId: string]: number;
    };
  }[];
}

interface QuizQuestionProps {
  question: QuizQuestion;
  selectedOption?: string;
  onSelectOption: (optionId: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export function QuizQuestion({
  question,
  selectedOption,
  onSelectOption,
  questionNumber,
  totalQuestions
}: QuizQuestionProps) {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <Badge variant="outline" className="mb-2">
          Question {questionNumber} of {totalQuestions}
        </Badge>
        <h2 className="text-xl font-semibold">{question.question}</h2>
      </div>
      
      <div className="space-y-3">
        {question.options.map((option) => (
          <Button
            key={option.id}
            variant={selectedOption === option.id ? "default" : "outline"}
            className="w-full text-left justify-start p-4 h-auto"
            onClick={() => onSelectOption(option.id)}
          >
            {option.text}
          </Button>
        ))}
      </div>
    </Card>
  );
} 