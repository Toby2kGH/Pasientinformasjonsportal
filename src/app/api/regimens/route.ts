import { NextResponse } from 'next/server';
import { prisma, PUBLISHED } from '@/lib/prisma';

export async function GET() {
  const regimens = await prisma.regimen.findMany({
    where: PUBLISHED,
    orderBy: [{ tumorGroupId: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    include: { tumorGroup: true },
  });
  return NextResponse.json(regimens);
}
