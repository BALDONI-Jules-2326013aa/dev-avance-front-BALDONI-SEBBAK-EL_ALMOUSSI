'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCourse } from '@/lib/hooks/useCourses';
import Loader from '@/components/ui/Loader';
import Button from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import VideoPlayer from '@/components/course-detail/VideoPlayer';
import DocumentViewer from '@/components/course-detail/DocumentViewer';
import QuizCard from '@/components/course-detail/QuizCard';
import AddVideoModal from '@/components/course-detail/AddVideoModal';
import AddDocumentModal from '@/components/course-detail/AddDocumentModal';
import { coursesApi } from '@/lib/api/courses';
import { useAuth } from '@/lib/context/AuthContext';
import {
  ArrowLeft,
  Video,
  FileText,
  ClipboardList,
  Calendar,
  RefreshCw,
  Plus
} from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = Number(params.id);
  const { course, isLoading, error, refetch } = useCourse(courseId);
  const { user, isAuthenticated, logout } = useAuth();
  const isTeacher = isAuthenticated && user?.roles.includes('ROLE_PROF');

  // États pour les modals
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fonction pour ajouter une vidéo
  const handleAddVideo = async (title: string, description: string, file: File) => {
    setIsUploading(true);
    try {
      await coursesApi.uploadVideo(courseId, title, description, file);
      await refetch();
    } finally {
      setIsUploading(false);
    }
  };

  // Fonction pour ajouter un document
  const handleAddDocument = async (title: string, description: string, file: File) => {
    setIsUploading(true);
    try {
      await coursesApi.uploadDocument(courseId, title, description, file);
      await refetch();
    } finally {
      setIsUploading(false);
    }
  };


  if (isLoading) {
    return <Loader text="Chargement du cours..." />;
  }

  if (error || !course) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-50 rounded-xl p-8 max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error || 'Cours introuvable'}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/courses">
              <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Retour aux cours
              </Button>
            </Link>
            <Button
              variant="primary"
              onClick={refetch}
              leftIcon={<RefreshCw className="w-4 h-4" />}>
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const hasVideos = course.videos && course.videos.length > 0;
  const hasDocuments = course.documents && course.documents.length > 0;
  const hasQuizzes = course.quizzes && course.quizzes.length > 0;

  return (
    <div>
      {/* Navigation retour */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
      </Link>

      {/* En-tête du cours */}
      <Card className="mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 px-8 py-12">
          <h1 className="text-3xl font-bold text-white mb-4">{course.title}</h1>
          <h2 className="text-white/90">
            ({isTeacher ? 'Vous êtes enseignant' : 'Vous êtes étudiant'})
          </h2>
          <div className="flex items-center gap-6 text-white/80">
            {course.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(course.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
        <CardBody>
          <p className="text-gray-600 leading-relaxed">
            {course.description || 'Aucune description disponible pour ce cours.'}
          </p>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale - Vidéos et Documents */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section Vidéos */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Video className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Vidéos ({course.videos?.length || 0})
                </h2>
              </div>
              {isTeacher && (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setIsVideoModalOpen(true)}
                >
                  Ajouter une vidéo
                </Button>
              )}
            </div>
            {hasVideos ? (
              <div className="space-y-4">
                {course.videos?.map((video) => (
                  <VideoPlayer key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <Card>
                <CardBody className="text-center py-8">
                  <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucune vidéo disponible pour ce cours</p>
                </CardBody>
              </Card>
            )}
          </section>

          {/* Section Documents */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Documents ({course.documents?.length || 0})
                </h2>
              </div>
              {isTeacher && (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setIsDocumentModalOpen(true)}
                >
                  Ajouter un document
                </Button>
              )}
            </div>
            {hasDocuments ? (
              <div className="space-y-3">
                {course.documents?.map((doc) => (
                  <DocumentViewer key={doc.id} document={doc} />
                ))}
              </div>
            ) : (
              <Card>
                <CardBody className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun document disponible pour ce cours</p>
                </CardBody>
              </Card>
            )}
          </section>
        </div>

        {/* Colonne latérale - QCM */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="flex items-center gap-3 mb-4">
              <ClipboardList className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                QCM disponibles ({course.quizzes?.length || 0})
              </h2>
            </div>
            {hasQuizzes ? (
              <div className="space-y-4">
                {course.quizzes?.map((quiz) => (
                  <QuizCard key={quiz.id} quiz={quiz} courseId={course.id} />
                ))}
              </div>
            ) : (
              <Card>
                <CardBody className="text-center py-8">
                  <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun QCM disponible pour ce cours</p>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modals pour les enseignants */}
      {isTeacher && (
        <>
          <AddVideoModal
            isOpen={isVideoModalOpen}
            onClose={() => setIsVideoModalOpen(false)}
            onSubmit={handleAddVideo}
            isLoading={isUploading}
          />
          <AddDocumentModal
            isOpen={isDocumentModalOpen}
            onClose={() => setIsDocumentModalOpen(false)}
            onSubmit={handleAddDocument}
            isLoading={isUploading}
          />
        </>
      )}
    </div>
  );
}
