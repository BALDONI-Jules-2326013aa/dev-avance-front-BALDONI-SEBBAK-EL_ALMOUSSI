'use client';

import { useState, useEffect, useCallback } from 'react';
import { Course } from '@/lib/types';
import { coursesApi } from '@/lib/api/courses';

interface UseCoursesReturn {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCourses = (): UseCoursesReturn => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await coursesApi.getAll();
      setCourses(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des cours');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    isLoading,
    error,
    refetch: fetchCourses,
  };
};

interface UseCourseReturn {
  course: Course | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCourse = (id: number): UseCourseReturn => {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await coursesApi.getById(id);
      setCourse(data);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erreur lors du chargement du cours');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return {
    course,
    isLoading,
    error,
    refetch: fetchCourse,
  };
};
