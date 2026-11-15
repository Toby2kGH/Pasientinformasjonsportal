import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Filter for innhold som kan vises offentlig: bare kurer som har gått gjennom
 * godkjenningsflyten (to godkjennere) og ikke er arkivert. Brukes i ALLE
 * offentlige spørringer, så utkast og arkiverte kurer aldri vises eller skrives ut.
 */
export const PUBLISHED = { isActive: true, publishStatus: 'APPROVED' } as const;
