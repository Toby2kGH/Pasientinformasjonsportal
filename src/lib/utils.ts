import { TreatmentType, AdministrationRoute, SideEffectFreq, AlertUrgency } from '@prisma/client';

export function treatmentTypeLabel(type: TreatmentType): string {
  const labels: Record<TreatmentType, string> = {
    CHEMOTHERAPY: 'Cellegift',
    IMMUNOTHERAPY: 'Immunterapi',
    TARGETED_THERAPY: 'Målrettet behandling',
    HORMONE_THERAPY: 'Hormonbehandling',
    COMBINATION: 'Kombinasjonsbehandling',
  };
  return labels[type];
}

export function treatmentTypeBadgeColor(type: TreatmentType): string {
  const colors: Record<TreatmentType, string> = {
    CHEMOTHERAPY: 'bg-blue-100 text-blue-800',
    IMMUNOTHERAPY: 'bg-green-100 text-green-800',
    TARGETED_THERAPY: 'bg-purple-100 text-purple-800',
    HORMONE_THERAPY: 'bg-orange-100 text-orange-800',
    COMBINATION: 'bg-teal-100 text-teal-800',
  };
  return colors[type];
}

export function administrationRouteLabel(route: AdministrationRoute): string {
  const labels: Record<AdministrationRoute, string> = {
    INTRAVENOUS: 'Intravenøs (iv)',
    ORAL: 'Tabletter/kapsler',
    SUBCUTANEOUS: 'Subkutan injeksjon',
    COMBINATION_IV_ORAL: 'IV + tabletter',
  };
  return labels[route];
}

export function sideEffectFreqLabel(freq: SideEffectFreq): string {
  const labels: Record<SideEffectFreq, string> = {
    VERY_COMMON: 'Svært vanlig (>10%)',
    COMMON: 'Vanlig (1–10%)',
    UNCOMMON: 'Mindre vanlig (0,1–1%)',
    RARE: 'Sjelden (<0,1%)',
    VARIABLE: 'Varierer',
  };
  return labels[freq];
}

export function sideEffectFreqColor(freq: SideEffectFreq): string {
  const colors: Record<SideEffectFreq, string> = {
    VERY_COMMON: 'bg-red-50 border-red-200 text-red-800',
    COMMON: 'bg-orange-50 border-orange-200 text-orange-800',
    UNCOMMON: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    RARE: 'bg-gray-50 border-gray-200 text-gray-600',
    VARIABLE: 'bg-blue-50 border-blue-200 text-blue-800',
  };
  return colors[freq];
}

export function alertUrgencyLabel(urgency: AlertUrgency): string {
  const labels: Record<AlertUrgency, string> = {
    EMERGENCY: 'RING 113',
    URGENT: 'Kontakt akuttmottak',
    SOON: 'Kontakt poliklinikk',
    ROUTINE: 'Ta opp på neste time',
  };
  return labels[urgency];
}

export function alertUrgencyColor(urgency: AlertUrgency): string {
  const colors: Record<AlertUrgency, string> = {
    EMERGENCY: 'bg-red-600 text-white border-red-700',
    URGENT: 'bg-red-100 text-red-900 border-red-300',
    SOON: 'bg-orange-100 text-orange-900 border-orange-300',
    ROUTINE: 'bg-yellow-50 text-yellow-900 border-yellow-200',
  };
  return colors[urgency];
}

export function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />');
}
