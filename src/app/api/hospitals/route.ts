import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Kontaktinfo kan endres i databasen: hent på nytt minst hvert 5. minutt
export const revalidate = 300;

export async function GET() {
  const regions = await prisma.healthRegion.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      hospitals: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          departments: {
            where: { isActive: true },
            orderBy: { name: 'asc' },
          },
        },
      },
    },
  });
  return NextResponse.json(regions);
}
