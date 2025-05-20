"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Candidate, QuizQuestion, getCandidates, getQuizQuestions } from "@/lib/dummy-data";

interface QuizContextType {
  // Data
  questions: QuizQuestion[];
  candidates: Candidate[];
  isLoading: boolean;
  error: string | null;
  
  // Quiz state
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isCompleted: boolean;
  
  // Quiz actions
  startQuiz: () => void;
  answerQuestion: (questionId: string, optionId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  
  // Results
  getResults: () => AlignmentResult[];
}

export interface AlignmentResult {
  candidateId: string;
  candidateName: string;
  candidateParty: string;
  candidateImage: string;
  alignmentScore: number;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  // State
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1); // -1 means quiz not started
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [questionsData, candidatesData] = await Promise.all([
          getQuizQuestions(),
          getCandidates(),
        ]);

        setQuestions(questionsData);
        setCandidates(candidatesData);
      } catch (error) {
        setError("Failed to fetch quiz data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Quiz actions
  const startQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsCompleted(false);
  };

  const answerQuestion = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const completeQuiz = () => {
    setIsCompleted(true);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(-1);
    setAnswers({});
    setIsCompleted(false);
  };

  // Calculate alignment results
  const getResults = (): AlignmentResult[] => {
    if (!isCompleted || Object.keys(answers).length === 0) {
      return [];
    }

    // Initialize scores for each candidate
    const candidateScores: Record<string, number> = {};
    candidates.forEach(candidate => {
      candidateScores[candidate.id] = 0;
    });

    // Calculate total possible points (for percentage calculation)
    const totalPossiblePoints = Object.keys(answers).length * 100;

    // Calculate scores based on user answers
    Object.entries(answers).forEach(([questionId, selectedOptionId]) => {
      const question = questions.find(q => q.id === questionId);
      if (!question) return;

      const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
      if (!selectedOption) return;

      // Add alignment scores for each candidate
      Object.entries(selectedOption.alignment).forEach(([candidateId, score]) => {
        candidateScores[candidateId] = (candidateScores[candidateId] || 0) + score;
      });
    });

    // Convert to alignment results sorted by score (highest first)
    const results: AlignmentResult[] = candidates.map(candidate => ({
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateParty: candidate.party,
      candidateImage: candidate.image,
      alignmentScore: Math.round((candidateScores[candidate.id] / totalPossiblePoints) * 100)
    }));

    return results.sort((a, b) => b.alignmentScore - a.alignmentScore);
  };

  return (
    <QuizContext.Provider
      value={{
        questions,
        candidates,
        isLoading,
        error,
        currentQuestionIndex,
        answers,
        isCompleted,
        startQuiz,
        answerQuestion,
        nextQuestion,
        previousQuestion,
        completeQuiz,
        resetQuiz,
        getResults,
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