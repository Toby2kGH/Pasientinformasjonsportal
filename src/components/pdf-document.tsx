import path from 'node:path';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import type { Department, Hospital, SectionType } from '@prisma/client';
import type { RegimenDetail } from '@/lib/regimen-query';
import { urgencyOrder } from '@/lib/regimen-query';
import {
  administrationRouteLabel,
  alertUrgencyLabel,
  sideEffectFreqLabel,
  treatmentTypeLabel,
} from '@/lib/utils';

const BLUE = '#1E3A5F';
const RED = '#C41E3A';
const GRAY = '#4B5563';

const s = StyleSheet.create({
  page: { paddingTop: 36, paddingBottom: 110, paddingHorizontal: 48, fontSize: 10, fontFamily: 'Helvetica', color: '#1A1D23', lineHeight: 1.45 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: BLUE, paddingBottom: 10, marginBottom: 18 },
  logoBadge: { backgroundColor: BLUE, borderRadius: 4, paddingVertical: 8, paddingHorizontal: 14 },
  logoBadgeText: { color: 'white', fontFamily: 'Helvetica-Bold', fontSize: 14 },
  logoImage: { height: 40, maxWidth: 160, objectFit: 'contain' },
  hospitalName: { fontFamily: 'Times-Bold', fontSize: 14, color: BLUE, textAlign: 'right' },
  departmentName: { fontSize: 10, color: GRAY, textAlign: 'right' },
  title: { fontFamily: 'Times-Bold', fontSize: 20, marginBottom: 8 },
  meta: { fontSize: 9, color: GRAY, marginBottom: 2 },
  bold: { fontFamily: 'Helvetica-Bold' },
  h2: { fontFamily: 'Times-Bold', fontSize: 13, marginTop: 14, marginBottom: 6, paddingBottom: 2, borderBottomWidth: 0.5, borderBottomColor: '#D1D5DB' },
  paragraph: { marginBottom: 5 },
  bulletRow: { flexDirection: 'row', marginBottom: 2, paddingLeft: 6 },
  bullet: { width: 10 },
  alertBox: { marginTop: 14, borderWidth: 1.5, borderColor: RED, borderRadius: 4 },
  alertHeader: { backgroundColor: RED, color: 'white', fontFamily: 'Helvetica-Bold', fontSize: 12, paddingVertical: 5, paddingHorizontal: 8 },
  alertRow: { paddingVertical: 5, paddingHorizontal: 8, borderTopWidth: 0.5, borderTopColor: '#F3C4CC' },
  alertEmergency: { backgroundColor: '#FDECEF' },
  sideEffect: { marginBottom: 6 },
  premedBox: { marginTop: 10, padding: 8, backgroundColor: '#EFF4FA', borderRadius: 4 },
  footer: { position: 'absolute', bottom: 28, left: 48, right: 48, borderTopWidth: 1.5, borderTopColor: BLUE, paddingTop: 6, fontSize: 9 },
  footerTitle: { fontFamily: 'Helvetica-Bold', color: BLUE, marginBottom: 2 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, fontSize: 7.5, color: GRAY },
});

const sectionOrder: SectionType[] = [
  'INTRODUCTION', 'INDICATION', 'PREPARATION', 'ADMINISTRATION',
  'NAUSEA_MANAGEMENT', 'DIETARY_ADVICE', 'FERTILITY',
  'GENERAL_ADVICE', 'IMPORTANT_INFO', 'SIDE_EFFECTS',
];

// The built-in PDF fonts use WinAnsi encoding; map the few characters outside it.
function pdfText(text: string): string {
  return text.replace(/≥\s*/g, 'minst ').replace(/≤\s*/g, 'maks ');
}

function InlineText({ text }: { text: string }) {
  const parts = pdfText(text).split(/\*\*(.+?)\*\*/g);
  return (
    <Text>
      {parts.map((part, i) => (i % 2 === 1 ? <Text key={i} style={s.bold}>{part}</Text> : part))}
    </Text>
  );
}

function MarkdownBlock({ content }: { content: string }) {
  return (
    <View>
      {content.split(/\n{2,}/).map((block, i) => (
        <View key={i} style={s.paragraph}>
          {block.split('\n').map((line, j) =>
            line.startsWith('- ') ? (
              <View key={j} style={s.bulletRow}>
                <Text style={s.bullet}>•</Text>
                <View style={{ flex: 1 }}><InlineText text={line.slice(2)} /></View>
              </View>
            ) : (
              <InlineText key={j} text={line} />
            ),
          )}
        </View>
      ))}
    </View>
  );
}

function Logo({ hospital }: { hospital: Hospital }) {
  // react-pdf cannot render SVG files; placeholder SVG logos are drawn as a badge instead.
  if (hospital.logoUrl && /\.(png|jpe?g)$/i.test(hospital.logoUrl) && hospital.logoUrl.startsWith('/logos/')) {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <Image style={s.logoImage} src={path.join(process.cwd(), 'public', path.normalize(hospital.logoUrl))} />;
  }
  return (
    <View style={s.logoBadge}>
      <Text style={s.logoBadgeText}>{hospital.shortName}</Text>
    </View>
  );
}

