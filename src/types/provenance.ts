/**
 * Data Provenance and Context Definitions for ladestandorte.de
 * Reference Layer Phase 1
 */

export type ProvenanceType = 
  | 'official-government'   // z. B. Bundesnetzagentur, BMDV, Gesetze
  | 'official-operator'     // z. B. Betreibermitteilungen, CPO-Spezifikationen
  | 'official-project'      // z. B. BMDV Förderprojekt HoLa, Fraunhofer ISI
  | 'standardization-body'  // z. B. CharIN, DIN, ISO
  | 'editorial-verified';   // Redaktionell von ladestandorte.de geprüft

export interface DataProvenance {
  sourceName?: string;
  sourceUrl?: string;
  sourceDataDate?: string;
  lastVerifiedAt?: string;
  provenanceType?: ProvenanceType;
}

/**
 * Denominator and context classification
 * Clarifies what dataset a metric is based on to prevent generalization errors
 */
export type DataContext = 
  | 'CURATED_DATASET'  // Eigene, kuratierte Stichprobe (z. B. 44 indexierbare Dossiers)
  | 'REGISTER_DATA'    // Makrozahlen aus Registern (z. B. BNetzA Open Data Stadtzahlen)
  | 'MCS_DATASET'      // Die aktuell dokumentierten MCS- und E-Lkw-Standorte
  | 'MODEL';           // Berechnete Ergebnisse des Laderechners
