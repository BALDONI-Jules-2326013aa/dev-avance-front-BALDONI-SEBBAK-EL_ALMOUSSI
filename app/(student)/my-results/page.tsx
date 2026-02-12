"use client";

import React from "react";
import Link from "next/link";
import { useQuizAttempts } from "@/lib/hooks/useQuiz";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import {
  ClipboardList,
  Trophy,
  Calendar,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

export default function MyResultsPage() {
  // useQuizAttempts n'a plus besoin de studentId, utilise /api/quiz-attempts/me
  const { attempts, isLoading, error, refetch } = useQuizAttempts();

  if (isLoading) {
    return <Loader text="Chargement de vos résultats..." />;
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

  // Calcul des statistiques
  const totalAttempts = attempts.length;
  const averageScore = totalAttempts > 0
    ? Math.round(attempts.reduce((acc, a) => acc + a.score, 0) / totalAttempts)
    : 0;
  const passedCount = attempts.filter(a => a.isPassed).length;

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600 bg-green-50";
    if (score >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <TrendingUp className="w-5 h-5" />;
    if (score >= 50) return <Minus className="w-5 h-5" />;
    return <TrendingDown className="w-5 h-5" />;
  };

  return (
    <div>
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Mes résultats</h1>
        </div>
        <p className="text-gray-600">
          Consultez l&apos;historique de vos QCM et suivez votre progression
        </p>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardBody className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-1">
              {totalAttempts}
            </div>
            <p className="text-gray-600">QCM passés</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-1">
              {averageScore}%
            </div>
            <p className="text-gray-600">Score moyen</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-1">
              {passedCount}/{totalAttempts}
            </div>
            <p className="text-gray-600">QCM réussis</p>
          </CardBody>
        </Card>
      </div>

      {/* Liste des tentatives */}
      {attempts.length === 0 ? (
        <Card>
          <CardBody className="text-center py-16">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun résultat pour l&apos;instant
            </h3>
            <p className="text-gray-500 mb-6">
              Passez votre premier QCM pour voir vos résultats ici
            </p>
            <Link href="/courses">
              <Button variant="primary">Voir les cours</Button>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Historique des QCM
          </h2>
          {attempts.map((attempt) => (
            <Card key={attempt.id} hover>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Score badge */}
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl ${getScoreColor(
                        attempt.score
                      )}`}
                    >
                      {getScoreIcon(attempt.score)}
                      <span className="text-2xl font-bold">{Math.round(attempt.score)}%</span>
                    </div>

                    {/* Infos */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {attempt.quiz.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4" />
                          <span>{attempt.correctAnswers}/{attempt.totalQuestions} bonnes réponses</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {attempt.completedAt
                              ? new Date(attempt.completedAt).toLocaleDateString("fr-FR", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZone: "Europe/Paris"
                                })
                              : new Date(attempt.startedAt).toLocaleDateString("fr-FR", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZone: "Europe/Paris"
                                })
                            }
                          </span>
                        </div>
                        {attempt.timeSpent && (
                          <span className="text-gray-400">
                            ({Math.floor(attempt.timeSpent / 60)}min {attempt.timeSpent % 60}s)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Badge réussi/échoué */}
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    attempt.isPassed 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {attempt.isPassed ? 'Réussi' : 'Échoué'}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
