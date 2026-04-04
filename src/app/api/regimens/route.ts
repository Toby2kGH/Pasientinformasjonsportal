import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const regimens = await prisma.regimen.findMany({
    where: { isActive: true },
    orderBy: [{ tumorGroupId: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    include: { tumorGroup: true },
  });
  return NextResponse.json(regimens);
}
