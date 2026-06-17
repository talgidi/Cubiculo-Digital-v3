"use client";

import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface AnswerItem {
  questionId: string;
  questionTitle: string;
  questionDescription: string;
  questionDepartment: string;
  questionTopic: string;
  answerContent: string;
  isCompleted: boolean;
}

interface AnswersReviewProps {
  responses: AnswerItem[];
}

export const AnswersReview = ({ responses }: AnswersReviewProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tus Respuestas</h2>
        <p className="text-sm text-gray-500 dark:text-[#92a4c9]">
          Revisa las preguntas y respuestas de tu entrevista.
        </p>
      </div>

      {responses.map((item, index) => (
        <div
          key={item.questionId}
          className="rounded-xl border border-gray-200 dark:border-[#232f48] bg-white dark:bg-[#192233]/30"
        >
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 dark:border-[#232f48] px-6 py-4 bg-gray-50 dark:bg-[#111722]/50 rounded-t-xl">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/10 text-sm font-bold text-blue-600 dark:text-blue-400">
                {index + 1}
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-400 ring-1 ring-inset ring-purple-600/20">
                  {item.questionDepartment}
                </span>
                <span className="rounded-md bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-600/20">
                  {item.questionTopic}
                </span>
              </div>
            </div>
            {item.isCompleted ? (
              <CheckCircle2 className="size-5 text-green-500 shrink-0" />
            ) : (
              <Circle className="size-5 text-gray-300 dark:text-[#637588] shrink-0" />
            )}
          </div>

          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {item.questionTitle}
              </h3>
              <p className="text-sm text-gray-500 dark:text-[#92a4c9] mt-1">
                {item.questionDescription}
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 dark:border-[#232f48]/50 bg-gray-50 dark:bg-[#111722]/30 p-4">
              <p className="text-sm font-medium text-gray-400 dark:text-[#637588] mb-2">Tu respuesta:</p>
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                {item.answerContent}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
