import { createSchema } from 'graphql-yoga';
import { prisma } from '@cubiculo/db';
import { authResolvers } from './modules/auth/auth.resolvers.js';
// 1. IMPORTA TU INTERFAZ PERSONALIZADA
import { GraphQLContext } from './context.js'; 
import { interviewResolvers } from './modules/interview/interview.resolvers.js';

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type User {
      id: String!
      email: String!
      name: String
    }

    type AuthPayload {
      token: String!
      user: User!
    }

    type InterviewQuestion {
      id: ID!
      title: String!
      description: String!
      department: String!
      topic: String!
    }

    type InterviewSession {
      id: ID!
      questions: [InterviewQuestion!]!
    }

    type MutationResponse {
      id: ID!
      success: Boolean!
    }

    type Query {
      health: String!
      me: User
      users: [User!]!
      randomInterview: InterviewSession!
    }

    type Mutation {
      signup(name: String!, email: String!, password: String!): AuthPayload!
      login(email: String!, password: String!): AuthPayload!
      submitAnswer(content: String!, questionId: String!): MutationResponse!
      finishInterview(lastAnswerContent: String!, questionId: String!): MutationResponse!
    }
  `,
  resolvers: [
    {
      Query: {
        health: () => 'ok',
        me: async (_, __, context: GraphQLContext) => {
          if (!context.currentUser) return null;
          return prisma.user.findUnique({ where: { id: context.currentUser.userId } });
        },
        users: async () => await prisma.user.findMany(),
      }
    },
    authResolvers,
    interviewResolvers
  ]
});
