'use client';

import { useState, useEffect, useId } from 'react';
import { useHospital, SelectedHospital } from '@/lib/hospital-context';
import { X, Star, CheckCircle } from 'lucide-react';

interface Region {
  id: string;
  name: string;
  hospitals: Hospital[];
}
interface Hospital {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string | null;
  departments: Department[];
}
interface Department {
  id: string;
  name: string;
  phoneNumber: string | null;
  emergencyPhone: string | null;
  openingHours: string | null;
  address: string | null;
}
interface HospitalSelectorProps {
  position: 'sidebar' | 'header' | 'modal';
  onClose?: () => void;
  showSetFavorite?: boolean;
  onSelectionChange?: (selection: SelectedHospital) => void;
}

export default function HospitalSelector({
  position, onClose, showSetFavorite = false, onSelectionChange,
}: HospitalSelectorProps) {
  const { selected, setSelected } = useHospital();
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Stable IDs for WCAG label association
  const regionId   = useId();
  const hospitalId = useId();
  const deptId     = useId();
  const statusId   = useId();

  useEffect(() => {
    fetch('/api/hospitals')
      .then((r) => r.json())
      .then((data: Region[]) => {
        setRegions(data);
        setLoading(false);
        if (selected) {
          setSelectedRegionId(selected.regionId);
          setSelectedHospitalId(selected.hospitalId);
          setSelectedDeptId(selected.departmentId);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const currentRegion   = regions.find((r) => r.id === selectedRegionId);
  const currentHospital = currentRegion?.hospitals.find((h) => h.id === selectedHospitalId);
  const currentDept     = currentHospital?.departments.find((d) => d.id === selectedDeptId);

  function handleConfirm() {
    if (!currentRegion || !currentHospital || !currentDept) return;
    const sel: SelectedHospital = {
      regionId: currentRegion.id,
      regionName: currentRegion.name,
      hospitalId: currentHospital.id,
      hospitalName: currentHospital.name,
      hospitalShortName: currentHospital.shortName,
      hospitalLogoUrl: currentHospital.logoUrl,
      departmentId: currentDept.id,
      departmentName: currentDept.name,
      phoneNumber: currentDept.phoneNumber,
      emergencyPhone: currentDept.emergencyPhone,
      openingHours: currentDept.openingHours,
      address: currentDept.address,
    };
    setSelected(sel);
    onSelectionChange?.(sel);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose?.();
    }, 800);
  }

  if (loading) {
    const msg = <p role="status" aria-live="polite" className="p-4 text-sm text-gray-500">Laster sykehus...</p>;
    return position === 'modal' ? (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8">{msg}</div>
      </div>
    ) : msg;
  }

  const content = (
    <div className="space-y-4">
      {/* Region */}
      <div>
        <label htmlFor={regionId} className="block text-sm font-medium text-gray-700 mb-1">
          Helseregion
        </label>
        <select
          id={regionId}
          value={selectedRegionId}
          onChange={(e) => { setSelectedRegionId(e.target.value); setSelectedHospitalId(''); setSelectedDeptId(''); }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-medical-blue focus:border-transparent"
          aria-required="true"
        >
          <option value="">Velg region…</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Hospital */}
      {selectedRegionId && (
        <div>
          <label htmlFor={hospitalId} className="block text-sm font-medium text-gray-700 mb-1">
            Sykehus
          </label>
          <select
            id={hospitalId}
            value={selectedHospitalId}
            onChange={(e) => { setSelectedHospitalId(e.target.value); setSelectedDeptId(''); }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-medical-blue"
            aria-required="true"
          >
            <option value="">Velg sykehus…</option>
            {currentRegion?.hospitals.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Department */}
      {selectedHospitalId && (
        <div>
          <label htmlFor={deptId} className="block text-sm font-medium text-gray-700 mb-1">
            Avdeling
          </label>
          <select
            id={deptId}
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-medical-blue"
            aria-required="true"
          >
            <option value="">Velg avdeling…</option>
            {currentHospital?.departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Preview of selected department */}
      {currentDept && (
        <div
          id={statusId}
          role="status"
          aria-live="polite"
          className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm"
        >
          <p className="font-medium text-medical-blue">{currentHospital?.name}</p>
          <p className="text-gray-600">{currentDept.name}</p>
          {currentDept.address    && <p className="text-gray-500 text-xs mt-1">{currentDept.address}</p>}
          {currentDept.phoneNumber && <p className="text-gray-600 mt-1">📞 {currentDept.phoneNumber}</p>}
        </div>
      )}

      <button
        onClick={handleConfirm}
        disabled={!selectedDeptId}
        aria-disabled={!selectedDeptId}
        aria-describedby={currentDept ? statusId : undefined}
        className="w-full flex items-center justify-center gap-2 bg-medical-blue text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-medical-blue"
      >
        {saved ? (
          <><CheckCircle size={16} /> Lagret!</>
        ) : showSetFavorite ? (
          <><Star size={16} /> Sett som mitt sykehus</>
        ) : (
          'Velg'
        )}
      </button>
    </div>
  );

  if (position === 'modal') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hospital-selector-title"
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 id="hospital-selector-title" className="font-serif font-semibold text-lg text-medical-blue">
              Velg ditt sykehus
            </h2>
            <button
              onClick={onClose}
              aria-label="Lukk dialogen"
              className="text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-medical-blue rounded"
            >
              <X size={20} />
            </button>
          </div>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="font-serif font-semibold text-medical-blue mb-3 text-sm" id="sidebar-hospital-title">
        🏥 Velg sykehus
      </h3>
      {selected && (
        <div className="mb-3 p-2 bg-blue-50 rounded-lg text-xs" aria-label="Valgt sykehus">
          <p className="font-medium">{selected.hospitalName}</p>
          <p className="text-gray-500">{selected.departmentName}</p>
        </div>
      )}
      <div role="group" aria-labelledby="sidebar-hospital-title">
        {content}
      </div>
    </div>
  );
}
