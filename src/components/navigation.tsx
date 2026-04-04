'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useHospital } from '@/lib/hospital-context';
import HospitalSelector from './hospital-selector';
import { Menu, X, Search } from 'lucide-react';

export default function Navigation() {
  const { selected } = useHospital();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <>
      <nav className="no-print bg-medical-blue text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-serif font-semibold text-xl hover:opacity-90 transition-opacity">
              <span className="text-2xl">🏥</span>
              <span className="hidden sm:inline">KreftInfo Norge</span>
              <span className="sm:hidden">KreftInfo</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-blue-200 transition-colors">Forside</Link>
              <Link href="/#tumorgrupper" className="hover:text-blue-200 transition-colors">Tumorgrupper</Link>
              <Link href="/innstillinger" className="hover:text-blue-200 transition-colors">Innstillinger</Link>
              <Link href="/admin" className="hover:text-blue-200 transition-colors">Admin</Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Hospital selector button */}
              <button
                onClick={() => setSelectorOpen(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-3 py-1.5 text-sm"
              >
                {selected ? (
                  <>
                    <span className="hidden sm:inline text-blue-200">Sykehus:</span>
                    <span className="font-medium">{selected.hospitalShortName}</span>
                  </>
                ) : (
                  <span className="text-blue-200">Velg sykehus ▾</span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-1"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Meny"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden border-t border-blue-700 py-3 space-y-2 text-sm">
              <Link href="/" className="block px-2 py-1.5 hover:bg-white/10 rounded" onClick={() => setMenuOpen(false)}>Forside</Link>
              <Link href="/#tumorgrupper" className="block px-2 py-1.5 hover:bg-white/10 rounded" onClick={() => setMenuOpen(false)}>Tumorgrupper</Link>
              <Link href="/innstillinger" className="block px-2 py-1.5 hover:bg-white/10 rounded" onClick={() => setMenuOpen(false)}>Innstillinger</Link>
              <Link href="/admin" className="block px-2 py-1.5 hover:bg-white/10 rounded" onClick={() => setMenuOpen(false)}>Admin</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hospital selector modal */}
      {selectorOpen && (
        <HospitalSelector
          position="modal"
          onClose={() => setSelectorOpen(false)}
          showSetFavorite
        />
      )}
    </>
  );
}
