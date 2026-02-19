import { aiService } from '../../../core/ai/ai.service.js';
import { INTERVIEW_POOL } from './interview.data.js';
import { prisma } from '@cubiculo/db';
import { GraphQLContext } from '../../context.js'; 

export const interviewResolvers = {
  Query: {
    randomInterview: () => {
      // Algoritmo de aleatoriedad
      const shuffled = [...INTERVIEW_POOL].sort(() => Math.random() - 0.5);
      return {
        id: crypto.randomUUID(),
        questions: shuffled.slice(0, 11) // Tomamos las 11
      };
    }
  },
  Mutation: {
    // Tipamos el contexto para evitar errores de 'any'
    submitAnswer: async (_: any, { content, questionId }: any, { currentUser }: GraphQLContext) => {
      if (!currentUser) throw new Error("No autorizado");
      
      await prisma.interviewResponse.create({
        data: {
          content,
          questionId,
          userId: currentUser.userId,
          isCompleted: false
        }
      });
      return { id: questionId, success: true };
    },

    finishInterview: async (_: any, { lastAnswerContent, questionId }: any, { currentUser }: any) => {
      if (!currentUser) throw new Error("No autorizado");

      // 1. Guardar la última respuesta
      await prisma.interviewResponse.create({
        data: {
          content: lastAnswerContent,
          questionId,
          userId: currentUser.userId,
          isCompleted: true
        }
      });

      // 2. Recuperar todas las respuestas del usuario para esta sesión
      const allResponses = await prisma.interviewResponse.findMany({
        where: { userId: currentUser.userId },
      });

      // 3. Mapear preguntas del POOL con respuestas de la DB para el contexto de la IA
      const contextForAI = allResponses.map(res => {
        const questionData = INTERVIEW_POOL.find(p => p.id === res.questionId);
        return {
          question: questionData?.title || "Pregunta desconocida",
          answer: res.content
        };
      });

      // 4. Generar Feedback con IA
      const user = await prisma.user.findUnique({ where: { id: currentUser.userId } });

      // Obtenemos el feedback (aquí es donde TS dice que podría ser string | null)
      const feedbackContent = await aiService.generateBusinessFeedback(
        user?.name || "Cliente", 
        contextForAI
      );
      
      // ✅ SOLUCIÓN: Verificación de seguridad y "Fallback"
      if (!feedbackContent) {
        throw new Error("La IA no pudo generar el reporte. Inténtalo de nuevo.");
      }

      // 5. Guardar el reporte final en una nueva tabla (o actualizar usuario)
      // Asumimos que tienes un modelo 'Feedback' en Prisma
      await prisma.feedback.upsert({
        where: { userId: currentUser.userId },
        update: { content: feedbackContent },
        create: { userId: currentUser.userId, content: feedbackContent }
      });

      return { id: currentUser.userId, success: true };
    }
  }
};
