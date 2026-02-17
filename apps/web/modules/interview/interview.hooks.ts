import { useMutation } from "@apollo/client";
import { SUBMIT_ANSWER } from "./interview.api";

export const useInterviewActions = () => {
  const [submitAnswer, { loading }] = useMutation(SUBMIT_ANSWER);

  const handleSave = async (content: string, questionId: string) => {
    // Aquí implementaremos la lógica para guardar
    console.log("Guardando:", content);
  };

  return { handleSave, loading };
};
