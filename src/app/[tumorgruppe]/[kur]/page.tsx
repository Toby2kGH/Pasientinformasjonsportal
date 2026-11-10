import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma, publicRegimenWhere } from '@/lib/prisma';
import { regimenDetailInclude } from '@/lib/regimen-query';
import PatientInfoSheet from '@/components/patient-info-sheet';
import HospitalSelector from '@/components/hospital-selector';

export const revalidate = 3600;

interface Props {
  params: { tumorgruppe: string; kur: string };
}

export async function generateMetadata({ params }: Props) {
  const regimen = await prisma.regimen.findFirst({
    where: { slug: params.kur, ...publicRegimenWhere },
    include: { tumorGroup: true },
  });
  if (!regimen) return { title: 'Ikke funnet' };
  return {
    title: `${regimen.name} — KreftInfo Norge`,
    description: `Pasientinformasjon om behandling med ${regimen.name} ved ${regimen.tumorGroup.name}.`,
  };
}

export default async function RegimenPage({ params }: Props) {
  const regimen = await prisma.regimen.findFirst({
    where: { slug: params.kur, ...publicRegimenWhere },
    include: regimenDetailInclude,
  });

  if (!regimen || regimen.tumorGroup.slug !== params.tumorgruppe) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 no-print">
        <Link href="/" className="hover:text-medical-blue">Forside</Link>
        <span>›</span>
        <Link href={`/${regimen.tumorGroup.slug}`} className="hover:text-medical-blue">
          {regimen.tumorGroup.name}
        </Link>
        <span>›</span>
        <span className="text-gray-900">{regimen.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <PatientInfoSheet regimen={regimen} />
        </div>

        {/* Sidebar */}
        <aside className="no-print lg:w-72 shrink-0 space-y-4">
          <HospitalSelector position="sidebar" showSetFavorite />

          {/* Version info */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500 space-y-1">
            <p className="font-medium text-gray-700">Dokumentinfo</p>
            <p>Versjon {regimen.version}</p>
            {regimen.lastReviewedAt && (
              <p>Sist gjennomgått: {new Date(regimen.lastReviewedAt).toLocaleDateString('nb-NO')}</p>
            )}
            {regimen.lastReviewedBy && <p>Av: {regimen.lastReviewedBy}</p>}
            {regimen.sourceReference && (
              <p className="mt-2 text-gray-400">{regimen.sourceReference}</p>
            )}
          </div>

          {/* Other regimens in same group */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-serif font-semibold text-sm text-gray-700 mb-3">
              Andre kurer — {regimen.tumorGroup.name}
            </h3>
            <OtherRegimens tumorGroupId={regimen.tumorGroupId} currentSlug={regimen.slug} tumorGroupSlug={regimen.tumorGroup.slug} />
          </div>
        </aside>
      </div>
    </div>
  );
}

async function OtherRegimens({ tumorGroupId, currentSlug, tumorGroupSlug }: { tumorGroupId: string; currentSlug: string; tumorGroupSlug: string }) {
  const others = await prisma.regimen.findMany({
    where: { tumorGroupId, ...publicRegimenWhere, NOT: { slug: currentSlug } },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    take: 6,
    select: { name: true, slug: true },
  });
  if (others.length === 0) return <p className="text-xs text-gray-400">Ingen andre kurer.</p>;
  return (
    <ul className="space-y-1">
      {others.map((r) => (
        <li key={r.slug}>
          <Link href={`/${tumorGroupSlug}/${r.slug}`} className="text-sm text-medical-blue hover:underline">
            {r.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
