"use client";

import React from "react";
import { useQuiz } from "@/context/QuizContext";
import { QuizIntro } from "./QuizIntro";
import { QuizQuestion } from "./QuizQuestion";
import { QuizResults } from "./QuizResults";

export function Quiz() {
  const {
    questions,
    currentQuestionIndex,
    answers,
    isCompleted,
    isLoading,
    error,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    completeQuiz,
    resetQuiz,
    getResults
  } = useQuiz();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p>Loading quiz...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Quiz not started state
  if (currentQuestionIndex === -1) {
    return <QuizIntro />;
  }

  // Quiz completed state
  if (isCompleted) {
    return <QuizResults results={getResults()} onReset={resetQuiz} />;
  }

  // Quiz in progress state
  const currentQuestion = questions[currentQuestionIndex];
  const selectedOptionId = answers[currentQuestion.id];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div>
      <div className="flex justify-center mb-4">
        <div className="text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>
      
      <QuizQuestion
        question={currentQuestion}
        selectedOptionId={selectedOptionId}
        onSelectOption={(optionId) => answerQuestion(currentQuestion.id, optionId)}
        onNext={nextQuestion}
        onPrevious={previousQuestion}
        onComplete={completeQuiz}
        isLastQuestion={isLastQuestion}
        isFirstQuestion={isFirstQuestion}
      />
    </div>
  );
} 