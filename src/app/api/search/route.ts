import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { treatmentTypeLabel } from '@/lib/utils';

// Simple in-memory rate limiter: max 30 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > 30;
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const q = request.nextUrl.searchParams.get('q') ?? '';
  if (q.length < 2) return NextResponse.json([]);

  // Enforce max query length to prevent abuse
  if (q.length > 100) return NextResponse.json([]);

  const regimens = await prisma.regimen.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        // Array fields: use hasSome for partial-word matching across synonyms
        { genericNames: { hasSome: [q.toLowerCase(), q] } },
        { brandNames: { hasSome: [q.toLowerCase(), q] } },
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
