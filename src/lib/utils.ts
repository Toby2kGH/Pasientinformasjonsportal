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
    // Merkelappen angir bare hvor mye det haster. Hva pasienten skal gjøre
    // (ringe avdelingen, akuttmottaket eller 113) står i teksten til hvert varsel.
    EMERGENCY: 'Akutt',
    URGENT: 'Haster',
    SOON: 'Snart',
    ROUTINE: 'Ved neste time',
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

/** Escape HTML special characters to prevent XSS */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Converts a small subset of Markdown to safe HTML.
 * Input is HTML-escaped first to prevent XSS, then only
 * our own controlled tags (**bold**, *italic*, newlines) are injected.
 */
export function formatMarkdown(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p class="mt-3">')
    .replace(/\n- /g, '</li><li>')
    .replace(/\n/g, '<br />');
}
