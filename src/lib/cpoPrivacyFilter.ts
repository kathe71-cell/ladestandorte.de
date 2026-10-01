export interface OperatorEntity {
  id: string;
  name: string;
  slug: string;
  brandName: string;
  parentCompany: string;
  headquarters: string;
  bnetzaMatchPatterns: string[];
  description: string;
  website: string;
}

export interface CpoPrivacyCheckResult {
  isPublishable: boolean;
  reason: 'verified_mapping' | 'institutional_threshold_met' | 'natural_person_rejected' | 'below_threshold_rejected';
  entityId?: string;
}

/**
 * Checks if an operator name looks like a natural person (e.g. Dr. Max Mustermann, Erika Mustermann).
 * Such entries must NEVER be published individually as CPO profiles or standalone data entities.
 */
export function isLikelyNaturalPerson(name: string): boolean {
  if (!name) return false;
  const trimmed = name.trim();

  // Explicit commercial / organizational indicators
  const institutionalKeywords = [
    'gmbh', 'ag', 'se', 'kg', 'ohg', 'eg', 'ev', 'e.v.', 'ug', 'gbr',
    'stadtwerke', 'energie', 'strom', 'mobility', 'charge', 'puls',
    'autohaus', 'hotel', 'gemeinde', 'stadt', 'kreis', 'verband',
    'holding', 'management', 'service', 'dienstleistung', 'vertrieb',
    'deutschland', 'germany', 'international', 'europe', 'partner',
    'supercharger', 'hypercharger', 'ladepark', 'infrastruktur', 'netz',
    'versorg', 'verkehr', 'werk', 'wohnung', 'immobilien', 'bau'
  ];

  const lower = trimmed.toLowerCase();
  for (const kw of institutionalKeywords) {
    if (lower.includes(kw)) {
      return false;
    }
  }

  // Academic / personal titles
  if (/^(dr\.|prof\.|dipl\.-|herr|frau)\b/i.test(trimmed)) {
    return true;
  }

  // Two or three words with typical personal name format (Capitalized First Last)
  const words = trimmed.split(/\s+/);
  if (words.length >= 2 && words.length <= 3) {
    const isCapitalizedWords = words.every(w => /^[A-ZÄÖÜ][a-zäöüß]+$/.test(w));
    if (isCapitalizedWords) {
      return true;
    }
  }

  return false;
}

/**
 * Evaluates whether an operator from BNetzA is safe and authorized for publication.
 * Enforces:
 * 1. Mapped verified entities are ALWAYS publishable under their verified entity ID.
 * 2. Unmapped operators are rejected if they appear to be a natural person.
 * 3. Unmapped operators must have at least minPointsThreshold (default 20) charge points.
 */
export function evaluateOperatorPublishability(
  operatorName: string,
  totalPoints: number,
  mappingEntities: OperatorEntity[],
  minPointsThreshold: number = 20
): CpoPrivacyCheckResult {
  // 1. Check if matches verified mapping
  for (const entity of mappingEntities) {
    for (const pattern of entity.bnetzaMatchPatterns) {
      if (operatorName === pattern || operatorName.toLowerCase().startsWith(pattern.toLowerCase())) {
        return {
          isPublishable: true,
          reason: 'verified_mapping',
          entityId: entity.id
        };
      }
    }
  }

  // 2. Reject natural persons
  if (isLikelyNaturalPerson(operatorName)) {
    return {
      isPublishable: false,
      reason: 'natural_person_rejected'
    };
  }

  // 3. Minimum points threshold for unmapped commercial entities
  if (totalPoints >= minPointsThreshold) {
    return {
      isPublishable: true,
      reason: 'institutional_threshold_met'
    };
  }

  return {
    isPublishable: false,
    reason: 'below_threshold_rejected'
  };
}
