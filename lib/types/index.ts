// Types pour l'authentification
export interface User {
  id: number;
  email: string;
  roles: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

// Types pour les cours
export interface Course {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  // Ces champs sont présents uniquement dans GET /api/courses/{id}
  videos?: Video[];
  documents?: Document[];
  quizzes?: Quiz[];
}

export interface Video {
  id: number;
  title: string;
  url?: string;
  fileUrl?: string;
  fileName?: string;
  description?: string;
  duration?: number;
  position?: number;
  courseId?: number;
}

export interface Document {
  id: number;
  title: string;
  fileUrl: string;
  fileName?: string;
  description?: string;
  mimeType?: string;
  fileSize?: number;
  position?: number;
  courseId?: number;
}

// Types pour les QCM
export interface Quiz {
  id: number;
  title: string;
  courseId: number;
  questions?: Question[];
}

export interface Question {
  id: number;
  label: string;
  choices: Choice[];
}

export interface Choice {
  id: number;
  label: string;
}

// Types pour les tentatives de QCM
export interface QuizAttempt {
  id: number;
  quizId: number;
  score: number;
  createdAt: string;
}

export interface QuizAttemptResult {
  score: number;
  total: number;
}

export interface Answer {
  questionId: number;
  choiceId: number;
}

export interface QuizSubmission {
  quizId: number;
  answers: Answer[];
}

// Types pour les requêtes de création
export interface CreateCourse {
  title: string;
  description: string;
}

export interface CreateVideo {
  title: string;
  url: string;
  courseId: number;
}

export interface CreateDocument {
  title: string;
  fileUrl: string;
  courseId: number;
}

export interface CreateQuiz {
  title: string;
  courseId: number;
}

// Types pour la génération de QCM via IA
export interface GeneratedQcmQuestion {
  id: number | string;
  text: string;
  options: GeneratedQcmOption[];
  correct: string[];
  explanation?: string | null;
}

export interface GeneratedQcmOption {
  id: string;
  text: string;
}

export interface GeneratedQcm {
  title: string;
  quiz_id?: number;
  questions: GeneratedQcmQuestion[];
  meta?: {
    source_file?: string;
    nb_questions?: number;
    nb_options?: number;
    answer_type?: string;
  };
}

export interface GenerateQcmResponse {
  success: boolean;
  qcm: GeneratedQcm;
  error?: string;
}

export interface QcmSubmitResult {
  total: number;
  correct: number;
  percentage: number;
  details: QcmSubmitDetail[];
}

export interface QcmSubmitDetail {
  id: number | string;
  text: string;
  expected: string[];
  expected_text: string[];
  given: string[];
  given_text: string[];
  is_correct: boolean;
  explanation?: string | null;
}

