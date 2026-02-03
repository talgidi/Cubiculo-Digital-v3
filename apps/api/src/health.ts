import type { PrismaClient } from '@prisma/client';

export async function checkDatabase(prisma: PrismaClient) {
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
