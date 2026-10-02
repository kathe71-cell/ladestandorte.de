import React, { useState } from 'react';
import { Palette, Copy, Check, RotateCcw, Code, ExternalLink } from 'lucide-react';
import { CalculatorEmbed } from './CalculatorEmbed';

export interface WidgetCustomization {
  accentColor: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  fontFamily: string;
  borderRadius: string;
}

const DEFAULT_CONFIG: WidgetCustomization = {
  accentColor: '#C7F000',
  bgColor: '#FFFFFF',
  textColor: '#171917',
  borderColor: '#DFE3DC',
  fontFamily: 'system-ui',
  borderRadius: '16px'
};

const SAFE_FONTS = [
  { label: 'System UI (Modern)', value: 'system-ui, -apple-system, sans-serif' },
  { label: 'Inter / Sans-Serif', value: 'Inter, ui-sans-serif, system-ui, sans-serif' },
  { label: 'Helvetica / Arial', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Open Sans', value: '"Open Sans", sans-serif' },
  { label: 'Georgia (Serif)', value: 'Georgia, serif' }
];

const PRESET_ACCENTS = [
  '#C7F000', // Lime
  '#2563EB', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#0F172A'  // Deep Slate
];

const PRESET_BACKGROUNDS = [
  '#FFFFFF', // White
  '#F8FAFC', // Slate 50
  '#F7F7F2', // Warm Light Alabaster
  '#0F172A'  // Dark Mode
];

function sanitizeColor(val: string, fallback: string): string {
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) {
    return val;
  }
  return fallback;
}

function sanitizeRadius(val: string): string {
  const num = parseInt(val, 10);
  if (isNaN(num)) return '16px';
  const clamped = Math.max(0, Math.min(32, num));
  return `${clamped}px`;
}

