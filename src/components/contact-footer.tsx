'use client';

import { useHospital } from '@/lib/hospital-context';
import { Phone, Clock, MapPin, AlertTriangle } from 'lucide-react';

export default function ContactFooter() {
  const { selected } = useHospital();

  if (!selected) return null;

  return (
    <div className="print-contact-footer mt-8 border-t-2 border-medical-blue pt-6 pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-serif font-semibold text-medical-blue text-base">
            Viktige telefonnumre — {selected.hospitalName}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {selected.emergencyPhone && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-2.5">
              <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-xs font-semibold text-red-700">Akuttmottak</p>
                <p className="text-sm font-bold text-red-800">{selected.emergencyPhone}</p>
                <p className="text-xs text-red-600">Alltid åpent</p>
              </div>
            </div>
          )}
          {selected.phoneNumber && (
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-2.5">
              <Phone className="text-blue-600 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-xs font-semibold text-blue-700">{selected.departmentName}</p>
                <p className="text-sm font-bold text-blue-800">{selected.phoneNumber}</p>
                {selected.openingHours && (
                  <p className="text-xs text-blue-600">{selected.openingHours}</p>
                )}
              </div>
            </div>
          )}
          {selected.openingHours && (
            <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2.5">
              <Clock className="text-gray-500 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-xs font-semibold text-gray-600">Åpningstider</p>
                <p className="text-sm text-gray-700">{selected.openingHours}</p>
              </div>
            </div>
          )}
          {selected.address && (
            <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2.5">
              <MapPin className="text-gray-500 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-xs font-semibold text-gray-600">Adresse</p>
                <p className="text-sm text-gray-700">{selected.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
