import api from './axios';
import { Quiz, QuizSubmission, QuizAttempt, QuizAttemptResult, GenerateQcmResponse, GeneratedQcm, QcmSubmitResult } from '@/lib/types';

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

  /**
   * Génère un QCM à partir d'un fichier PDF
   * POST /api/qcm/generate
   */
  generateFromPdf: async (
    pdfFile: File,
    nbQuestions: number = 5,
    nbOptions: number = 3,
    answerType: 'single' | 'multiple' | 'boolean' = 'single'
  ): Promise<GenerateQcmResponse> => {
    const formData = new FormData();
    formData.append('pdf_file', pdfFile);
    formData.append('nbQuestions', nbQuestions.toString());
    formData.append('nbOptions', nbOptions.toString());
    formData.append('answerType', answerType);

    const response = await api.post<GenerateQcmResponse>('/api/qcm/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Soumet les réponses d'un QCM généré et obtient la correction
   * POST /api/qcm/submit
   */
  submitGeneratedQcm: async (
    qcm: GeneratedQcm,
    answers: Record<string | number, string>,
    startedAt?: number
  ): Promise<QcmSubmitResult> => {
    const response = await api.post<QcmSubmitResult>('/api/qcm/submit', {
      qcm,
      answers,
      startedAt,
    });
    return response.data;
  },

  /**
   * Génère un QCM à partir des documents d'un cours
   * POST /api/qcm/generate-from-course/{courseId}
   */
  generateFromCourse: async (
    courseId: number,
    nbQuestions: number = 10,
    nbOptions: number = 4,
    answerType: 'single' | 'multiple' | 'boolean' = 'multiple'
  ): Promise<GenerateQcmResponse> => {
    const response = await api.post<GenerateQcmResponse>(
      `/api/qcm/generate-from-course/${courseId}`,
      {
        nbQuestions,
        nbOptions,
        answerType,
      }
    );
    return response.data;
  },
};
