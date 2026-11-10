'use client';

import { FileDown } from 'lucide-react';
import { useHospital } from '@/lib/hospital-context';

interface Props {
  tumorGroupSlug: string;
  regimenSlug: string;
}

export default function PdfGenerator({ tumorGroupSlug, regimenSlug }: Props) {
  const { selected } = useHospital();
  const query = selected ? `?avdeling=${encodeURIComponent(selected.departmentId)}` : '';

  return (
    <a
      href={`/${tumorGroupSlug}/${regimenSlug}/pdf${query}`}
      className="w-full sm:w-auto flex items-center justify-center gap-2 border border-medical-blue text-medical-blue rounded-xl px-6 py-3 font-medium hover:bg-blue-50 transition-colors"
    >
      <FileDown size={18} aria-hidden />
      Last ned PDF
    </a>
  );
}
