"use client";

import React from 'react';
import { FileDown, FileText } from 'lucide-react';
import { Button } from '@/components/ui';

interface ExportToolbarProps {
  onExportPdf: () => void;
  onExportMarkdown: () => void;
}

export const ExportToolbar = ({ onExportPdf, onExportMarkdown }: ExportToolbarProps) => {
  return (
    <div className="mt-12 flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-[#232f48] bg-white dark:bg-[#192233]/30 p-6 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Exportar Resultados</h3>
        <p className="text-sm text-gray-500 dark:text-[#92a4c9]">
          Descarga el reporte completo de tu entrevista.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onExportPdf} className="gap-2">
          <FileDown className="size-4" />
          Exportar PDF
        </Button>
        <Button onClick={onExportMarkdown} variant="outline" className="gap-2 dark:border-[#232f48] dark:text-white">
          <FileText className="size-4" />
          Exportar Markdown
        </Button>
      </div>
    </div>
  );
};
