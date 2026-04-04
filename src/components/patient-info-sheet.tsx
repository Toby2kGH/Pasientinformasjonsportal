'use client';

import { SectionType, TreatmentType, AdministrationRoute } from '@prisma/client';
import { treatmentTypeLabel, treatmentTypeBadgeColor, administrationRouteLabel, formatMarkdown } from '@/lib/utils';
import AlertBox from './alert-box';
import SideEffectTable from './side-effect-table';
import ContactFooter from './contact-footer';
import { useHospital } from '@/lib/hospital-context';
import { Printer, Calendar, User, BookOpen } from 'lucide-react';

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

  const sortedSections = [...regimen.patientInfoSections].sort(
    (a, b) => sectionOrder.indexOf(a.sectionType) - sectionOrder.indexOf(b.sectionType)
  );

  function handlePrint() {
    window.print();
  }

  return (
    <article className="max-w-3xl mx-auto">
      {/* Print hospital header */}
      {selected && (
        <div className="print-hospital-header hidden print:flex items-center gap-4 mb-6 pb-4 border-b-2 border-medical-blue">
          <div>
            <p className="font-serif font-bold text-xl text-medical-blue">{selected.hospitalName}</p>
            <p className="text-gray-600">{selected.departmentName}</p>
          </div>
        </div>
      )}

      {/* Article header */}
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

        <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
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

        <button
          onClick={handlePrint}
          className="no-print mt-4 flex items-center gap-2 text-sm text-medical-blue border border-medical-blue rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors"
        >
          <Printer size={15} />
          Skriv ut pasientark
        </button>
      </header>

      {/* Alert box — always first and prominent */}
      {regimen.alertInstructions.length > 0 && (
        <AlertBox alerts={regimen.alertInstructions} />
      )}

      {/* Premedication */}
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

      {/* Main content sections */}
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

      {/* Side effects */}
      {regimen.sideEffects.length > 0 && (
        <section className="my-6">
          <h2 className="font-serif font-semibold text-xl text-gray-900 mb-3 pb-1 border-b border-gray-200">
            Mulige bivirkninger
          </h2>
          <SideEffectTable sideEffects={regimen.sideEffects} />
        </section>
      )}

      {/* Source reference */}
      {regimen.sourceReference && (
        <div className="my-6 text-xs text-gray-400 flex items-start gap-1.5 border-t pt-4">
          <BookOpen size={12} className="mt-0.5 shrink-0" />
          <span><strong>Kilde:</strong> {regimen.sourceReference}</span>
        </div>
      )}

      {/* Dynamic contact footer */}
      <ContactFooter />
    </article>
  );
}
