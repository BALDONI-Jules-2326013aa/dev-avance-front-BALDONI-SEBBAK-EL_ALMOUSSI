'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { quizApi } from '@/lib/api/quiz';
import { GeneratedQcm, QcmSubmitResult } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import {
  Upload,
  FileText,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Loader2,
  Settings,
  Sparkles
} from 'lucide-react';

type QuizState = 'upload' | 'generating' | 'quiz' | 'result';

export default function GenerateQuizPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  // État de la page
  const [state, setState] = useState<QuizState>('upload');

  // Configuration du QCM
  const [nbQuestions, setNbQuestions] = useState(10);
  const [nbOptions, setNbOptions] = useState(4);
  const [answerType, setAnswerType] = useState<'single' | 'multiple' | 'boolean'>('multiple');

  // Fichier PDF (pour mode manuel)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // QCM généré
  const [qcm, setQcm] = useState<GeneratedQcm | null>(null);

  // État du quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string | number, string>>({});

  // Résultats
  const [result, setResult] = useState<QcmSubmitResult | null>(null);

  // Erreur
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoGenerateTriggered, setAutoGenerateTriggered] = useState(false);

  // Générer automatiquement si courseId est présent
  useEffect(() => {
    if (courseId && !autoGenerateTriggered) {
      setAutoGenerateTriggered(true);
      handleGenerateFromCourse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleGenerateFromCourse = async () => {
    if (!courseId) return;

    setState('generating');
    setError(null);

    try {
      const response = await quizApi.generateFromCourse(
        parseInt(courseId),
        nbQuestions,
        nbOptions,
        answerType
      );

      if (response.success && response.qcm) {
        setQcm(response.qcm);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setState('quiz');
      } else {
        setError(response.error || 'Erreur lors de la génération du QCM.');
        setState('upload');
      }
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Erreur lors de la génération du QCM.');
      setState('upload');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Veuillez sélectionner un fichier PDF valide.');
    }
  };

  const handleDropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Veuillez sélectionner un fichier PDF valide.');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleGenerateQcm = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier PDF.');
      return;
    }

    setState('generating');
    setError(null);

    try {
      const response = await quizApi.generateFromPdf(
        selectedFile,
        nbQuestions,
        nbOptions,
        answerType
      );

      if (response.success && response.qcm) {
        setQcm(response.qcm);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setState('quiz');
      } else {
        setError(response.error || 'Erreur lors de la génération du QCM.');
        setState('upload');
      }
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Erreur lors de la génération du QCM.');
      setState('upload');
    }
  };

  const currentQuestion = qcm?.questions?.[currentQuestionIndex];
  const totalQuestions = qcm?.questions?.length || 0;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const answeredCount = Object.keys(answers).length;

  const handleSelectChoice = (choiceId: string) => {
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
    if (!qcm) return;

    setIsSubmitting(true);

    try {
      const response = await quizApi.submitGeneratedQcm(qcm, answers);
      setResult(response);
      setState('result');
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      const simulatedScore = Object.keys(answers).length;
      setResult({
        total: totalQuestions,
        correct: simulatedScore,
        percentage: Math.round((simulatedScore / totalQuestions) * 100),
        details: []
      });
      setState('result');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setState('upload');
    setSelectedFile(null);
    setQcm(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setError(null);
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setState('quiz');
  };

  const backUrl = courseId ? `/courses/${courseId}` : '/courses';

  // Écran d'upload
  if (state === 'upload') {
    return (
      <div className="max-w-2xl mx-auto">
        <Link
          href={backUrl}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {courseId ? 'Retour au cours' : 'Retour aux cours'}
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Générer un QCM à partir d&apos;un PDF
        </h1>

        <Card>
          <CardBody>
            {/* Si courseId, proposer de relancer la génération */}
            {courseId && (
              <div className="mb-6 p-4 bg-indigo-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium text-indigo-900">
                    Génération automatique
                  </span>
                </div>
                <p className="text-sm text-indigo-700 mb-4">
                  Cliquez ci-dessous pour générer un QCM à partir des documents du cours.
                </p>
                <Button
                  variant="primary"
                  onClick={handleGenerateFromCourse}
                  className="w-full"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Générer le QCM (10 questions, choix multiple)
                </Button>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Zone de dépôt de fichier */}
            <div
              onDrop={handleDropFile}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                selectedFile
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex flex-col items-center gap-3">
                  <FileText className="w-12 h-12 text-green-600" />
                  <p className="text-green-700 font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-12 h-12 text-gray-400" />
                  <p className="text-gray-600 font-medium">
                    {courseId ? 'Ou déposez un autre fichier PDF ici' : 'Cliquez ou déposez un fichier PDF ici'}
                  </p>
                  <p className="text-sm text-gray-500">Maximum 10 MB</p>
                </div>
              )}
            </div>

            {/* Configuration */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Configuration</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Nombre de questions
                  </label>
                  <select
                    value={nbQuestions}
                    onChange={(e) => setNbQuestions(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {[3, 5, 10, 15, 20].map((n) => (
                      <option key={n} value={n}>
                        {n} questions
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Options par question
                  </label>
                  <select
                    value={nbOptions}
                    onChange={(e) => setNbOptions(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {[2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} options
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Type de réponse
                  </label>
                  <select
                    value={answerType}
                    onChange={(e) =>
                      setAnswerType(e.target.value as 'single' | 'multiple' | 'boolean')
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="single">Choix unique</option>
                    <option value="multiple">Choix multiple</option>
                    <option value="boolean">Vrai / Faux</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bouton de génération */}
            {selectedFile && (
              <div className="mt-6">
                <Button
                  variant="primary"
                  onClick={handleGenerateQcm}
                  disabled={!selectedFile}
                  className="w-full"
                >
                  Générer le QCM à partir du fichier
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }

  // Écran de génération
  if (state === 'generating') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardBody className="text-center py-16">
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Génération du QCM en cours...
            </h2>
            <p className="text-gray-600">
              L&apos;IA analyse le document et génère les questions. Cela peut prendre
              quelques secondes.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Écran de résultats
  if (state === 'result' && result) {
    const isPassed = result.percentage >= 50;

    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardBody className="text-center py-12">
            {/* Icône de résultat */}
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                isPassed ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
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
              <div
                className="text-5xl font-bold mb-2"
                style={{
                  color: isPassed ? '#059669' : '#dc2626',
                }}
              >
                {result.percentage}%
              </div>
              <p className="text-gray-600">
                {result.correct} / {result.total} bonnes réponses
              </p>
            </div>

            {/* Détails des réponses */}
            {result.details && result.details.length > 0 && (
              <div className="text-left mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Détail des réponses
                </h3>
                <div className="space-y-4">
                  {result.details.map((detail, index) => (
                    <div
                      key={detail.id}
                      className={`p-4 rounded-lg border ${
                        detail.is_correct
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {detail.is_correct ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-2">
                            Question {index + 1}: {detail.text}
                          </p>
                          <div className="text-sm">
                            <p className="text-gray-600">
                              <span className="font-medium">Votre réponse:</span>{' '}
                              {detail.given_text.join(', ') || 'Pas de réponse'}
                            </p>
                            {!detail.is_correct && (
                              <p className="text-green-700">
                                <span className="font-medium">Réponse correcte:</span>{' '}
                                {detail.expected_text.join(', ')}
                              </p>
                            )}
                            {detail.explanation && (
                              <p className="text-gray-500 mt-2 italic">
                                {detail.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={handleRetry}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Réessayer
              </Button>
              <Button variant="primary" onClick={handleReset}>
                Nouveau QCM
              </Button>
              <Link href={backUrl}>
                <Button variant="ghost">
                  {courseId ? 'Retour au cours' : 'Retour aux cours'}
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Écran du quiz
  if (state === 'quiz' && qcm && currentQuestion) {
    return (
      <div className="max-w-3xl mx-auto">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Annuler et revenir
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{qcm.title}</h1>
        </div>

        <div className="mb-6">
          <ProgressBar
            value={currentQuestionIndex + 1}
            max={totalQuestions}
            showLabel={false}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>
              Question {currentQuestionIndex + 1} sur {totalQuestions}
            </span>
            <span>
              {answeredCount} réponse{answeredCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <Card>
          <CardBody>
            <div className="mb-6">
              <span className="text-sm font-medium text-indigo-600 mb-2 block">
                Question {currentQuestionIndex + 1} sur {totalQuestions}
              </span>
              <h3 className="text-lg font-semibold text-gray-900">
                {currentQuestion.text}
              </h3>
            </div>

            <div className="space-y-3">
              {currentQuestion.options && currentQuestion.options.length > 0 ? (
                currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectChoice(option.id)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>

                        <span
                          className={`flex-1 ${
                            isSelected
                              ? 'text-indigo-900 font-medium'
                              : 'text-gray-700'
                          }`}
                        >
                          {option.text}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Aucun choix disponible
                </p>
              )}
            </div>
          </CardBody>
        </Card>

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

        {answeredCount < totalQuestions && isLastQuestion && (
          <p className="text-center text-sm text-amber-600 mt-4">
            Veuillez répondre à toutes les questions avant de terminer
          </p>
        )}
      </div>
    );
  }

  return null;
}
