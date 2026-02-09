import { createSchema } from 'graphql-yoga';
import { prisma } from '@cubiculo/db';
import { redis } from './redis.js';

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type User {
      id: String!
      email: String!
      name: String
    }
    type Query {
      health: String!
      users: [User!]!
    }
  `,
  resolvers: {
    Query: {
      health: () => 'ok',
      users: async () => {
        const cacheKey = 'users:all';

        // 1. INTENTAR OBTENER DE REDIS (Cache Hit)
        const cachedUsers = await redis.get(cacheKey);
        if (cachedUsers) {
          console.log('🚀 Cache Hit: Sirviendo desde Redis');
          return JSON.parse(cachedUsers);
        }

        // 2. SI NO ESTÁ, BUSCAR EN SUPABASE (Cache Miss)
        console.log('📡 Cache Miss: Buscando en Supabase');
        const users = await prisma.user.findMany();

        // 3. GUARDAR EN REDIS PARA LA PRÓXIMA VEZ
        // 'EX', 3600 hace que el cache expire en 1 hora automáticamente
        await redis.set(cacheKey, JSON.stringify(users), {
          EX: 3600
        });

        return users;
      },
    },
  },
});
