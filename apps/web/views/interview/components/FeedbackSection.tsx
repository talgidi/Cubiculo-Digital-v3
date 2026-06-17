"use client";

import React from 'react';
import { Sparkles } from 'lucide-react';

interface FeedbackSectionProps {
  content: string;
  createdAt?: string;
}

export const FeedbackSection = ({ content, createdAt }: FeedbackSectionProps) => {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-500/10">
          <Sparkles className="size-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Feedback de la IA</h2>
          {formattedDate && (
            <p className="text-xs text-gray-400 dark:text-[#637588]">Generado el {formattedDate}</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-[#232f48] bg-white dark:bg-[#192233]/30">
        <div className="p-6 md:p-8">
          <div className="prose prose-gray dark:prose-invert max-w-none whitespace-pre-wrap text-gray-800 dark:text-[#e0e6f0] leading-relaxed text-base">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};
