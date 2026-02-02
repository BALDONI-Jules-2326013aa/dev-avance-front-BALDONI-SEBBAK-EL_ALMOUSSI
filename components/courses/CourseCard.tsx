"use client";

import React from "react";
import Link from "next/link";
import { Course } from "@/lib/types";
import { Card, CardBody, CardFooter } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card hover className="flex flex-col h-full">
      {/* Header avec icône */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 px-6 py-8">
        <BookOpen className="w-12 h-12 text-white/90" />
      </div>

      <CardBody className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description || "Aucune description disponible"}
        </p>

        {/* Date de création */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(course.createdAt).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </CardBody>

      <CardFooter>
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button
            variant="primary"
            className="w-full"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Voir le cours
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
