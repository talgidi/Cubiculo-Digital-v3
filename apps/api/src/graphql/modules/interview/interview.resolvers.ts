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

      // Guardamos en Postgres (Prisma)
      await prisma.interviewResponse.create({
        data: {
          content,
          questionId,
          userId: currentUser.userId
        }
      });

      return { id: questionId, success: true };
    }
  }
};
