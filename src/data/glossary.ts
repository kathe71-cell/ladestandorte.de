export interface GlossaryEntry {
  slug: string;
  term: string;
  category: "Stecker & Hardware" | "Normen & Gesetze" | "Abrechnung & Roaming" | "Elektrotechnik";
  shortDef: string;
  fullExplanation: string;
  standardNorm?: string;
  practicalTip: string;
}

export const GLOSSARY_DATA: GlossaryEntry[] = [
  {
    slug: "ccs-combined-charging-system",
    term: "CCS (Combined Charging System / Combo 2)",
    category: "Stecker & Hardware",
    shortDef: "Der gesetzliche europäische Standardstecker für DC-Schnellladung bis zu 400 kW.",
    fullExplanation: "Das Combined Charging System (CCS) erweitert den herkömmlichen europäischen Typ-2-Stecker um zwei zusätzliche groß dimensionierte Gleichstrom-Kontakte im unteren Bereich. Dadurch können moderne Elektrofahrzeuge sowohl an Wechselstrom (AC) als auch an High-Power-Chargern (DC) mit einem einzigen fahrzeugseitigen Ladeport geladen werden. Nach der deutschen Ladesäulenverordnung (LSV) und der europäischen AFIR-Verordnung ist CCS an allen neu errichteten öffentlichen Schnellladepunkten mit mehr als 50 kW Ladeleistung zwingend vorgeschrieben.",
    standardNorm: "DIN EN 62196-3 / IEC 62196",
    practicalTip: "Bei CCS-Ladung verriegelt der Stecker elektronisch im Fahrzeugport. Sollte sich der Stecker nach Ladeende nicht lösen, entsperren Sie das Fahrzeug zweimal per Funkschlüssel."
  },
  {
    slug: "typ-2-mennekes",
    term: "Typ 2 (Mennekes-Stecker)",
    category: "Stecker & Hardware",
    shortDef: "Der europäische Standardstecker für dreiphasiges Wechselstromladen (AC) bis zu 22 kW bzw. 43 kW.",
    fullExplanation: "Der Typ-2-Stecker, ursprünglich vom deutschen Hersteller Mennekes entwickelt, wurde 2013 von der Europäischen Kommission als einheitlicher Standard für das Laden von Elektrofahrzeugen mit Wechselstrom festgelegt. Er ermöglicht einphasiges Laden mit bis zu 7,4 kW (bei Schieflastgrenze 4,6 kW in DE) sowie dreiphasiges Laden mit 11 kW oder 22 kW an privaten Wallboxen und städtischen AC-Ladesäulen.",
    standardNorm: "DIN EN 62196-2 / IEC 62196-2",
    practicalTip: "Für das Laden an öffentlichen AC-Säulen müssen Sie Ihr eigenes Typ-2-Kabel mitführen. Für die meisten Fahrzeuge reicht ein 11-kW-Kabel; für 22-kW-Lader (z.B. Renault Zoe, Smart) wird ein 32A-Kabel benötigt."
  },
  {
    slug: "hpc-high-power-charging",
    term: "HPC (High Power Charging)",
    category: "Stecker & Hardware",
    shortDef: "Gleichstrom-Ultraschnellladen mit Ladeleistungen von 150 kW bis 400 kW bei 400V bzw. 800V Systemspannung.",
    fullExplanation: "High Power Charging bezeichnet DC-Schnellladestationen, die flüssigkeitsgekühlte Ladekabel nutzen, um Ströme von bis zu 500 Ampere und Spannungen bis 1.000 Volt sicher zu übertragen. Elektroautos mit 800-Volt-Architektur (z. B. Porsche Taycan, Hyundai Ioniq 5/6, Kia EV6/EV9, Audi e-tron GT) können so in ca. 18 Minuten von 10 % auf 80 % State of Charge (SoC) aufgeladen werden.",
    standardNorm: "ISO 15118 / DIN SPEC 70121",
    practicalTip: "Aktivieren Sie im Navigationssystem die Vorkonditionierung (Batterieheizung), wenn Sie einen HPC-Lader ansteuern. Ohne angewärmten Akku drosselt das Batteriemanagement die Ladeleistung im Winter massiv."
  },
  {
    slug: "afir-verordnung",
    term: "AFIR (Alternative Fuels Infrastructure Regulation)",
    category: "Normen & Gesetze",
    shortDef: "EU-Verordnung (EU) 2023/1804 zur Verpflichtung von Kartenterminals und transparenter Preisanzeige.",
    fullExplanation: "Die seit dem 13. April 2024 verbindlich anzuwendende EU-Verordnung über den Aufbau der Infrastruktur für alternative Kraftstoffe (AFIR) verpflichtet Betreiber öffentlicher Ladepunkte ab 50 kW, kontaktlose Bezahlung per Debit- oder Kreditkarte (NFC/Chip) anzubieten. Zudem müssen Preise transparent je Kilowattstunde (kWh) vor Beginn des Ladevorgangs direkt an der Säule angezeigt werden. Ziel ist die Beseitigung des Ladekarten-Monopols und die Gleichstellung mit klassischen Tankstellen.",
    standardNorm: "EU-Verordnung (EU) 2023/1804",
    practicalTip: "Dank AFIR können Sie an allen neuen Schnellladestationen spontan mit Ihrer gewöhnlichen Girocard oder Mastercard/Visa ohne vorherige App-Registrierung laden."
  },
  {
    slug: "plug-and-charge",
    term: "Plug & Charge (ISO 15118)",
    category: "Normen & Gesetze",
    shortDef: "Automatisierte Autorisierung und Abrechnung durch einfaches Anstecken des Ladekabels.",
    fullExplanation: "Plug & Charge basiert auf dem internationalen Sicherheitsstandard ISO 15118. Beim Einstecken des CCS-Steckers tauschen Ladesäule und Fahrzeug verschlüsselte digitale Zertifikate aus. Der Ladevorgang startet ohne App, Ladekarte oder Display-Interaktion, und die Kosten werden automatisch über den im Auto hinterlegten Tarifvertrag abgerechnet.",
    standardNorm: "ISO 15118-2 / ISO 15118-20",
    practicalTip: "Nicht zu verwechseln mit 'AutoCharge' (MAC-Adressen-Abfrage bei Fastned/EnBW). Plug & Charge ist kryptografisch gesichert und herstellerübergreifend genormt."
  },
  {
    slug: "kw-vs-kwh",
    term: "kW vs. kWh (Leistung vs. Energiemenge)",
    category: "Elektrotechnik",
    shortDef: "kW beschreibt die Lade- oder Motorleistung; kWh beschreibt die Batteriekapazität und verbrauchte Energie.",
    fullExplanation: "Das Kilowatt (kW) ist die Maßeinheit für die momentane Leistung. Eine Ladesäule mit 300 kW kann theoretisch in sehr kurzer Zeit viel Strom liefern. Die Kilowattstunde (kWh) ist die Maßeinheit für die Energiemenge. Wenn ein Elektroauto 1 Stunde lang mit einer konstanten Leistung von 11 kW lädt, hat es genau 11 kWh Energie in die Batterie geladen (abzüglich Ladeverluste).",
    standardNorm: "SI-Basiseinheiten / DIN 1301",
    practicalTip: "Merkformel: kW = Lade-Geschwindigkeit (Tacho), kWh = Tankinhalt / verbrauchte Liter Strom."
  },
  {
    slug: "soc-state-of-charge",
    term: "SoC (State of Charge & Ladekurve)",
    category: "Elektrotechnik",
    shortDef: "Der Ladezustand der Hochvoltbatterie in Prozent und dessen Einfluss auf die Ladegeschwindigkeit.",
    fullExplanation: "Der State of Charge (SoC) gibt den aktuellen Füllstand des Akkus von 0 % bis 100 % an. Die Ladekurve beschreibt, wie viel Leistung der Akku bei welchem SoC aufnehmen kann. Zwischen 10 % und 50 % erreichen Elektrofahrzeuge ihre Spitzenladeleistung (Peak). Ab ca. 70 % bis 80 % greift das Batteriemanagementsystem (BMS) ein und reduziert die Ladeleistung drastisch, um die Zellchemie vor Überhitzung und Degradation zu schützen.",
    standardNorm: "DIN EN IEC 62660",
    practicalTip: "Auf der Langstrecke lohnt es sich fast nie, am HPC-Lader über 80 % zu laden. Die letzten 20 % dauern oft länger als das Laden von 10 % auf 80 %."
  },
  {
    slug: "cpo-vs-emp",
    term: "CPO vs. EMP (Betreiber vs. Mobilitätsdienstleister)",
    category: "Abrechnung & Roaming",
    shortDef: "CPO stellt die physische Ladesäule bereit; EMP verkauft den Stromtarif an den Endkunden.",
    fullExplanation: "Ein Charge Point Operator (CPO, z.B. Ionity, Aral pulse, Fastned) installiert, wartet und betreibt die Hardware der Ladesäule. Ein E-Mobility Provider (EMP oder MSP, z.B. EnBW mobility+, DKV, Maingau) gibt Ladekarten und Apps an Fahrer aus und rechnet die geladenen Kilowattstunden ab. Viele Unternehmen (wie EnBW) agieren gleichzeitig als CPO und EMP.",
    standardNorm: "OCPI / OICP Protokolle",
    practicalTip: "CPO-eigene Tarife sind an den eigenen Säulen oft deutlich günstiger als beim Roaming über Dritt-EMPs."
  },
  {
    slug: "blockiergebuehr",
    term: "Blockiergebühr (Standzeitgebühr)",
    category: "Abrechnung & Roaming",
    shortDef: "Zeittarif ab einer bestimmten Standzeit (z. B. nach 240 Min. AC bzw. 60 Min. DC), um Ladesäulen freizuhalten.",
    fullExplanation: "Um das Dauerparken an Ladesäulen nach beendetem Ladevorgang zu verhindern, erheben fast alle Mobilitätsanbieter ab einer bestimmten Standzeit (Karenzzeit) einen Minutenpreis von meist 0,10 € bis 0,20 € pro Minute. An Schnellladern (DC) greift diese Gebühr häufig bereits ab Minute 60 oder 90; an Normalladern (AC) meist ab Minute 240 (4 Stunden). Viele Tarife pausieren die Gebühr in der Nacht (21:00 bis 08:00 Uhr).",
    standardNorm: "Preisangabenverordnung (PAngV)",
    practicalTip: "Prüfen Sie vor dem Einstecken die AGB Ihres Anbieters. Wer sein Auto über Nacht an einer AC-Säule ohne Nachtregelung stehen lässt, riskiert Zusatzkosten von bis zu 12,00 € bis 30,00 €."
  },
  {
    slug: "eichrechtskonformitaet",
    term: "Eichrechtskonformität & MessEG",
    category: "Normen & Gesetze",
    shortDef: "Gesetzliche Vorgabe für manipulationssichere und grammgenaue Abrechnung von Kilowattstunden.",
    fullExplanation: "In Deutschland verlangt das Mess- und Eichgesetz (MessEG), dass jeder geladene Kilowattstunden-Wert durch einen zertifizierten, manipulationssicheren Gleichstrom- bzw. Wechselstromzähler erfasst wird. Die Messwerte werden signiert und können vom Kunden im Nachhinein über eine Transparenzsoftware auf ihre Richtigkeit geprüft werden.",
    standardNorm: "Mess- und Eichgesetz (MessEG) / Mess- und Eichverordnung (MessEV)",
    practicalTip: "Auf Ihrer Ladeabrechnung finden Sie die Signatur und den Zählerstand. Über die kostenfreie 'Transparenzsoftware' können Sie nachvollziehen, ob die Abrechnung exakt den Messwerten der Säule entspricht."
  }
];
