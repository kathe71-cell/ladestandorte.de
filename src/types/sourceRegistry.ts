import sourceRegistryData from '../data/source-registry.json';
import type { ProvenanceType } from './provenance';

export type SourceCategory = 
  | 'REGISTRY_DATA'
  | 'OPERATOR_PRICING'
  | 'OPERATOR_TECHNICAL'
  | 'LEGAL_REGULATORY'
  | 'THG'
  | 'MCS_INFRASTRUCTURE'
  | 'METHODOLOGY';

export type ApprovalRequirement = 
  | 'AUTO'
  | 'HUMAN_REVIEW'
  | 'HUMAN_DECISION';

export type CriticalityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AffectedContent {
  pages: string[];
  dataFiles: string[];
  structuredData?: string[];
}

export interface SourceEntry {
  id: string;
  name: string;
  url: string;
  type: ProvenanceType;
  category: SourceCategory;
  affectedContent: AffectedContent;
  checkIntervalDays: number;
  lastVerifiedAt: string;
  criticality: CriticalityLevel;
  approvalRequirement: ApprovalRequirement;
  validationMethod: string;
}

export const SOURCE_REGISTRY: SourceEntry[] = sourceRegistryData as SourceEntry[];

export function getSourceById(id: string): SourceEntry | undefined {
  return SOURCE_REGISTRY.find(s => s.id === id);
}

export function getSourcesByCategory(category: SourceCategory): SourceEntry[] {
  return SOURCE_REGISTRY.filter(s => s.category === category);
}

export function getSourcesByApproval(requirement: ApprovalRequirement): SourceEntry[] {
  return SOURCE_REGISTRY.filter(s => s.approvalRequirement === requirement);
}
