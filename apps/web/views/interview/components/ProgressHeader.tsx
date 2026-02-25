import React from 'react';

interface ProgressHeaderProps {
  current: number;
  total: number;
}

export const ProgressHeader = ({ current, total }: ProgressHeaderProps) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="mb-10 flex flex-col gap-3">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Progreso de la Entrevista</h2>
          <p className="text-sm text-gray-500 dark:text-[#92a4c9]">Pregunta {current} de {total}</p>
        </div>
        <span className="text-sm font-bold text-blue-600 dark:text-[#1980e6]">{percentage}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-[#192233]">
        <div 
          className="h-full rounded-full bg-blue-600 dark:bg-[#1980e6] transition-all duration-700 ease-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
