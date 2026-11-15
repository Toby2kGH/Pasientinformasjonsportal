# KreftInfo Norge — demo av nasjonal pasientinformasjonsportal

**Dette er en demo. Den skal ikke brukes med pasienter.** Kurtekstene og telefonnumrene er
eksempler og er verken faglig eller faktisk kontrollert. Alle sider og utskrifter er merket
som demo.

Demoen viser funksjonalitet en nasjonal løsning bør ha:

- **Én nasjonal tekst per kur**, med lokal kontaktinformasjon på utskriften
- **Godkjenning av to ulike personer** før en kur blir synlig (fireøyeprinsippet)
- **Bare godkjente kurer vises offentlig.** Utkast, kurer til gjennomgang og arkiverte kurer
  vises ikke og kan ikke skrives ut.
- **Varsler etter hvor mye det haster** (akutt, haster, snart, ved neste time). Hva pasienten
  skal gjøre, står i hvert varsel.
- **Endringslogg** for godkjenningssteg
- Søk på kurnavn, virkestoff og handelsnavn

## Innhold i demoen

- 15 eksempelkurer innen fire av ti kreftgrupper (GI, melanom, lunge, bryst). 12 er lagt inn
  som «demogodkjent» av to demobrukere. Tre ligger i godkjenningsflyten (FLOX som utkast,
  Nivolumab og Karboplatin + Pemetreksed + Pembrolizumab til gjennomgang), så flyten kan vises.
- 15 sykehus med 17 avdelinger. Numrene er ikke kontrollert. Der «akuttnummeret» var likt
  avdelingens nummer, vises det ikke som akuttnummer.

## Kom i gang

Forutsetninger: Node.js 18+ og Docker (eller en annen PostgreSQL 16).

```bash
cp .env.example .env          # sett ADMIN_PASSWORD
docker compose up -d db
npm install
npx prisma migrate deploy     # lager tabeller og fulltekstsøk
npx prisma db seed            # legger inn eksempeldata
npm run dev                   # åpne http://localhost:3000
```

Redaksjonsverktøyet ligger på `/admin` og krever brukernavn og passord fra `.env`
(`ADMIN_USER`, standard `admin`, og `ADMIN_PASSWORD`). Uten `ADMIN_PASSWORD` er det stengt.

## Teknisk

- Next.js 14 (App Router) + TypeScript, PostgreSQL + Prisma, Tailwind CSS
- `prisma/schema.prisma` — datamodell. `prisma/seed.ts` — eksempeldata.
- `src/lib/prisma.ts` — `PUBLISHED`-filteret som alle offentlige spørringer bruker
- `src/middleware.ts` og `src/lib/admin-auth.ts` — innlogging til redaksjonsverktøyet

## Det demoen ikke løser (kreves før bruk med pasienter)

- **Faglig eierskap og redaksjon:** hvem eier innholdet nasjonalt, hvem godkjenner, og hvordan
  oppdateres det når handlingsprogrammene endres
- **Faglig gjennomgang av alt innhold** av onkolog og kreftsykepleier
- **Kontrollerte kontaktopplysninger** fra hvert sykehus, og ekte logoer med tillatelse
- **Innlogging med personlig identitet (HelseID).** Demoen bruker ett felles passord, og
  godkjenners navn skrives inn som fritekst.
- Redigering av kurtekster i verktøyet (i dag bare godkjenningsflyt)
- Drift: connection pooling, sikkerhetskopi, overvåking, universell utforming testet
