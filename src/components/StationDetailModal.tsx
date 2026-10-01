import React, { useState, useEffect } from 'react';
import { X, Zap, MapPin, Navigation, ShieldCheck, CreditCard, Share2, Check, ExternalLink, AlertTriangle, Info } from 'lucide-react';
import { StationData, getStationConnectors } from '../data/stations';

interface Props {
  station: StationData | null;
  onClose: () => void;
}

export const StationDetailModal: React.FC<Props> = ({ station, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Close on Escape key for WCAG accessibility
  useEffect(() => {
    if (!station) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [station, onClose]);

  if (!station) return null;

  const handleShare = () => {
    const url = `${window.location.origin}/suche?station=${station.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
  const connectors = getStationConnectors(station);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center cursor-pointer"
            aria-label="Schließen"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-500 text-slate-950">
              {station.kwMax} kW max. Standortleistung
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-800 text-slate-300">
              {station.operator}
            </span>
            {station.motorway && (
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-amber-400 uppercase font-mono border border-slate-700">
                BAB {station.motorway.toUpperCase()}
              </span>
            )}
          </div>
          <h2 id="modal-headline" className="text-xl sm:text-2xl font-black tracking-tight text-white pr-10">
            {station.name}
          </h2>
          <p className="text-slate-300 text-sm mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{station.street}, {station.plz} {station.city}</span>
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-mono text-slate-500 uppercase block">Max. Standort</span>
              <span className="text-lg font-black text-slate-900 font-mono">{station.kwMax} kW</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-mono text-slate-500 uppercase block">Ladepunkte</span>
              <span className="text-lg font-black text-slate-900 font-mono">{station.pointsCount} Anschlüsse</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-mono text-slate-500 uppercase block">Betreiber (CPO)</span>
              <span className="text-sm font-bold text-slate-900 truncate block" title={station.operator}>{station.operator}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-mono text-slate-500 uppercase block">Inbetriebnahme</span>
              <span className="text-lg font-black text-slate-900 font-mono">{station.openingYear}</span>
            </div>
          </div>

          {/* Stecker-Typen mit individueller Leistung */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2.5">
              Verfügbare Steckertypen &amp; Leistung je Anschluss
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {connectors.map((conn) => (
                <div key={conn.type} className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-xl font-bold text-sm">
                  <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{conn.type}</span>
                  <span className="text-xs font-semibold text-emerald-800 font-mono bg-emerald-100/80 px-2 py-0.5 rounded">
                    bis {conn.maxKw} kW {conn.type === 'Typ 2' ? '(AC)' : '(DC)'}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Hinweis: Die tatsächlich erzielbare Ladeleistung wird stets durch den bordeigenen Lader des Fahrzeugs (AC) oder die Ladekurve des Akkus (DC) begrenzt.
            </p>
          </div>

          {/* Bezahlung & Autorisierung */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2.5">
              Zahlungs- &amp; Autorisierungsmethoden
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {station.paymentMethods.map((method) => (
                <div key={method} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700">
                  <CreditCard className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{method}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Komfort & Vor-Ort-Ausstattung (Redaktionelle Zusatzangaben) */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-2.5">
            <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-950 font-bold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-700" />
                <span>Standortmerkmale &amp; Netzanbindung</span>
              </h3>
              <span className="text-[10px] text-amber-800 font-mono">Verifizierte Daten</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {station.exitDistance && (
                <div className="flex items-center gap-2 text-slate-800">
                  <span className="text-base">📍</span>
                  <span>Autobahnanbindung: <strong className="text-slate-900">
                    {station.exitDistance}
                  </strong></span>
                </div>
              )}
              {station.truckCharging && (
                <div className="flex items-center gap-2 text-slate-800">
                  <span className="text-base">🚛</span>
                  <span>E-Lkw Eignung: <strong className="text-emerald-800">
                    {station.truckCharging.mcsStatus === 'operational' ? 'MCS Megawatt-Laden aktiv' : 'Schwerlast-Ladehub (400 kW CCS)'}
                  </strong></span>
                </div>
              )}
              {station.isCovered === true && (
                <div className="flex items-center gap-2 text-slate-800">
                  <span className="text-base">☔</span>
                  <span>Überdachung: <strong className="text-emerald-800">Ja (Wetterschutz)</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Amtliche Registerdaten (Bundesnetzagentur) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2 font-mono">
            <div className="flex flex-wrap items-center justify-between gap-1 border-b border-slate-200/80 pb-2">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Amtliche Registerdaten (Bundesnetzagentur)</span>
              </div>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                Kuratierte Beispieldaten
              </span>
            </div>

            <p>
              Datenquelle: <strong className="text-slate-900">{station.dataSource || 'Bundesnetzagentur Ladesäulenregister (Open Data CC BY 4.0)'}</strong>
            </p>

            <p>
              Offizieller Quelldatensatz:{' '}
              <a 
                href="https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/E-Mobilitaet/Ladesaeulenkarte/start.html" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-emerald-700 hover:text-emerald-800 underline font-bold inline-flex items-center gap-1 font-sans"
              >
                <span>BNetzA Ladesäulenregister (Offizielles Datenportal &amp; Excel-Download)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </p>

            <p>Datenstand des Registers: <strong className="text-slate-900">{station.importDate || 'September 2026'}</strong></p>
            <p>Geokoordinaten: <strong className="text-slate-900">{station.lat.toFixed(4)}° N, {station.lng.toFixed(4)}° E</strong></p>
            <p>Zugänglichkeit: <strong className="text-slate-900">{station.accessType}</strong></p>

            <div className="pt-2 border-t border-slate-200/80 text-[11px] font-sans text-slate-500 leading-relaxed">
              <strong>Hinweis zur Datenherkunft:</strong> Dieser Standort entstammt unserer redaktionell verifizierten Auswahl von 44 Ladeparks in Deutschland. Die Basisdaten zu Ladeleistung, Steckern und Geokoordinaten basieren auf den amtlichen Veröffentlichungen der Bundesnetzagentur.
            </div>
          </div>

          {/* Disclaimer: Keine Echtzeitdaten */}
          <div className="p-3.5 bg-amber-50/50 border border-amber-300/80 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="font-bold block">Keine Echtzeit-Belegung oder Live-Betriebsinformation:</strong>
              <p className="text-slate-600 leading-normal">
                Dieses Portal bildet statische Infrastruktur- und Registerdaten ab. Ob ein Ladepunkt aktuell frei, belegt oder außer Betrieb ist, kann nur über die App des jeweiligen Betreibers ({station.operator}) in Echtzeit eingesehen werden.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm text-xs sm:text-sm transition-all min-h-[48px]"
            >
              <Navigation className="w-4 h-4" />
              <span>Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href={`https://maps.apple.com/?daddr=${station.lat},${station.lng}&dirflg=d`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-sm text-xs sm:text-sm transition-all min-h-[48px]"
            >
              <Navigation className="w-4 h-4" />
              <span>Apple Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors min-h-[48px] cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Kopiert!' : 'Teilen'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
