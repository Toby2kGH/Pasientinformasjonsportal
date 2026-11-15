# KreftInfo Norge — Nasjonal Pasientinformasjonsportal

Nasjonal, nettbasert pasientinformasjonsportal for kreftbehandling i Norge. Komplett database
over cellegiftkurer og medikamentelle behandlingsregimer med standardisert pasientinformasjon
tilpasset lokalt sykehus-branding.

## Kom i gang

### Forutsetninger
- Node.js 18+
- Docker (for PostgreSQL)

### Oppsett

```bash
# 1. Start PostgreSQL
docker-compose up -d db

# 2. Installer avhengigheter
npm install

# 3. Generer Prisma client
npx prisma generate

# 4. Kjør migrasjoner
npx prisma migrate deploy

# 5. Seed databasen
npx prisma db seed

# 6. Start utviklingsserver
npm run dev

# 7. Åpne http://localhost:3000
```

## Nøkkelfunksjoner

- **15+ kurer** med komplett pasientinformasjon (Temozolomid, BRAF/MEK, FOLFOX, FOLFIRI, Kapecitabin, Pembrolizumab, Nivolumab+Ipilimumab, EC90, Docetaxel, FOLFIRINOX, Gemcitabin+nab-paklitaksel, CAPOX, Karboplatin+Pemetreksed+Pembrolizumab, FLOX, Nivolumab)
- **16 sykehus** med reell kontaktinformasjon fra alle helseregioner
- **Dynamisk sykehusvelger** — kaskaderende region → sykehus → avdeling
- **Utskriftsoptimalisert** — sykehuslogo i header, kontaktinfo i footer
- **Varselhierarki** — EMERGENCY/URGENT/SOON/ROUTINE med visuell differensiering
- **Favorittsystem** — lagres i localStorage
- **Søk** på kurnavnet, virkestoff og handelsnavn
- **Admin-prototype** med statistikk og audit-log

## Filstruktur

```
prisma/
  schema.prisma     — Databaseskjema
  seed.ts           — Seed-data med alle sykehus og kurer
public/
  logos/            — SVG-plassholdere for sykehuslogoer
src/
  app/              — Next.js App Router pages
  components/       — React-komponenter
  lib/              — Prisma-klient, utils, hospital-context
```

## Teknisk stack

- Next.js 14 (App Router) + TypeScript
- PostgreSQL + Prisma ORM
- Tailwind CSS
- Lucide React (ikoner)

## For produksjon

- Erstatt SVG-placeholder-logoer med ekte sykehuslogoer i `public/logos/`
- Aktiver HelseID/Helsenorge-autentisering
- Implementer full CRUD i admin-grensesnittet
- Konfigurer caching-strategi (ISR/CDN)
