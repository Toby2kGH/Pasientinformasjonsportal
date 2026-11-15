import { PrismaClient, TreatmentType, AdministrationRoute, SectionType, SideEffectFreq, AlertUrgency, PublishStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ============================================================
  // HELSEREGIONER
  // ============================================================
  const sorOst = await prisma.healthRegion.upsert({
    where: { name: 'Helse Sør-Øst RHF' },
    update: {},
    create: { name: 'Helse Sør-Øst RHF', sortOrder: 1 },
  });
  const vest = await prisma.healthRegion.upsert({
    where: { name: 'Helse Vest RHF' },
    update: {},
    create: { name: 'Helse Vest RHF', sortOrder: 2 },
  });
  const midtNorge = await prisma.healthRegion.upsert({
    where: { name: 'Helse Midt-Norge RHF' },
    update: {},
    create: { name: 'Helse Midt-Norge RHF', sortOrder: 3 },
  });
  const nord = await prisma.healthRegion.upsert({
    where: { name: 'Helse Nord RHF' },
    update: {},
    create: { name: 'Helse Nord RHF', sortOrder: 4 },
  });

  console.log('Regions created');

  // ============================================================
  // SYKEHUS OG AVDELINGER
  // ============================================================
  const hospitalsData = [
    {
      name: 'Oslo universitetssykehus', shortName: 'OUS',
      logoUrl: '/logos/ous.svg', websiteUrl: 'https://www.oslo-universitetssykehus.no',
      regionId: sorOst.id, sortOrder: 1,
      departments: [
        { name: 'Kreftklinikken – Radiumhospitalet', phoneNumber: '22 93 40 00', emergencyPhone: '22 11 73 50', openingHours: 'man-fre kl. 08:00-15:30', address: 'Ullernchausseen 70, 0379 Oslo' },
        { name: 'Kreftklinikken – Ullevål', phoneNumber: '22 11 80 00', emergencyPhone: '22 11 73 50', openingHours: 'man-fre kl. 08:00-15:30', address: 'Kirkeveien 166, 0450 Oslo' },
      ],
    },
    {
      name: 'Akershus universitetssykehus', shortName: 'Ahus',
      logoUrl: '/logos/ahus.svg', websiteUrl: 'https://www.ahus.no',
      regionId: sorOst.id, sortOrder: 2,
      departments: [
        { name: 'Onkologisk avdeling', phoneNumber: '67 96 43 25', emergencyPhone: '67 96 11 11', openingHours: 'man-fre kl. 08:30-11:00 og 12:00-15:00', address: 'Sykehusveien 25, 1478 Lørenskog' },
      ],
    },
    {
      name: 'Sykehuset Østfold', shortName: 'SØ',
      logoUrl: '/logos/so.svg', websiteUrl: 'https://www.sykehuset-ostfold.no',
      regionId: sorOst.id, sortOrder: 3,
      departments: [
        { name: 'Kreftavdelingen', phoneNumber: '69 86 00 00', emergencyPhone: '69 86 00 00', openingHours: 'man-fre kl. 08:00-15:30', address: 'Kalnesveien 300, 1714 Grålum' },
      ],
    },
    {
      name: 'Sykehuset i Vestfold', shortName: 'SiV',
      logoUrl: '/logos/siv.svg', websiteUrl: 'https://www.siv.no',
      regionId: sorOst.id, sortOrder: 4,
      departments: [
        { name: 'Onkologisk seksjon', phoneNumber: '33 34 20 00', emergencyPhone: '33 34 20 00', openingHours: 'man-fre kl. 08:00-15:30', address: 'Halfdan Wilhelmsens allé 17, 3116 Tønsberg' },
      ],
    },
    {
      name: 'Sykehuset Innlandet', shortName: 'SI',
      logoUrl: '/logos/si.svg', websiteUrl: 'https://www.sykehuset-innlandet.no',
      regionId: sorOst.id, sortOrder: 5,
      departments: [
        { name: 'Kreftenhet Hamar', phoneNumber: '62 53 50 00', emergencyPhone: '62 53 50 00', openingHours: 'man-fre kl. 08:00-15:30', address: 'Skolegata 32, 2318 Hamar' },
        { name: 'Kreftenhet Gjøvik', phoneNumber: '61 15 20 00', emergencyPhone: '61 15 20 00', openingHours: 'man-fre kl. 08:00-15:30', address: 'Kyrre Grepps gate 11, 2819 Gjøvik' },
      ],
    },
    {
      name: 'Sørlandet sykehus', shortName: 'SSHF',
      logoUrl: '/logos/sshf.svg', websiteUrl: 'https://www.sshf.no',
      regionId: sorOst.id, sortOrder: 6,
      departments: [
        { name: 'Onkologisk seksjon, Kristiansand', phoneNumber: '38 07 30 00', emergencyPhone: '38 07 30 00', openingHours: 'man-fre kl. 08:00-15:30', address: 'Eg, 4604 Kristiansand' },
      ],
    },
    {
      name: 'Vestre Viken', shortName: 'VV',
      logoUrl: '/logos/vv.svg', websiteUrl: 'https://www.vestreviken.no',
      regionId: sorOst.id, sortOrder: 7,
      departments: [
        { name: 'Onkologisk poliklinikk, Drammen', phoneNumber: '32 80 30 00', emergencyPhone: '32 80 30 00', openingHours: 'man-fre kl. 08:00-15:30', address: 'Dronninggata 28, 3004 Drammen' },
      ],
    },
    {
      name: 'Sykehuset Telemark', shortName: 'STHF',
      logoUrl: '/logos/sthf.svg', websiteUrl: 'https://www.sthf.no',
      regionId: sorOst.id, sortOrder: 8,
      departments: [
        { name: 'Kreftavdelingen', phoneNumber: '35 00 30 00', emergencyPhone: '35 00 30 00', openingHours: 'man-fre kl. 08:00-15:30', address: 'Ulefossveien 55, 3710 Skien' },
      ],
    },
    {
      name: 'Haukeland universitetssjukehus', shortName: 'HUS',
      logoUrl: '/logos/hus.svg', websiteUrl: 'https://www.helse-bergen.no',
      regionId: vest.id, sortOrder: 9,
      departments: [
        { name: 'Avdeling for kreftbehandling', phoneNumber: '55 97 20 10', emergencyPhone: '55 97 50 00', openingHours: 'man-fre kl. 08:00-15:30', address: 'Jonas Lies vei 65, 5021 Bergen' },
      ],
    },
    {
      name: 'Stavanger universitetssjukehus', shortName: 'SUS',
      logoUrl: '/logos/sus.svg', websiteUrl: 'https://www.helse-stavanger.no',
      regionId: vest.id, sortOrder: 10,
      departments: [
        { name: 'Avdeling for blod- og kreftsykdommer', phoneNumber: '51 51 80 00', emergencyPhone: '51 51 80 00', openingHours: 'man-fre kl. 08:00-15:30', address: 'Gerd-Ragna Bloch Thorsens gate 8, 4011 Stavanger' },
      ],
    },
    {
      name: 'Haugesund sjukehus (Helse Fonna)', shortName: 'Helse Fonna',
      logoUrl: '/logos/fonna.svg', websiteUrl: 'https://www.helse-fonna.no',
      regionId: vest.id, sortOrder: 11,
      departments: [
        { name: 'Kreftavdelingen', phoneNumber: '52 73 20 00', emergencyPhone: '52 73 20 00', openingHours: 'man-fre kl. 08:00-15:30', address: 'Karmsundgata 120, 5528 Haugesund' },
      ],
    },
    {
      name: 'St. Olavs hospital', shortName: 'St. Olav',
      logoUrl: '/logos/stolav.svg', websiteUrl: 'https://www.stolav.no',
      regionId: midtNorge.id, sortOrder: 12,
      departments: [
        { name: 'Kreftklinikken', phoneNumber: '72 57 30 00', emergencyPhone: '72 57 60 00', openingHours: 'man-fre kl. 08:00-15:30', address: 'Prinsesse Kristinas gate 1, 7030 Trondheim' },
      ],
    },
    {
      name: 'Ålesund sjukehus (Helse Møre og Romsdal)', shortName: 'Ålesund',
      logoUrl: '/logos/alesund.svg', websiteUrl: 'https://www.helse-mr.no',
      regionId: midtNorge.id, sortOrder: 13,
      departments: [
        { name: 'Onkologisk poliklinikk', phoneNumber: '70 10 50 00', emergencyPhone: '70 10 50 00', openingHours: 'man-fre kl. 08:00-15:30', address: 'Åsehaugen 5, 6017 Ålesund' },
      ],
    },
    {
      name: 'Universitetssykehuset Nord-Norge', shortName: 'UNN',
      logoUrl: '/logos/unn.svg', websiteUrl: 'https://www.unn.no',
      regionId: nord.id, sortOrder: 14,
      departments: [
        { name: 'Kreftavdelingen', phoneNumber: '77 62 67 65', emergencyPhone: '77 62 60 00', openingHours: 'man-fre kl. 08:00-15:30', address: 'Hansine Hansens vei 18, 9019 Tromsø' },
      ],
    },
    {
      name: 'Nordlandssykehuset', shortName: 'NLSH',
      logoUrl: '/logos/nlsh.svg', websiteUrl: 'https://www.nordlandssykehuset.no',
      regionId: nord.id, sortOrder: 15,
      departments: [
        { name: 'Avdeling for kreft og lindrende behandling', phoneNumber: '75 53 40 00', emergencyPhone: '75 53 40 00', openingHours: 'man-fre kl. 08:00-15:30', address: 'Prinsens gate 164, 8005 Bodø' },
      ],
    },
  ];

  for (const h of hospitalsData) {
    const { departments, ...hospitalFields } = h;
    const hospital = await prisma.hospital.upsert({
      where: { id: hospitalFields.shortName },
      update: {},
      create: { ...hospitalFields, id: hospitalFields.shortName },
    });
    for (const dept of departments) {
      // Der «akuttnummeret» er det samme som avdelingens nummer, er det ikke et eget
      // akuttnummer (trolig sentralbord). Vis det da ikke som «Akuttmottak».
      const emergencyPhone = dept.emergencyPhone !== dept.phoneNumber ? dept.emergencyPhone : null;
      // Kan kjøres flere ganger uten å lage doble avdelinger
      const existingDept = await prisma.department.findFirst({ where: { hospitalId: hospital.id, name: dept.name } });
      const deptData = { ...dept, emergencyPhone, hospitalId: hospital.id };
      if (existingDept) {
        await prisma.department.update({ where: { id: existingDept.id }, data: deptData });
      } else {
        await prisma.department.create({ data: deptData });
      }
    }
  }

  console.log('Hospitals and departments created');

  // ============================================================
  // TUMORGRUPPER
  // ============================================================
  const tumorGroupsData = [
    { name: 'Gastrointestinal kreft', slug: 'gi', description: 'Kreft i mage-tarmsystemet inkl. tykktarm, endetarm, bukspyttkjertel, magesekk, lever og galleveier', iconName: 'activity', sortOrder: 1 },
    { name: 'Melanom og hudkreft', slug: 'melanom', description: 'Føflekkreft (malignt melanom) og andre hudkreftformer', iconName: 'sun', sortOrder: 2 },
    { name: 'Lungekreft', slug: 'lunge', description: 'Ikke-småcellet og småcellet lungekreft, mesoteliom', iconName: 'wind', sortOrder: 3 },
    { name: 'Brystkreft', slug: 'bryst', description: 'Brystkreft inkl. HER2-positiv, hormonreseptor-positiv og trippel-negativ', iconName: 'heart', sortOrder: 4 },
    { name: 'Gynekologisk kreft', slug: 'gyn', description: 'Eggstokkreft, livmorkreft, livmorhalskreft', iconName: 'flower2', sortOrder: 5 },
    { name: 'Urologisk kreft', slug: 'uro', description: 'Prostatakreft, blærekreft, nyrekreft, testikkelkreft', iconName: 'droplets', sortOrder: 6 },
    { name: 'Hode-/halskreft', slug: 'hode-hals', description: 'Kreft i munnhule, svelg, strupe, nese-/bihule, spyttkjertler', iconName: 'scan-face', sortOrder: 7 },
    { name: 'Lymfom og leukemi', slug: 'lymfom', description: 'Hodgkin lymfom, non-Hodgkin lymfom, kronisk lymfatisk leukemi', iconName: 'droplet', sortOrder: 8 },
    { name: 'Hjernesvulst', slug: 'hjerne', description: 'Glioblastom, astrocytom, oligodendrogliom og andre CNS-svulster', iconName: 'brain', sortOrder: 9 },
    { name: 'Sarkom', slug: 'sarkom', description: 'Bløtvevssarkom og bensarkom', iconName: 'bone', sortOrder: 10 },
  ];

  const tumorGroups: Record<string, string> = {};
  for (const tg of tumorGroupsData) {
    const created = await prisma.tumorGroup.upsert({
      where: { slug: tg.slug },
      update: {},
      create: tg,
    });
    tumorGroups[tg.slug] = created.id;
  }

  console.log('Tumor groups created');

  // ============================================================
  // KURER (REGIMENS)
  // ============================================================

  // DEMO: De fleste kurene legges inn som «godkjent» av to demobrukere, så
  // offentlige sider har innhold. Tre kurer ligger igjen i godkjenningsflyten,
  // så flyten kan vises i redaksjonsverktøyet. Ingen av tekstene er faglig vurdert.
  const demoWorkflow: Record<string, { status: PublishStatus; first?: string }> = {
    'flox': { status: PublishStatus.DRAFT },
    'nivolumab': { status: PublishStatus.PENDING_REVIEW },
    'folfiri': { status: PublishStatus.PENDING_REVIEW, first: 'Demobruker A' },
  };
  const seededAt = new Date();

  // Helper
  async function createRegimen(data: {
    name: string; slug: string; genericNames: string[]; brandNames: string[];
    tumorGroupSlug: string; treatmentType: TreatmentType; administrationRoute: AdministrationRoute;
    cycleDescription?: string; numberOfCycles?: string; sourceReference?: string;
    sections: { sectionType: SectionType; title: string; content: string; sortOrder?: number }[];
    sideEffects: { name: string; description: string; frequency: SideEffectFreq; severity?: string; management?: string; sortOrder?: number }[];
    alertInstructions: { urgency: AlertUrgency; instruction: string; action: string; sortOrder?: number }[];
    premedication: { medication: string; timing: string; isRequired?: boolean; notes?: string; sortOrder?: number }[];
  }) {
    const existing = await prisma.regimen.findUnique({ where: { slug: data.slug } });
    if (existing) return existing;

    const wf = demoWorkflow[data.slug] ?? { status: PublishStatus.APPROVED };
    const approved = wf.status === PublishStatus.APPROVED;

    return prisma.regimen.create({
      data: {
        name: data.name,
        slug: data.slug,
        genericNames: data.genericNames,
        brandNames: data.brandNames,
        tumorGroupId: tumorGroups[data.tumorGroupSlug],
        treatmentType: data.treatmentType,
        administrationRoute: data.administrationRoute,
        cycleDescription: data.cycleDescription,
        numberOfCycles: data.numberOfCycles,
        sourceReference: data.sourceReference,
        publishStatus: wf.status,
        approvedByFirst: approved ? 'Demobruker A' : wf.first ?? null,
        approvedBySecond: approved ? 'Demobruker B' : null,
        approvedAt: approved ? seededAt : null,
        publishedAt: approved ? seededAt : null,
        lastReviewedAt: approved ? seededAt : null,
        lastReviewedBy: approved ? 'Demogodkjent – ikke faglig vurdert' : null,
        version: 1,
        patientInfoSections: { create: data.sections.map((s, i) => ({ ...s, sortOrder: s.sortOrder ?? i })) },
        sideEffects: { create: data.sideEffects.map((s, i) => ({ ...s, sortOrder: s.sortOrder ?? i })) },
        alertInstructions: { create: data.alertInstructions.map((a, i) => ({ ...a, sortOrder: a.sortOrder ?? i })) },
        premedication: { create: data.premedication.map((p, i) => ({ ...p, isRequired: p.isRequired ?? true, sortOrder: p.sortOrder ?? i })) },
      },
    });
  }

  // ── KUR 1: Temozolomid ──────────────────────────────────────
  await createRegimen({
    name: 'Temozolomid (Temodal)', slug: 'temozolomid',
    genericNames: ['temozolomid'], brandNames: ['Temodal'],
    tumorGroupSlug: 'melanom',
    treatmentType: TreatmentType.CHEMOTHERAPY,
    administrationRoute: AdministrationRoute.ORAL,
    cycleDescription: '5 dager med kapsler, deretter 23 dagers pause (28-dagers syklus)',
    numberOfCycles: 'Vanligvis 3–4 kurer før evaluering',
    sourceReference: 'Nasjonalt handlingsprogram for melanomer',
    sections: [
      { sectionType: SectionType.INTRODUCTION, title: 'Om behandlingen', content: 'Temozolomid (Temodal®) er en cellegift i kapselform som gis ved føflekkreft og enkelte typer hjernesvulst. Du gjennomfører vanligvis tre til fire kurer før man vurderer om behandlingen har hatt effekt. Man starter med 150 mg/m² ved første kur og øker dosen fra kur nr. 2 ved god toleranse.' },
      { sectionType: SectionType.ADMINISTRATION, title: 'Hvordan foregår behandlingen?', content: 'En kur temozolomid gis over fem dager (dag 1 til dag 5). Du har deretter 23 dagers pause, før du starter ny kur. Dette tilsier start av ny kur hver fjerde uke.\n\nDet må tas blodprøver før hver kur.\n\nTemozolomid-kapsler må ikke tygges eller åpnes, men svelges hele med ett glass vann. Når du skal ta kapslene, må det ha gått minst 2 timer siden du har spist, og du skal vente én time etter at du har tatt kapslene før du kan spise.\n\nDersom du kaster opp etter at du har tatt kapslene, skal du likevel ikke ta ny dose før neste dag.' },
      { sectionType: SectionType.NAUSEA_MANAGEMENT, title: 'Kvalmebehandling', content: 'Ondansetron 8 mg tas 30 minutter til 1 time før temozolomid.\n\nHvis du blir forstoppet, kan du forsøke Afipran istedenfor ondansetron, eller bruke Movicol.' },
      { sectionType: SectionType.GENERAL_ADVICE, title: 'Generelle råd', content: 'Dersom du overhodet ikke opplever kvalme, kan du vurdere å forsøke uten kvalmestillende medikamenter. Ha i så fall kvalmestillende medikamenter tilgjengelig i tilfelle du blir kvalm.\n\nUnngå direkte sollys og bruk solkrem med høy faktor.' },
    ],
    sideEffects: [
      { name: 'Kvalme', description: 'En del, men ikke alle, opplever kvalme ved denne kuren. Kvalmen forebygges ved å ta de kvalmeforebyggende medikamentene legen har foreskrevet.', frequency: SideEffectFreq.VERY_COMMON, management: 'Ondansetron 8 mg 30 min til 1 time før temozolomid.' },
      { name: 'Tretthet (fatigue)', description: 'Du kan føle deg trett under behandlingen, med økt behov for å hvile. Opplevelsen av tretthet er mest uttalt den første uken etter kur.', frequency: SideEffectFreq.VERY_COMMON, management: 'Finn en balanse mellom aktivitet og hvile. Undersøkelser viser at det er gunstig å være i noe fysisk aktivitet.' },
      { name: 'Forstoppelse', description: 'Forstoppelse kan forekomme. Du kan i noe grad forebygge dette ved å drikke rikelig, spise fiberrik kost og holde deg i fysisk aktivitet.', frequency: SideEffectFreq.COMMON, management: 'Start med mildtvirkende avføringsmiddel som Levolac/Movicol. Fås uten resept.' },
      { name: 'Påvirkning av benmarg og immunforsvar', description: 'Temozolomid kan påvirke produksjonen av immunceller og gi risiko for infeksjoner.', frequency: SideEffectFreq.COMMON, management: 'Blodprøver kontrolleres før hver kur.' },
      { name: 'Hodepine', description: 'Hodepine er rapportert hos noen pasienter.', frequency: SideEffectFreq.COMMON, management: 'Paracetamol kan brukes ved behov. Kontakt lege om hodepinen er sterk eller vedvarende.' },
    ],
    alertInstructions: [
      { urgency: AlertUrgency.EMERGENCY, instruction: 'Frostrier eller feber over 38 °C', action: 'Kontakt akuttmottaket umiddelbart' },
      { urgency: AlertUrgency.URGENT, instruction: 'Oppkast mer enn én gang per dag som ikke lindres av kvalmestillende', action: 'Kontakt onkologisk poliklinikk eller akuttmottak' },
      { urgency: AlertUrgency.URGENT, instruction: 'Uttalt kvalme som medfører nedsatt inntak av mat og drikke', action: 'Kontakt onkologisk poliklinikk' },
      { urgency: AlertUrgency.URGENT, instruction: 'Uttalt slapphet som medfører at du blir liggende til sengs mer enn halve dagen', action: 'Kontakt onkologisk poliklinikk' },
    ],
    premedication: [
      { medication: 'Ondansetron 8 mg', timing: '30 min til 1 time før temozolomid', isRequired: true, notes: 'Kan byttes til Afipran ved forstoppelse' },
    ],
  });

  // ── KUR 2: BRAF/MEK-hemmere ─────────────────────────────────
  await createRegimen({
    name: 'BRAF/MEK-hemmere (dabrafenib + trametinib)', slug: 'braf-mek-hemmere',
    genericNames: ['dabrafenib', 'trametinib', 'enkorafenib', 'binimetinib'],
    brandNames: ['Tafinlar', 'Mekinist', 'Braftovi', 'Mektovi'],
    tumorGroupSlug: 'melanom',
    treatmentType: TreatmentType.TARGETED_THERAPY,
    administrationRoute: AdministrationRoute.ORAL,
    cycleDescription: 'Kontinuerlig daglig behandling',
    numberOfCycles: 'Adjuvant: 1 år. Metastatisk: så lenge det er effekt',
    sourceReference: 'Nasjonalt handlingsprogram for melanomer',
    sections: [
      { sectionType: SectionType.INTRODUCTION, title: 'Om behandlingen', content: 'Dette er en tablettbehandling som benyttes hos de som har påvist BRAF-mutasjon, en genforandring i kreftcellene. Dette er ca. 40–50 % av pasienter med føflekkreft med fjernspredning. Tablettene hemmer signaloverføring inne i kreftcellen.' },
      { sectionType: SectionType.INDICATION, title: 'Når brukes behandlingen?', content: 'Behandlingen kan gis som:\n\n**Adjuvant behandling**: Tilleggsbehandling etter kirurgisk fjerning av kreft, i 1 år.\n\n**Ved ikke-operabel spredning**: Ved spredning til lymfeknuter eller indre organer som ikke kan opereres. Det er høy rate av effekt på metastaser, men dessverre vil en overvekt oppleve at medikamentene mister sin effekt etter hvert.' },
      { sectionType: SectionType.ADMINISTRATION, title: 'Hvordan tas tablettene?', content: '**Kombinasjon 1: Dabrafenib + Trametinib**\n- Dabrafenib (Tafinlar): 2 kapsler morgen og 2 kapsler kveld\n- Trametinib (Mekinist): 1 tablett daglig\n- Tas utenom måltid (1 time før eller 2 timer etter)\n- Trametinib oppbevares i kjøleskap\n- Unngå grapefruktjuice\n\n**Kombinasjon 2: Enkorafenib + Binimetinib**\n- Enkorafenib (Braftovi): 6 kapsler én gang daglig\n- Binimetinib (Mektovi): 3 tabletter morgen og 3 tabletter kveld\n- Tas med mat\n- Unngå grapefruktjuice' },
      { sectionType: SectionType.IMPORTANT_INFO, title: 'Viktig informasjon', content: 'Ikke bruk under graviditet eller amming.\n\nDet er viktig at legen får en oversikt over hvilke medisiner du bruker, også kosttilskudd, for eksempel johannesurt. Noen tilskudd kan gi økt fare for bivirkninger eller redusere effekt.' },
    ],
    sideEffects: [
      { name: 'Feber', description: 'Ved de første 2–3 episodene skal du ta kontakt med akuttmottak ved feber >38,5 °C, eller >38 °C med frostrier. Det må utelukkes alvorlig infeksjon.', frequency: SideEffectFreq.VERY_COMMON, severity: 'Alvorlig', management: 'Du skal alltid stoppe tabletter ved feber. Du kan starte tablettene igjen etter 24 timer uten feber, dersom infeksjon er utelukket.' },
      { name: 'Hjerteforstyrrelser', description: 'Du blir fulgt med EKG og/eller andre hjerteundersøkelser jevnlig.', frequency: SideEffectFreq.UNCOMMON, severity: 'Alvorlig', management: 'Ta kontakt ved ukontrollert hjertebank, brystsmerter, tungpust eller hevelser.' },
      { name: 'Betennelse på øynene', description: 'Synsforstyrrelser kan oppstå.', frequency: SideEffectFreq.UNCOMMON, management: 'Kontakt lege ved synsforstyrrelser.' },
      { name: 'Hudreaksjoner', description: 'Du kan oppleve mer sensitiv hud og risiko for å tåle sol dårligere.', frequency: SideEffectFreq.VERY_COMMON, management: 'Bruk faktor 50 og klær/hodeplagg i sterk sol.' },
      { name: 'Mage-tarmplager', description: 'Magesmerter, diare, kvalme og oppkast kan forekomme.', frequency: SideEffectFreq.COMMON, management: 'Ta kontakt ved sterk diare, ellers diskuteres dette på neste legetime.' },
    ],
    alertInstructions: [
      { urgency: AlertUrgency.EMERGENCY, instruction: 'Feber over 38,5 °C, eller feber over 38 °C med frostrier (de første 2–3 episodene)', action: 'Kontakt akuttmottaket. Stopp tablettene umiddelbart.' },
      { urgency: AlertUrgency.URGENT, instruction: 'Ukontrollert hjertebank, brystsmerter, tungpust eller hevelser', action: 'Kontakt akuttmottak' },
      { urgency: AlertUrgency.URGENT, instruction: 'Synsforstyrrelser', action: 'Kontakt lege' },
      { urgency: AlertUrgency.SOON, instruction: 'Sterk diare eller vedvarende oppkast', action: 'Kontakt onkologisk poliklinikk' },
    ],
    premedication: [],
  });

  // ── KUR 3: FOLFOX ────────────────────────────────────────────
  await createRegimen({
    name: 'FOLFOX', slug: 'folfox',
    genericNames: ['oksaliplatin', '5-fluorouracil', 'kalsiumfolinat'],
    brandNames: ['Eloxatin', 'Fluorouracil', 'Rescuvolin/Isovorin'],
    tumorGroupSlug: 'gi',
    treatmentType: TreatmentType.CHEMOTHERAPY,
    administrationRoute: AdministrationRoute.INTRAVENOUS,
    cycleDescription: 'Hver 14. dag (2-ukers syklus). Dag 1: infusjon på sykehuset. Dag 1–2: hjemmeinfusjon via pumpe.',
    numberOfCycles: 'Adjuvant: vanligvis 12 kurer (6 måneder). Metastatisk: vurderes fortløpende.',
    sourceReference: 'Nasjonalt handlingsprogram for kolorektalkreft',
    sections: [
      { sectionType: SectionType.INTRODUCTION, title: 'Om behandlingen', content: 'FOLFOX er en cellegiftkombinasjon som brukes ved kreft i tykktarm og endetarm. Behandlingen inneholder tre virkestoffer: oksaliplatin (Eloxatin), 5-fluorouracil (5-FU) og kalsiumfolinat (leukovorin). Kalsiumfolinat er ikke cellegift i seg selv, men forsterker effekten av 5-FU.' },
      { sectionType: SectionType.ADMINISTRATION, title: 'Hvordan foregår behandlingen?', content: 'Behandlingen gis hver 14. dag.\n\n**Dag 1 på sykehuset:**\nDu møter på poliklinikken. Først gis kvalmestillende, deretter oksaliplatin som infusjon over 2 timer, etterfulgt av en kort injeksjon med 5-FU (bolus). Til slutt kobles en bærbar infusjonspumpe til din venøse tilgang.\n\n**Dag 1–2 hjemme:**\n5-FU gis som kontinuerlig infusjon over 46 timer via pumpen. Du kan ha pumpen i en liten veske eller belte. Pumpen kobles fra etter 46 timer — enten på sykehuset eller av hjemmesykepleier.\n\n**Blodprøver** tas før hver kur, vanligvis 1–2 dager i forveien.' },
      { sectionType: SectionType.NAUSEA_MANAGEMENT, title: 'Kvalmebehandling', content: 'Du får kvalmestillende medisiner intravenøst før behandlingen starter (vanligvis ondansetron og deksametason). Du kan også få med tabletter hjem for å ta ved behov.' },
      { sectionType: SectionType.GENERAL_ADVICE, title: 'Råd om kuldefølsomhet', content: 'Oksaliplatin gir ofte kuldefølsomhet i fingre, tær og svelg de første dagene etter behandling:\n- Unngå kalde drikker og mat rett fra kjøleskap\n- Bruk hansker ved håndtering av kalde gjenstander og i kaldt vær\n- Unngå kald luft i ansiktet\n- Symptomene er vanligvis forbigående' },
    ],
    sideEffects: [
      { name: 'Nerveskade/nummenhet (nevrotoksisitet)', description: 'Oksaliplatin kan gi prikking, nummenhet og kuldefølsomhet i fingre og tær. Ved akutt nevrotoksisitet kan du oppleve ubehag i hals/svelg ved kulde.', frequency: SideEffectFreq.VERY_COMMON, severity: 'Moderat til alvorlig', management: 'Bruk hansker ved håndtering av kalde gjenstander. Drikk romtempererte drikker. Meld fra til legen om symptomene — dosejustering kan være nødvendig.' },
      { name: 'Kvalme og oppkast', description: 'Moderat risiko for kvalme, særlig de første dagene etter behandling.', frequency: SideEffectFreq.VERY_COMMON, management: 'Forebygges med kvalmestillende. Kontakt avdelingen hvis kvalmen ikke lindres.' },
      { name: 'Diare', description: '5-FU kan gi løs avføring til diare.', frequency: SideEffectFreq.COMMON, management: 'Hold god væskeinntak. Kontakt avdelingen ved sterk eller langvarig diare.' },
      { name: 'Munnsårhet (mukositt)', description: 'Sårhet og sår i munnen kan forekomme.', frequency: SideEffectFreq.COMMON, management: 'God munnhygiene. Bruk myk tannbørste. Unngå sterkt krydret mat. Skyll munnen regelmessig.' },
      { name: 'Benmargspåvirkning', description: 'Kan gi lavt antall hvite blodceller (økt infeksjonsrisiko), lave blodplater og blodmangel.', frequency: SideEffectFreq.VERY_COMMON, management: 'Kontrolleres med blodprøver. Ved feber og lavt immunforsvar er rask kontakt med sykehus viktig.' },
      { name: 'Hårtap', description: 'Lett til moderat hårtap kan forekomme.', frequency: SideEffectFreq.COMMON, management: 'Håret vokser vanligvis tilbake etter avsluttet behandling.' },
    ],
    alertInstructions: [
      { urgency: AlertUrgency.EMERGENCY, instruction: 'Feber ≥38,3 °C eller frostrier', action: 'Kontakt akuttmottak umiddelbart – infeksjon med lavt immunforsvar kan være livstruende' },
      { urgency: AlertUrgency.URGENT, instruction: 'Sterk diare (≥6 løse avføringer per dag) eller blodig avføring', action: 'Kontakt onkologisk poliklinikk eller akuttmottak' },
      { urgency: AlertUrgency.URGENT, instruction: 'Kraftig oppkast som ikke lindres av kvalmestillende', action: 'Kontakt onkologisk poliklinikk' },
      { urgency: AlertUrgency.URGENT, instruction: 'Problemer med pumpe eller venøs tilgang (lekkasje, smerte, hevelse)', action: 'Kontakt onkologisk poliklinikk i åpningstiden, akuttmottak utenom' },
      { urgency: AlertUrgency.SOON, instruction: 'Tiltagende nummenhet/prikking i fingre/tær som påvirker funksjon', action: 'Meld fra ved neste time — dosejustering kan være nødvendig' },
    ],
    premedication: [
      { medication: 'Ondansetron 8 mg iv', timing: '30 min før behandling', isRequired: true },
      { medication: 'Deksametason 8 mg iv', timing: '30 min før behandling', isRequired: true },
    ],
  });

  // ── KUR 4: FOLFIRI ───────────────────────────────────────────
  await createRegimen({
    name: 'FOLFIRI', slug: 'folfiri',
    genericNames: ['irinotekan', '5-fluorouracil', 'kalsiumfolinat'],
    brandNames: ['Campto', 'Fluorouracil', 'Isovorin'],
    tumorGroupSlug: 'gi',
    treatmentType: TreatmentType.CHEMOTHERAPY,
    administrationRoute: AdministrationRoute.INTRAVENOUS,
    cycleDescription: 'Hver 14. dag. Infusjon på sykehuset dag 1, hjemmeinfusjon (5-FU) dag 1–2.',
    numberOfCycles: 'Vurderes fortløpende, vanligvis til progresjon eller uakseptabel toksisitet.',
    sourceReference: 'Nasjonalt handlingsprogram for kolorektalkreft',
    sections: [
      { sectionType: SectionType.INTRODUCTION, title: 'Om behandlingen', content: 'FOLFIRI er en cellegiftkombinasjon brukt ved kreft i tykktarm og endetarm, særlig som andrelinjebehandling eller ved KRAS-mutasjon. Kombinasjonen inneholder irinotekan, 5-fluorouracil (5-FU) og kalsiumfolinat.' },
      { sectionType: SectionType.ADMINISTRATION, title: 'Hvordan foregår behandlingen?', content: 'Behandlingen gis hver 14. dag.\n\n**Dag 1 på sykehuset:** Kvalmestillende gis, deretter irinotekan som infusjon over 90 minutter, etterfulgt av kalsiumfolinat og 5-FU bolus. En bærbar infusjonspumpe med 5-FU kobles til ved avreise.\n\n**Dag 1–2 hjemme:** 5-FU gis som kontinuerlig infusjon over 46 timer. Pumpen kobles fra på sykehuset eller av hjemmesykepleier.' },
      { sectionType: SectionType.GENERAL_ADVICE, title: 'Generelle råd', content: 'Irinotekan kan gi akutt diare under eller rett etter infusjonen — dette behandles med atropin. Sendiare (>24 timer etter kur) kan være alvorlig og krever behandling med Loperamid.\n\nDrikk minst 2 liter vann daglig under behandlingsdagene.' },
    ],
    sideEffects: [
      { name: 'Diare', description: 'Irinotekan kan gi både akutt diare (under infusjon) og sen diare (fra dag 2–10). Sen diare kan være alvorlig.', frequency: SideEffectFreq.VERY_COMMON, severity: 'Kan være alvorlig', management: 'Ved sendiare: Start Loperamid (Imodium) umiddelbart — 4 mg ved første løse avføring, deretter 2 mg hver 2. time. Kontakt sykehus ved >6 løse avføringer per dag.' },
      { name: 'Kvalme og oppkast', description: 'Forebygges med antiemetika.', frequency: SideEffectFreq.VERY_COMMON, management: 'Ondansetron og deksametason gis i forkant. Ta kvalmestillende tabletter hjem ved behov.' },
      { name: 'Benmargspåvirkning', description: 'Økt infeksjonsrisiko, blødningstendens og tretthet.', frequency: SideEffectFreq.VERY_COMMON, management: 'Blodprøver kontrolleres regelmessig.' },
      { name: 'Hårtap', description: 'Hårtap er vanlig ved FOLFIRI.', frequency: SideEffectFreq.VERY_COMMON, management: 'Håret vokser tilbake etter avsluttet behandling.' },
    ],
    alertInstructions: [
      { urgency: AlertUrgency.EMERGENCY, instruction: 'Feber ≥38,3 °C eller frostrier', action: 'Kontakt akuttmottak umiddelbart' },
      { urgency: AlertUrgency.URGENT, instruction: 'Mer enn 6 løse avføringer per dag, eller blod i avføringen', action: 'Kontakt onkologisk poliklinikk eller akuttmottak' },
      { urgency: AlertUrgency.URGENT, instruction: 'Akutte kramper i magen under eller rett etter infusjonen', action: 'Meld fra til sykepleier umiddelbart under infusjonen' },
    ],
    premedication: [
      { medication: 'Ondansetron 8 mg iv', timing: '30 min før behandling', isRequired: true },
      { medication: 'Deksametason 8 mg iv', timing: '30 min før behandling', isRequired: true },
      { medication: 'Atropin 0,25 mg iv/sc', timing: 'Ved behov ved akutt kolinerg syndrom under irinotekan-infusjon', isRequired: false },
    ],
  });

  // ── KUR 5: Kapecitabin (Xeloda) ─────────────────────────────
  await createRegimen({
    name: 'Kapecitabin (Xeloda)', slug: 'kapecitabin',
    genericNames: ['kapecitabin'], brandNames: ['Xeloda'],
    tumorGroupSlug: 'gi',
    treatmentType: TreatmentType.CHEMOTHERAPY,
    administrationRoute: AdministrationRoute.ORAL,
    cycleDescription: '14 dager med tabletter, 7 dager pause (21-dagers syklus)',
    numberOfCycles: 'Adjuvant: 8 kurer (6 måneder). Metastatisk: til progresjon.',
    sourceReference: 'Nasjonalt handlingsprogram for kolorektalkreft',
    sections: [
      { sectionType: SectionType.INTRODUCTION, title: 'Om behandlingen', content: 'Kapecitabin (Xeloda®) er en cellegift i tabletform. I kroppen omdannes kapecitabin til 5-fluorouracil (5-FU), som er en av de viktigste cellegiftene ved tarmkreft. Fordelen med kapecitabin er at det kan tas hjemme som tabletter.' },
      { sectionType: SectionType.ADMINISTRATION, title: 'Hvordan tas tablettene?', content: 'Tablettene tas to ganger daglig — morgen og kveld — med mat (innen 30 minutter etter måltid). Du tar tabletter i 14 dager, deretter 7 dager pause.\n\nDosen beregnes etter kroppsoverflate og justeres av legen. Det er viktig å ta tablettene til riktig tid og ikke hoppe over doser.' },
      { sectionType: SectionType.GENERAL_ADVICE, title: 'Hånd-fot-syndrom — forebygging', content: 'Kapecitabin kan gi røde, ømme og oppsprukne hender og fotsåler (hånd-fot-syndrom). For å forebygge:\n- Bruk fet håndkrem/fotcreme daglig (f.eks. Decubal, Locobase)\n- Unngå varmt vann, trange sko og gjentatte bevegelser\n- Start med kremen fra dag 1 av behandlingen' },
    ],
    sideEffects: [
      { name: 'Hånd-fot-syndrom', description: 'Røde, ømme, flassende eller oppsprukne hender og fotsåler. Vanligvis etter 2–4 ukers behandling.', frequency: SideEffectFreq.VERY_COMMON, severity: 'Moderat', management: 'Fet fugtighetskrem daglig fra behandlingsstart. Kontakt legen om huden sprekker opp eller gir sterk smerte — dosereduksjon kan være nødvendig.' },
      { name: 'Diare', description: 'Løs avføring til diare kan forekomme.', frequency: SideEffectFreq.COMMON, management: 'Loperamid (Imodium) ved behov. Drikk rikelig. Kontakt lege ved alvorlig diare.' },
      { name: 'Kvalme', description: 'Relativt mild kvalme forekommer hos noen.', frequency: SideEffectFreq.COMMON, management: 'Ta tablettene med mat. Kvalmestillende ved behov.' },
      { name: 'Benmargspåvirkning', description: 'Lavere enn ved intravenøs 5-FU, men blodprøver må kontrolleres.', frequency: SideEffectFreq.COMMON, management: 'Regelmessige blodprøver.' },
    ],
    alertInstructions: [
      { urgency: AlertUrgency.EMERGENCY, instruction: 'Feber ≥38,3 °C eller frostrier', action: 'Kontakt akuttmottak umiddelbart. Stopp tablettene.' },
      { urgency: AlertUrgency.URGENT, instruction: 'Mer enn 4 løse avføringer per dag', action: 'Kontakt onkologisk poliklinikk. Stopp tablettene midlertidig.' },
      { urgency: AlertUrgency.URGENT, instruction: 'Alvorlig hånd-fot-syndrom med smerter som hindrer normal aktivitet', action: 'Kontakt onkologisk poliklinikk. Stopp tablettene.' },
      { urgency: AlertUrgency.SOON, instruction: 'Brystsmerter eller hjerterytmeforstyrrelser', action: 'Kontakt lege — sjelden, men kapecitabin kan påvirke hjertet' },
    ],
    premedication: [],
  });

  // ── KUR 6: Pembrolizumab (Keytruda) ─────────────────────────
  await createRegimen({
    name: 'Pembrolizumab (Keytruda)', slug: 'pembrolizumab',
    genericNames: ['pembrolizumab'], brandNames: ['Keytruda'],
    tumorGroupSlug: 'melanom',
    treatmentType: TreatmentType.IMMUNOTHERAPY,
    administrationRoute: AdministrationRoute.INTRAVENOUS,
    cycleDescription: 'Infusjon over 30 min hver 3. uke (Q3W) eller hver 6. uke (Q6W)',
    numberOfCycles: 'Inntil 2 år (35 kurer Q3W), eller til progresjon/uakseptabel toksisitet',
    sourceReference: 'Nasjonalt handlingsprogram for melanomer',
    sections: [
      { sectionType: SectionType.INTRODUCTION, title: 'Om behandlingen', content: 'Pembrolizumab (Keytruda®) er en immunterapi — et såkalt sjekkpunktblokkerende antistoff (PD-1-hemmer). Medikamentet hjelper immunforsvaret ditt med å gjenkjenne og angripe kreftcellene. Det er ikke en cellegift og virker på en annen måte enn tradisjonell cellegiftbehandling.' },
      { sectionType: SectionType.ADMINISTRATION, title: 'Hvordan foregår behandlingen?', content: 'Pembrolizumab gis som infusjon (drypp) over 30 minutter på poliklinikken. Du trenger ikke faste i forkant.\n\nBehandlingen gis enten hver 3. uke (200 mg) eller hver 6. uke (400 mg flat dose). Blodprøver tas regelmessig for å overvåke immunreaksjoner.' },
      { sectionType: SectionType.IMPORTANT_INFO, title: 'Viktig om immunreaksjoner', content: 'Fordi pembrolizumab aktiverer immunforsvaret, kan det angripe normale celler og organer. Disse immunreaksjonene (immuntoksisitet) kan ramme:\n- Lunger (pneumonitt)\n- Tarm (kolitt)\n- Lever (hepatitt)\n- Hud (utslett)\n- Hormonsystemet (tyreoiditt, hypofysitt)\n- Nyrer, hjerte, ledd og mer\n\nDisse bivirkningene er vanligvis reversible med kortikosteroider, men krever rask diagnostikk og behandling.' },
      { sectionType: SectionType.FERTILITY, title: 'Graviditet og amming', content: 'Pembrolizumab skal ikke brukes under graviditet. Bruk sikker prevensjon under behandlingen og i minst 4 måneder etter siste dose. Amming frarådes under behandling og i 4 måneder etter.' },
    ],
    sideEffects: [
      { name: 'Tretthet (fatigue)', description: 'Vanlig bivirkning som kan vedvare gjennom behandlingen.', frequency: SideEffectFreq.VERY_COMMON, management: 'Balanser aktivitet og hvile. Kontakt legen om trettheten er invalidiserende.' },
      { name: 'Hudreaksjoner', description: 'Utslett, kløe og vitiligo (lysere hudflekker) kan forekomme.', frequency: SideEffectFreq.VERY_COMMON, management: 'Fuktighetskremer, unngå sterk sol. Kontakt legen ved alvorlig utslett.' },
      { name: 'Immunrelatert pneumonitt (lungebetennelse)', description: 'Betennelse i lungene kan gi tørrhoste og kortpustethet. Kan være alvorlig.', frequency: SideEffectFreq.UNCOMMON, severity: 'Potensielt alvorlig', management: 'Kontakt legen ved ny hoste eller kortpustethet. Behandles med kortikosteroider.' },
      { name: 'Immunrelatert kolitt (tarmbetennelse)', description: 'Diare og magesmerter som tegn på betennelse i tykktarmen.', frequency: SideEffectFreq.UNCOMMON, severity: 'Potensielt alvorlig', management: 'Kontakt legen ved vedvarende diare. Behandles med kortikosteroider.' },
      { name: 'Skjoldbruskkjertelforstyrrelser', description: 'Hypo- eller hypertyreose er relativt vanlig.', frequency: SideEffectFreq.COMMON, management: 'Kontrolleres regelmessig med blodprøver. Behandles med horsonterapi ved behov.' },
    ],
    alertInstructions: [
      { urgency: AlertUrgency.EMERGENCY, instruction: 'Alvorlig kortpustethet, brystsmerter eller rask forverring av allmenntilstand', action: 'Ring 113 eller dra til nærmeste akuttmottak umiddelbart' },
      { urgency: AlertUrgency.URGENT, instruction: 'Ny hoste, kortpustethet eller mer enn 4 løse avføringer per dag', action: 'Kontakt onkologisk poliklinikk samme dag' },
      { urgency: AlertUrgency.URGENT, instruction: 'Sterk magesmerter, blod i avføringen eller mørk urin/gulsott', action: 'Kontakt onkologisk avdeling' },
      { urgency: AlertUrgency.URGENT, instruction: 'Feber over 38 °C', action: 'Kontakt akuttmottak' },
      { urgency: AlertUrgency.SOON, instruction: 'Vedvarende hodepine, synsforandringer eller tretthet med vektøkning/vekttap', action: 'Kontakt poliklinikken — kan tyde på hormonforstyrrelser' },
    ],
    premedication: [],
  });

  // ── KUR 7: Nivolumab + Ipilimumab ───────────────────────────
  await createRegimen({
    name: 'Nivolumab + Ipilimumab (Opdivo + Yervoy)', slug: 'nivolumab-ipilimumab',
    genericNames: ['nivolumab', 'ipilimumab'], brandNames: ['Opdivo', 'Yervoy'],
    tumorGroupSlug: 'melanom',
    treatmentType: TreatmentType.IMMUNOTHERAPY,
    administrationRoute: AdministrationRoute.INTRAVENOUS,
    cycleDescription: 'Kombinasjonsfase: 4 kurer hver 3. uke. Vedlikeholdsfase: nivolumab alene hver 4. uke.',
    numberOfCycles: 'Kombinasjon: 4 kurer. Vedlikehold nivolumab: inntil 2 år totalt.',
    sourceReference: 'Nasjonalt handlingsprogram for melanomer',
    sections: [
      { sectionType: SectionType.INTRODUCTION, title: 'Om behandlingen', content: 'Denne kombinasjonsbehandlingen bruker to immunterapimedikamenter som angriper kreftcellene på ulike måter. Nivolumab (Opdivo®) blokkerer PD-1, og ipilimumab (Yervoy®) blokkerer CTLA-4. Kombinasjonen er mer effektiv enn hvert medikament alene, men gir også flere bivirkninger.' },
      { sectionType: SectionType.ADMINISTRATION, title: 'Behandlingsopplegg', content: '**Fase 1 (kombinasjon) — 4 kurer:**\nNivolumab og ipilimumab gis som separate infusjoner samme dag, hver 3. uke.\n\n**Fase 2 (vedlikehold):**\nNivolumab alene gis hver 4. uke, inntil totalt 2 år med behandling.\n\nDu følges tett med blodprøver og klinisk undersøkelse mellom hver kur.' },
      { sectionType: SectionType.IMPORTANT_INFO, title: 'Immunreaksjoner — vær årvåken', content: 'Kombinasjonsbehandlingen gir økt risiko for immunreaksjoner sammenlignet med monoterapi. Symptomer kan oppstå når som helst under behandlingen og opptil måneder etter avsluttet behandling. Informer ALLTID helsepersonell om at du er i immunterapi ved kontakt med andre leger eller legevakt.' },
    ],
    sideEffects: [
      { name: 'Immunrelaterte bivirkninger (generelt)', description: 'Kombinasjonen gir hyppigere og ofte mer alvorlige immunreaksjoner enn monoterapi. Alle organer kan affiseres.', frequency: SideEffectFreq.VERY_COMMON, severity: 'Kan være alvorlig', management: 'Rask diagnostikk og behandling med kortikosteroider er essensielt.' },
      { name: 'Kolitt (tarmbetennelse)', description: 'Diare og magesmerter. Mer vanlig enn ved monoterapi.', frequency: SideEffectFreq.COMMON, severity: 'Moderat til alvorlig', management: 'Kontakt legen ved > 3 løse avføringer per dag. Behandles med kortikosteroider.' },
      { name: 'Hepatitt (leverbetennelse)', description: 'Forhøyede leverenzymer eller gulsott.', frequency: SideEffectFreq.COMMON, severity: 'Potensielt alvorlig', management: 'Kontrolleres med blodprøver. Behandles med kortikosteroider.' },
      { name: 'Hudreaksjoner', description: 'Utslett og kløe.', frequency: SideEffectFreq.VERY_COMMON, management: 'Fuktighetskremer og antihistamin ved behov.' },
    ],
    alertInstructions: [
      { urgency: AlertUrgency.EMERGENCY, instruction: 'Alvorlig kortpustethet, sterk brystsmerte eller plutselig synsforstyrrelse', action: 'Ring 113 umiddelbart' },
      { urgency: AlertUrgency.URGENT, instruction: 'Mer enn 4 løse avføringer per dag, blod i avføringen, alvorlige magesmerter', action: 'Kontakt onkologisk avdeling samme dag' },
      { urgency: AlertUrgency.URGENT, instruction: 'Gulsott, mørk urin eller lys avføring', action: 'Kontakt onkologisk avdeling' },
      { urgency: AlertUrgency.URGENT, instruction: 'Feber over 38 °C', action: 'Kontakt akuttmottak' },
    ],
    premedication: [],
  });

  // ── KUR 8: EC90 (Brystkreft) ─────────────────────────────────
  await createRegimen({
    name: 'EC90 (Epirubicin + Cyklofosfamid)', slug: 'ec90',
    genericNames: ['epirubicin', 'cyklofosfamid'], brandNames: ['Farmorubicin', 'Sendoxan'],
    tumorGroupSlug: 'bryst',
    treatmentType: TreatmentType.CHEMOTHERAPY,
    administrationRoute: AdministrationRoute.INTRAVENOUS,
    cycleDescription: 'Infusjon på sykehuset, én dag per kur, gjentas hver 3. uke',
    numberOfCycles: '4 kurer (vanligvis etterfulgt av 4 kurer docetaxel)',
    sourceReference: 'Nasjonalt handlingsprogram for brystkreft',
    sections: [
      { sectionType: SectionType.INTRODUCTION, title: 'Om behandlingen', content: 'EC er en cellegiftkombinasjon brukt ved brystkreft. Den inneholder epirubicin (Farmorubicin®) og cyklofosfamid (Sendoxan®). EC gis vanligvis som neoadjuvant (før operasjon) eller adjuvant (etter operasjon) behandling, og kombineres ofte med docetaxel.' },
      { sectionType: SectionType.ADMINISTRATION, title: 'Behandlingsdag på sykehuset', content: 'Du møter fastende på poliklinikken. Blodprøver tas ved ankomst.\n\nFørst gis kvalmestillende medisiner intravenøst. Deretter gis epirubicin som rask infusjon, og cyklofosfamid som infusjon. Hele behandlingen tar ca. 2–3 timer.\n\nEpirubicin er rødfarge — urinen kan være rødfarget i 1–2 dager etter behandling. Dette er normalt og ufarlig.' },
      { sectionType: SectionType.FERTILITY, title: 'Fruktbarhet og prevensjon', content: 'EC-behandling kan påvirke fruktbarheten. Kvinner i fertil alder bør diskutere nedfrysing av egg med legen FØR behandlingsstart.\n\nBruk sikker prevensjon under og i 6 måneder etter avsluttet behandling. Graviditet under behandling er kontraindisert.' },
      { sectionType: SectionType.GENERAL_ADVICE, title: 'Hårhjelp og praktiske råd', content: 'EC gir nesten alltid hårtap innen 2–3 uker etter første kur. Det kan være lurt å bestille parykk eller skjerf i god tid.\n\nHåret vokser tilbake etter avsluttet behandling, vanligvis etter 2–3 måneder.' },
    ],
    sideEffects: [
      { name: 'Hårtap (alopesi)', description: 'Nesten alle opplever hårtap innen 2–3 uker etter første kur. Hår på hele kroppen kan falle av.', frequency: SideEffectFreq.VERY_COMMON, management: 'Håret vokser tilbake. Parykk eller hodeplagg kan bestilles gjennom sykehuset.' },
      { name: 'Kvalme og oppkast', description: 'Moderat til alvorlig kvalme særlig de første 2–3 dagene.', frequency: SideEffectFreq.VERY_COMMON, management: 'Forebygges med ondansetron og deksametason. Ta kvalmestillende tabletter hjem.' },
      { name: 'Benmargsdepresjon', description: 'Lavt immunforsvar, særlig dag 7–14 etter kur.', frequency: SideEffectFreq.VERY_COMMON, severity: 'Alvorlig', management: 'Blodprøver tas regelmessig. Kontakt sykehus umiddelbart ved feber.' },
      { name: 'Tretthet', description: 'Utpregd tretthet er vanlig, særlig etter kur 2–4.', frequency: SideEffectFreq.VERY_COMMON, management: 'Prioriter hvile, men prøv å holde deg i lett aktivitet.' },
      { name: 'Hjertepåvirkning', description: 'Epirubicin kan i sjeldne tilfeller påvirke hjertets pumpefunksjon. Kontrolleres med hjerteultralyd (LVEF).', frequency: SideEffectFreq.RARE, severity: 'Potensielt alvorlig', management: 'Hjertefunksjon måles før oppstart. Meld fra ved kortpustethet, hevelser i bein eller rask puls.' },
    ],
    alertInstructions: [
      { urgency: AlertUrgency.EMERGENCY, instruction: 'Feber ≥38,3 °C eller frostrier (særlig dag 7–14 etter kur)', action: 'Kontakt akuttmottak UMIDDELBART — dette kan være febril nøytropeni, som er livstruende' },
      { urgency: AlertUrgency.URGENT, instruction: 'Blødning eller uvanlige blåmerker', action: 'Kontakt onkologisk avdeling' },
      { urgency: AlertUrgency.URGENT, instruction: 'Kraftig oppkast som ikke lindres og hindrer væskeinntak', action: 'Kontakt onkologisk poliklinikk eller akuttmottak' },
      { urgency: AlertUrgency.SOON, instruction: 'Kortpustethet ved lett aktivitet eller hevelse i bena', action: 'Kontakt lege — kan tyde på hjertepåvirkning' },
    ],
    premedication: [
      { medication: 'Ondansetron 8 mg iv', timing: '30 min før behandling', isRequired: true },
      { medication: 'Deksametason 8 mg iv', timing: '30 min før behandling', isRequired: true },
      { medication: 'Aprepitant 125 mg po', timing: '1 time før behandling dag 1 (deretter 80 mg dag 2 og 3)', isRequired: true },
    ],
  });

  // ── KUR 9: Docetaxel ─────────────────────────────────────────
  await createRegimen({
    name: 'Docetaxel', slug: 'docetaxel',
    genericNames: ['docetaksel'], brandNames: ['Taxotere', 'Docetaxel Accord'],
    tumorGroupSlug: 'bryst',
    treatmentType: TreatmentType.CHEMOTHERAPY,
    administrationRoute: AdministrationRoute.INTRAVENOUS,
    cycleDescription: 'Infusjon over 1 time hver 3. uke',
    numberOfCycles: '4 kurer (etter EC ved brystkreft), eller inntil 6 ved lungekreft',
    sourceReference: 'Nasjonalt handlingsprogram for brystkreft',
    sections: [
      { sectionType: SectionType.INTRODUCTION, title: 'Om behandlingen', content: 'Docetaksel (Taxotere®) er en cellegift som virker ved å hindre kreftcellene i å dele seg. Det brukes ved brystkreft (vanligvis etter EC-kurer), lungekreft og prostatakreft.' },
      { sectionType: SectionType.PREPARATION, title: 'Forberedelser', content: 'For å forebygge væskeansamling og alvorlige allergiske reaksjoner må du ta deksametason-tabletter hjemme DAGEN FØR, BEHANDLINGSDAGEN og DAGEN ETTER kur.\n\nDette er svært viktig — behandlingen kan ikke gis uten dette.' },
      { sectionType: SectionType.ADMINISTRATION, title: 'Behandlingsdagen', content: 'Infusjonen gis over 1 time. Sykepleier er til stede og observerer deg under hele infusjonen for tegn på allergisk reaksjon.\n\nDe første minuttene er viktigst å overvåke.' },
    ],
    sideEffects: [
      { name: 'Hårtap', description: 'Nesten alle opplever hårtap, inkl. øyenbryn og -vipper.', frequency: SideEffectFreq.VERY_COMMON, management: 'Midlertidig. Håret vokser tilbake.' },
      { name: 'Væskeansamling', description: 'Hevelse i bein, ansikt og hender kan forekomme.', frequency: SideEffectFreq.COMMON, management: 'Forebygges med deksametason. Meld fra ved tiltagende hevelse.' },
      { name: 'Nevropati', description: 'Prikking og nummenhet i fingre og tær.', frequency: SideEffectFreq.COMMON, management: 'Meld fra til legen. Dosereduksjon kan bli nødvendig ved alvorlige symptomer.' },
      { name: 'Benmargsdepresjon', description: 'Særlig lavt antall hvite blodceller dag 7–14.', frequency: SideEffectFreq.VERY_COMMON, severity: 'Alvorlig', management: 'Rask kontakt med sykehus ved feber.' },
      { name: 'Negleforandringer', description: 'Negler kan misfarges og falle av.', frequency: SideEffectFreq.COMMON, management: 'Isposer på negler under infusjon kan forebygge dette (diskuter med sykepleier).' },
    ],
    alertInstructions: [
      { urgency: AlertUrgency.EMERGENCY, instruction: 'Feber ≥38,3 °C (særlig dag 7–14)', action: 'Kontakt akuttmottak umiddelbart' },
      { urgency: AlertUrgency.EMERGENCY, instruction: 'Allergisk reaksjon under infusjon: utslett, pusteproblemer, hjertebank', action: 'Si fra til sykepleier UMIDDELBART under infusjonen' },
      { urgency: AlertUrgency.URGENT, instruction: 'Tiltagende hevelse i bein eller ansikt', action: 'Kontakt onkologisk poliklinikk' },
    ],
    premedication: [
      { medication: 'Deksametason 8 mg po', timing: 'Dagen FØR, behandlingsdagen og dagen ETTER kur (3 dager)', isRequired: true, notes: 'SVÆRT VIKTIG — behandling kan ikke gis uten' },
    ],
  });

  // ── KUR 10: FOLFIRINOX ───────────────────────────────────────
  await createRegimen({
    name: 'FOLFIRINOX', slug: 'folfirinox',
    genericNames: ['oksaliplatin', 'irinotekan', '5-fluorouracil', 'kalsiumfolinat'],
    brandNames: ['Eloxatin', 'Campto', 'Fluorouracil', 'Isovorin'],
    tumorGroupSlug: 'gi',
    treatmentType: TreatmentType.CHEMOTHERAPY,
    administrationRoute: AdministrationRoute.INTRAVENOUS,
    cycleDescription: 'Hver 14. dag. Dagslang infusjon + 46t hjemmeinfusjon (5-FU)',
    numberOfCycles: 'Vanligvis 8–12 kurer. Avhenger av toleranse og respons.',
    sourceReference: 'Nasjonalt handlingsprogram for bukspyttkjertelkreft',
    sections: [
      { sectionType: SectionType.INTRODUCTION, title: 'Om behandlingen', content: 'FOLFIRINOX er en intensiv cellegiftkombinasjon brukt ved bukspyttkjertelkreft (pankreas). Den inneholder fire virkestoffer: oksaliplatin, irinotekan, 5-fluorouracil og kalsiumfolinat. Det er en krevende behandling, men kan gi god effekt hos pasienter med god allmenntilstand.' },
      { sectionType: SectionType.ADMINISTRATION, title: 'Behandlingsdagen', content: 'Behandlingen starter tidlig på morgenen og varer hele dagen. Du mottar alle fire medikamentene intravenøst. Ved avreise kobles 46-timers 5-FU-pumpe til.\n\nDu trenger noen som kjører deg hjem. Planlegg rolige dager de nærmeste dagene etter behandling.' },
      { sectionType: SectionType.GENERAL_ADVICE, title: 'Ernæringsråd', content: 'FOLFIRINOX kan gi kraftig kvalme og diare. Spis små, hyppige måltider. Unngå sterk mat. Drikk nok væske.\n\nVed vekttap bør du kontakte ernæringsfysiolog via poliklinikken.' },
    ],
    sideEffects: [
      { name: 'Diare', description: 'Kan være alvorlig og dehydrerende.', frequency: SideEffectFreq.VERY_COMMON, severity: 'Potensielt alvorlig', management: 'Loperamid ved sendiare. Kontakt sykehus ved > 6 løse avføringer/dag.' },
      { name: 'Nevropati', description: 'Kuldefølsomhet og nummenhet fra oksaliplatin.', frequency: SideEffectFreq.VERY_COMMON, management: 'Unngå kulde. Meld fra ved tiltagende symptomer.' },
      { name: 'Benmargsdepresjon', description: 'Økt infeksjonsrisiko.', frequency: SideEffectFreq.VERY_COMMON, severity: 'Alvorlig', management: 'G-CSF (Neulasta/Neupogen) kan gis profylaktisk.' },
      { name: 'Kvalme', description: 'Intens kvalme er vanlig.', frequency: SideEffectFreq.VERY_COMMON, management: 'Ondansetron, aprepitant og deksametason gis preventivt.' },
      { name: 'Hårtap', description: 'Vanlig ved FOLFIRINOX.', frequency: SideEffectFreq.VERY_COMMON, management: 'Midlertidig.' },
    ],
    alertInstructions: [
      { urgency: AlertUrgency.EMERGENCY, instruction: 'Feber ≥38,3 °C eller frostrier', action: 'Kontakt akuttmottak umiddelbart' },
      { urgency: AlertUrgency.URGENT, instruction: 'Mer enn 6 løse avføringer per dag', action: 'Kontakt onkologisk poliklinikk eller akuttmottak' },
      { urgency: AlertUrgency.URGENT, instruction: 'Kraftig oppkast og manglende væskeinntak', action: 'Kontakt onkologisk poliklinikk' },
    ],
    premedication: [
      { medication: 'Ondansetron 8 mg iv', timing: '30 min før behandling', isRequired: true },
      { medication: 'Deksametason 8 mg iv', timing: '30 min før behandling', isRequired: true },
      { medication: 'Aprepitant 125 mg po', timing: 'Dagen for behandling, deretter 80 mg dag 2 og 3', isRequired: true },
      { medication: 'Atropin 0,25 mg sc', timing: 'Profylaktisk 30 min før irinotekan', isRequired: false },
    ],
  });

  // ── KUR 11: Gemcitabin + nab-paklitaksel ────────────────────
  await createRegimen({
    name: 'Gemcitabin + nab-paklitaksel', slug: 'gemcitabin-nab-paklitaksel',
    genericNames: ['gemcitabin', 'nab-paklitaksel'], brandNames: ['Gemzar', 'Abraxane'],
    tumorGroupSlug: 'gi',
    treatmentType: TreatmentType.CHEMOTHERAPY,
    administrationRoute: AdministrationRoute.INTRAVENOUS,
    cycleDescription: 'Dag 1, 8 og 15 av en 28-dagers syklus',
    numberOfCycles: 'Inntil 6 sykluser, avhenger av toleranse og respons',
    sourceReference: 'Nasjonalt handlingsprogram for bukspyttkjertelkreft',
    sections: [
      { sectionType: SectionType.INTRODUCTION, title: 'Om behandlingen', content: 'Kombinasjonen av gemcitabin og nab-paklitaksel (Abraxane®) er et standardregime ved bukspyttkjertelkreft. Gemcitabin er en cellegift som hemmer DNA-syntesen, mens nab-paklitaksel er bundet til nanopartikler av albumin for bedre opptaket i svulsten.' },
      { sectionType: SectionType.ADMINISTRATION, title: 'Behandlingsopplegg', content: 'Du møter til infusjon tre ganger i syklusen: dag 1, dag 8 og dag 15. Deretter er det en ukes pause (dag 22–28), så starter ny syklus.\n\nnab-Paklitaksel gis over 30 minutter, etterfulgt av gemcitabin over 30 minutter. Blodprøver tas hver gang.' },
    ],
    sideEffects: [
      { name: 'Benmargsdepresjon', description: 'Nøytropeni er vanlig og kan gi infeksjonskomplikasjoner.', frequency: SideEffectFreq.VERY_COMMON, severity: 'Alvorlig', management: 'Regelmessige blodprøver. Kontakt sykehus ved feber.' },
      { name: 'Nevropati', description: 'Prikking og nummenhet fra paklitaksel.', frequency: SideEffectFreq.VERY_COMMON, management: 'Meld fra om symptomer til legen.' },
      { name: 'Hårtap', description: 'Vanlig ved nab-paklitaksel.', frequency: SideEffectFreq.VERY_COMMON, management: 'Midlertidig.' },
      { name: 'Tretthet', description: 'Uttalt tretthet er vanlig.', frequency: SideEffectFreq.VERY_COMMON, management: 'Prioriter hvile.' },
    ],
    alertInstructions: [
      { urgency: AlertUrgency.EMERGENCY, instruction: 'Feber ≥38,3 °C', action: 'Kontakt akuttmottak umiddelbart' },
      { urgency: AlertUrgency.URGENT, instruction: 'Allergisk reaksjon under infusjon', action: 'Si fra til sykepleier umiddelbart' },
    ],
    premedication: [
      { medication: 'Ondansetron 8 mg iv', timing: '30 min før behandling', isRequired: true },
      { medication: 'Deksametason 8 mg iv', timing: '30 min før nab-paklitaksel', isRequired: true },
      { medication: 'Difenhydramin (eller cetirizin)', timing: '30 min før nab-paklitaksel', isRequired: true },
    ],
  });

  // ── KUR 12: CAPOX/XELOX ─────────────────────────────────────
  await createRegimen({
    name: 'CAPOX (XELOX)', slug: 'capox',
    genericNames: ['oksaliplatin', 'kapecitabin'], brandNames: ['Eloxatin', 'Xeloda'],
    tumorGroupSlug: 'gi',
    treatmentType: TreatmentType.CHEMOTHERAPY,
    administrationRoute: AdministrationRoute.COMBINATION_IV_ORAL,
    cycleDescription: 'Dag 1: oksaliplatin iv på sykehuset. Dag 1–14: kapecitabin tabletter hjemme. 7 dagers pause.',
    numberOfCycles: 'Adjuvant: 8 kurer. Metastatisk: inntil progresjon.',
    sourceReference: 'Nasjonalt handlingsprogram for kolorektalkreft',
    sections: [
      { sectionType: SectionType.INTRODUCTION, title: 'Om behandlingen', content: 'CAPOX (også kalt XELOX) kombinerer oksaliplatin gitt som infusjon på sykehuset med kapecitabin-tabletter du tar hjemme. Dette er et alternativ til FOLFOX og har lignende effekt, men med færre sykehusbesøk.' },
      { sectionType: SectionType.ADMINISTRATION, title: 'Behandlingsopplegg', content: '**Dag 1 – sykehuset:** Du møter for oksaliplatin-infusjon (ca. 2 timer). Kvalmestillende gis i forkant.\n\n**Dag 1–14 – hjemme:** Du tar kapecitabin-tabletter to ganger daglig med mat.\n\n**Dag 15–21:** Pause. Ingen tabletter, ingen infusjon.\n\n**Dag 22:** Ny syklus starter.' },
      { sectionType: SectionType.GENERAL_ADVICE, title: 'Kuldefølsomhet og hånd-fot-syndrom', content: 'Unngå kalde drikker og kalde gjenstander de første dagene etter oksaliplatin-infusjonen.\n\nKapecitabin kan gi hånd-fot-syndrom: røde, ømme hender og fotsåler. Bruk fet hudkrem daglig fra behandlingsstart.' },
    ],
    sideEffects: [
      { name: 'Nevropati/kuldefølsomhet', description: 'Fra oksaliplatin. Prikking og nummenhet i fingre og tær, kuldefølsomhet.', frequency: SideEffectFreq.VERY_COMMON, management: 'Unngå kulde de første dagene. Meld fra om tiltagende symptomer.' },
      { name: 'Hånd-fot-syndrom', description: 'Fra kapecitabin.', frequency: SideEffectFreq.VERY_COMMON, management: 'Fet krem daglig fra dag 1. Kontakt legen ved alvorlige hudreaksjoner.' },
      { name: 'Diare', description: 'Kan gi diare.', frequency: SideEffectFreq.COMMON, management: 'Loperamid ved behov. Kontakt lege ved > 4 løse avføringer per dag.' },
      { name: 'Benmargsdepresjon', description: 'Regelmessige blodprøver nødvendig.', frequency: SideEffectFreq.COMMON, management: 'Kontakt sykehus ved feber.' },
    ],
    alertInstructions: [
      { urgency: AlertUrgency.EMERGENCY, instruction: 'Feber ≥38,3 °C. Stopp kapecitabin-tablettene.', action: 'Kontakt akuttmottak umiddelbart' },
      { urgency: AlertUrgency.URGENT, instruction: 'Mer enn 4 løse avføringer per dag', action: 'Stopp tablettene. Kontakt onkologisk poliklinikk.' },
      { urgency: AlertUrgency.URGENT, instruction: 'Alvorlig hånd-fot-syndrom med sprekker og smerter', action: 'Stopp tablettene. Kontakt onkologisk poliklinikk.' },
    ],
    premedication: [
      { medication: 'Ondansetron 8 mg iv', timing: '30 min før oksaliplatin', isRequired: true },
      { medication: 'Deksametason 8 mg iv', timing: '30 min før oksaliplatin', isRequired: true },
    ],
  });

  // ── KUR 13: Karboplatin + Pemetreksed + Pembrolizumab ────────
  await createRegimen({
    name: 'Karboplatin + Pemetreksed + Pembrolizumab', slug: 'karboplatin-pemetreksed-pembrolizumab',
    genericNames: ['karboplatin', 'pemetreksed', 'pembrolizumab'],
    brandNames: ['Carboplatin', 'Alimta', 'Keytruda'],
    tumorGroupSlug: 'lunge',
    treatmentType: TreatmentType.COMBINATION,
    administrationRoute: AdministrationRoute.INTRAVENOUS,
    cycleDescription: 'Kombinasjonsfase: 4 kurer hver 3. uke. Vedlikehold: pemetreksed + pembrolizumab.',
    numberOfCycles: 'Kombinasjon: 4 kurer. Vedlikehold: inntil 2 år.',
    sourceReference: 'Nasjonalt handlingsprogram for lungekreft (ikke-småcellet, ikke-plateepitel)',
    sections: [
      { sectionType: SectionType.INTRODUCTION, title: 'Om behandlingen', content: 'Denne kombinasjonen brukes ved ikke-småcellet lungekreft uten EGFR/ALK-mutasjon og uten PD-L1-høy ekspresjon. Den kombinerer to cellegifter (karboplatin og pemetreksed) med en immunterapi (pembrolizumab/Keytruda®).' },
      { sectionType: SectionType.PREPARATION, title: 'Viktig forberedelse', content: 'Pemetreksed krever tilskudd av folinsyre (B9) og vitamin B12 for å redusere bivirkninger:\n- **Folinsyre 400 mcg** daglig fra 7 dager før oppstart, gjennom hele behandlingen og i 21 dager etter siste dose\n- **Vitamin B12** injeksjon gis av legen 1–2 uker før oppstart, deretter hver 9. uke\n\nDette er obligatorisk og kan ikke hoppes over.' },
      { sectionType: SectionType.ADMINISTRATION, title: 'Behandlingsdagen', content: 'Infusjonene gis i rekkefølge: pembrolizumab over 30 min, pemetreksed over 10 min, deretter karboplatin over 30–60 min. Totalt ca. 3–4 timer på poliklinikken.' },
    ],
    sideEffects: [
      { name: 'Benmargsdepresjon', description: 'Nøytropeni og trombocytopeni er vanlig.', frequency: SideEffectFreq.VERY_COMMON, severity: 'Potensielt alvorlig', management: 'Blodprøver etter hver kur.' },
      { name: 'Tretthet', description: 'Uttalt tretthet er svært vanlig.', frequency: SideEffectFreq.VERY_COMMON, management: 'Hvil etter behov.' },
      { name: 'Immunreaksjoner (fra pembrolizumab)', description: 'Se informasjon om pembrolizumab. Alle organer kan affiseres.', frequency: SideEffectFreq.COMMON, management: 'Kontakt legen ved nye symptomer.' },
      { name: 'Kvalme', description: 'Karboplatin gir moderat kvalme.', frequency: SideEffectFreq.COMMON, management: 'Forebygges med antiemetika.' },
      { name: 'Nyrepåvirkning', description: 'Karboplatin utskilles via nyrene. Nyrefunksjon måles regelmessig.', frequency: SideEffectFreq.COMMON, management: 'Godt væskeinntak er viktig.' },
    ],
    alertInstructions: [
      { urgency: AlertUrgency.EMERGENCY, instruction: 'Feber ≥38,3 °C eller frostrier', action: 'Kontakt akuttmottak umiddelbart' },
      { urgency: AlertUrgency.URGENT, instruction: 'Ny kortpustethet, hoste eller brystsmerte (immunpneumonitt)', action: 'Kontakt onkologisk avdeling samme dag' },
      { urgency: AlertUrgency.URGENT, instruction: 'Diare > 4 løse avføringer/dag eller blod i avføringen', action: 'Kontakt onkologisk poliklinikk' },
    ],
    premedication: [
      { medication: 'Folinsyre 400 mcg po', timing: 'Daglig fra 7 dager før oppstart gjennom hele behandlingen', isRequired: true, notes: 'OBLIGATORISK' },
      { medication: 'Vitamin B12 im-injeksjon', timing: '1–2 uker før oppstart, deretter hver 9. uke', isRequired: true, notes: 'OBLIGATORISK' },
      { medication: 'Ondansetron 8 mg iv', timing: '30 min før behandling', isRequired: true },
      { medication: 'Deksametason 8 mg iv', timing: '30 min før behandling', isRequired: true },
    ],
  });

  // ── KUR 14: FLOX (Nordisk bolusregime) ──────────────────────
  await createRegimen({
    name: 'FLOX (Nordisk bolusregime)', slug: 'flox',
    genericNames: ['oksaliplatin', '5-fluorouracil', 'kalsiumfolinat'],
    brandNames: ['Eloxatin', 'Fluorouracil', 'Isovorin'],
    tumorGroupSlug: 'gi',
    treatmentType: TreatmentType.CHEMOTHERAPY,
    administrationRoute: AdministrationRoute.INTRAVENOUS,
    cycleDescription: 'Oksaliplatin dag 1 og 15. 5-FU bolus ukentlig i 8 uker. Deretter 2 ukers pause.',
    numberOfCycles: 'Adjuvant: 3 sykluser (ca. 6 måneder)',
    sourceReference: 'Nasjonalt handlingsprogram for kolorektalkreft',
    sections: [
      { sectionType: SectionType.INTRODUCTION, title: 'Om behandlingen', content: 'FLOX er et norsk/nordisk cellegiftregime ved tykktarm- og endetarmskreft. Det er et enklere alternativ til FOLFOX da det ikke krever hjemmeinfusjonspumpe, men gis som bolus-injeksjoner på poliklinikken.' },
      { sectionType: SectionType.ADMINISTRATION, title: 'Behandlingsopplegg', content: 'Du møter ukentlig til poliklinikken for 5-FU bolus-injeksjon (dag 1, 8, 15, 22, 29, 36, 43, 50). I tillegg gis oksaliplatin på dag 1 og 15 av hver syklus.\n\nSelve behandlingen på sykehuset tar 1–2 timer.' },
    ],
    sideEffects: [
      { name: 'Nevropati/kuldefølsomhet', description: 'Fra oksaliplatin.', frequency: SideEffectFreq.VERY_COMMON, management: 'Unngå kulde etter oksaliplatin-dag.' },
      { name: 'Diare', description: 'Fra 5-FU.', frequency: SideEffectFreq.COMMON, management: 'Loperamid. Kontakt lege ved alvorlig diare.' },
      { name: 'Benmargsdepresjon', description: 'Blodprøver ukentlig.', frequency: SideEffectFreq.COMMON, management: 'Kontakt sykehus ved feber.' },
    ],
    alertInstructions: [
      { urgency: AlertUrgency.EMERGENCY, instruction: 'Feber ≥38,3 °C', action: 'Kontakt akuttmottak umiddelbart' },
      { urgency: AlertUrgency.URGENT, instruction: 'Sterk diare eller oppkast', action: 'Kontakt onkologisk poliklinikk' },
    ],
    premedication: [
      { medication: 'Ondansetron 8 mg iv', timing: '30 min før behandling (oksaliplatin-dager)', isRequired: true },
    ],
  });

  // ── KUR 15: Nivolumab monoterapi ────────────────────────────
  await createRegimen({
    name: 'Nivolumab (Opdivo)', slug: 'nivolumab',
    genericNames: ['nivolumab'], brandNames: ['Opdivo'],
    tumorGroupSlug: 'melanom',
    treatmentType: TreatmentType.IMMUNOTHERAPY,
    administrationRoute: AdministrationRoute.INTRAVENOUS,
    cycleDescription: 'Infusjon over 30 min hver 4. uke (480 mg flat dose)',
    numberOfCycles: 'Inntil 2 år, eller til progresjon/uakseptabel toksisitet',
    sourceReference: 'Nasjonalt handlingsprogram for melanomer',
    sections: [
      { sectionType: SectionType.INTRODUCTION, title: 'Om behandlingen', content: 'Nivolumab (Opdivo®) er en PD-1-hemmer, en type immunterapi. Det hjelper immunforsvaret med å gjenkjenne og bekjempe kreftcellene. Det brukes ved melanom, lungekreft og flere andre kreftformer.' },
      { sectionType: SectionType.ADMINISTRATION, title: 'Behandlingen', content: 'Nivolumab gis som infusjon over 30 minutter på poliklinikken. Du observeres i 30–60 minutter etterpå. Blodprøver tas regelmessig.' },
      { sectionType: SectionType.IMPORTANT_INFO, title: 'Immunreaksjoner', content: 'Som all immunterapi kan nivolumab gi immunreaksjoner i ulike organer. Informer alltid annet helsepersonell om at du er i immunterapi. Symptomene kan komme sent, også etter avsluttet behandling.' },
    ],
    sideEffects: [
      { name: 'Tretthet', description: 'Vanlig, men ofte mild.', frequency: SideEffectFreq.VERY_COMMON, management: 'Hvil etter behov.' },
      { name: 'Hudreaksjoner', description: 'Utslett og kløe.', frequency: SideEffectFreq.COMMON, management: 'Fuktighetskremer.' },
      { name: 'Immunrelaterte bivirkninger', description: 'Kan ramme lunger, tarm, lever, skjoldbruskkjertel m.fl.', frequency: SideEffectFreq.COMMON, severity: 'Potensielt alvorlig', management: 'Kontakt lege ved nye symptomer.' },
    ],
    alertInstructions: [
      { urgency: AlertUrgency.EMERGENCY, instruction: 'Alvorlig kortpustethet eller brystsmerte', action: 'Ring 113 umiddelbart' },
      { urgency: AlertUrgency.URGENT, instruction: 'Ny hoste, diare > 4 x/dag, gulsott', action: 'Kontakt onkologisk poliklinikk samme dag' },
      { urgency: AlertUrgency.URGENT, instruction: 'Feber over 38 °C', action: 'Kontakt akuttmottak' },
    ],
    premedication: [],
  });

  console.log('All regimens created');
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
