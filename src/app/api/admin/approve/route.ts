import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/audit';

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
 * NOTE: In production the `approver` identity must come from HelseID session,
 * not from the request body. This is a prototype demo.
 */
export async function POST(request: NextRequest) {
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
      if (regimen.approvedByFirst === approver.trim())
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
  // Publishing or withdrawing must take effect immediately on all cached public pages.
  revalidatePath('/', 'layout');

  writeAuditLog('Regimen', regimenId, `WORKFLOW_${step.toUpperCase()}`, approver.trim(), {
    from: regimen.publishStatus,
    to: updated.publishStatus,
  });

  return NextResponse.json({ ok: true, publishStatus: updated.publishStatus });
}
