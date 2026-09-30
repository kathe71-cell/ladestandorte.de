import { OPERATORS_DATA } from '../data/operators';

export function getOperatorSlugByName(name: string): string | null {
  const clean = name.toLowerCase().trim();
  
  if (clean.includes('enbw')) return 'enbw';
  if (clean.includes('tesla')) return 'tesla-supercharger';
  if (clean.includes('ionity')) return 'ionity';
  if (clean.includes('aral')) return 'aral-pulse';
  if (clean.includes('fastned')) return 'fastned';
  if (clean.includes('allego')) return 'allego';
  if (clean.includes('ewe')) return 'ewe-go';
  if (clean.includes('shell')) return 'shell-recharge';
  if (clean.includes('total')) return 'totalenergies-charge';
  if (clean.includes('pfalzwerke')) return 'pfalzwerke';
  if (clean.includes('lidl')) return 'lidl-charge';
  if (clean.includes('kaufland')) return 'kaufland-charge';
  if (clean.includes('aldi')) return 'aldi-sued-charge';

  const directMatch = OPERATORS_DATA.find(o => 
    o.name.toLowerCase() === clean || 
    o.slug === clean ||
    clean.includes(o.name.toLowerCase()) ||
    o.name.toLowerCase().includes(clean)
  );

  return directMatch ? directMatch.slug : null;
}
