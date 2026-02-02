import api from './axios';
import { Quiz, QuizSubmission, QuizAttempt, QuizAttemptResult } from '@/lib/types';

export const quizApi = {
  /**
   * Récupère un QCM par son ID
   * GET /api/quizzes/{id}
   */
  getById: async (id: number): Promise<Quiz> => {
    const response = await api.get<Quiz>(`/api/quizzes/${id}`);
    return response.data;
  },

  /**
   * Récupère les QCM d'un cours
   * GET /api/quizzes?courseId={id}
   */
  getByCourse: async (courseId: number): Promise<Quiz[]> => {
    const response = await api.get<Quiz[]>(`/api/quizzes?courseId=${courseId}`);
    return response.data;
  },

  /**
   * Soumet une tentative de QCM
   * POST /api/quiz-attempts
   */
  submitAttempt: async (submission: QuizSubmission): Promise<QuizAttemptResult> => {
    const response = await api.post<QuizAttemptResult>('/api/quiz-attempts', submission);
    return response.data;
  },

  /**
   * Récupère l'historique des tentatives de l'utilisateur courant
   * GET /api/quiz-attempts/me
   */
  getMyAttempts: async (): Promise<QuizAttempt[]> => {
    const response = await api.get<QuizAttempt[]>('/api/quiz-attempts/me');
    return response.data;
  },
};
