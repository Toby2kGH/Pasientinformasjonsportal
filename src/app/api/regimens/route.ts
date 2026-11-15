import { NextResponse } from 'next/server';
import { prisma, PUBLISHED } from '@/lib/prisma';

// Godkjenning og arkivering skal slå inn med en gang
export const dynamic = 'force-dynamic';

export async function GET() {
  const regimens = await prisma.regimen.findMany({
    where: PUBLISHED,
    orderBy: [{ tumorGroupId: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    include: { tumorGroup: true },
  });
  return NextResponse.json(regimens);
}
