export interface ChargingCard {
  id: string;
  name: string;
  provider: string;
  monthlyFee: number; // €
  acPriceOwn: number; // €/kWh
  dcPriceOwn: number; // €/kWh
  acPriceRoaming: number; // €/kWh
  dcPriceRoaming: number; // €/kWh
  blockiergebuehr: string;
  roamingPoints: string;
  badge?: string;
  bestFor: string;
  officialUrl: string;
  features: string[];
}

export const CHARGING_CARDS: ChargingCard[] = [
  {
    id: "dkv-mobility",
    name: "DKV Mobility Card",
    provider: "DKV Mobility",
    monthlyFee: 0.0,
    acPriceOwn: 0.49,
    dcPriceOwn: 0.59,
    acPriceRoaming: 0.54,
    dcPriceRoaming: 0.64,
    blockiergebuehr: "Keine Blockiergebühr bei AC bis 240 Min.",
    roamingPoints: "Über 700.000 Ladepunkte in ganz Europa",
    badge: "Führende Flotten- & Gewerbeabdeckung",
    bestFor: "Gewerbliche Fuhrparks, Dienstwagen & Vielfahrer",
    officialUrl: "https://www.dkv-mobility.com/de/",
    features: [
      "Kombinierte Abrechnung von Kraftstoff, Maut und Ladestrom",
      "Vollständig finanzamtkonforme Monats-Sammelrechnung",
      "Europaweites Multi-CPO Roaming ohne Aufschläge",
      "App mit Live-Belegungsstatus und Routenplaner"
    ]
  },
  {
    id: "enbw-mobility-plus",
    name: "EnBW mobility+ (Tarif M)",
    provider: "EnBW",
    monthlyFee: 5.99,
    acPriceOwn: 0.39,
    dcPriceOwn: 0.49,
    acPriceRoaming: 0.59,
    dcPriceRoaming: 0.69,
    blockiergebuehr: "0,10 €/Min. ab 240 Min. (max. 12,00 €)",
    roamingPoints: "Über 750.000 Ladepunkte im HyperNetz",
    badge: "Tarif für Viellader",
    bestFor: "Regelmäßige Langstreckenfahrer & Autobahnnutzer",
    officialUrl: "https://www.enbw.com/elektromobilitaet",
    features: [
      "Vergünstigter Tarif im größten Schnellladenetz Deutschlands",
      "AutoCharge-Funktion: Einstecken und automatischer Ladebeginn",
      "Monatlich flexibel kündbar oder tariflich anpassbar",
      "Kostenlose physische RFID-Ladekarte inklusive"
    ]
  },
  {
    id: "maingau-autostrom",
    name: "MAINGAU Autostrom",
    provider: "MAINGAU Energie",
    monthlyFee: 0.0,
    acPriceOwn: 0.44,
    dcPriceOwn: 0.54,
    acPriceRoaming: 0.54,
    dcPriceRoaming: 0.64,
    blockiergebuehr: "0,10 €/Min. ab 240 Min. (AC) bzw. ab 60 Min. (DC)",
    roamingPoints: "Über 600.000 Ladepunkte in Europa",
    badge: "Ohne Grundgebühr",
    bestFor: "Gelegenheitslader & Hausstrom-Kunden",
    officialUrl: "https://www.maingau-energie.de/e-mobilitaet/autostrom",
    features: [
      "Dauerhaft 0,00 € Grundgebühr ohne Mindestumsatz",
      "Rabatt je kWh für MAINGAU Strom-/Gaskunden möglich",
      "Breite Roaming-Abdeckung bei Ionity und Fastned",
      "Übersichtliche iOS- und Android-App"
    ]
  },
  {
    id: "ionity-passport",
    name: "IONITY Passport Power",
    provider: "IONITY",
    monthlyFee: 11.99,
    acPriceOwn: 0.0,
    dcPriceOwn: 0.39,
    acPriceRoaming: 0.69,
    dcPriceRoaming: 0.79,
    blockiergebuehr: "Keine Blockiergebühr bis Ladeende",
    roamingPoints: "Exklusives 350 kW Autobahnnetz",
    badge: "Autobahn-Langstreckentarif",
    bestFor: "Urlaubsfahrten & Geschäftsreisen auf Autobahnen",
    officialUrl: "https://ionity.eu/de/network/access-and-payment",
    features: [
      "Garantierte 350 kW Ladeleistung an Raststätten",
      "Vergünstigter Preis je kWh gegenüber Ad-hoc",
      "Plug & Charge (ISO 15118) ohne Kartenkontakt",
      "Monatlich kündbar für Urlaubs- und Reisezeiten"
    ]
  },
  {
    id: "shell-recharge",
    name: "Shell Recharge Ladekarte",
    provider: "Shell",
    monthlyFee: 0.0,
    acPriceOwn: 0.55,
    dcPriceOwn: 0.64,
    acPriceRoaming: 0.59,
    dcPriceRoaming: 0.69,
    blockiergebuehr: "Betreiberabhängig",
    roamingPoints: "Über 650.000 Ladepunkte",
    badge: "Handels- & Tankstellennetz",
    bestFor: "Einkaufslader bei Rewe, Penny & Shell Tankstellen",
    officialUrl: "https://www.shell.de/",
    features: [
      "Keine monatliche Grundgebühr",
      "Inklusive Shell ClubSmart Treuepunkten",
      "Gute Kombination mit Firmenflotten",
      "Schnelllader an bundesweiten Shell Tankstellen"
    ]
  }
];
