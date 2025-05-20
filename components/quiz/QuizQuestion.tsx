"use client";

import React from "react";
import { useQuiz } from "@/context/QuizContext";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuizQuestion as QuizQuestionType } from "@/lib/dummy-data";

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedOptionId: string | undefined;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  isLastQuestion: boolean;
  isFirstQuestion: boolean;
}

export function QuizQuestion({
  question,
  selectedOptionId,
  onSelectOption,
  onNext,
  onPrevious,
  onComplete,
  isLastQuestion,
  isFirstQuestion,
}: QuizQuestionProps) {
  return (
    <Card className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">{question.question}</h2>
        
        <div className="space-y-3">
          {question.options.map((option) => (
            <div
              key={option.id}
              className={`p-4 rounded-md border-2 cursor-pointer transition-colors ${
                selectedOptionId === option.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => onSelectOption(option.id)}
            >
              <p>{option.text}</p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-6">
          <Button
            onClick={onPrevious}
            disabled={isFirstQuestion}
            variant="outline"
          >
            Previous
          </Button>
          
          {isLastQuestion ? (
            <Button
              onClick={onComplete}
              disabled={!selectedOptionId}
              variant="default"
            >
              See Results
            </Button>
          ) : (
            <Button
              onClick={onNext}
              disabled={!selectedOptionId}
              variant="default"
            >
              Next Question
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
} 