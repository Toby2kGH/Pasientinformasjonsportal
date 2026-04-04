'use client';

import { useHospital } from '@/lib/hospital-context';
import HospitalSelector from '@/components/hospital-selector';
import { Trash2, CheckCircle } from 'lucide-react';

export default function InnstillingerPage() {
  const { selected, setSelected } = useHospital();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Innstillinger</h1>
      <p className="text-gray-500 mb-8">
        Velg ditt favoritt-sykehus og -avdeling. Valget huskes i nettleseren din og brukes automatisk
        på alle pasientark og ved utskrift.
      </p>

      {selected && (
        <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="text-green-600" size={18} />
                <p className="font-semibold text-green-800">Favoritt-sykehus satt</p>
              </div>
              <p className="text-green-700 font-medium">{selected.hospitalName}</p>
              <p className="text-green-600 text-sm">{selected.departmentName}</p>
              {selected.address && <p className="text-green-600 text-xs mt-1">{selected.address}</p>}
              {selected.phoneNumber && <p className="text-green-600 text-xs">📞 Poliklinikk: {selected.phoneNumber}</p>}
              {selected.emergencyPhone && <p className="text-green-600 text-xs">🚨 Akuttmottak: {selected.emergencyPhone}</p>}
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-red-400 hover:text-red-600 transition-colors"
              title="Fjern favoritt"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="font-serif font-semibold text-lg text-medical-blue mb-4">
          {selected ? 'Bytt sykehus' : 'Velg ditt sykehus'}
        </h2>
        <HospitalSelector position="sidebar" showSetFavorite />
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        <p className="font-medium mb-1">ℹ️ Om lagring</p>
        <p>
          Ditt valgte sykehus lagres lokalt i nettleseren din (localStorage). Ingen persondata
          sendes til server. Valget slettes hvis du tømmer nettleserens lagring.
        </p>
      </div>
    </div>
  );
}
