import { NextResponse } from 'next/server';
import { prisma, publicRegimenWhere } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const regimens = await prisma.regimen.findMany({
    where: publicRegimenWhere,
    orderBy: [{ tumorGroupId: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    include: { tumorGroup: true },
  });
  return NextResponse.json(regimens);
}
