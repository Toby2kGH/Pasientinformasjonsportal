import { Prisma, PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Only regimens approved under the four-eyes workflow may be shown to patients.
export const publicRegimenWhere = {
  isActive: true,
  publishStatus: 'APPROVED',
} satisfies Prisma.RegimenWhereInput;