interface Props {
  regimen: RegimenDetail;
  hospital: Hospital | null;
  department: Department | null;
}

export default function PatientInfoPdf({ regimen, hospital, department }: Props) {
  const sections = [...regimen.patientInfoSections].sort(
    (a, b) => sectionOrder.indexOf(a.sectionType) - sectionOrder.indexOf(b.sectionType),
  );
  const alerts = [...regimen.alertInstructions].sort(
    (a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency] || a.sortOrder - b.sortOrder,
  );
  const dateFmt = (d: Date) => d.toLocaleDateString('nb-NO', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document
      title={`Behandling med ${regimen.name}`}
      author={hospital?.name ?? 'KreftInfo Norge'}
      subject="Pasientinformasjon"
      language="nb"
    >
      <Page size="A4" style={s.page}>
        <View style={s.header} fixed>
          {hospital ? <Logo hospital={hospital} /> : <Text style={s.meta}>KreftInfo Norge</Text>}
          <View>
            <Text style={s.hospitalName}>{hospital?.name ?? 'Sykehus ikke valgt'}</Text>
            {department && <Text style={s.departmentName}>{department.name}</Text>}
          </View>
        </View>

        <Text style={s.title}>Behandling med {pdfText(regimen.name)}</Text>
        <Text style={s.meta}>
          {treatmentTypeLabel(regimen.treatmentType)} · {administrationRouteLabel(regimen.administrationRoute)}
        </Text>
        {regimen.genericNames.length > 0 && (
          <Text style={s.meta}><Text style={s.bold}>Virkestoff: </Text>{regimen.genericNames.join(', ')}</Text>
        )}
        {regimen.cycleDescription && (
          <Text style={s.meta}><Text style={s.bold}>Syklus: </Text>{pdfText(regimen.cycleDescription)}</Text>
        )}
        {regimen.numberOfCycles && (
          <Text style={s.meta}><Text style={s.bold}>Antall kurer: </Text>{pdfText(regimen.numberOfCycles)}</Text>
        )}

        {alerts.length > 0 && (
          <View style={s.alertBox} wrap={false}>
            <Text style={s.alertHeader}>NÅR MÅ DU KONTAKTE LEGE?</Text>
            {alerts.map((a, i) => (
              <View key={i} style={[s.alertRow, ...(a.urgency === 'EMERGENCY' ? [s.alertEmergency] : [])]}>
                <Text style={s.bold}>{pdfText(a.instruction)}</Text>
                <Text>
                  <Text style={s.bold}>{alertUrgencyLabel(a.urgency)}: </Text>
                  {pdfText(a.action)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {regimen.premedication.length > 0 && (
          <View style={s.premedBox} wrap={false}>
            <Text style={[s.bold, { color: BLUE, marginBottom: 3 }]}>Medisiner du får i forkant</Text>
            {regimen.premedication.map((p, i) => (
              <Text key={i}>
                • <Text style={s.bold}>{pdfText(p.medication)}</Text> – {pdfText(p.timing)}
                {p.notes ? ` (${pdfText(p.notes)})` : ''}
              </Text>
            ))}
          </View>
        )}

        {sections.map((section, i) => (
          <View key={i}>
            <Text style={s.h2} minPresenceAhead={40}>{pdfText(section.title)}</Text>
            <MarkdownBlock content={section.content} />
          </View>
        ))}

        {regimen.sideEffects.length > 0 && (
          <View>
            <Text style={s.h2} minPresenceAhead={40}>Mulige bivirkninger</Text>
            {regimen.sideEffects.map((se, i) => (
              <View key={i} style={s.sideEffect} wrap={false}>
                <Text>
                  <Text style={s.bold}>{pdfText(se.name)}</Text>
                  <Text style={{ color: GRAY }}> – {sideEffectFreqLabel(se.frequency)}</Text>
                </Text>
                <Text>{pdfText(se.description)}</Text>
                {se.management && <Text style={{ color: GRAY }}>Råd: {pdfText(se.management)}</Text>}
              </View>
            ))}
          </View>
        )}

        <View style={s.footer} fixed>
          {department ? (
            <>
              <Text style={s.footerTitle}>Viktige telefonnumre – {hospital?.name}</Text>
              {department.emergencyPhone && <Text>Akuttmottak (døgnåpent): {department.emergencyPhone}</Text>}
              {department.phoneNumber && (
                <Text>
                  {department.name}: {department.phoneNumber}
                  {department.openingHours ? ` (${department.openingHours})` : ''}
                </Text>
              )}
            </>
          ) : (
            <Text style={[s.footerTitle, { color: RED }]}>
              Kontaktinformasjon mangler – velg sykehus og avdeling før utskrift.
            </Text>
          )}
          <View style={s.footerRow}>
            <Text>
              Versjon {regimen.version}
              {regimen.lastReviewedAt ? ` · Faglig gjennomgått ${dateFmt(regimen.lastReviewedAt)}` : ''}
              {regimen.sourceReference ? ` · Kilde: ${pdfText(regimen.sourceReference)}` : ''}
            </Text>
            <Text render={({ pageNumber, totalPages }) => `Side ${pageNumber} av ${totalPages}`} />
          </View>
        </View>
      </Page>
    </Document>
  );
}
