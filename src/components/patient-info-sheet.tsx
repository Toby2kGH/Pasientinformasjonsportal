'use client';

import { useState } from 'react';
import { SectionType, TreatmentType, AdministrationRoute } from '@prisma/client';
import { treatmentTypeLabel, treatmentTypeBadgeColor, administrationRouteLabel, formatMarkdown } from '@/lib/utils';
import AlertBox from './alert-box';
import SideEffectTable from './side-effect-table';
import ContactFooter from './contact-footer';
import { useHospital } from '@/lib/hospital-context';
import { Printer, Calendar, User, BookOpen, AlertTriangle } from 'lucide-react';

interface PatientInfoSection {
  sectionType: SectionType;
  title: string;
  content: string;
  sortOrder: number;
}

interface SideEffect {
  name: string;
  description: string;
  frequency: any;
  severity?: string | null;
  management?: string | null;
  sortOrder: number;
}

interface AlertInstruction {
  urgency: any;
  instruction: string;
  action: string;
  sortOrder: number;
}

interface Premedication {
  medication: string;
  timing: string;
  isRequired: boolean;
  notes?: string | null;
  sortOrder: number;
}

interface Regimen {
  name: string;
  genericNames: string[];
  brandNames: string[];
  treatmentType: TreatmentType;
  administrationRoute: AdministrationRoute;
  cycleDescription?: string | null;
  numberOfCycles?: string | null;
  sourceReference?: string | null;
  lastReviewedAt?: Date | string | null;
  lastReviewedBy?: string | null;
  version: number;
  patientInfoSections: PatientInfoSection[];
  sideEffects: SideEffect[];
  alertInstructions: AlertInstruction[];
  premedication: Premedication[];
  tumorGroup: { name: string; slug: string };
}

interface PatientInfoSheetProps {
  regimen: Regimen;
}

const sectionOrder: SectionType[] = [
  'INTRODUCTION', 'INDICATION', 'PREPARATION', 'ADMINISTRATION',
  'NAUSEA_MANAGEMENT', 'DIETARY_ADVICE', 'FERTILITY',
  'GENERAL_ADVICE', 'IMPORTANT_INFO', 'SIDE_EFFECTS',
];

