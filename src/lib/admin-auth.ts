/**
 * Valgfri innlogging for redaksjonsverktøyet i demoen (HTTP Basic Auth).
 *
 * Uten ADMIN_PASSWORD er verktøyet åpent for alle (lokal demo).
 * Med ADMIN_PASSWORD kreves brukernavn og passord. Sett det hvis demoen
 * legges på en adresse andre kan nå. Dette er en demoløsning. Nasjonal drift krever HelseID med personlig
 * identitet, slik at godkjenner hentes fra innloggingen og ikke fra et tekstfelt.
 */
export type AdminAuthResult = 'ok' | 'unauthorized';

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function checkAdminAuth(authorizationHeader: string | null): AdminAuthResult {
  const user = process.env.ADMIN_USER ?? 'admin';
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return 'ok';
  if (!authorizationHeader?.startsWith('Basic ')) return 'unauthorized';

  let decoded: string;
  try {
    decoded = atob(authorizationHeader.slice(6));
  } catch {
    return 'unauthorized';
  }
  const sep = decoded.indexOf(':');
  if (sep < 0) return 'unauthorized';
  const ok = safeEqual(decoded.slice(0, sep), user) && safeEqual(decoded.slice(sep + 1), password);
  return ok ? 'ok' : 'unauthorized';
}
