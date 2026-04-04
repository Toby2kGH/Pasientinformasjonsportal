import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { treatmentTypeLabel, treatmentTypeBadgeColor } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminPage() {
  const regimens = await prisma.regimen.findMany({
    orderBy: [{ tumorGroup: { sortOrder: 'asc' } }, { name: 'asc' }],
    include: { tumorGroup: true },
  });

  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const stats = {
    totalRegimens: regimens.length,
    activeRegimens: regimens.filter((r) => r.isActive).length,
    tumorGroups: new Set(regimens.map((r) => r.tumorGroupId)).size,
    hospitals: await prisma.hospital.count(),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-1">Admin-prototype</h1>
        <p className="text-gray-500 text-sm">Oversikt over kurinnhold og endringslogg. Demonstrasjon.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Kurer totalt', value: stats.totalRegimens },
          { label: 'Aktive kurer', value: stats.activeRegimens },
          { label: 'Tumorgrupper', value: stats.tumorGroups },
          { label: 'Sykehus', value: stats.hospitals },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-medical-blue font-serif">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Regimen list */}
        <div>
          <h2 className="font-serif font-semibold text-xl mb-4">Kurer</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-600">Kur</th>
                  <th className="text-left p-3 font-medium text-gray-600">Type</th>
                  <th className="text-left p-3 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {regimens.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <Link
                        href={`/${r.tumorGroup.slug}/${r.slug}`}
                        className="font-medium text-medical-blue hover:underline"
                      >
                        {r.name}
                      </Link>
                      <p className="text-xs text-gray-400">{r.tumorGroup.name}</p>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${treatmentTypeBadgeColor(r.treatmentType)}`}>
                        {treatmentTypeLabel(r.treatmentType)}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {r.isActive ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit log */}
        <div>
          <h2 className="font-serif font-semibold text-xl mb-4">Endringslogg</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {auditLogs.length === 0 ? (
              <p className="p-6 text-sm text-gray-400 text-center">Ingen endringer logget ennå.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {auditLogs.map((log) => (
                  <li key={log.id} className="p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{log.action} {log.entityType}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(log.createdAt).toLocaleDateString('nb-NO')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{log.changedBy} — ID: {log.entityId}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            I produksjon vil alle endringer i kurinnhold logges automatisk her.
          </p>
        </div>
      </div>
    </div>
  );
}
