import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { treatmentTypeLabel, treatmentTypeBadgeColor } from '@/lib/utils';
import ApproveButton from './approve-button';

export const revalidate = 0;

const statusLabel: Record<string, string> = {
  DRAFT:          'Utkast',
  PENDING_REVIEW: 'Til gjennomgang',
  APPROVED:       'Publisert',
  ARCHIVED:       'Arkivert',
};

const statusColor: Record<string, string> = {
  DRAFT:          'bg-gray-100 text-gray-600',
  PENDING_REVIEW: 'bg-amber-100 text-amber-800',
  APPROVED:       'bg-green-100 text-green-700',
  ARCHIVED:       'bg-red-100 text-red-700',
};

export default async function AdminPage() {
  const regimens = await prisma.regimen.findMany({
    orderBy: [{ tumorGroup: { sortOrder: 'asc' } }, { name: 'asc' }],
    include: { tumorGroup: true },
  });

  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const byStatus = {
    DRAFT:          regimens.filter((r) => r.publishStatus === 'DRAFT').length,
    PENDING_REVIEW: regimens.filter((r) => r.publishStatus === 'PENDING_REVIEW').length,
    APPROVED:       regimens.filter((r) => r.publishStatus === 'APPROVED').length,
    ARCHIVED:       regimens.filter((r) => r.publishStatus === 'ARCHIVED').length,
  };

  const hospitalCount = await prisma.hospital.count();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-1">Redaksjonsverktøy</h1>
        <p className="text-gray-500 text-sm">
          Godkjenningsflyt for kurinnhold. Bare godkjente kurer vises offentlig. Demo: felles passord og navn i fritekst. Nasjonal drift krever HelseID.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {[
          { label: 'Utkast',          value: byStatus.DRAFT,          color: 'text-gray-700'  },
          { label: 'Til gjennomgang', value: byStatus.PENDING_REVIEW, color: 'text-amber-700' },
          { label: 'Publisert',       value: byStatus.APPROVED,       color: 'text-green-700' },
          { label: 'Arkivert',        value: byStatus.ARCHIVED,       color: 'text-red-700'   },
          { label: 'Sykehus',         value: hospitalCount,           color: 'text-medical-blue' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className={`text-3xl font-bold font-serif ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending review banner */}
      {byStatus.PENDING_REVIEW > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
          <span className="text-amber-600 text-xl">⏳</span>
          <div>
            <p className="font-semibold text-amber-800">
              {byStatus.PENDING_REVIEW} kur{byStatus.PENDING_REVIEW !== 1 ? 'er' : ''} venter på faglig godkjenning
            </p>
            <p className="text-sm text-amber-700 mt-0.5">
              Fireøyeprinsipp: to ulike fagpersoner må godkjenne før publisering.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Regimen table */}
        <div className="lg:col-span-2">
          <h2 className="font-serif font-semibold text-xl mb-4">Kurer</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-600">Kur</th>
                  <th className="text-left p-3 font-medium text-gray-600 hidden sm:table-cell">Type</th>
                  <th className="text-left p-3 font-medium text-gray-600">Status</th>
                  <th className="text-left p-3 font-medium text-gray-600">Handling</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {regimens.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      {r.publishStatus === 'APPROVED' ? (
                        <Link
                          href={`/${r.tumorGroup.slug}/${r.slug}`}
                          className="font-medium text-medical-blue hover:underline"
                        >
                          {r.name}
                        </Link>
                      ) : (
                        <span className="font-medium text-gray-700">{r.name}</span>
                      )}
                      <p className="text-xs text-gray-400">{r.tumorGroup.name}</p>
                      {r.publishStatus === 'PENDING_REVIEW' && r.approvedByFirst && (
                        <p className="text-xs text-amber-600 mt-0.5">
                          1. godkjenner: {r.approvedByFirst}
                        </p>
                      )}
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${treatmentTypeBadgeColor(r.treatmentType)}`}>
                        {treatmentTypeLabel(r.treatmentType)}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[r.publishStatus]}`}>
                        {statusLabel[r.publishStatus]}
                      </span>
                    </td>
                    <td className="p-3">
                      <ApproveButton
                        regimenId={r.id}
                        publishStatus={r.publishStatus}
                        approvedByFirst={r.approvedByFirst}
                      />
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
              <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {auditLogs.map((log) => (
                  <li key={log.id} className="p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-xs">{log.action}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(log.createdAt).toLocaleDateString('nb-NO')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{log.changedBy}</p>
                    <p className="text-xs text-gray-400 truncate">{log.entityType}: {log.entityId.slice(0, 12)}…</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