export default function PatientInfoSheet({ regimen }: PatientInfoSheetProps) {
  const { selected } = useHospital();
  const [showPrintWarning, setShowPrintWarning] = useState(false);

  const sortedSections = [...regimen.patientInfoSections].sort(
    (a, b) => sectionOrder.indexOf(a.sectionType) - sectionOrder.indexOf(b.sectionType)
  );

  const printDate = new Date().toLocaleDateString('nb-NO', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  function handlePrint() {
    if (!selected) {
      setShowPrintWarning(true);
      return;
    }
    setShowPrintWarning(false);
    window.print();
  }

  function printAnyway() {
    setShowPrintWarning(false);
    window.print();
  }

  return (
    <article className="max-w-3xl mx-auto">

      {/* ── PRINT HEADER (only visible when printing) ─────────── */}
      <div className="hidden print:block mb-6 pb-4 border-b-2 border-medical-blue">
        {selected ? (
          <div className="flex items-start justify-between">
            <div>
              <p className="font-serif font-bold text-xl text-medical-blue">{selected.hospitalName}</p>
              <p className="text-gray-600 text-sm">{selected.departmentName}</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>Skrevet ut: {printDate}</p>
              {regimen.lastReviewedAt && (
                <p>Faglig gjennomgått: {new Date(regimen.lastReviewedAt).toLocaleDateString('nb-NO', { year: 'numeric', month: 'long' })}</p>
              )}
              <p>Versjon {regimen.version}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <p className="font-serif font-bold text-xl text-gray-500 italic">
              [Sykehus ikke valgt — se kreftinfo.no]
            </p>
            <div className="text-right text-xs text-gray-500">
              <p>Skrevet ut: {printDate}</p>
              <p>Versjon {regimen.version}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── PRINT BUTTON — prominent, above the fold ──────────── */}
      <div className="no-print mb-6">
        {/* Warning: no hospital selected */}
        {showPrintWarning && (
          <div className="mb-3 flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl p-4">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-amber-800">Ingen avdeling valgt</p>
              <p className="text-sm text-amber-700 mt-0.5">
                Pasientarket vil bli skrevet ut <strong>uten kontaktinformasjon</strong> i bunnen.
                Velg sykehus og avdeling i sidepanelet til høyre for å inkludere telefonnummer
                og åpningstider.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={printAnyway}
                  className="text-xs border border-amber-400 text-amber-700 rounded px-3 py-1.5 hover:bg-amber-100 transition-colors"
                >
                  Skriv ut likevel (uten kontaktinfo)
                </button>
                <button
                  onClick={() => setShowPrintWarning(false)}
                  className="text-xs text-amber-600 hover:underline px-2"
                >
                  Avbryt
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-medical-blue text-white rounded-xl px-6 py-3 font-medium hover:bg-blue-800 transition-colors shadow-sm"
        >
          <Printer size={18} />
          Skriv ut pasientark
          {selected && (
            <span className="text-blue-200 text-sm font-normal">
              — {selected.hospitalShortName}
            </span>
          )}
        </button>
        {!selected && (
          <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
            <AlertTriangle size={11} />
            Velg sykehus i sidepanelet for å få kontaktinfo på utskriften
          </p>
        )}
      </div>

      {/* ── ARTICLE HEADER ────────────────────────────────────── */}
      <header className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-2 mb-2 text-sm text-gray-500">
          <a href={`/${regimen.tumorGroup.slug}`} className="hover:text-medical-blue">
            {regimen.tumorGroup.name}
          </a>
          <span>›</span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Behandling med {regimen.name}
        </h1>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${treatmentTypeBadgeColor(regimen.treatmentType)}`}>
            {treatmentTypeLabel(regimen.treatmentType)}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
            {administrationRouteLabel(regimen.administrationRoute)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
          {regimen.genericNames.length > 0 && (
            <div>
              <span className="font-medium">Virkestoff: </span>
              {regimen.genericNames.join(', ')}
            </div>
          )}
          {regimen.brandNames.length > 0 && (
            <div>
              <span className="font-medium">Handelsnavn: </span>
              {regimen.brandNames.join(', ')}
            </div>
          )}
          {regimen.cycleDescription && (
            <div>
              <span className="font-medium">Sykluslengde: </span>
              {regimen.cycleDescription}
            </div>
          )}
          {regimen.numberOfCycles && (
            <div>
              <span className="font-medium">Antall kurer: </span>
              {regimen.numberOfCycles}
            </div>
          )}
        </div>

        {/* Version info — visible on screen */}
        <div className="no-print flex items-center gap-4 mt-4 text-xs text-gray-400">
          {regimen.lastReviewedAt && (
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              Sist gjennomgått: {new Date(regimen.lastReviewedAt).toLocaleDateString('nb-NO', { year: 'numeric', month: 'long' })}
            </span>
          )}
          {regimen.lastReviewedBy && (
            <span className="flex items-center gap-1">
              <User size={12} />
              {regimen.lastReviewedBy}
            </span>
          )}
          <span>v{regimen.version}</span>
        </div>
      </header>

      {/* ── ALERT BOX — always prominent ──────────────────────── */}
      {regimen.alertInstructions.length > 0 && (
        <AlertBox alerts={regimen.alertInstructions} />
      )}

      {/* ── PREMEDICATION ─────────────────────────────────────── */}
      {regimen.premedication.length > 0 && (
        <section className="my-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h2 className="font-serif font-semibold text-medical-blue mb-3">Medisiner du får i forkant</h2>
          <div className="space-y-2">
            {[...regimen.premedication].sort((a, b) => a.sortOrder - b.sortOrder).map((pm, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className={`mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs ${pm.isRequired ? 'bg-medical-blue text-white' : 'bg-gray-300 text-gray-600'}`}>
                  {pm.isRequired ? '✓' : '?'}
                </span>
                <div>
                  <span className="font-medium">{pm.medication}</span>
                  <span className="text-gray-500"> — {pm.timing}</span>
                  {pm.notes && <p className="text-xs text-gray-500 mt-0.5">{pm.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── MAIN CONTENT SECTIONS ─────────────────────────────── */}
      {sortedSections.map((section, i) => (
        <section key={i} className="my-6">
          <h2 className="font-serif font-semibold text-xl text-gray-900 mb-3 pb-1 border-b border-gray-200">
            {section.title}
          </h2>
          <div
            className="prose-medical text-gray-700 text-sm leading-relaxed space-y-2"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(section.content) }}
          />
        </section>
      ))}

      {/* ── SIDE EFFECTS ──────────────────────────────────────── */}
      {regimen.sideEffects.length > 0 && (
        <section className="my-6">
          <h2 className="font-serif font-semibold text-xl text-gray-900 mb-3 pb-1 border-b border-gray-200">
            Mulige bivirkninger
          </h2>
          <SideEffectTable sideEffects={regimen.sideEffects} />
        </section>
      )}

      {/* ── SOURCE REFERENCE ──────────────────────────────────── */}
      {regimen.sourceReference && (
        <div className="my-6 text-xs text-gray-400 flex items-start gap-1.5 border-t pt-4">
          <BookOpen size={12} className="mt-0.5 shrink-0" />
          <span><strong>Kilde:</strong> {regimen.sourceReference}</span>
        </div>
      )}

      {/* ── DYNAMIC CONTACT FOOTER ────────────────────────────── */}
      <ContactFooter />
    </article>
  );
}
