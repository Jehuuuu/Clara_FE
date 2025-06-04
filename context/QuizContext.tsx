"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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

interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
}

interface QuizResult {
  candidateId: string;
  alignmentScore: number;
}

interface QuizContextType {
  // Quiz state
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  currentQuestionIndex: number;
  isCompleted: boolean;
  
  // Quiz actions
  answerQuestion: (questionId: string, optionId: string) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  goToQuestion: (index: number) => void;
  resetQuiz: () => void;
  
  // Results
  getResults: () => QuizResult[];
  getProgress: () => number;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  // Quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Load quiz questions from API (placeholder for now)
  React.useEffect(() => {
    // TODO: Implement quiz questions loading from API
    // For now, we'll keep an empty array
    setQuestions([]);
  }, []);

  const answerQuestion = (questionId: string, optionId: string) => {
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(answer => answer.questionId === questionId);
      const newAnswer = { questionId, selectedOptionId: optionId };
      
      if (existingAnswerIndex >= 0) {
        // Update existing answer
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = newAnswer;
        return newAnswers;
      } else {
        // Add new answer
        return [...prev, newAnswer];
      }
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const resetQuiz = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
  };

  const getResults = (): QuizResult[] => {
    if (questions.length === 0 || answers.length === 0) {
      return [];
    }

    // Calculate alignment scores
    const candidateScores: { [candidateId: string]: number } = {};
    const totalPossibleScore: { [candidateId: string]: number } = {};

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) return;

      const selectedOption = question.options.find(option => option.id === answer.selectedOptionId);
      if (!selectedOption) return;

      Object.entries(selectedOption.alignment).forEach(([candidateId, score]) => {
        candidateScores[candidateId] = (candidateScores[candidateId] || 0) + score;
        totalPossibleScore[candidateId] = (totalPossibleScore[candidateId] || 0) + 100;
      });
    });

    // Convert to percentage and sort
    return Object.entries(candidateScores)
      .map(([candidateId, score]) => ({
        candidateId,
        alignmentScore: Math.round((score / totalPossibleScore[candidateId]) * 100)
      }))
      .sort((a, b) => b.alignmentScore - a.alignmentScore);
  };

  const getProgress = (): number => {
    if (questions.length === 0) return 0;
    return Math.round((answers.length / questions.length) * 100);
  };

  return (
    <QuizContext.Provider
      value={{
        questions,
        answers,
        currentQuestionIndex,
        isCompleted,
        answerQuestion,
        goToNextQuestion,
        goToPreviousQuestion,
        goToQuestion,
        resetQuiz,
        getResults,
        getProgress,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
} 