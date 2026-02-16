import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@cubiculo/db';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';

export const authResolvers = {
  Mutation: {
    signup: async (_: any, { name, email, password }: any) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword }
      });
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token, user };
    },
    login: async (_: any, { email, password }: any) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('Usuario no encontrado');
      
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Contraseña incorrecta');

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token, user };
    }
  }
};
