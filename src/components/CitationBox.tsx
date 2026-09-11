import React, { useState } from 'react';
import { Quote, Copy, Check } from 'lucide-react';

interface Props {
  title: string;
  urlPath: string;
  dateStr?: string;
  className?: string;
}

export const CitationBox: React.FC<Props> = ({
  title,
  urlPath,
  dateStr,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const fullUrl = `https://ladestandorte.de${urlPath}`;
  const currentDate = dateStr || new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  const citationText = `Fachredaktion ladestandorte.de. ${title}. Bundesweites Ladesäulenregister Deutschland. Online verfügbar unter: ${fullUrl} (Stand: ${currentDate}).`;

  const handleCopy = () => {
    navigator.clipboard.writeText(citationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Quote className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
            Wissenschaftliche &amp; Journalistische Zitation (APA-Standard)
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 shadow-xs transition-colors min-h-[36px]"
          aria-label="Zitation kopieren"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
          <span>{copied ? 'Kopiert!' : 'Zitation kopieren'}</span>
        </button>
      </div>

      <blockquote className="text-xs sm:text-sm text-slate-700 italic bg-white p-3.5 rounded-xl border border-slate-200/60 font-serif leading-relaxed">
        „{citationText}“
      </blockquote>
    </div>
  );
};

export default CitationBox;
