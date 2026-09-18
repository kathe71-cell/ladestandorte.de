import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InstantFinder } from '../components/InstantFinder';
import { EEATBadge } from '../components/EEATBadge';
import { STATIONS_DATA } from '../data/stations';
import { StationDetailModal } from '../components/StationDetailModal';
import { SEO } from '../components/SEO';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || searchParams.get('s') || '';
  const stationIdParam = searchParams.get('station');

  const [selectedStation, setSelectedStation] = React.useState(() => {
    if (stationIdParam) {
      return STATIONS_DATA.find(s => s.id === stationIdParam) || null;
    }
    return null;
  });

  useEffect(() => {
    if (stationIdParam) {
      const found = STATIONS_DATA.find(s => s.id === stationIdParam);
      if (found) setSelectedStation(found);
    }
  }, [stationIdParam]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title={queryParam ? `Ladesäulen Suche: „${queryParam}“` : "Ladesäulen Instant-Finder · Bundesweites Register durchsuchen"}
        description="Durchsuchen Sie alle öffentlich registrierten Ladesäulen & HPC-Schnelllader in Deutschland nach Ort, PLZ, Betreiber oder Autobahn in Echtzeit."
        canonicalPath="/suche"
      />
      
      {/* Search Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold block">
          High-Speed Datenfilter
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          Ladesäulen Instant-Finder
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Geben Sie eine Postleitzahl, eine Stadt, einen Betreiber (z. B. EnBW, IONITY, Tesla) oder eine Autobahnnummer (z. B. A3, A7) ein. Ergebnisse erscheinen verzögerungsfrei in unter 5 Millisekunden.
        </p>
      </div>

      {/* Instant Search Bar */}
      <div className="max-w-4xl">
        <InstantFinder
          autoFocus={true}
          initialQuery={queryParam}
          showFilters={true}
        />
      </div>

      {/* Trust Badge */}
      <div className="max-w-4xl pt-8">
        <EEATBadge
          topic="Suchindex &amp; BNetzA-Register"
          source1Title="Amtliche Primärdatenbasis"
          source1Text="Ladesäulenregister der Bundesnetzagentur (BNetzA) gemäß § 5 LSV (Open Data, CC BY 4.0)."
          source2Title="Redaktionelle Kuration &amp; Beispieldaten"
          source2Text="Der Finder durchsucht redaktionell kuratierte Musterstandorte und Flagship-Hubs. Zur Vollständigkeitsprüfung siehe das amtliche BNetzA-Gesamtregister."
          dateText="Stand: BNetzA Open Data"
        />
      </div>

      {/* Station Modal if direct link */}
      <StationDetailModal
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />

    </div>
  );
};

export default SearchPage;
