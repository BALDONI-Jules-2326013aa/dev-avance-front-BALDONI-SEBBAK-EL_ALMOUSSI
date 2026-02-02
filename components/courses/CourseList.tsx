'use client';

import React from 'react';
import { Course } from '@/lib/types';
import CourseCard from './CourseCard';
import { BookOpen } from 'lucide-react';

interface CourseListProps {
  courses: Course[];
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun cours disponible
        </h3>
        <p className="text-gray-500">
          Les cours seront affichés ici une fois disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
