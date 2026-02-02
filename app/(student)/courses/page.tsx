'use client';

import React from 'react';
import { useCourses } from '@/lib/hooks/useCourses';
import CourseList from '@/components/courses/CourseList';
import Loader from '@/components/ui/Loader';
import { BookOpen, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CoursesPage() {
  const { courses, isLoading, error, refetch } = useCourses();

  if (isLoading) {
    return <Loader text="Chargement des cours..." />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-50 rounded-xl p-8 max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={refetch}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Mes cours</h1>
        </div>
        <p className="text-gray-600">
          Découvrez tous les cours disponibles et commencez votre apprentissage
        </p>
      </div>

      {/* Liste des cours */}
      <CourseList courses={courses} />
    </div>
  );
}
