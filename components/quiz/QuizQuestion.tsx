'use client';

import React from 'react';
import { Question, Choice } from '@/lib/types';
import { Card, CardBody } from '@/components/ui/Card';
import { CheckCircle } from 'lucide-react';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedChoiceId: number | null;
  onSelectChoice: (choiceId: number) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedChoiceId,
  onSelectChoice,
}) => {
  return (
    <Card>
      <CardBody>
        {/* En-tête de la question */}
        <div className="mb-6">
          <span className="text-sm font-medium text-indigo-600 mb-2 block">
            Question {questionNumber} sur {totalQuestions}
          </span>
          <h3 className="text-lg font-semibold text-gray-900">
            {question.label}
          </h3>
        </div>

        {/* Choix */}
        <div className="space-y-3">
          {question.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.id;

            return (
              <button
                key={choice.id}
                onClick={() => onSelectChoice(choice.id)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Radio button custom */}
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

                  {/* Texte du choix */}
                  <span
                    className={`flex-1 ${
                      isSelected ? 'text-indigo-900 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {choice.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default QuizQuestion;
