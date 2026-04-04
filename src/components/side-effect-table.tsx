import { SideEffectFreq } from '@prisma/client';
import { sideEffectFreqLabel, sideEffectFreqColor } from '@/lib/utils';

interface SideEffect {
  name: string;
  description: string;
  frequency: SideEffectFreq;
  severity?: string | null;
  management?: string | null;
  sortOrder: number;
}

interface SideEffectTableProps {
  sideEffects: SideEffect[];
}

const freqOrder: Record<SideEffectFreq, number> = {
  VERY_COMMON: 0,
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  VARIABLE: 4,
};

export default function SideEffectTable({ sideEffects }: SideEffectTableProps) {
  const sorted = [...sideEffects].sort(
    (a, b) => freqOrder[a.frequency] - freqOrder[b.frequency]
  );

  return (
    <div className="my-4">
      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        <span className="px-2 py-1 rounded bg-red-50 border border-red-200 text-red-700">Svært vanlig (&gt;10%)</span>
        <span className="px-2 py-1 rounded bg-orange-50 border border-orange-200 text-orange-700">Vanlig (1–10%)</span>
        <span className="px-2 py-1 rounded bg-yellow-50 border border-yellow-200 text-yellow-700">Mindre vanlig</span>
        <span className="px-2 py-1 rounded bg-gray-50 border border-gray-200 text-gray-600">Sjelden</span>
      </div>

      <div className="space-y-3">
        {sorted.map((se, i) => (
          <div key={i} className={`border rounded-lg p-3 ${sideEffectFreqColor(se.frequency)}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{se.name}</span>
                  {se.severity && (
                    <span className="text-xs bg-white/60 px-1.5 py-0.5 rounded border border-current/20">
                      {se.severity}
                    </span>
                  )}
                </div>
                <p className="text-sm mt-1 opacity-90">{se.description}</p>
                {se.management && (
                  <p className="text-xs mt-1.5 font-medium">
                    <span className="opacity-70">Håndtering: </span>{se.management}
                  </p>
                )}
              </div>
              <span className="text-xs whitespace-nowrap opacity-70 shrink-0">
                {sideEffectFreqLabel(se.frequency).split(' (')[0]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
