import { useMutation, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { SUBMIT_ANSWER, GET_RANDOM_INTERVIEW } from "./interview.api";

export const useInterviewFlow = () => {
  // A. Obtener datos del servidor
  const { data, loading: queryLoading } = useQuery(GET_RANDOM_INTERVIEW, {
    // IMPORTANTE: Mantenemos la misma data durante la sesión
    fetchPolicy: 'cache-first'
  }); 
  // B. Estado del paso actual
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('interview_step') || 0);
    }
    return 0;
  });
  // C. Mutación para guardar en DB
  const [submitAnswer, { loading: mutationLoading }] = useMutation(SUBMIT_ANSWER);

  // Persistir el paso actual
  useEffect(() => {
    localStorage.setItem('interview_step', currentStep.toString());
  }, [currentStep]);


  // Acción: Guardar progreso en LocalStorage (Caché de resiliencia)
  const saveLocalProgress = (questionId: string, content: string) => {
    localStorage.setItem(`interview_q_${questionId}`, content);
  };
  // Acción: Obtener progreso guardado
  const getLocalProgress = (questionId: string) => {
    if (typeof window === 'undefined') return "";
    return localStorage.getItem(`interview_q_${questionId}`) || "";
  };

    // Acción: Guardar en DB y avanzar
  const handleNext = async (questionId: string, content: string) => {
    try {
      // 1. Guardar en Servidor
      const response = await submitAnswer({ variables: { content, questionId } });
      
      // ✅ Si la respuesta del servidor es exitosa, avanzamos
      if (response.data?.submitAnswer?.success) {
        setCurrentStep(prev => prev + 1);
      }
    } catch (error) {
      // Si falla, el error saldrá en consola pero no avanzará la pregunta (correcto)
      console.error("Fallo al guardar en DB:", error);
      alert("Error al guardar: Asegúrate de estar logueado correctamente.");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return {
    questions: data?.randomInterview?.questions || [],
    currentStep,
    loading: queryLoading || mutationLoading,
    handleNext,
    handleBack,
    saveLocalProgress: (id: string, val: string) => localStorage.setItem(`interview_q_${id}`, val),
    getLocalProgress
  };
};
