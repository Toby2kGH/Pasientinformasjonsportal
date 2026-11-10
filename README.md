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

# 2. Installer avhengigheter og lag .env (sett ADMIN_PASSWORD)
npm install
cp .env.example .env

# 3. Generer Prisma client
npx prisma generate

# 4. Kjør migrasjonene som ligger i repoet
npx prisma migrate deploy

# 5. Seed databasen
npx prisma db seed

# 6. Start utviklingsserver
npm run dev

# 7. Åpne http://localhost:3000
```

## Nøkkelfunksjoner

- **15+ kurer** med komplett pasientinformasjon (Temozolomid, BRAF/MEK, FOLFOX, FOLFIRI, Kapecitabin, Pembrolizumab, Nivolumab+Ipilimumab, EC90, Docetaxel, FOLFIRINOX, Gemcitabin+nab-paklitaksel, CAPOX, Karboplatin+Pemetreksed+Pembrolizumab, FLOX, Nivolumab)
- **15 sykehus** med reell kontaktinformasjon fra alle helseregioner
- **Dynamisk sykehusvelger** — kaskaderende region → sykehus → avdeling
- **Utskriftsoptimalisert** — sykehuslogo i header, kontaktinfo i footer
- **PDF-nedlasting** — `/[tumorgruppe]/[kur]/pdf?avdeling=<id>` genererer A4-PDF med sykehusets navn, logo og kontaktinfo på hver side. Kontaktinfo hentes alltid fra databasen.
- **Publiseringsflyt med fireøyeprinsipp** — kun kurer med status `APPROVED` vises for publikum, i PDF og i søk. Seed-dataene er forhåndsgodkjent for demo.
- **Varselhierarki** — EMERGENCY/URGENT/SOON/ROUTINE med visuell differensiering
- **Favorittsystem** — lagres i localStorage
- **Søk** på kurnavnet, virkestoff og handelsnavn
- **Admin-prototype** med statistikk og audit-log. Beskyttet med HTTP Basic auth (`ADMIN_USER` / `ADMIN_PASSWORD` i `.env`); uten satt passord er admin deaktivert. Skal erstattes av HelseID i produksjon.

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
- Legg til full-text search via PostgreSQL `tsvector`
- Implementer full CRUD i admin-grensesnittet
- Konfigurer caching-strategi (ISR/CDN)
