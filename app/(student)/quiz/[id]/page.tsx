'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuiz } from '@/lib/hooks/useQuiz';
import { quizApi } from '@/lib/api/quiz';
import { Answer } from '@/lib/types';
import Loader from '@/components/ui/Loader';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { Card, CardBody } from '@/components/ui/Card';
import QuizQuestion from '@/components/quiz/QuizQuestion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw
} from 'lucide-react';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = Number(params.id);
  const courseId = searchParams.get('courseId');

  const { quiz, isLoading, error } = useQuiz(quizId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    maxScore: number;
    percentage: number;
  } | null>(null);

  const currentQuestion = quiz?.questions?.[currentQuestionIndex];
  const totalQuestions = quiz?.questions?.length || 0;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const answeredCount = Object.keys(answers).length;

  const handleSelectChoice = (choiceId: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: choiceId,
    }));
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    setIsSubmitting(true);

    try {
      const formattedAnswers: Answer[] = Object.entries(answers).map(
        ([questionId, choiceId]) => ({
          questionId: Number(questionId),
          choiceId,
        })
      );

      const response = await quizApi.submitAttempt({
        quizId: quiz.id,
        answers: formattedAnswers,
      });

      setResult({
        score: response.score,
        maxScore: response.total,
        percentage: Math.round((response.score / response.total) * 100),
      });
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      // En cas d'erreur, simuler un résultat pour le développement
      const simulatedScore = Object.keys(answers).length;
      setResult({
        score: simulatedScore,
        maxScore: totalQuestions,
        percentage: Math.round((simulatedScore / totalQuestions) * 100),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
  };

  if (isLoading) {
    return <Loader text="Chargement du QCM..." />;
  }

  if (error || !quiz) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-50 rounded-xl p-8 max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error || 'QCM introuvable'}</p>
          <Link href={courseId ? `/courses/${courseId}` : '/courses'}>
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Retour au cours
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Affichage des résultats
  if (result) {
    const isPassed = result.percentage >= 50;

    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardBody className="text-center py-12">
            {/* Icône de résultat */}
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
              isPassed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isPassed ? (
                <Trophy className="w-10 h-10 text-green-600" />
              ) : (
                <XCircle className="w-10 h-10 text-red-600" />
              )}
            </div>

            {/* Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isPassed ? 'Félicitations !' : 'Continuez vos efforts !'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isPassed
                ? 'Vous avez réussi ce QCM.'
                : 'Vous pouvez réessayer ce QCM pour améliorer votre score.'}
            </p>

            {/* Score */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="text-5xl font-bold mb-2" style={{
                color: isPassed ? '#059669' : '#dc2626'
              }}>
                {result.percentage}%
              </div>
              <p className="text-gray-600">
                {result.score} / {result.maxScore} bonnes réponses
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={handleRetry}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Réessayer
              </Button>
              <Link href={courseId ? `/courses/${courseId}` : '/courses'}>
                <Button variant="primary">
                  Retour au cours
                </Button>
              </Link>
              <Link href="/my-results">
                <Button variant="ghost">
                  Voir mes résultats
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Navigation retour */}
      <Link
        href={courseId ? `/courses/${courseId}` : '/courses'}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au cours
      </Link>

      {/* En-tête du QCM */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
      </div>

      {/* Barre de progression */}
      <div className="mb-6">
        <ProgressBar
          value={currentQuestionIndex + 1}
          max={totalQuestions}
          showLabel={false}
        />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>Question {currentQuestionIndex + 1} sur {totalQuestions}</span>
          <span>{answeredCount} réponse{answeredCount > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Question actuelle */}
      {currentQuestion && (
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          selectedChoiceId={answers[currentQuestion.id] || null}
          onSelectChoice={handleSelectChoice}
        />
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstQuestion}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Précédent
        </Button>

        {isLastQuestion ? (
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={answeredCount < totalQuestions}
            leftIcon={<CheckCircle className="w-4 h-4" />}
          >
            Terminer le QCM
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Suivant
          </Button>
        )}
      </div>

      {/* Indicateur de questions non répondues */}
      {answeredCount < totalQuestions && isLastQuestion && (
        <p className="text-center text-sm text-amber-600 mt-4">
          ⚠️ Veuillez répondre à toutes les questions avant de terminer
        </p>
      )}
    </div>
  );
}
