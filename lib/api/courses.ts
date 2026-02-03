import api from './axios';
import { Course, Video, Document as DocumentType } from '@/lib/types';


export const coursesApi = {
  /**
   * Récupère tous les cours
   * GET /api/courses
   */
  getAll: async (): Promise<Course[]> => {
    const response = await api.get('/api/courses');

    // API Platform retourne une structure Hydra
    if (response.data && Array.isArray(response.data['hydra:member'])) {
      return response.data['hydra:member'];
    }

    // Si c'est déjà un tableau direct
    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  },

  /**
   * Récupère un cours par son ID avec ses vidéos, documents et quizzes
   * GET /api/courses/{id}
   */
  getById: async (id: number): Promise<Course> => {
    const response = await api.get<Course>(`/api/courses/${id}`);
    return response.data;
  },

  /**
   * Upload une nouvelle vidéo pour un cours
   * POST /api/videos
   */
  uploadVideo: async (courseId: number, title: string, description: string, videoFile: File): Promise<Video> => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('course', `/api/courses/${courseId}`);
    formData.append('videoFile', videoFile);

    const response = await api.post('/api/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // La réponse est directement l'objet vidéo, pas dans un wrapper
    return response.data;
  },

  /**
   * Upload un nouveau document pour un cours
   * POST /api/documents
   */
  uploadDocument: async (courseId: number, title: string, description: string, documentFile: File): Promise<DocumentType> => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('course', `/api/courses/${courseId}`);
    formData.append('documentFile', documentFile);

    const response = await api.post('/api/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // La réponse est directement l'objet document, pas dans un wrapper
    return response.data;
  },

  /**
   * Supprimer une vidéo
   * DELETE /api/videos/{id}
   */
  deleteVideo: async (videoId: number): Promise<void> => {
    await api.delete(`/api/videos/${videoId}`);
  },

  /**
   * Supprimer un document
   * DELETE /api/documents/{id}
   */
  deleteDocument: async (documentId: number): Promise<void> => {
    await api.delete(`/api/documents/${documentId}`);
  },
};
