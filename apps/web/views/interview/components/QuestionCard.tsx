import React from 'react';

interface QuestionCardProps {
  title: string;
  description: string;
  department: string;
  topic: string;
}

export const QuestionCard = ({ title, description, department, topic }: QuestionCardProps) => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-md bg-purple-50 dark:bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-700 dark:text-purple-400 ring-1 ring-inset ring-purple-600/20">
          {department}
        </span>
        <span className="rounded-md bg-blue-50 dark:bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-600/20">
          {topic}
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-[#92a4c9] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
