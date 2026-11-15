import Link from 'next/link';
import { prisma, PUBLISHED } from '@/lib/prisma';
import TumorGroupCard from '@/components/tumor-group-card';
import SearchBar from '@/components/search-bar';

export const revalidate = 3600;

export default async function HomePage() {
  const tumorGroups = await prisma.tumorGroup.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { regimens: { where: PUBLISHED } } } },
  });

  const totalRegimens = tumorGroups.reduce((sum, tg) => sum + tg._count.regimens, 0);

  return (
    <div>
      {/* Hero */}
      <section className="bg-medical-blue text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            KreftInfo Norge
          </h1>
          <p className="text-blue-200 text-lg sm:text-xl mb-2">
            Nasjonal pasientinformasjonsportal for kreftbehandling
          </p>
          <p className="text-blue-300 text-sm mb-8 max-w-2xl mx-auto">
            Demo med {totalRegimens} eksempelkurer: én nasjonal tekst per kur, tilpasset
            ditt lokale sykehus ved utskrift.
          </p>

          {/* Search */}
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-b border-gray-100 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-medical-blue flex items-center justify-center text-lg font-bold font-serif">1</div>
              <p className="font-medium">Velg ditt sykehus</p>
              <p className="text-gray-500">Klikk på &ldquo;Velg sykehus&rdquo; i navigasjonen og velg din avdeling.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-medical-blue flex items-center justify-center text-lg font-bold font-serif">2</div>
              <p className="font-medium">Finn riktig kur</p>
              <p className="text-gray-500">Søk eller bla i tumorgrupper for å finne pasientens behandling.</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-medical-blue flex items-center justify-center text-lg font-bold font-serif">3</div>
              <p className="font-medium">Skriv ut</p>
              <p className="text-gray-500">Pasientarket skrives ut med ditt sykehus' kontaktinformasjon i bunnen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tumor groups */}
      <section id="tumorgrupper" className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Tumorgrupper</h2>
          <p className="text-gray-500 mb-6">Velg krefttype for å se tilgjengelige behandlingsregimer.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tumorGroups.map((tg) => (
              <TumorGroupCard
                key={tg.id}
                name={tg.name}
                slug={tg.slug}
                description={tg.description}
                iconName={tg.iconName}
                regimenCount={tg._count.regimens}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quality assurance banner */}
      <section className="bg-amber-50 border-y border-amber-200 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start gap-4">
          <div className="text-3xl">⚠️</div>
          <div>
            <h3 className="font-serif font-semibold text-amber-900 mb-1">Dette er en demo</h3>
            <p className="text-amber-800 text-sm">
              Demoen viser funksjonaliteten en nasjonal løsning bør ha: felles kurinformasjon,
              godkjenning av to fagpersoner før publisering, og utskrift med lokal kontaktinformasjon.
              Kurtekstene og telefonnumrene er eksempler og er ikke faglig eller faktisk kontrollert.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
