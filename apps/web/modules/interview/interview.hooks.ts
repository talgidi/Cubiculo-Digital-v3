import { useMutation, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SUBMIT_ANSWER, GET_RANDOM_INTERVIEW, FINISH_INTERVIEW } from "./interview.api";

export const useInterviewFlow = () => {
  const router = useRouter();
  const [finishInterview, { loading: finishing }] = useMutation(FINISH_INTERVIEW);
  // A. Obtener datos del servidor
  const { data, loading: queryLoading } = useQuery(GET_RANDOM_INTERVIEW, {
    fetchPolicy: 'network-only', // Forzamos carga fresca para evitar arrays vacíos de caché antigua
    nextFetchPolicy: 'cache-first'
  }); 
  // B. Estado del paso actual
  const [currentStep, setCurrentStep] = useState(0);
  // C. Mutación para guardar en DB
  const [submitAnswer, { loading: mutationLoading }] = useMutation(SUBMIT_ANSWER);

  // Cargar el paso de localStorage SOLO después del montaje (Client Side)
  useEffect(() => {
    const savedStep = localStorage.getItem('interview_step');
    if (savedStep) {
      setCurrentStep(Number(savedStep));
    }
  }, []);

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

  const handleFinish = async (questionId: string, content: string) => {
    try {
      const response = await finishInterview({ variables: { lastAnswerContent: content, questionId } });
      if (response.data?.finishInterview?.success) {
        // Limpiamos el rastro local para una nueva sesión futura
        localStorage.removeItem('interview_step');
        // Redirigimos a una página de "Procesando" o al Dashboard con un aviso
        router.push("/dashboard?status=processing");
      }
    } catch (error) {
      console.error("Error al finalizar:", error);
    }
  };

  const handleSaveAndExit = () => {
    // Simplemente redirige, ya que guardamos localmente en cada cambio de input
    router.push("/dashboard");
  };

  return {
    questions: data?.randomInterview?.questions || [],
    currentStep,
    loading: queryLoading,
    handleNext,
    handleBack,
    saveLocalProgress: (id: string, val: string) => localStorage.setItem(`interview_q_${id}`, val),
    getLocalProgress,
    handleFinish,
    handleSaveAndExit,
    isFinishing: finishing,
  };
};
