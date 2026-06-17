"use client";

import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { ChevronRight, Save } from 'lucide-react';
import { Button } from '@/components/ui';
import { useInterviewFlow, useInterviewResults } from '@/modules/interview/interview.hooks';
import { FINISH_INTERVIEW } from '@/modules/interview/interview.api';
import { ProgressHeader } from './components/ProgressHeader';
import { QuestionCard } from './components/QuestionCard';
import { EditorArea } from './components/EditorArea';
import { AnswersReview } from './components/AnswersReview';
import { FeedbackSection } from './components/FeedbackSection';
import { ExportToolbar } from './components/ExportToolbar';

export const InterviewView = () => {
  const {
    questions, currentStep, handleNext, handleBack,
    handleSaveAndExit,
    saveLocalProgress, getLocalProgress, loading
  } = useInterviewFlow();

  const { responses, feedback, loading: resultsLoading, hasResults, refetch: refetchResults } = useInterviewResults();
  const [finishInterviewMutation, { loading: finishLoading }] = useMutation(FINISH_INTERVIEW);

  const [answer, setAnswer] = useState("");
  const [viewMode, setViewMode] = useState<'loading' | 'interview' | 'results'>('loading');
  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  // Determinar el modo inicial cuando el check de resultados termina
  useEffect(() => {
    if (!resultsLoading && viewMode === 'loading') {
      setViewMode(hasResults ? 'results' : 'interview');
    }
  }, [resultsLoading, hasResults, viewMode]);

  // Efecto: Cargar progreso desde localStorage al cambiar de pregunta (solo en modo entrevista)
  useEffect(() => {
    if (currentQuestion && viewMode === 'interview') {
      setAnswer(getLocalProgress(currentQuestion.id));
    }
  }, [currentStep, currentQuestion, getLocalProgress, viewMode]);

  const handleFinishShowResults = async () => {
    if (!currentQuestion) return;
    try {
      const response = await finishInterviewMutation({
        variables: { lastAnswerContent: answer, questionId: currentQuestion.id },
      });
      if (response.data?.finishInterview?.success) {
        localStorage.removeItem('interview_step');
        await refetchResults();
        setViewMode('results');
      }
    } catch {
      alert("Hubo un problema con la IA, pero tus respuestas están a salvo.");
    }
  };

  // 1. Manejo de Carga (datos iniciales o check de resultados)
  if (loading || viewMode === 'loading') return (
    <div className="flex h-screen items-center justify-center dark:bg-[#0b101a]">
      <p className="text-white animate-pulse">Cargando sesión de entrevista...</p>
    </div>
  );

  // 2. Modo Resultados (entrevista ya completada)
  if (viewMode === 'results') {
    return (
      <div className="flex flex-col h-full animate-in fade-in duration-500">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 dark:border-[#232f48] bg-white/50 dark:bg-[#111722]/50 px-6 backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#92a4c9]">
            <span>Entrevistas</span>
            <ChevronRight className="size-4" />
            <span className="text-gray-900 dark:text-white font-medium">Resultados</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/dashboard'}
            className="gap-2 dark:border-[#232f48] dark:text-white"
          >
            Volver al Dashboard
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-transparent">
          <div className="mx-auto max-w-4xl px-6 py-10 pb-32">
            <AnswersReview responses={responses} />
            {feedback && <FeedbackSection content={feedback.content} createdAt={feedback.createdAt} />}
            <ExportToolbar onExportPdf={() => {}} onExportMarkdown={() => {}} />
          </div>
        </div>
      </div>
    );
  }

  // 3. Manejo de error o falta de datos
  if (!loading && questions.length === 0) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <p className="text-red-500 mb-4">No se encontraron preguntas disponibles.</p>
        <Button onClick={() => window.location.href = '/dashboard'}>Volver al Dashboard</Button>
      </div>
    );
  }

  // 4. Modo Entrevista (flujo actual de preguntas)
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 dark:border-[#232f48] bg-white/50 dark:bg-[#111722]/50 px-6 backdrop-blur-md">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#92a4c9]">
          <span>Entrevistas</span>
          <ChevronRight className="size-4" />
          <span className="text-gray-900 dark:text-white font-medium">Sesión Activa</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSaveAndExit}
          className="gap-2 dark:border-[#232f48] dark:text-white"
        >
          <Save className="size-4" />
          <span className="hidden sm:inline">Guardar y Salir</span>
        </Button>
      </header>

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
                  saveLocalProgress(currentQuestion.id, val);
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
                <Button 
                  size="lg"
                  onClick={() => {
                    if (isLastStep) {
                      handleFinishShowResults();
                    } else {
                      handleNext(currentQuestion.id, answer);
                    }
                  }}
                  disabled={loading || finishLoading || !answer}
                  className={isLastStep ? "bg-green-600 hover:bg-green-700 shadow-green-500/20" : ""}
                >
                  {finishLoading ? "Procesando..." : isLastStep ? "Finalizar Entrevista" : "Siguiente Pregunta"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
