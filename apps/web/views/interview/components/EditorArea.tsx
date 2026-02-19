import React from 'react';
import { Bold, Italic, List, Link2 } from 'lucide-react';
import { Button } from '@/components/ui';

interface EditorAreaProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const EditorArea = ({ value, onChange, placeholder }: EditorAreaProps) => {
  return (
    <div className="group mt-8 rounded-xl border border-gray-200 dark:border-[#232f48] bg-white dark:bg-[#192233]/30 transition-all focus-within:border-blue-500 dark:focus-within:border-[#1980e6]">
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-[#232f48] p-2 bg-gray-50 dark:bg-[#111722]/50">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 dark:text-[#92a4c9]"><Bold className="size-4" /></Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 dark:text-[#92a4c9]"><Italic className="size-4" /></Button>
        <div className="mx-1 h-4 w-px bg-gray-300 dark:bg-[#232f48]" />
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 dark:text-[#92a4c9]"><List className="size-4" /></Button>
      </div>
      <textarea
        className="w-full min-h-75 p-6 bg-transparent text-gray-900 dark:text-white outline-none resize-none text-lg"
        placeholder={placeholder || "Escribe tu respuesta aquí..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
