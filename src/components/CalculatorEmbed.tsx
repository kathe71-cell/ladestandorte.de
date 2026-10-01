import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Calculator, Zap, Clock, Euro, Check, Code, Share2, Car, Sparkles, AlertTriangle, Info } from 'lucide-react';
import { VEHICLES_DATA } from '../data/vehicles';

interface Props {
  isEmbed?: boolean;
}

// Robust query parameter parsing with fallback and bounds checking
function parseNum(val: string | null, fallback: number, min?: number, max?: number): number {
  if (val === null || val === undefined || val === '') return fallback;
  const num = Number(val);
  if (isNaN(num)) return fallback;
  if (min !== undefined && num < min) return min;
  if (max !== undefined && num > max) return max;
  return num;
}

export const CalculatorEmbed: React.FC<Props> = ({ isEmbed = false }) => {
  const [searchParams] = useSearchParams();

  // Mode: 'estimate' (Praxis-Schätzung, default) or 'theoretical' (Theoretisch)
  const [calcMode, setCalcMode] = useState<'estimate' | 'theoretical'>(() => {
    const m = searchParams.get('mode');
    return m === 'theoretical' ? 'theoretical' : 'estimate';
  });

  // State defaults or safely parsed from URL query
  const [batteryCapacity, setBatteryCapacity] = useState<number>(() => {
    return parseNum(searchParams.get('capacity'), 75, 20, 130);
  });

  const [chargePower, setChargePower] = useState<number>(() => {
    return parseNum(searchParams.get('kw'), 150, 3, 400);
  });

  const [startSoc, setStartSoc] = useState<number>(() => {
    return parseNum(searchParams.get('start'), 10, 0, 95);
  });

  const [endSoc, setEndSoc] = useState<number>(() => {
    return parseNum(searchParams.get('end'), 80, 5, 100);
  });

  const [pricePerKwh, setPricePerKwh] = useState<number>(() => {
    return parseNum(searchParams.get('price'), 0.49, 0.1, 2.0);
  });

  const [currentLossPercent, setCurrentLossPercent] = useState<number>(() => {
    return chargePower > 22 ? 6 : 12;
  });

  const [linkCopied, setLinkCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  // Vehicle preset: neutral/manual mode by default (no vehicle selected unless explicitly set in URL)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(() => {
    const vParam = searchParams.get('vehicle');
    if (vParam && VEHICLES_DATA.some(v => v.id === vParam)) {
      return vParam;
    }
    return '';
  });

  const selectedVehicle = VEHICLES_DATA.find(v => v.id === selectedVehicleId);

  const handleVehicleSelect = (id: string) => {
    setSelectedVehicleId(id);
    const vehicle = VEHICLES_DATA.find(v => v.id === id);
    if (vehicle) {
      setBatteryCapacity(vehicle.batteryNetKwh);
      if (chargePower <= 22) {
        setChargePower(vehicle.maxKwAc);
      } else {
        setChargePower(Math.min(vehicle.maxKwDc, 300));
      }
      setStartSoc(10);
      setEndSoc(80);
    }
  };

  const handleCapacityChange = (val: number) => {
    setBatteryCapacity(val);
    if (selectedVehicleId) setSelectedVehicleId('');
  };

  const handlePowerChange = (val: number) => {
    setChargePower(val);
    if (selectedVehicleId) setSelectedVehicleId('');
  };

  const location = useLocation();
  const isRechnerPage = location.pathname === '/rechner';

  // Smooth URL state synchronization via window.history.replaceState:
  // Updates browser address bar for shareable link WITHOUT triggering React Router re-render cascades
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isRechnerPage && !isEmbed) {
      const params = new URLSearchParams();
      params.set('capacity', String(batteryCapacity));
      params.set('kw', String(chargePower));
      params.set('start', String(startSoc));
      params.set('end', String(endSoc));
      params.set('price', String(pricePerKwh));
      if (selectedVehicleId) {
        params.set('vehicle', selectedVehicleId);
      }
      if (calcMode === 'theoretical') {
        params.set('mode', 'theoretical');
      }
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, '', newUrl);
    } else if (location.pathname === '/' && window.location.search.includes('capacity')) {
      window.history.replaceState(null, '', '/');
    }
  }, [batteryCapacity, chargePower, startSoc, endSoc, pricePerKwh, selectedVehicleId, calcMode, isEmbed, isRechnerPage, location.pathname]);

  // Adjust loss percentage when switching between AC and HPC
  useEffect(() => {
    if (chargePower > 22) {
      setCurrentLossPercent(6);
    } else {
      setCurrentLossPercent(12);
    }
  }, [chargePower]);

  // Detection of manual adjustments
  const isCustomCapacity = selectedVehicle ? batteryCapacity !== selectedVehicle.batteryNetKwh : false;
  const isCustomKw = selectedVehicle ? (
    chargePower <= 22 
      ? chargePower !== selectedVehicle.maxKwAc 
      : chargePower !== Math.min(selectedVehicle.maxKwDc, 300)
  ) : false;

  // Validation: startSoc must be strictly less than endSoc
  const isInvalidSoc = startSoc >= endSoc;

  // === MATHEMATISCHE BERECHNUNGEN ===

  // 1. Gemeinsame Nettoenergie (im Akku gespeicherte Energie)
  const socDeltaPercent = isInvalidSoc ? 0 : endSoc - startSoc;
  const netEnergyKwh = isInvalidSoc ? 0 : (batteryCapacity * socDeltaPercent) / 100;

  // 2. THEORETISCHER MODUS (Reine mathematische Idealwerte)
  const theoreticalCostEur = isInvalidSoc ? 0 : netEnergyKwh * pricePerKwh;
  const theoreticalDurationHours = isInvalidSoc || chargePower <= 0 ? 0 : netEnergyKwh / chargePower;
  const theoreticalDurationMinutes = isInvalidSoc ? 0 : Math.round(theoreticalDurationHours * 60);

  // 3. PRAXIS-SCHÄTZUNG (Vereinfachte Modellannahmen: Ladekurve + Ladeverlust)
  const vehicleAcLimit = selectedVehicle?.maxKwAc ?? (chargePower <= 22 ? chargePower : 11);
  const vehicleDcLimit = selectedVehicle?.maxKwDc ?? chargePower;

  let effectiveAverageKw = 11;
  let isAcCapped = false;
  let isDcCapped = false;

  if (chargePower <= 22) {
    effectiveAverageKw = Math.min(chargePower, vehicleAcLimit);
    if (chargePower > vehicleAcLimit) {
      isAcCapped = true;
    }
  } else {
    const peakDc = Math.min(chargePower, vehicleDcLimit);
    if (chargePower > vehicleDcLimit) {
      isDcCapped = true;
    }
    // Ladekurvenfaktor:
    // Im manuellen Standardmodus sowie bei 400V-Fahrzeugen gilt ein transparenter Faktor von 0,76 (10–80 % SoC).
    // Nur bei explizit gewähltem 800V-Fahrzeugprofil mit flacherer Plateaukurve wird 0,82 angesetzt.
    // Keine künstliche Unstetigkeit / Stufenfunktion bei 150 kW mehr vorhanden.
    const curveFactor = selectedVehicle?.systemVoltage === 800 ? 0.82 : 0.76;
    effectiveAverageKw = Math.max(1, peakDc * curveFactor);
  }

  const grossEnergyKwh = isInvalidSoc ? 0 : netEnergyKwh * (1 + currentLossPercent / 100);
  const lossKwh = isInvalidSoc ? 0 : grossEnergyKwh - netEnergyKwh;
  const estimateCostEur = isInvalidSoc ? 0 : grossEnergyKwh * pricePerKwh;
  const estimateDurationHours = isInvalidSoc || effectiveAverageKw <= 0 ? 0 : grossEnergyKwh / effectiveAverageKw;
  const estimateDurationMinutes = isInvalidSoc ? 0 : Math.round(estimateDurationHours * 60);

  // Aktive Werte abhängig vom gewählten Modus
  const isTheoretical = calcMode === 'theoretical';
  const displayCostEur = isTheoretical ? theoreticalCostEur : estimateCostEur;
  const displayMinutes = isTheoretical ? theoreticalDurationMinutes : estimateDurationMinutes;
  const displayEnergyBilledKwh = isTheoretical ? netEnergyKwh : grossEnergyKwh;

  const vehicleConsumption = selectedVehicle?.consumptionKwhPer100Km ?? 17.5;
  const rangeGainKm = isInvalidSoc ? 0 : Math.round((netEnergyKwh / vehicleConsumption) * 100);

  const handleCopyLink = () => {
    const modeParam = isTheoretical ? '&mode=theoretical' : '';
    const vehicleParam = selectedVehicleId ? `&vehicle=${encodeURIComponent(selectedVehicleId)}` : '';
    const url = `${window.location.origin}/rechner?capacity=${batteryCapacity}&kw=${chargePower}&start=${startSoc}&end=${endSoc}&price=${pricePerKwh}${vehicleParam}${modeParam}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handleCopyEmbed = () => {
    const modeParam = isTheoretical ? '&mode=theoretical' : '';
    const vehicleParam = selectedVehicleId ? `&vehicle=${encodeURIComponent(selectedVehicleId)}` : '';
    const iframeCode = `<iframe src="https://www.ladestandorte.de/rechner-embed?capacity=${batteryCapacity}&kw=${chargePower}&start=${startSoc}&end=${endSoc}&price=${pricePerKwh}${vehicleParam}${modeParam}" width="100%" height="680" style="border:1px solid #e2e8f0;border-radius:16px;max-width:720px;display:block;margin:auto;" title="Ladezeit- & Ladekostenrechner ladestandorte.de"></iframe><p style="font-size:12px;text-align:center;color:#64748b;margin-top:8px;">Bereitgestellt von <a href="https://www.ladestandorte.de" target="_blank" style="color:#059669;font-weight:bold;">ladestandorte.de</a></p>`;
    navigator.clipboard.writeText(iframeCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2500);
  };

  return (
    <div className={`bg-white rounded-2xl sm:rounded-3xl border border-[#DFE3DC] shadow-sm overflow-hidden ${isEmbed ? 'p-4 sm:p-6' : 'p-6 sm:p-8'}`}>
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DFE3DC] pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#171917] text-[#C7F000] flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5 text-[#C7F000]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#171917]">
              Ladezeit- &amp; Kostenrechner
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6C716B] mt-1">
            Beispielhafte Modellrechnung für Ladedauer, Ladeverluste und Ladekosten für Elektrofahrzeuge.
          </p>
        </div>

        {!isEmbed && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#F7F7F2] hover:bg-[#DFE3DC] text-[#171917] border border-[#DFE3DC] transition-colors min-h-[44px] cursor-pointer"
              aria-label="Link mit Konfiguration kopieren"
            >
              {linkCopied ? <Check className="w-4 h-4 text-[#2F5E73]" /> : <Share2 className="w-4 h-4" />}
              <span>{linkCopied ? 'Kopiert!' : 'Konfiguration teilen'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyEmbed}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#171917] hover:bg-[#2F5E73] text-[#C7F000] border border-[#171917] transition-colors min-h-[44px] cursor-pointer"
              aria-label="Widget Einbettungscode kopieren"
            >
              {embedCopied ? <Check className="w-4 h-4 text-[#C7F000]" /> : <Code className="w-4 h-4" />}
              <span>{embedCopied ? 'Code kopiert!' : 'Embed Widget'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Berechnungsmodus-Umschaltung: Theoretisch vs. Praxis-Schätzung */}
      <div className="mb-6 p-1.5 bg-[#F7F7F2] rounded-2xl flex items-center gap-1.5 border border-[#DFE3DC] max-w-md">
        <button
          type="button"
          onClick={() => setCalcMode('estimate')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] flex items-center justify-center gap-1.5 cursor-pointer ${
            calcMode === 'estimate'
              ? 'bg-[#171917] text-[#C7F000] shadow-sm border border-[#171917]'
              : 'text-[#6C716B] hover:text-[#171917] hover:bg-[#DFE3DC]/60'
          }`}
          aria-pressed={calcMode === 'estimate'}
        >
          <span>Praxis-Schätzung</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold hidden sm:inline ${
            calcMode === 'estimate' ? 'bg-[#C7F000] text-[#171917]' : 'bg-[#DFE3DC] text-[#171917]'
          }`}>
            Standard
          </span>
        </button>
        <button
          type="button"
          onClick={() => setCalcMode('theoretical')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] flex items-center justify-center gap-1.5 cursor-pointer ${
            calcMode === 'theoretical'
              ? 'bg-[#171917] text-[#C7F000] shadow-sm border border-[#171917]'
              : 'text-[#6C716B] hover:text-[#171917] hover:bg-[#DFE3DC]/60'
          }`}
          aria-pressed={calcMode === 'theoretical'}
        >
          <span>Theoretisch</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold hidden sm:inline ${
            calcMode === 'theoretical' ? 'bg-[#C7F000] text-[#171917]' : 'bg-[#DFE3DC] text-[#171917]'
          }`}>
            Idealwert
          </span>
        </button>
      </div>

      {/* Validation Banner if Start SoC >= End SoC */}
      {isInvalidSoc && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 flex items-start gap-3 animate-in fade-in duration-200">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <strong className="font-bold block">Ungültiger Ladebereich:</strong>
            <p>
              Der Start-Ladestand ({startSoc} %) muss kleiner sein als der Ziel-Ladestand ({endSoc} %). Die Berechnung wurde gestoppt. Bitte passen Sie die Regler an.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Controls & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Fahrzeug-Schnellwähler */}
          <div className="p-4 rounded-2xl bg-[#F7F7F2] border border-[#DFE3DC] space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="vehicle-select" className="text-xs font-mono uppercase tracking-wider text-[#171917] font-bold flex items-center gap-1.5">
                <Car className="w-4 h-4 text-[#2F5E73]" />
                <span>Fahrzeug-Schnellwähler:</span>
              </label>
              {selectedVehicle && selectedVehicle.systemVoltage === 800 ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono bg-[#171917] text-[#C7F000] border border-[#171917] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C7F000]" />
                  <span>800V System (Sehr flache Ladekurve)</span>
                </span>
              ) : selectedVehicle ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#DFE3DC] text-[#171917]">
                  400V System
                </span>
              ) : null}
            </div>

            <select
              id="vehicle-select"
              value={selectedVehicleId}
              onChange={(e) => handleVehicleSelect(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-white border border-[#DFE3DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#171917] font-semibold text-[#171917] shadow-xs cursor-pointer"
            >
              <option value="">-- Individuelles Fahrzeug (Manuelle Eingabe) --</option>
              {VEHICLES_DATA.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} – {v.variant} (Peak {v.maxKwDc} kW DC / {v.maxKwAc} kW AC)
                </option>
              ))}
            </select>

            {selectedVehicle && (
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#6C716B] pt-1 border-t border-[#DFE3DC] font-medium">
                <span>Ø Verbrauch: <strong className="text-[#171917]">{selectedVehicle.consumptionKwhPer100Km} kWh/100km</strong></span>
                <span>·</span>
                <span>Max. DC-Peak: <strong className="text-[#171917]">{selectedVehicle.maxKwDc} kW</strong></span>
                <span>·</span>
                <span>Max. AC-Lader: <strong className="text-[#171917]">{selectedVehicle.maxKwAc} kW</strong></span>
                <span>·</span>
                <span>Werksangabe 10–80 %: <strong className="text-[#2F5E73]">~{selectedVehicle.typical10to80Min} Min.</strong></span>
              </div>
            )}
          </div>

          {/* Battery Capacity */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="capacity-range" className="font-bold text-[#171917] flex items-center gap-1.5">
                <span>Akkukapazität (netto nutzbar):</span>
                {isCustomCapacity && (
                  <span className="text-[10px] font-mono text-[#171917] bg-[#F7F7F2] border border-[#DFE3DC] px-1.5 py-0.2 rounded font-semibold">
                    (manuell angepasst)
                  </span>
                )}
              </label>
              <span className="font-mono font-black text-[#171917] bg-[#F7F7F2] border border-[#DFE3DC] px-2.5 py-0.5 rounded-md text-base">
                {batteryCapacity} kWh netto
              </span>
            </div>
            <input
              id="capacity-range"
              type="range"
              min="20"
              max="130"
              step="1"
              value={batteryCapacity}
              onChange={(e) => handleCapacityChange(Number(e.target.value))}
              className="w-full accent-[#171917] h-2 bg-[#DFE3DC] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-[#6C716B]">
              <span>20 kWh (Kleinwagen)</span>
              <span>75–77 kWh (Mittelklasse)</span>
              <span>130 kWh (Oberklasse)</span>
            </div>
          </div>

          {/* Ladeleistung in kW */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="kw-range" className="font-bold text-[#171917] flex items-center gap-1.5">
                <span>Ladesäulen-Nennleistung:</span>
                {isCustomKw && (
                  <span className="text-[10px] font-mono text-[#171917] bg-[#F7F7F2] border border-[#DFE3DC] px-1.5 py-0.2 rounded font-semibold">
                    (manuell angepasst)
                  </span>
                )}
              </label>
              <span className="font-mono font-black text-[#171917] bg-[#F7F7F2] border border-[#DFE3DC] px-2.5 py-0.5 rounded-md text-base">
                {chargePower} kW {chargePower > 22 ? '(DC Schnelllader)' : '(AC Normallader)'}
              </span>
            </div>
            <input
              id="kw-range"
              type="range"
              min="3"
              max="400"
              step={chargePower > 50 ? 10 : 1}
              value={chargePower}
              onChange={(e) => handlePowerChange(Number(e.target.value))}
              className="w-full accent-[#171917] h-2 bg-[#DFE3DC] rounded-lg cursor-pointer"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[11, 22, 50, 150, 300, 400].map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => handlePowerChange(kw)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                    chargePower === kw
                      ? 'bg-[#171917] text-[#C7F000]'
                      : 'bg-[#F7F7F2] hover:bg-[#DFE3DC] text-[#171917] border border-[#DFE3DC]'
                  }`}
                >
                  {kw} kW {kw <= 22 ? 'AC' : 'HPC'}
                </button>
              ))}
            </div>

            {/* Vehicle Limitation Warnings */}
            {isAcCapped && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Fahrzeuglimit AC:</strong> Der bordeigene AC-Lader Ihres Fahrzeugs limitiert auf max. <strong>{vehicleAcLimit} kW</strong> (trotz {chargePower} kW Säule).
                </span>
              </div>
            )}
            {isDcCapped && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Fahrzeuglimit DC:</strong> Die maximale DC-Ladeleistung Ihres Fahrzeugs liegt bei <strong>{vehicleDcLimit} kW</strong> (trotz {chargePower} kW Säule).
                </span>
              </div>
            )}
          </div>

          {/* State of Charge (SoC) Slider Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="start-soc" className="text-xs font-bold text-[#171917] block">
                Start-Ladestand (SoC): <span className="font-mono font-black text-[#171917]">{startSoc} %</span>
              </label>
              <input
                id="start-soc"
                type="range"
                min="0"
                max="95"
                step="5"
                value={startSoc}
                onChange={(e) => setStartSoc(Number(e.target.value))}
                className="w-full accent-[#171917] h-2 bg-[#DFE3DC] rounded-lg cursor-pointer"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="end-soc" className="text-xs font-bold text-[#171917] block">
                Ziel-Ladestand (SoC): <span className="font-mono font-black text-[#171917]">{endSoc} %</span>
              </label>
              <input
                id="end-soc"
                type="range"
                min="5"
                max="100"
                step="5"
                value={endSoc}
                onChange={(e) => setEndSoc(Number(e.target.value))}
                className="w-full accent-[#171917] h-2 bg-[#DFE3DC] rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Strompreis je kWh */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="price-range" className="font-bold text-[#171917]">
                Strompreis je Kilowattstunde:
              </label>
              <span className="font-mono font-black text-[#171917] bg-[#F7F7F2] border border-[#DFE3DC] px-2.5 py-0.5 rounded-md text-base">
                {pricePerKwh.toFixed(2).replace('.', ',')} € / kWh
              </span>
            </div>
            <input
              id="price-range"
              type="range"
              min="0.25"
              max="0.89"
              step="0.01"
              value={pricePerKwh}
              onChange={(e) => setPricePerKwh(Number(e.target.value))}
              className="w-full accent-[#171917] h-2 bg-[#DFE3DC] rounded-lg cursor-pointer"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: 'Hausstrom (0,32 €)', p: 0.32 },
                { label: 'AC Öffentlich (0,44 €)', p: 0.44 },
                { label: 'EnBW HPC (0,49 €)', p: 0.49 },
                { label: 'Ionity / Ad-hoc (0,69 €)', p: 0.69 }
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setPricePerKwh(item.p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    Math.abs(pricePerKwh - item.p) < 0.005
                      ? 'bg-[#171917] text-[#C7F000]'
                      : 'bg-[#F7F7F2] hover:bg-[#DFE3DC] text-[#171917] border border-[#DFE3DC]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#6C716B]">
              Modellannahmen (Stand: September 2026). Reale Preise variieren je nach Ladekarte, Roaming-Aufschlag und Blockiergebühren.
            </p>
          </div>

        </div>

        {/* Results Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-[#171917] text-white rounded-2xl p-6 flex flex-col justify-between space-y-6 border border-[#171917]">
          
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C7F000] font-bold block">
                {isTheoretical ? 'Theoretischer Idealwert' : 'Praxis-Schätzung'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                isTheoretical ? 'bg-white/10 text-white border border-white/20' : 'bg-[#C7F000] text-[#171917]'
              }`}>
                {isTheoretical ? 'Mathematisches Ideal' : 'Modellannahmen'}
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
              {displayCostEur.toFixed(2).replace('.', ',')} €
            </div>
            
            <p className="text-xs text-[#DFE3DC] mt-1">
              {isTheoretical
                ? `Reine Netto-Energiekosten für ${netEnergyKwh.toFixed(1).replace('.', ',')} kWh (ohne Verluste)`
                : `Geschätzte Gesamtkosten für ${grossEnergyKwh.toFixed(1).replace('.', ',')} kWh brutto (ab Ladesäule)`}
            </p>
          </div>

          <div className="space-y-3.5 border-t border-white/10 pt-4">
            
            {/* Ladedauer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#DFE3DC] text-sm">
                <Clock className="w-4 h-4 text-[#C7F000]" />
                <span>{isTheoretical ? 'Theoretische Mindest-Ladezeit:' : 'Geschätzte Ladedauer:'}</span>
              </div>
              <span className="text-lg font-black text-white font-mono">
                {isInvalidSoc ? '0 min' : displayMinutes >= 60 ? `${Math.floor(displayMinutes / 60)}h ${displayMinutes % 60}m` : `${displayMinutes} min`}
              </span>
            </div>

            {/* Effektive Ø Leistung / Modellannahme */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6C716B]">{isTheoretical ? 'Angenommene Ladeleistung:' : 'Effektive Ø Leistung (Modell):'}</span>
              <span className="font-mono text-[#DFE3DC] font-bold">
                {isInvalidSoc
                  ? '0 kW'
                  : isTheoretical
                    ? `${chargePower} kW konstant`
                    : `~ ${effectiveAverageKw.toFixed(0)} kW`}
                {!isTheoretical && isAcCapped && ` (AC-Limit ${vehicleAcLimit} kW)`}
                {!isTheoretical && isDcCapped && ` (DC-Limit ${vehicleDcLimit} kW)`}
              </span>
            </div>

            {/* Geladene Netto-Energie */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#DFE3DC] text-sm">
                <Zap className="w-4 h-4 text-[#C7F000]" />
                <span>Netto im Akku ({socDeltaPercent} %):</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">
                {netEnergyKwh.toFixed(1).replace('.', ',')} kWh
              </span>
            </div>

            {/* Ladeverluste */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#DFE3DC] text-sm">
                <Zap className="w-4 h-4 text-[#C7F000]" />
                <span>{isTheoretical ? 'Ladeverluste im Modell:' : `Ladeverlust (+${currentLossPercent} %):`}</span>
              </div>
              <span className={`text-sm font-mono ${isTheoretical ? 'text-[#6C716B] font-normal' : 'font-bold text-[#C7F000]'}`}>
                {isTheoretical ? '0,0 kWh (Idealwert)' : `+ ${lossKwh.toFixed(1).replace('.', ',')} kWh`}
              </span>
            </div>

            {/* Reichweitengewinn */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#DFE3DC] text-sm">
                <Euro className="w-4 h-4 text-[#C7F000]" />
                <span>Ca. Reichweitengewinn:</span>
              </div>
              <span className="text-sm font-bold text-[#C7F000] font-mono">
                + {rangeGainKm} km (bei Ø {vehicleConsumption.toFixed(1).replace('.', ',')} kWh/100km)
              </span>
            </div>

          </div>

          {/* Vergleichszusammenfassung / Fußnote */}
          <div className="pt-3 border-t border-white/10 text-[11px] text-[#6C716B] leading-normal space-y-1.5">
            {!isTheoretical ? (
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#DFE3DC] space-y-1">
                <span className="font-semibold text-[#C7F000] block">Praxis-Schätzung auf Basis vereinfachter Modellannahmen.</span>
                <p className="text-[#6C716B]">
                  Theoretischer Idealwert: <strong>{theoreticalDurationMinutes} Min.</strong> · <strong>{theoreticalCostEur.toFixed(2).replace('.', ',')} €</strong>
                </p>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#DFE3DC] space-y-1">
                <span className="font-semibold text-[#C7F000] block">Idealwert bei konstant verfügbarer eingestellter Ladeleistung.</span>
                <p className="text-[#6C716B]">
                  Reale Ladevorgänge dauern in der Regel länger (Ladekurve, Akkutemperatur &amp; Ladeverluste).
                </p>
              </div>
            )}

            <p className="text-[10px] text-[#6C716B]">
              * Die tatsächliche Ladedauer und Kosten hängen maßgeblich vom Fahrzeugmodell, der realen Ladekurve, Batterietemperatur, Vorkonditionierung und dem individuellen CPO-Tarif ab.
            </p>
          </div>

        </div>

      </div>

      {/* Aufklappbarer Bereich: Wie wird gerechnet? */}
      <div className="mt-8 pt-6 border-t border-[#DFE3DC]">
        <details className="group rounded-2xl bg-[#F7F7F2] border border-[#DFE3DC] overflow-hidden transition-all">
          <summary className="p-4 sm:p-5 font-bold text-[#171917] cursor-pointer list-none flex items-center justify-between select-none">
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Info className="w-4 h-4 text-[#2F5E73]" />
              <span>Wie wird gerechnet? (Berechnungsmodelle erklärt)</span>
            </div>
            <span className="text-xs font-mono font-bold text-[#6C716B] group-open:rotate-180 transition-transform">
              ▼
            </span>
          </summary>
          
          <div className="p-4 sm:p-6 pt-0 border-t border-[#DFE3DC] text-xs sm:text-sm text-[#6C716B] space-y-4 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-[#DFE3DC] space-y-2">
                <h4 className="font-bold text-[#171917] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#6C716B]" />
                  <span>1. Modus: Theoretisch</span>
                </h4>
                <p className="text-xs text-[#6C716B]">
                  Reine mathematische Idealrechnung ohne Ladeverluste oder Ladekurvendrosselung:
                </p>
                <ul className="text-xs font-mono text-[#171917] space-y-1 list-disc pl-4">
                  <li>Nettoenergie = Kapazität × (Ziel-SoC − Start-SoC)</li>
                  <li>Kosten = Nettoenergie × Strompreis</li>
                  <li>Mindest-Ladezeit = Nettoenergie ÷ Nennleistung</li>
                </ul>
                <p className="text-[11px] text-[#6C716B] italic">
                  Idealwert bei 100 % konstanter Leistungsabgabe ohne jegliche Wandlungsverluste.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#DFE3DC] space-y-2">
                <h4 className="font-bold text-[#171917] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C7F000]" />
                  <span>2. Modus: Praxis-Schätzung</span>
                </h4>
                <p className="text-xs text-[#6C716B]">
                  Vereinfachtes Modell unter Berücksichtigung typischer Praxisaufschläge:
                </p>
                <ul className="text-xs text-[#171917] space-y-1.5 list-disc pl-4">
                  <li>
                    <strong>Modellannahme Ladeverluste:</strong> Rechnerischer Aufschlag von 6 % (HPC Gleichstrom) bzw. 12 % (AC Wechselstrom).
                  </li>
                  <li>
                    <strong>Modellannahme Ladekurve:</strong> Durchschnittliche Leistung ca. 76 % der Spitzenleistung im Bereich 10–80 % SoC (bei 800V-Fahrzeugarchitektur ca. 82 %).
                  </li>
                </ul>
                <p className="text-[11px] text-[#6C716B] italic">
                  Reale Werte variieren je nach Fahrzeug, Batterietemperatur, Vorkonditionierung und Ladesäule.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#6C716B] border-t border-[#DFE3DC] pt-3">
              Hinweis: Die tatsächliche Ladezeit und Ladeleistung hängen insbesondere von Fahrzeugmodell, Ladekurve, Akkutemperatur, Ladezustand, Vorkonditionierung und verfügbarer Ladeleistung ab.
            </p>
          </div>
        </details>
      </div>

    </div>
  );
};

export default CalculatorEmbed;
