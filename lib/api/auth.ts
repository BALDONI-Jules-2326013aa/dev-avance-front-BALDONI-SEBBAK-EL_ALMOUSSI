import api from './axios';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/lib/types';

export const authApi = {
      /**
       * Authentification de l'utilisateur
       * POST /api/login
       * Réponse de l'API Symfony avec lexik_jwt_authentication
       */
      login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post('/api/login', credentials);
        const data = response.data;

        // Si l'API renvoie uniquement le token
        if (data && data.token) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.token);
          }
          return { success: true, token: data.token } as AuthResponse;
        }

        // Si l'API renvoie l'objet complet
        if (data && data.success) {
          return data as AuthResponse;
        }

        // Gestion local storage, storedToken et storedUser
        if (typeof window !== 'undefined' && data.token && data.user) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }


        throw new Error(data?.message || 'Échec de la connexion');
      },

  /**
   * Inscription d'un nouvel utilisateur
   * POST /api/register
   */
  register: async (credentials: RegisterCredentials): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/api/register', credentials);
    return response.data;
  },

  /**
   * Récupère l'utilisateur courant depuis l'API
   * GET /api/me
   */
  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/api/me');
    return response.data;
  },

  /**
   * Déconnexion de l'utilisateur
   */
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  },

  /**
   * Récupère le token stocké
   */
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  /**
   * Récupère l'utilisateur courant depuis le stockage local
   */
  getCurrentUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
};
