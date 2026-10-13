export interface ThgAffiliateLink {
  id: 'info' | 'year2026' | 'year2027';
  partnerDomain: string;
  campaignKey: string;
  url: string;
  targetDescription: string;
  purpose: string;
  ctaText: string;
  enabled: boolean;
  rel: string;
}

export interface ThgYearConfig {
  year: number;
  affiliateUrl: string;
  enabled: boolean;
  status: 'active' | 'upcoming' | 'closed';
  statusLabel: string;
  payoutInfo: string;
  payoutRangeNote: string;
  deadlineGov: string;
  deadlineProviderNotice: string;
  electricKwhPkwM1: number | null;
  verificationDate: string;
  notes: string;
}

export interface ThgLegalSource {
  title: string;
  citation: string;
  url?: string;
  type: 'Gesetz' | 'Verordnung' | 'Behörde' | 'Ministerium';
}

export interface ThgFaqItem {
  q: string;
  a: string;
  category: 'Grundlagen' | 'Voraussetzungen' | 'Antrag & Fristen' | 'Finanzen & Markt';
}

export const THG_CONFIG = {
  canonicalPath: '/thg-praemie',
  canonicalUrl: 'https://www.ladestandorte.de/thg-praemie',
  lastVerified: '13. Oktober 2026',
  editorialCheckDate: '2026-10-13',
  affiliateLinks: {
    info: {
      id: 'info',
      partnerDomain: 'thgverkauf.de',
      campaignKey: 'ladestandorte-info',
      url: 'https://thgverkauf.de/c/ladestandorte?k=ladestandorte-info&zu=%2Fso-funktionierts',
      targetDescription: 'So funktioniert es',
      purpose: 'Allgemeine Informationen zum Ablauf des THG-Quotenverkaufs.',
      ctaText: 'So funktioniert der THG-Quotenverkauf beim Partner *',
      enabled: true,
      rel: 'sponsored noopener noreferrer'
    } as ThgAffiliateLink,
    year2026: {
      id: 'year2026',
      partnerDomain: 'thg2026.de',
      campaignKey: 'ladestandorte-2026',
      url: 'https://thg2026.de/c/ladestandorte?k=ladestandorte-2026&zu=%2Fhochladen',
      targetDescription: 'Fahrzeugschein hochladen',
      purpose: 'Einstieg in den Antragsprozess für das Quotenjahr 2026.',
      ctaText: 'THG-Prämie 2026 beim Partner beantragen *',
      enabled: true,
      rel: 'sponsored noopener noreferrer'
    } as ThgAffiliateLink,
    year2027: {
      id: 'year2027',
      partnerDomain: 'thg2027.de',
      campaignKey: 'ladestandorte-2027',
      url: 'https://thg2027.de/c/ladestandorte?k=ladestandorte-2027',
      targetDescription: 'Startseite',
      purpose: 'Informationen zum Quotenjahr 2027.',
      ctaText: 'Informationen zur THG-Prämie 2027 beim Partner *',
      enabled: false, // WICHTIG: Antrag 2027 noch nicht geöffnet, Human-in-the-Loop Safety Guard aktiv
      rel: 'sponsored noopener noreferrer'
    } as ThgAffiliateLink
  },
  years: {
    2026: {
      year: 2026,
      affiliateUrl: 'https://thg2026.de/c/ladestandorte?k=ladestandorte-2026&zu=%2Fhochladen',
      enabled: true,
      status: 'active',
      statusLabel: 'Antrag aktiv möglich',
      payoutInfo: 'Marktbasierte Vergütung (beobachtete Angebote für Pkw M1 bis zu 350 €)',
      payoutRangeNote: 'Reine Markterlöse ohne staatliche Garantie. Auszahlungsbeträge schwanken je nach Dienstleister und Quotenhändler.',
      deadlineGov: '15. November 2026 beim Umweltbundesamt (§ 8 38. BImSchV)',
      deadlineProviderNotice: 'Dienstleister schließen die Annahme für 2026 häufig bereits Ende Oktober / Anfang November, um die Bündelung und UBA-Einreichung fristgerecht abzuschließen.',
      electricKwhPkwM1: 2000,
      verificationDate: '2026-10-13',
      notes: 'Quotenjahr 2026 ist aktiv. Anträge werden von Quotenhändlern entgegengenommen und für die UBA-Mitteilung vorbereitet.'
    } as ThgYearConfig,
    2027: {
      year: 2027,
      affiliateUrl: 'https://thg2027.de/c/ladestandorte?k=ladestandorte-2027',
      enabled: false,
      status: 'upcoming',
      statusLabel: 'Ausblick / Beträge noch offen',
      payoutInfo: 'Auszahlungsbeträge noch nicht festgelegt',
      payoutRangeNote: 'Verbindliche Quotenpreise und UBA-Schätzwerte für das Verpflichtungsjahr 2027 stehen noch nicht fest. Angebote folgen zum Jahreswechsel.',
      deadlineGov: '15. November 2027 beim Umweltbundesamt (§ 8 38. BImSchV)',
      deadlineProviderNotice: 'Antragsannahme mit verbindlichen Konditionen startet voraussichtlich ab Ende 2026 / Anfang 2027.',
      electricKwhPkwM1: null,
      verificationDate: '2026-10-13',
      notes: 'Gesetzlicher Rahmen nach BImSchG und 38. BImSchV gilt fort. Konkrete Quotenhandelswerte und UBA-Referenzwerte für 2027 sind noch offen.'
    } as ThgYearConfig
  }
};

