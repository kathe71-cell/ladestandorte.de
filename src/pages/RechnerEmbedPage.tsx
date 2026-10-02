import React from 'react';
import { CalculatorEmbed } from '../components/CalculatorEmbed';
import { SEO } from '../components/SEO';
import { AmazonPartnerSentence } from '@plattform/core';

import { useSearchParams } from 'react-router-dom';

function sanitizeHex(val: string | null, fallback: string): string {
  if (!val) return fallback;
  const clean = val.replace(/[^0-9A-Fa-f]/g, '');
  if (clean.length === 3 || clean.length === 6) {
    return `#${clean}`;
  }
  return fallback;
}

export const RechnerEmbedPage: React.FC = () => {
  const [params] = useSearchParams();
  const bg = sanitizeHex(params.get('bg'), '#FFFFFF');
  const text = sanitizeHex(params.get('text'), '#171917');
  const border = sanitizeHex(params.get('border'), '#DFE3DC');
  const rawRadius = parseInt(params.get('radius') || '16', 10);
  const radius = isNaN(rawRadius) ? '16px' : `${Math.max(0, Math.min(32, rawRadius))}px`;
  const rawFont = params.get('font');
  const font = rawFont ? `${rawFont}, system-ui, sans-serif` : 'system-ui, sans-serif';

  return (
    <div 
      style={{ backgroundColor: bg, color: text, fontFamily: font }}
      className="min-h-screen p-2 sm:p-4 flex items-center justify-center transition-colors"
    >
      <SEO
        title="Ladezeit- & Ladekosten-Rechner Widget"
        description="Einbettbares Widget für den Ladezeit- und Ladekostenrechner für Elektroautos."
        canonicalPath="/rechner"
        noIndex={true}
      />
      <div 
        style={{ borderColor: border, borderRadius: radius }}
        className="w-full max-w-2xl border p-2 sm:p-4 shadow-sm"
      >
        <CalculatorEmbed isEmbed={true} />
        <AmazonPartnerSentence className="sr-only" />
      </div>
    </div>
  );
};

export default RechnerEmbedPage;
