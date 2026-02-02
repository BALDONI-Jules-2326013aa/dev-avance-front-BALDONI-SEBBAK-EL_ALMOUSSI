import api from './axios';
import { Course } from '@/lib/types';

export const coursesApi = {
  /**
   * Récupère tous les cours
   * GET /api/courses
   */
  getAll: async (): Promise<Course[]> => {
    const response = await api.get<Course[]>('/api/courses');
    return response.data;
  },

  /**
   * Récupère un cours par son ID avec ses vidéos, documents et quizzes
   * GET /api/courses/{id}
   */
  getById: async (id: number): Promise<Course> => {
    const response = await api.get<Course>(`/api/courses/${id}`);
    return response.data;
  },
};
