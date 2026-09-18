export interface WallboxItem {
  id: string;
  name: string;
  brand: string;
  maxKw: number; // 11 or 22
  cableLengthM: number;
  hasApp: boolean;
  hasRfid: boolean;
  hasSolarCharging: boolean;
  fundingEligible: boolean;
  fundingNote: string;
  priceEst: number; // €
  features: string[];
}

export const WALLBOXES_DATA: WallboxItem[] = [
  {
    id: "go-e-gemini-flex-11",
    name: "go-e Charger Gemini flex 11 kW",
    brand: "go-e",
    maxKw: 11,
    cableLengthM: 0, // Buchse für Typ 2 Kabel
    hasApp: true,
    hasRfid: true,
    hasSolarCharging: true,
    fundingEligible: true,
    fundingNote: "Regionale Zuschüsse (Länder/Kommunen) möglich; KfW-Programme (440, 441, 442) beendet",
    priceEst: 589,
    features: [
      "Mobil einsetzbar über rote CEE 16A Steckdose",
      "Dynamisches PV-Überschussladen & Phasen-Umschaltung",
      "WLAN, App-Steuerung, RFID-Zugangskontrolle",
      "Eichrechtskonforme Zähler-Schnittstelle"
    ]
  },
  {
    id: "heidelberg-energy-control",
    name: "Heidelberg Energy Control 11 kW",
    brand: "Heidelberg Ampere",
    maxKw: 11,
    cableLengthM: 5.0,
    hasApp: false,
    hasRfid: false,
    hasSolarCharging: true,
    fundingEligible: true,
    fundingNote: "Regionale Zuschüsse (Länder/Kommunen) möglich; KfW-Programme (440, 441, 442) beendet",
    priceEst: 429,
    features: [
      "Integrierte Lastmanagement-Schnittstelle bis 16 Wallboxen",
      "Extrem robustes Aluminiumgehäuse Made in Germany",
      "Einfache Plug-and-Play Installation durch Elektrofachbetrieb",
      "Fest angeschlagenes 5m Typ 2 Ladekabel"
    ]
  },
  {
    id: "webasto-next-11",
    name: "Webasto Next 11 kW / 22 kW",
    brand: "Webasto",
    maxKw: 22,
    cableLengthM: 4.5,
    hasApp: true,
    hasRfid: false,
    hasSolarCharging: true,
    fundingEligible: true,
    fundingNote: "Regionale Zuschüsse (Länder/Kommunen) möglich; KfW-Programme (440, 441, 442) beendet",
    priceEst: 649,
    features: [
      "Bis zu 22 kW Ladeleistung konfigurierbar",
      "Webasto ChargeConnect Backend & App-Monitoring",
      "Integrierter DC-Fehlerstromschutz (6mA DC)",
      "Automatisches Firmware-Update Over-the-Air"
    ]
  },
  {
    id: "easee-charge-lite",
    name: "Easee Charge Lite 11 kW",
    brand: "Easee",
    maxKw: 11,
    cableLengthM: 0,
    hasApp: true,
    hasRfid: true,
    hasSolarCharging: true,
    fundingEligible: true,
    fundingNote: "Regionale Zuschüsse (Länder/Kommunen) möglich; KfW-Programme (440, 441, 442) beendet",
    priceEst: 519,
    features: [
      "Kompakteste Bauform am Markt (nur 1,5 kg Gewicht)",
      "Integrierter eSIM-Mobilfunk (kein WLAN nötig)",
      "Phasenbalancierung & automatischer Kabel-Lock",
      "Erweiterbar auf bis zu 3 Wallboxen pro Hausanschluss"
    ]
  },
  {
    id: "abl-emh1",
    name: "ABL Wallbox eMH1 11 kW",
    brand: "ABL",
    maxKw: 11,
    cableLengthM: 6.35,
    hasApp: false,
    hasRfid: false,
    hasSolarCharging: false,
    fundingEligible: true,
    fundingNote: "Regionale Zuschüsse (Länder/Kommunen) möglich; KfW-Programme (440, 441, 442) beendet",
    priceEst: 389,
    features: [
      "Bewährter Klassiker für unkompliziertes Laden im Alltag",
      "Extra langes 6,35 m Kabel für hohe Flexibilität im Carport",
      "Keine fehleranfällige Elektronik – langlebiges Schützdesign",
      "Serienmäßiger FI Typ A mit DC-Fehlerstromerkennung"
    ]
  }
];
