import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { treatmentTypeLabel } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';
  if (q.length < 2) return NextResponse.json([]);

  const regimens = await prisma.regimen.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { genericNames: { has: q.toLowerCase() } },
        { brandNames: { has: q } },
      ],
    },
    take: 10,
    include: { tumorGroup: true },
  });

  return NextResponse.json(
    regimens.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      tumorGroupSlug: r.tumorGroup.slug,
      tumorGroupName: r.tumorGroup.name,
      treatmentType: treatmentTypeLabel(r.treatmentType),
    }))
  );
}
