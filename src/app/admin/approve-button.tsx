'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  regimenId: string;
  publishStatus: string;
  approvedByFirst: string | null;
}

export default function ApproveButton({ regimenId, publishStatus, approvedByFirst }: Props) {
  const [approver, setApprover] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const router = useRouter();

  async function act(step: string) {
    const name = approver.trim();
    if (!name) { setError('Skriv inn navn'); return; }
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regimenId, step, approver: name }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? 'Feil'); return; }
    router.refresh();
  }

  if (publishStatus === 'ARCHIVED') {
    return <span className="text-xs text-gray-400">Arkivert</span>;
  }

  if (publishStatus === 'APPROVED') {
    return (
      <button
        onClick={() => act('archive')}
        className="text-xs text-red-500 hover:underline"
      >
        Arkiver
      </button>
    );
  }

  const nextStep = publishStatus === 'DRAFT'
    ? 'submit_review'
    : approvedByFirst ? 'second' : 'first';

  const btnLabel = publishStatus === 'DRAFT'
    ? 'Send til gjennomgang'
    : approvedByFirst
    ? 'Godkjenn (2. godkjenner)'
    : 'Godkjenn (1. godkjenner)';

  return (
    <div className="space-y-1">
      <input
        type="text"
        value={approver}
        onChange={(e) => setApprover(e.target.value)}
        placeholder="Ditt navn"
        aria-label="Ditt navn for godkjenning"
        className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-medical-blue"
      />
      <button
        onClick={() => act(nextStep)}
        disabled={loading}
        className="w-full text-xs bg-medical-blue text-white rounded px-2 py-1 hover:bg-blue-800 disabled:opacity-50"
      >
        {loading ? '…' : btnLabel}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
