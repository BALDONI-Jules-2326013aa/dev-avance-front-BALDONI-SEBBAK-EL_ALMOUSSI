'use client';

import { useState, useEffect, useCallback } from 'react';
import { Quiz, QuizAttempt } from '@/lib/types';
import { quizApi } from '@/lib/api/quiz';

interface UseQuizReturn {
  quiz: Quiz | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useQuiz = (id: number): UseQuizReturn => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await quizApi.getById(id);
      setQuiz(data);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erreur lors du chargement du QCM');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  return {
    quiz,
    isLoading,
    error,
    refetch: fetchQuiz,
  };
};

interface UseQuizAttemptsReturn {
  attempts: QuizAttempt[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer l'historique des tentatives de QCM de l'utilisateur courant
 * Utilise GET /api/quiz-attempts/me
 */
export const useQuizAttempts = (): UseQuizAttemptsReturn => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttempts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await quizApi.getMyAttempts();
      setAttempts(data);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erreur lors du chargement des résultats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  return {
    attempts,
    isLoading,
    error,
    refetch: fetchAttempts,
  };
};