export const THG_LEGAL_SOURCES: ThgLegalSource[] = [
  {
    title: '§ 37a Bundes-Immissionsschutzgesetz (BImSchG)',
    citation: 'Gesetzliche Pflicht zur Minderung von Treibhausgasen für Unternehmen, die fossile Kraftstoffe in Verkehr bringen.',
    type: 'Gesetz'
  },
  {
    title: '38. BImSchV (Verordnung zur Treibhausgasminderung bei Kraftstoffen)',
    citation: 'Regelt die Anrechnung von elektrischem Strom für reine Batterie-Elektrofahrzeuge (§§ 5–8) sowie die gesetzliche Meldefrist zum 15. November.',
    type: 'Verordnung'
  },
  {
    title: 'Umweltbundesamt (UBA) – Vollzug der 38. BImSchV',
    citation: 'Amtliche Bescheinigung von Strommengen und Festlegung pauschaler Schätzwerte für Straßenfahrzeuge im Bundesanzeiger.',
    type: 'Behörde'
  },
  {
    title: 'Bundesministerium für Umwelt, Naturschutz, nukleare Sicherheit und Verbraucherschutz (BMUV)',
    citation: 'Übergeordneter Verordnungsgeber für die Weiterentwicklung der THG-Quote im Verkehrssektor.',
    type: 'Ministerium'
  }
];

