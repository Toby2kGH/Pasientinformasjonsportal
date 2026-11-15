import Link from 'next/link';
import { TreatmentType, AdministrationRoute } from '@prisma/client';
import { treatmentTypeLabel, treatmentTypeBadgeColor, administrationRouteLabel } from '@/lib/utils';
import { Pill, Syringe, Tablet } from 'lucide-react';

interface RegimenCardProps {
  name: string;
  slug: string;
  tumorGroupSlug: string;
  genericNames: string[];
  treatmentType: TreatmentType;
  administrationRoute: AdministrationRoute;
  cycleDescription?: string | null;
  lastReviewedAt?: Date | string | null;
}

const routeIcon = (route: AdministrationRoute) => {
  if (route === 'ORAL') return <Tablet size={14} />;
  if (route === 'INTRAVENOUS') return <Syringe size={14} />;
  return <Pill size={14} />;
};

export default function RegimenCard({
  name, slug, tumorGroupSlug, genericNames, treatmentType, administrationRoute, cycleDescription, lastReviewedAt
}: RegimenCardProps) {
  return (
    <Link
      href={`/${tumorGroupSlug}/${slug}`}
      className="group block bg-white border border-gray-200 rounded-xl p-4 hover:border-medical-blue hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-serif font-semibold text-gray-900 group-hover:text-medical-blue transition-colors">
          {name}
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${treatmentTypeBadgeColor(treatmentType)}`}>
          {treatmentTypeLabel(treatmentType)}
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-2">{genericNames.join(', ')}</p>

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          {routeIcon(administrationRoute)}
          {administrationRouteLabel(administrationRoute)}
        </span>
        {cycleDescription && (
          <span className="text-gray-400 truncate">· {cycleDescription}</span>
        )}
      </div>

      {lastReviewedAt && (
        <p className="text-xs text-gray-400 mt-2">
          Godkjent: {new Date(lastReviewedAt).toLocaleDateString('nb-NO', { year: 'numeric', month: 'long' })}
        </p>
      )}
    </Link>
  );
}
