import { AlertUrgency, Prisma } from '@prisma/client';

export const regimenDetailInclude = {
  tumorGroup: true,
  patientInfoSections: { orderBy: { sortOrder: 'asc' } },
  sideEffects: { orderBy: { sortOrder: 'asc' } },
  alertInstructions: { orderBy: { sortOrder: 'asc' } },
  premedication: { orderBy: { sortOrder: 'asc' } },
} satisfies Prisma.RegimenInclude;

export type RegimenDetail = Prisma.RegimenGetPayload<{ include: typeof regimenDetailInclude }>;

export const urgencyOrder: Record<AlertUrgency, number> = {
  EMERGENCY: 0,
  URGENT: 1,
  SOON: 2,
  ROUTINE: 3,
};