export const EmbedWidgetConfigurator: React.FC = () => {
  const [config, setConfig] = useState<WidgetCustomization>(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);

  const cleanAccent = sanitizeColor(config.accentColor, DEFAULT_CONFIG.accentColor);
  const cleanBg = sanitizeColor(config.bgColor, DEFAULT_CONFIG.bgColor);
  const cleanText = config.bgColor === '#0F172A' ? '#F8FAFC' : sanitizeColor(config.textColor, DEFAULT_CONFIG.textColor);
  const cleanBorder = sanitizeColor(config.borderColor, DEFAULT_CONFIG.borderColor);
  const cleanRadius = sanitizeRadius(config.borderRadius);

  // URL query string for iframe
  const configParams = new URLSearchParams({
    accent: cleanAccent.replace('#', ''),
    bg: cleanBg.replace('#', ''),
    text: cleanText.replace('#', ''),
    border: cleanBorder.replace('#', ''),
    font: config.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
    radius: cleanRadius.replace('px', '')
  }).toString();

  const embedUrl = `https://www.ladestandorte.de/rechner-embed?${configParams}`;
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="720" style="border:1px solid ${cleanBorder};border-radius:${cleanRadius};max-width:740px;display:block;margin:auto;" title="Ladezeit- & Ladekostenrechner · ladestandorte.de"></iframe><p style="font-size:12px;text-align:center;color:#64748b;margin-top:8px;">Bereitgestellt von <a href="https://www.ladestandorte.de" target="_blank" style="color:#171917;font-weight:bold;">ladestandorte.de</a></p>`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(iframeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DFE3DC] p-6 sm:p-8 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DFE3DC] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#C7F000] text-[#171917] text-xs font-mono font-bold mb-2">
            <Palette className="w-3.5 h-3.5" />
            <span>WIDGET KONFIGURATOR</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#171917]">
            Rechner-Widget für Ihre Website anpassen
          </h3>
          <p className="text-xs sm:text-sm text-[#6C716B] mt-1">
            Passen Sie Farben, Typografie und Eckenradius an das Design Ihrer Website an. Keine Cookies, 100 % DSGVO-konform.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#F7F7F2] hover:bg-[#DFE3DC] text-[#171917] border border-[#DFE3DC] transition-colors self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Vorschau zurücksetzen</span>
        </button>
      </div>

      {/* Grid: Controls & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Primär-/Akzentfarbe */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#171917] block">Akzentfarbe (Buttons, Highlights)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={cleanAccent}
                onChange={e => setConfig({ ...config, accentColor: e.target.value })}
                className="w-10 h-10 rounded-xl border border-[#DFE3DC] p-1 cursor-pointer"
              />
              <input
                type="text"
                value={config.accentColor}
                onChange={e => setConfig({ ...config, accentColor: e.target.value })}
                className="px-3 py-2 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs font-mono font-bold text-[#171917] w-28"
              />
              <div className="flex items-center gap-1">
                {PRESET_ACCENTS.map(col => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setConfig({ ...config, accentColor: col })}
                    style={{ backgroundColor: col }}
                    className="w-6 h-6 rounded-full border border-black/10 transition-transform hover:scale-110"
                    aria-label={`Akzent ${col}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 2. Hintergrundfarbe */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#171917] block">Hintergrundfarbe</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={cleanBg}
                onChange={e => setConfig({ ...config, bgColor: e.target.value })}
                className="w-10 h-10 rounded-xl border border-[#DFE3DC] p-1 cursor-pointer"
              />
              <input
                type="text"
                value={config.bgColor}
                onChange={e => setConfig({ ...config, bgColor: e.target.value })}
                className="px-3 py-2 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs font-mono font-bold text-[#171917] w-28"
              />
              <div className="flex items-center gap-1">
                {PRESET_BACKGROUNDS.map(bg => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setConfig({ ...config, bgColor: bg })}
                    style={{ backgroundColor: bg }}
                    className="w-6 h-6 rounded-full border border-[#DFE3DC] transition-transform hover:scale-110"
                    aria-label={`Hintergrund ${bg}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 3. Rahmenfarbe */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#171917] block">Rahmenfarbe (Border)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={cleanBorder}
                onChange={e => setConfig({ ...config, borderColor: e.target.value })}
                className="w-10 h-10 rounded-xl border border-[#DFE3DC] p-1 cursor-pointer"
              />
              <input
                type="text"
                value={config.borderColor}
                onChange={e => setConfig({ ...config, borderColor: e.target.value })}
                className="px-3 py-2 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs font-mono font-bold text-[#171917] w-28"
              />
            </div>
          </div>

          {/* 4. Schriftart */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#171917] block">Schriftart (DSGVO-sichere System-Fonts)</label>
            <select
              value={config.fontFamily}
              onChange={e => setConfig({ ...config, fontFamily: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs font-bold text-[#171917]"
            >
              {SAFE_FONTS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* 5. Eckenradius */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#171917]">
              <span>Eckenradius (Border Radius)</span>
              <span className="font-mono text-[#6C716B]">{cleanRadius}</span>
            </div>
            <input
              type="range"
              min="0"
              max="28"
              step="2"
              value={parseInt(cleanRadius, 10)}
              onChange={e => setConfig({ ...config, borderRadius: `${e.target.value}px` })}
              className="w-full accent-[#171917]"
            />
          </div>

          {/* Embed Code Box */}
          <div className="space-y-3 pt-4 border-t border-[#DFE3DC]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#171917] flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-[#2F5E73]" />
                <span>Generierter Einbettungscode</span>
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#171917] text-[#C7F000] text-xs font-bold hover:bg-[#2F5E73] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Code kopiert!' : 'Embed-Code kopieren'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={4}
              value={iframeCode}
              className="w-full p-3 rounded-xl bg-[#171917] text-slate-200 text-xs font-mono leading-relaxed resize-none focus:outline-none"
            />
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#6C716B] uppercase">
            <span>Interaktive Live-Vorschau</span>
            <span className="text-[#2F5E73]">Echtzeit-Render</span>
          </div>

          {/* Container simulating host site styling */}
          <div 
            style={{ 
              backgroundColor: cleanBg, 
              color: cleanText, 
              borderColor: cleanBorder, 
              borderRadius: cleanRadius,
              fontFamily: config.fontFamily 
            }}
            className="p-4 sm:p-6 border shadow-lg transition-all"
          >
            <CalculatorEmbed isEmbed={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
