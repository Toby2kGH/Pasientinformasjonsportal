'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SelectedHospital {
  regionId: string;
  regionName: string;
  hospitalId: string;
  hospitalName: string;
  hospitalShortName: string;
  hospitalLogoUrl?: string | null;
  departmentId: string;
  departmentName: string;
  phoneNumber?: string | null;
  emergencyPhone?: string | null;
  openingHours?: string | null;
  address?: string | null;
}

interface HospitalContextType {
  selected: SelectedHospital | null;
  setSelected: (h: SelectedHospital | null) => void;
}

const HospitalContext = createContext<HospitalContextType>({
  selected: null,
  setSelected: () => {},
});

const STORAGE_KEY = 'kreftinfo-hospital-preference';

interface RegionData {
  id: string;
  name: string;
  hospitals: {
    id: string;
    name: string;
    shortName: string;
    logoUrl: string | null;
    departments: {
      id: string;
      name: string;
      phoneNumber: string | null;
      emergencyPhone: string | null;
      openingHours: string | null;
      address: string | null;
    }[];
  }[];
}

function findSelection(regions: RegionData[], departmentId: string): SelectedHospital | null {
  for (const region of regions) {
    for (const hospital of region.hospitals) {
      const dept = hospital.departments.find((d) => d.id === departmentId);
      if (dept) {
        return {
          regionId: region.id,
          regionName: region.name,
          hospitalId: hospital.id,
          hospitalName: hospital.name,
          hospitalShortName: hospital.shortName,
          hospitalLogoUrl: hospital.logoUrl,
          departmentId: dept.id,
          departmentName: dept.name,
          phoneNumber: dept.phoneNumber,
          emergencyPhone: dept.emergencyPhone,
          openingHours: dept.openingHours,
          address: dept.address,
        };
      }
    }
  }
  return null;
}

export function HospitalProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelectedState] = useState<SelectedHospital | null>(null);

  useEffect(() => {
    let stored: SelectedHospital | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) stored = JSON.parse(raw);
    } catch {}
    if (!stored) return;
    setSelectedState(stored);

    // Nettleseren lagrer bare hvilket sykehus og hvilken avdeling som er valgt.
    // Telefonnumre, åpningstider og adresse hentes på nytt, så utskriften aldri
    // får gamle opplysninger. Finnes avdelingen ikke lenger, nullstilles valget.
    const storedSelection = stored;
    fetch('/api/hospitals')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((regions: RegionData[]) => {
        const fresh = findSelection(regions, storedSelection.departmentId);
        setSelected(fresh);
      })
      .catch(() => {
        // Nettverksfeil: behold lagret valg heller enn å fjerne kontaktinfo
      });
  }, []);

  function setSelected(h: SelectedHospital | null) {
    setSelectedState(h);
    try {
      if (h) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(h));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }

  return (
    <HospitalContext.Provider value={{ selected, setSelected }}>
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  return useContext(HospitalContext);
}
