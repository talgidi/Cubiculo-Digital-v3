import { YogaInitialContext } from 'graphql-yoga';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';

export interface GraphQLContext extends YogaInitialContext {
  currentUser?: { userId: string };
}

export const createContext = async (initialContext: YogaInitialContext): Promise<GraphQLContext> => {
  const authHeader = initialContext.request.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return { ...initialContext, currentUser: decoded };
    } catch (e) {
      // Token inválido, el contexto no tendrá currentUser
    }
  }

  return initialContext;
};
