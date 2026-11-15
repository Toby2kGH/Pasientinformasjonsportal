import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import RegimenCard from '@/components/regimen-card';
import { Activity, Sun, Wind, Heart, Flower2, Droplets, ScanFace, Droplet, Brain, Bone } from 'lucide-react';

export const revalidate = 3600;

const iconMap: Record<string, React.ReactNode> = {
  activity: <Activity size={24} />,
  sun: <Sun size={24} />,
  wind: <Wind size={24} />,
  heart: <Heart size={24} />,
  flower2: <Flower2 size={24} />,
  droplets: <Droplets size={24} />,
  'scan-face': <ScanFace size={24} />,
  droplet: <Droplet size={24} />,
  brain: <Brain size={24} />,
  bone: <Bone size={24} />,
};

interface Props {
  params: { tumorgruppe: string };
  searchParams: { type?: string };
}

export default async function TumorGroupPage({ params, searchParams }: Props) {
  const tumorGroup = await prisma.tumorGroup.findUnique({
    where: { slug: params.tumorgruppe },
    include: {
      regimens: {
        where: {
          isActive: true,
          publishStatus: 'APPROVED',
          ...(searchParams.type ? { treatmentType: searchParams.type as any } : {}),
        },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      },
    },
  });

  if (!tumorGroup) notFound();

  const allTypes = await prisma.regimen.findMany({
    where: { tumorGroupId: tumorGroup.id, isActive: true, publishStatus: 'APPROVED' },
    select: { treatmentType: true },
    distinct: ['treatmentType'],
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-medical-blue">Forside</Link>
        <span>›</span>
        <span className="text-gray-900">{tumorGroup.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="text-medical-blue bg-blue-100 rounded-xl p-3">
          {tumorGroup.iconName && iconMap[tumorGroup.iconName]
            ? iconMap[tumorGroup.iconName]
            : <Activity size={24} />}
        </div>
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">{tumorGroup.name}</h1>
          {tumorGroup.description && (
            <p className="text-gray-500 mt-1">{tumorGroup.description}</p>
          )}
          <p className="text-sm text-medical-blue mt-1">{tumorGroup.regimens.length} behandlingsregimer</p>
        </div>
      </div>

      {/* Filter by type */}
      {allTypes.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href={`/${params.tumorgruppe}`}
            className={`text-sm px-3 py-1 rounded-full border transition-colors ${!searchParams.type ? 'bg-medical-blue text-white border-medical-blue' : 'bg-white text-gray-600 border-gray-300 hover:border-medical-blue'}`}
          >
            Alle
          </Link>
          {allTypes.map((t) => (
            <Link
              key={t.treatmentType}
              href={`/${params.tumorgruppe}?type=${t.treatmentType}`}
              className={`text-sm px-3 py-1 rounded-full border transition-colors ${searchParams.type === t.treatmentType ? 'bg-medical-blue text-white border-medical-blue' : 'bg-white text-gray-600 border-gray-300 hover:border-medical-blue'}`}
            >
              {t.treatmentType === 'CHEMOTHERAPY' ? 'Cellegift'
                : t.treatmentType === 'IMMUNOTHERAPY' ? 'Immunterapi'
                : t.treatmentType === 'TARGETED_THERAPY' ? 'Målrettet'
                : t.treatmentType === 'HORMONE_THERAPY' ? 'Hormon'
                : 'Kombinasjon'}
            </Link>
          ))}
        </div>
      )}

      {/* Regimen grid */}
      {tumorGroup.regimens.length === 0 ? (
        <p className="text-gray-500 py-8 text-center">Ingen kurer funnet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tumorGroup.regimens.map((r) => (
            <RegimenCard
              key={r.id}
              name={r.name}
              slug={r.slug}
              tumorGroupSlug={tumorGroup.slug}
              genericNames={r.genericNames}
              treatmentType={r.treatmentType}
              administrationRoute={r.administrationRoute}
              cycleDescription={r.cycleDescription}
              lastReviewedAt={r.lastReviewedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
