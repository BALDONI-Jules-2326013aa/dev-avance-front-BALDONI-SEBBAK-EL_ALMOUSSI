"use client";

import React from "react";
import Link from "next/link";
import { Quiz } from "@/lib/types";
import { Card, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ClipboardList, ArrowRight } from "lucide-react";

interface QuizCardProps {
  quiz: Quiz;
  courseId: number;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, courseId }) => {
  return (
    <Card hover>
      <CardBody>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <ClipboardList className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">{quiz.title}</h4>
            </div>
          </div>
          <Link href={`/quiz/${quiz.id}?courseId=${courseId}`}>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}>
              Passer le QCM
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};

export default QuizCard;
