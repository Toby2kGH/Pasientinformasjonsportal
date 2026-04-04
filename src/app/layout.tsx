import type { Metadata } from 'next';
import './globals.css';
import { HospitalProvider } from '@/lib/hospital-context';
import Navigation from '@/components/navigation';

export const metadata: Metadata = {
  title: 'KreftInfo Norge — Nasjonal pasientinformasjonsportal',
  description: 'Nasjonalt kvalitetssikret pasientinformasjon om kreftbehandling. Cellegiftkurer, immunterapi og målrettet behandling med lokalt sykehus-branding.',
  keywords: 'kreft, cellegift, immunterapi, pasientinformasjon, onkologi, Norge',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body className="min-h-screen bg-background">
        <HospitalProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="no-print bg-medical-blue text-white py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-serif font-semibold text-lg mb-2">KreftInfo Norge</h3>
                  <p className="text-blue-200 text-sm">
                    Nasjonal pasientinformasjonsportal for kreftbehandling. Innholdet er faglig
                    kvalitetssikret og oppdatert i henhold til nasjonale handlingsprogrammer.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-lg mb-2">Viktig informasjon</h3>
                  <p className="text-blue-200 text-sm">
                    Informasjonen på denne portalen er generell og erstatter ikke råd fra
                    din behandlende lege. Kontakt alltid ditt lokale sykehus ved spørsmål
                    om din behandling.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-lg mb-2">Ressurser</h3>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>Helsedirektoratet — nasjonale handlingsprogrammer</li>
                    <li>Kreftforeningen — pasientstøtte</li>
                    <li>Felleskatalogen — medikamentinformasjon</li>
                    <li>kreftlex.no — forklaring av faguttrykk</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-blue-700 mt-8 pt-4 text-center text-blue-300 text-xs">
                © {new Date().getFullYear()} KreftInfo Norge — Prototype. Ikke for klinisk bruk uten faglig godkjenning.
              </div>
            </div>
          </footer>
        </HospitalProvider>
      </body>
    </html>
  );
}
