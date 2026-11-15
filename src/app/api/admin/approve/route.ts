import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeAuditLog } from '@/lib/audit';
import { checkAdminAuth } from '@/lib/admin-auth';

/** Samme person skal ikke kunne godkjenne to ganger ved å endre store/små bokstaver eller mellomrom. */
function samePerson(a: string, b: string): boolean {
  const norm = (x: string) => x.trim().replace(/\s+/g, ' ').toLocaleLowerCase('nb-NO');
  return norm(a) === norm(b);
}

/**
 * POST /api/admin/approve
 * Body: { regimenId: string; step: 'submit_review'|'first'|'second'|'archive'; approver: string }
 *
 * Two-approver (fireøye) workflow:
 *   DRAFT → submit_review → PENDING_REVIEW
 *   PENDING_REVIEW → first → approvedByFirst set
 *   PENDING_REVIEW + approvedByFirst → second → APPROVED
 *   APPROVED → archive → ARCHIVED
 *
 * Beskyttet av Basic Auth (middleware + sjekk her). Godkjenners navn er fortsatt
 * fritekst i demoen. Nasjonal drift krever identitet fra HelseID.
 */
export async function POST(request: NextRequest) {
  // Dobbel sikring: ikke stol bare på middleware
  if (checkAdminAuth(request.headers.get('authorization')) !== 'ok') {
    return NextResponse.json({ error: 'Ikke autorisert' }, { status: 401 });
  }

  let body: { regimenId: string; step: string; approver: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { regimenId, step, approver } = body;
  if (!regimenId || !step || !approver?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const regimen = await prisma.regimen.findUnique({ where: { id: regimenId } });
  if (!regimen) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  let update: Record<string, unknown> = {};

  switch (step) {
    case 'submit_review':
      if (regimen.publishStatus !== 'DRAFT')
        return NextResponse.json({ error: 'Only DRAFT kan sendes til gjennomgang' }, { status: 400 });
      update = { publishStatus: 'PENDING_REVIEW' };
      break;

    case 'first':
      if (regimen.publishStatus !== 'PENDING_REVIEW')
        return NextResponse.json({ error: 'Kuren er ikke til gjennomgang' }, { status: 400 });
      if (regimen.approvedByFirst)
        return NextResponse.json({ error: 'Første godkjenner er allerede satt' }, { status: 400 });
      update = { approvedByFirst: approver.trim() };
      break;

    case 'second':
      if (regimen.publishStatus !== 'PENDING_REVIEW')
        return NextResponse.json({ error: 'Kuren er ikke til gjennomgang' }, { status: 400 });
      if (!regimen.approvedByFirst)
        return NextResponse.json({ error: 'Første godkjenner mangler' }, { status: 400 });
      if (samePerson(regimen.approvedByFirst, approver))
        return NextResponse.json(
          { error: 'Fireøyeprinsipp: samme person kan ikke være begge godkjennere' },
          { status: 400 }
        );
      update = {
        publishStatus: 'APPROVED',
        approvedBySecond: approver.trim(),
        approvedAt: new Date(),
        publishedAt: new Date(),
        lastReviewedAt: new Date(),
        lastReviewedBy: `${regimen.approvedByFirst} + ${approver.trim()}`,
        isActive: true,
      };
      break;

    case 'archive':
      update = { publishStatus: 'ARCHIVED', isActive: false };
      break;

    default:
      return NextResponse.json({ error: 'Ukjent steg' }, { status: 400 });
  }

  const updated = await prisma.regimen.update({ where: { id: regimenId }, data: update });

  // Offentlige sider er bufret i inntil en time. Tøm bufferen så en arkivert
  // kur forsvinner, og en nylig godkjent kur vises, med en gang.
  revalidatePath('/', 'layout');

  writeAuditLog('Regimen', regimenId, `WORKFLOW_${step.toUpperCase()}`, approver.trim(), {
    from: regimen.publishStatus,
    to: updated.publishStatus,
  });

  return NextResponse.json({ ok: true, publishStatus: updated.publishStatus });
}
