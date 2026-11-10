import { createElement } from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { prisma, publicRegimenWhere } from '@/lib/prisma';
import { regimenDetailInclude } from '@/lib/regimen-query';
import PatientInfoPdf from '@/components/pdf-document';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { tumorgruppe: string; kur: string } },
) {
  const regimen = await prisma.regimen.findFirst({
    where: { slug: params.kur, ...publicRegimenWhere },
    include: regimenDetailInclude,
  });
  if (!regimen || regimen.tumorGroup.slug !== params.tumorgruppe) {
    return NextResponse.json({ error: 'Kur ikke funnet' }, { status: 404 });
  }

  // Contact details are always read from the database, never from the client.
  const departmentId = request.nextUrl.searchParams.get('avdeling');
  const department = departmentId
    ? await prisma.department.findFirst({
        where: { id: departmentId, isActive: true, hospital: { isActive: true } },
        include: { hospital: true },
      })
    : null;
  if (departmentId && !department) {
    return NextResponse.json({ error: 'Avdeling ikke funnet' }, { status: 404 });
  }

  const element = createElement(PatientInfoPdf, {
    regimen,
    hospital: department?.hospital ?? null,
    department,
  });
  // renderToBuffer's signature expects a <Document> element; PatientInfoPdf renders one.
  const pdf = await renderToBuffer(element as unknown as Parameters<typeof renderToBuffer>[0]);

  const filename = `${regimen.slug}${department ? `-${department.hospital.shortName}` : ''}.pdf`
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-');

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
