import type { prisma } from '@cubiculo/db';

type PrismaInstance = typeof prisma;

export async function checkDatabase(prisma: PrismaInstance) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { ok: false, error: error.message };
    }

    return { ok: false, error: 'Unknown error' };
  }
}
