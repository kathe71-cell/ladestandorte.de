import React from 'react';
import { CalculatorEmbed } from '../components/CalculatorEmbed';
import { SEO } from '../components/SEO';

export const RechnerEmbedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-2 sm:p-4 flex items-center justify-center">
      <SEO
        title="Ladezeit- & Ladekosten-Rechner Widget"
        description="Einbettbares Widget für den Ladezeit- und Ladekostenrechner für Elektroautos."
        canonicalPath="/rechner"
        noIndex={true}
      />
      <div className="w-full max-w-2xl">
        <CalculatorEmbed isEmbed={true} />
      </div>
    </div>
  );
};

export default RechnerEmbedPage;
