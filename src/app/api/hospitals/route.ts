import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
