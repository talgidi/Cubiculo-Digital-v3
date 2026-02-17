"use client";

import React, { useState } from 'react';
import { ChevronRight, Save } from 'lucide-react';
import { Button } from '@/components/ui';
import { useInterviewActions } from '@/modules/interview/interview.hooks';
import { ProgressHeader } from './components/ProgressHeader';
import { QuestionCard } from './components/QuestionCard';
import { EditorArea } from './components/EditorArea';

export const InterviewView = () => {
  const [answer, setAnswer] = useState("");
  const { handleSave, loading } = useInterviewActions();

  // Mock de datos (En el futuro vendrán de tu useQuery)
  const currentQuestion = {
    id: "q3",
    title: "¿Cuál es el proceso estándar para el onboarding de un nuevo cliente?",
    description: "Detalla los pasos críticos desde la firma del contrato hasta la primera reunión estratégica. Menciona si hay herramientas específicas involucradas.",
    department: "Ventas",
    topic: "Onboarding",
    step: 3,
    totalSteps: 10
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Sub-Header interno */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 dark:border-[#232f48] bg-white/50 dark:bg-[#111722]/50 px-6 backdrop-blur-md">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#92a4c9]">
          <span>Entrevistas</span>
          <ChevronRight className="size-4" />
          <span className="text-gray-900 dark:text-white font-medium">Sesión Activa</span>
        </div>
        <Button variant="outline" size="sm" className="gap-2 dark:border-[#232f48] dark:text-white">
          <Save className="size-4" />
          <span className="hidden sm:inline">Guardar y Salir</span>
        </Button>
      </header>

      {/* Área de Contenido con Scroll */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-transparent">
        <div className="mx-auto max-w-4xl px-6 py-10 pb-32">
          
          <ProgressHeader 
            current={currentQuestion.step} 
            total={currentQuestion.totalSteps} 
          />

          <QuestionCard 
            title={currentQuestion.title}
            description={currentQuestion.description}
            department={currentQuestion.department}
            topic={currentQuestion.topic}
          />

          <EditorArea 
            value={answer}
            onChange={setAnswer}
            placeholder="Comienza a redactar el proceso aquí..."
          />

          <div className="mt-10 flex justify-end">
            <Button 
              size="lg" 
              className="min-w-50 shadow-lg shadow-blue-600/20"
              onClick={() => handleSave(answer, currentQuestion.id)}
              disabled={loading || !answer}
            >
              {loading ? "Guardando..." : "Siguiente Pregunta →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