export const THG_FAQS: ThgFaqItem[] = [
  {
    q: 'Was ist die THG-Prämie?',
    a: 'Die Treibhausgasminderungsprämie (THG-Prämie) ist die finanzielle Vergütung, die Halter von reinen Elektrofahrzeugen erhalten, wenn sie das durch ihr Fahrzeug eingesparte CO2 in Form einer THG-Quote an quotenverpflichtete Mineralölunternehmen verkaufen.',
    category: 'Grundlagen'
  },
  {
    q: 'Was bedeutet THG-Quote?',
    a: 'Die THG-Quote (Treibhausgasminderungsquote) ist ein gesetzliches Klimaschutzinstrument nach § 37a BImSchG. Mineralölunternehmen, die Benzin und Diesel in den Verkehr bringen, sind gesetzlich verpflichtet, die Treibhausgasemissionen ihrer Kraftstoffe schrittweise um einen bestimmten Prozentsatz zu senken.',
    category: 'Grundlagen'
  },
  {
    q: 'Warum können Elektroautohalter davon profitieren?',
    a: 'Reine Elektrofahrzeuge stoßen im Betrieb lokal keine CO2-Emissionen aus. Nach der 38. BImSchV wird der verbrauchte Ladestrom pauschal als CO2-Minderung anerkannt. Mineralölkonzerne können diese Einsparungen aufkaufen, um ihre gesetzlichen Minderungsziele zu erfüllen und Strafzahlungen zu vermeiden.',
    category: 'Grundlagen'
  },
  {
    q: 'Wer ist anspruchsberechtigt?',
    a: 'Anspruchsberechtigt ist ausschließlich die Person oder das Unternehmen, die bzw. das in der Zulassungsbescheinigung Teil I (Fahrzeugschein) als Fahrzeughalter eingetragen ist. Ob das Fahrzeug geleast, finanziert oder im Eigentum ist, ist für die Berechtigung unerheblich.',
    category: 'Voraussetzungen'
  },
  {
    q: 'Welche Fahrzeuge sind förderfähig?',
    a: 'Förderfähig sind ausschließlich reine Batterie-Elektrofahrzeuge (BEV) mit amtlicher Zulassung in Deutschland. Dies umfasst Pkw (Fahrzeugklasse M1), leichte Nutzfahrzeuge und Transporter (N1), schwere Nutzfahrzeuge (N2, N3), Busse (M3) sowie zulassungspflichtige Elektro-Krafträder mit amtlichem Kennzeichen.',
    category: 'Voraussetzungen'
  },
  {
    q: 'Sind Plug-in-Hybride berechtigt?',
    a: 'Nein. Plug-in-Hybride (PHEV) und Vollhybride sind nach der 38. BImSchV ausdrücklich von der pauschalen Fahrzeuganrechnung ausgeschlossen, da sie auch über einen Verbrennungsmotor verfügen. Nur rein batterieelektrische Fahrzeuge (Feld P.3 im Fahrzeugschein: Elektro) erhalten die Prämie.',
    category: 'Voraussetzungen'
  },
  {
    q: 'Welche Rolle spielt die Fahrzeugzulassung?',
    a: 'Das Fahrzeug muss im jeweiligen Kalenderjahr mindestens einen Tag auf den Antragsteller in Deutschland amtlich zugelassen gewesen sein. Die Zulassung wird anhand der FIN (Fahrzeug-Identifizierungsnummer) beim Umweltbundesamt geprüft, um Doppeleinreichungen auszuschließen.',
    category: 'Voraussetzungen'
  },
  {
    q: 'Welche Unterlagen werden benötigt?',
    a: 'Für die Beantragung werden lediglich ein gut lesbares Foto oder ein Scan der Vorder- und Rückseite der Zulassungsbescheinigung Teil I (Fahrzeugschein), die persönlichen Halterdaten sowie eine deutsche oder europäische IBAN für die Auszahlung benötigt.',
    category: 'Antrag & Fristen'
  },
  {
    q: 'Wie funktioniert die Beantragung?',
    a: 'Der Halter lädt den Fahrzeugschein bei einem THG-Dienstleister hoch. Dieser prüft das Dokument, bündelt Anträge und reicht sie beim Umweltbundesamt (UBA) ein. Nach Prüfung und Zertifizierung durch das UBA veräußert der Anbieter die Quote an Mineralölunternehmen und überweist den Erlös abzüglich seiner Servicegebühr an den Halter.',
    category: 'Antrag & Fristen'
  },
  {
    q: 'Welche Fristen gelten für 2026?',
    a: 'Die gesetzliche Einreichungsfrist beim Umweltbundesamt für das Verpflichtungsjahr 2026 endet gemäß § 8 der 38. BImSchV am 15. November 2026. Vermittler und Quotenhändler setzen in der Praxis meist frühere Annahmeschlüsse (Ende Oktober / Anfang November 2026), um die Datenbearbeitung rechtzeitig abzuschließen.',
    category: 'Antrag & Fristen'
  },
  {
    q: 'Welche Regelungen gelten für 2027?',
    a: 'Der gesetzliche Rahmen nach BImSchG bleibt für 2027 bestehen. Die gesetzliche UBA-Frist für 2027 wird der 15. November 2027 sein. Die amtlichen Schätzwerte für die Strommengen sowie die Marktpreise der Mineralölkonzerne werden jedoch erst gegen Ende 2026 bzw. Anfang 2027 fixiert. Verbindliche Auszahlungsbeträge für 2027 stehen noch nicht fest.',
    category: 'Antrag & Fristen'
  },
  {
    q: 'Wie wird die Auszahlungshöhe bestimmt?',
    a: 'Die Prämie ist keine fixe staatliche Subvention, sondern ein freier Marktpreis. Er richtet sich nach Angebot und Nachfrage am Quotenmarkt (Preis pro Tonne CO2-Äquivalent), multipliziert mit der amtlich geschätzten Strommenge (für Pkw M1: 2.000 kWh), abzüglich der Marge des Vermittlers.',
    category: 'Finanzen & Markt'
  },
  {
    q: 'Wann erfolgt die Auszahlung?',
    a: 'Der genaue Zeitpunkt hängt vom gewählten Modell und den jeweiligen Vertragsbedingungen des Anbieters ab. Bei regulären Abwicklungen erfolgt die Auszahlung üblicherweise erst, nachdem das Umweltbundesamt die Bescheinigung erteilt und der Dienstleister die Strommenge vermarktet hat. Dies kann je nach Bearbeitungsaufkommen der Behörde mehrere Wochen oder Monate in Anspruch nehmen. Einige Dienstleister bieten gesonderte Express- oder Sofortmodelle an, für die jedoch abweichende Konditionen oder Sicherheitsabschläge gelten können.',
    category: 'Finanzen & Markt'
  },
  {
    q: 'Kann die Prämie jährlich beantragt werden?',
    a: 'Ja. Die THG-Prämie kann in jedem Kalenderjahr erneut beantragt werden, solange das Fahrzeug auf den Halter zugelassen ist. Sie verlängert sich nicht automatisch, sodass für jedes Quotenjahr ein neuer Antrag gestellt werden muss.',
    category: 'Antrag & Fristen'
  },
  {
    q: 'Was passiert bei einem Fahrzeugwechsel?',
    a: 'Die Quote wird pro Fahrzeug (FIN) und Kalenderjahr nur genau einmal bescheinigt. Wer ein E-Auto kauft, dessen Vorbesitzer die Quote für das laufende Jahr bereits geltend gemacht hat, kann im selben Jahr keine Prämie mehr beanspruchen. Eine anteilige Monatsaufteilung existiert gesetzlich nicht.',
    category: 'Voraussetzungen'
  },
  {
    q: 'Worauf sollte man bei THG-Anbietern achten?',
    a: 'Achten Sie auf transparente Gebührenmodelle, den Unterschied zwischen fixen Garantiebeträgen und marktabhängigen Flex-Prämien, faire Auszahlungsfristen und insbesondere darauf, dass Verträge keine automatische Abtretung für Folgejahre enthalten.',
    category: 'Finanzen & Markt'
  }
];
