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
  Nivolumab og FOLFIRI til gjennomgang), så flyten kan vises.
- 15 sykehus med 17 avdelinger. Telefon, telefontid og adresse er hentet fra sykehusenes egne
  nettsider 15.11.2026, men via søkeutdrag, ikke ved å åpne sidene. Stikkprøv før bruk.
  Sykehuset Innlandet har ikke eget avdelingsnummer på nett; der vises sentralbordet. Bare St. Olav
  oppgir en egen linje for kreftpasienter utenom åpningstid; den vises som «Utenom åpningstid».

## Kom i gang

Forutsetninger: Node.js 18+ og Docker (eller en annen PostgreSQL 16).

```bash
cp .env.example .env
docker compose up -d db
npm install
npx prisma migrate deploy     # lager tabeller og fulltekstsøk
npx prisma db seed            # legger inn eksempeldata
npm run dev                   # åpne http://localhost:3000
```

Redaksjonsverktøyet ligger på `/admin` og er åpent uten passord. Legges demoen på en
adresse andre kan nå, sett `ADMIN_PASSWORD` (og eventuelt `ADMIN_USER`, standard `admin`)
i `.env`. Ellers kan hvem som helst godkjenne og arkivere kurer.

## Teknisk

- Next.js 14 (App Router) + TypeScript, PostgreSQL + Prisma, Tailwind CSS
- `prisma/schema.prisma` — datamodell. `prisma/seed.ts` — eksempeldata.
- `src/lib/prisma.ts` — `PUBLISHED`-filteret som alle offentlige spørringer bruker
- `src/middleware.ts` og `src/lib/admin-auth.ts` — valgfri innlogging til redaksjonsverktøyet

## Det demoen ikke løser (kreves før bruk med pasienter)

- **Faglig eierskap og redaksjon:** hvem eier innholdet nasjonalt, hvem godkjenner, og hvordan
  oppdateres det når handlingsprogrammene endres
- **Faglig gjennomgang av alt innhold** av onkolog og kreftsykepleier
- **Kontrollerte kontaktopplysninger** fra hvert sykehus, og ekte logoer med tillatelse
- **Innlogging med personlig identitet (HelseID).** Demoen har ingen eller ett felles passord,
  og godkjenners navn skrives inn som fritekst.
- Redigering av kurtekster i verktøyet (i dag bare godkjenningsflyt)
- Drift: connection pooling, sikkerhetskopi, overvåking, universell utforming testet
