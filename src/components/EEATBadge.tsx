import React from 'react';
import { ShieldCheck, Database, Calendar, Award } from 'lucide-react';

interface Props {
  className?: string;
  topic?: string;
  source1Title?: string;
  source1Text?: React.ReactNode;
  source2Title?: string;
  source2Text?: React.ReactNode;
  dateText?: string;
}

export const EEATBadge: React.FC<Props> = ({
  className = '',
  topic = 'Ladeinfrastruktur',
  source1Title = 'Amtliche Primärdatenquelle',
  source1Text = 'Ladesäulenregister der Bundesnetzagentur (BNetzA) gemäß § 5 LSV, lizenziert unter Creative Commons CC BY 4.0.',
  source2Title = 'Redaktionelle Kuration',
  source2Text = 'Kuratierte Musterstandorte und Flagship-Hubs. Keine Gewähr für Echtzeit-Verfügbarkeit oder Vollständigkeit des Gesamtregisters vor Ort.',
  dateText = 'Stand: BNetzA Open Data'
}) => {
  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold block">
              Redaktionelle Transparenz &amp; Datenherkunft
            </span>
            <span className="text-sm font-bold text-slate-900">
              Geprüft durch Fachredaktion ladestandorte.de ({topic})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{dateText}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
        <div className="flex items-start gap-2">
          <Database className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800">{source1Title}:</strong> {source1Text}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800">{source2Title}:</strong> {source2Text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EEATBadge;
