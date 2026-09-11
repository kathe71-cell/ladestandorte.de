import React, { useState } from 'react';
import { X, Zap, MapPin, Navigation, ShieldCheck, CreditCard, Share2, Check, ExternalLink } from 'lucide-react';
import { StationData } from '../data/stations';

interface Props {
  station: StationData | null;
  onClose: () => void;
}

export const StationDetailModal: React.FC<Props> = ({ station, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!station) return null;

  const handleShare = () => {
    const url = `${window.location.origin}/suche?station=${station.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
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
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Schließen"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-500 text-slate-950">
              {station.kwMax} kW {station.isHpc ? 'HPC' : 'AC'}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-slate-800 text-slate-300">
              BNetzA: {station.bnetzaId}
            </span>
            {station.motorway && (
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-400 text-slate-950 uppercase font-mono">
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
              <span className="text-[11px] font-mono text-slate-500 uppercase block">Max. Leistung</span>
              <span className="text-lg font-black text-slate-900 font-mono">{station.kwMax} kW</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-mono text-slate-500 uppercase block">Ladepunkte</span>
              <span className="text-lg font-black text-slate-900 font-mono">{station.pointsCount} Anschlüsse</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-mono text-slate-500 uppercase block">Betreiber</span>
              <span className="text-sm font-bold text-slate-900 truncate block">{station.operator}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-mono text-slate-500 uppercase block">Inbetriebnahme</span>
              <span className="text-lg font-black text-slate-900 font-mono">{station.openingYear}</span>
            </div>
          </div>

          {/* Stecker-Typen */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2.5">
              Verfügbare Steckertypen
            </h3>
            <div className="flex flex-wrap gap-2">
              {station.connectorTypes.map((type) => (
                <div key={type} className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl font-bold text-sm">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>{type}</span>
                  <span className="text-xs font-normal text-emerald-700 font-mono">bis {station.kwMax} kW</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bezahlung & Autorisierung */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2.5">
              Zahlung &amp; Autorisierung (AFIR-konform)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {station.paymentMethods.map((method) => (
                <div key={method} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
                  <CreditCard className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{method}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Offizielle Registerdaten */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5 font-mono">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Amtliche Registerdaten (Bundesnetzagentur)</span>
            </div>
            <p>BNetzA Registriernummer: <strong className="text-slate-900">{station.bnetzaId}</strong></p>
            <p>Geokoordinaten: <strong className="text-slate-900">{station.lat.toFixed(4)}° N, {station.lng.toFixed(4)}° E</strong></p>
            <p>Zugänglichkeit: <strong className="text-slate-900">{station.accessType}</strong></p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm text-sm transition-all min-h-[48px]"
            >
              <Navigation className="w-4 h-4" />
              <span>Navigation via Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-xl text-sm transition-colors min-h-[48px]"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link kopiert!' : 'Standort teilen'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
