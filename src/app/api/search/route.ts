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
  const ip =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const q = (request.nextUrl.searchParams.get('q') ?? '').trim();
  if (q.length < 2) return NextResponse.json([]);
  if (q.length > 100) return NextResponse.json([]);

  // Expand medical synonyms before searching
  const expanded = expandSynonyms(q);

  // Try PostgreSQL full-text search first; fall back to ILIKE if tsvector not available
  let regimens;
  try {
    // Build tsquery: each word becomes a prefix search term joined with OR
    const tsquery = expanded
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => `${w}:*`)
      .join(' | ');

    regimens = await prisma.$queryRaw<
      Array<{ id: string; name: string; slug: string; tumorGroupId: string }>
    >`
      SELECT r.id, r.name, r.slug, r."tumorGroupId"
      FROM "Regimen" r
      WHERE r."isActive" = true
        AND r."publishStatus" = 'APPROVED'
        AND r."searchVector" @@ to_tsquery('simple', ${tsquery})
      ORDER BY ts_rank(r."searchVector", to_tsquery('simple', ${tsquery})) DESC
      LIMIT 10
    `;
  } catch {
    // tsvector column not yet available — fall back to ILIKE
    regimens = await prisma.regimen.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: expanded, mode: 'insensitive' } },
          { genericNames: { hasSome: expanded.split(/\s+/) } },
          { brandNames: { hasSome: expanded.split(/\s+/) } },
          { synonyms: { hasSome: expanded.split(/\s+/) } },
        ],
      },
      take: 10,
      select: { id: true, name: true, slug: true, tumorGroupId: true },
    });
  }

  if (!regimens.length) return NextResponse.json([]);

  // Fetch tumor groups for matched regimens
  const ids = regimens.map((r) => r.id);
  const full = await prisma.regimen.findMany({
    where: { id: { in: ids } },
    include: { tumorGroup: true },
    take: 10,
  });

  // Preserve relevance order from full-text ranking
  const ordered = ids
    .map((id) => full.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  return NextResponse.json(
    ordered.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      tumorGroupSlug: r.tumorGroup.slug,
      tumorGroupName: r.tumorGroup.name,
      treatmentType: treatmentTypeLabel(r.treatmentType),
    }))
  );
}

/**
 * Expand common Norwegian medical abbreviations and synonyms before searching.
 * This runs server-side so the synonym list is not exposed to clients.
 */
function expandSynonyms(q: string): string {
  const lower = q.toLowerCase().trim();
  const synonymMap: Record<string, string> = {
    // Fluorouracil synonyms
    '5-fu': 'fluorouracil',
    '5fu': 'fluorouracil',
    'fluorouracil': 'fluorouracil 5-fluorouracil',
    // Oxaliplatin
    'oxaliplatin': 'oksaliplatin oxaliplatin',
    'oksaliplatin': 'oksaliplatin oxaliplatin eloxatin',
    'eloxatin': 'oksaliplatin eloxatin',
    // Irinotecan
    'irinotecan': 'irinotekan campto',
    'irinotekan': 'irinotekan campto',
    'campto': 'irinotekan campto',
    // Capecitabine
    'capecitabin': 'kapecitabin xeloda',
    'kapecitabin': 'kapecitabin xeloda',
    'xeloda': 'kapecitabin xeloda',
    // Temozolomide
    'temozolomide': 'temozolomid temodal',
    'temodal': 'temozolomid temodal',
    // Pembrolizumab
    'keytruda': 'pembrolizumab keytruda',
    'pd-1': 'pembrolizumab nivolumab',
    // Nivolumab
    'opdivo': 'nivolumab opdivo',
    // Ipilimumab
    'yervoy': 'ipilimumab yervoy',
    'ctla-4': 'ipilimumab yervoy',
    // Docetaxel
    'taxotere': 'docetaksel taxotere docetaxel',
    'docetaxel': 'docetaksel taxotere',
    // Carboplatin
    'carboplatin': 'karboplatin carboplatin',
    'karboplatin': 'karboplatin carboplatin',
    // Pemetrexed
    'alimta': 'pemetreksed alimta',
    'pemetrexed': 'pemetreksed alimta',
    // Gemcitabine
    'gemzar': 'gemcitabin gemzar',
    'gemcitabine': 'gemcitabin gemzar',
    // nab-paclitaxel
    'abraxane': 'paklitaksel abraxane',
    'nab-paklitaksel': 'paklitaksel abraxane',
    // Epirubicin
    'farmorubicin': 'epirubicin farmorubicin',
    // Cyclophosphamide
    'sendoxan': 'cyklofosfamid sendoxan',
    // Regimen abbreviations
    'folfox': 'folfox oksaliplatin fluorouracil',
    'folfiri': 'folfiri irinotekan fluorouracil',
    'folfirinox': 'folfirinox oksaliplatin irinotekan',
    'capox': 'capox xelox kapecitabin oksaliplatin',
    'xelox': 'capox xelox kapecitabin oksaliplatin',
    'flox': 'flox oksaliplatin fluorouracil',
    'ec': 'epirubicin cyklofosfamid ec90',
    'braf': 'braf mek dabrafenib trametinib',
    'mek': 'braf mek dabrafenib trametinib',
  };

  return synonymMap[lower] ?? q;
}
