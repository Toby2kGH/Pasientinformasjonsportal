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

export function HospitalProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelectedState] = useState<SelectedHospital | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSelectedState(JSON.parse(stored));
    } catch {}
  }, []);

  function setSelected(h: SelectedHospital | null) {
    setSelectedState(h);
    if (h) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(h));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
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
