"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, Save } from 'lucide-react';
import { Button } from '@/components/ui';
import { useInterviewFlow } from '@/modules/interview/interview.hooks';
import { ProgressHeader } from './components/ProgressHeader';
import { QuestionCard } from './components/QuestionCard';
import { EditorArea } from './components/EditorArea';

export const InterviewView = () => {
  const {
    questions, currentStep, handleNext, handleBack,
    handleFinish, handleSaveAndExit,
    saveLocalProgress, getLocalProgress, loading, isFinishing
  } = useInterviewFlow();

  const [answer, setAnswer] = useState("");
  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  // Efecto: Cargar progreso desde localStorage al cambiar de pregunta
  useEffect(() => {
    if (currentQuestion) {
      setAnswer(getLocalProgress(currentQuestion.id));
    }
  }, [currentStep, currentQuestion]);

  if (loading && questions.length === 0) return <div>Cargando entrevista...</div>;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Sub-Header interno */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 dark:border-[#232f48] bg-white/50 dark:bg-[#111722]/50 px-6 backdrop-blur-md">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#92a4c9]">
          <span>Entrevistas</span>
          <ChevronRight className="size-4" />
          <span className="text-gray-900 dark:text-white font-medium">Sesión Activa</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSaveAndExit} // 👈 Acción real
          className="gap-2 dark:border-[#232f48] dark:text-white"
        >
          <Save className="size-4" />
          <span className="hidden sm:inline">Guardar y Salir</span>
        </Button>
      </header>

      {/* Área de Contenido con Scroll */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-transparent">
        <div className="mx-auto max-w-4xl px-6 py-10 pb-32">          
          <ProgressHeader current={currentStep + 1} total={questions.length} />
          
          {currentQuestion && (
            <>
              <QuestionCard 
                title={currentQuestion.title}
                description={currentQuestion.description}
                department={currentQuestion.department}
                topic={currentQuestion.topic}
              />

              <EditorArea 
                value={answer} 
                onChange={(val) => {
                  setAnswer(val);
                  saveLocalProgress(currentQuestion.id, val); // Persistencia en cache
                }} 
              />

              <div className="mt-10 flex justify-between">
                <Button 
                    variant="outline" 
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="dark:border-[#232f48] dark:text-white"
                  >
                    Pregunta Anterior
                </Button>
                {/* BOTÓN DINÁMICO: Siguiente o Finalizar */}
                <Button 
                  size="lg"
                  onClick={() => {
                    if (isLastStep) {
                      handleFinish(currentQuestion.id, answer);
                    } else {
                      handleNext(currentQuestion.id, answer);
                    }
                  }}
                  disabled={loading || isFinishing || !answer}
                  className={isLastStep ? "bg-green-600 hover:bg-green-700 shadow-green-500/20" : ""}
                >
                  {isFinishing ? "Procesando..." : isLastStep ? "Finalizar Entrevista" : "Siguiente Pregunta"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};




