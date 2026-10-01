import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, X } from 'lucide-react';

interface Props {
  title?: string;
  subtitle?: string;
  link?: string;
  linkLabel?: string;
}

export const FloatingCTABar: React.FC<Props> = ({
  title = 'Welche Ladekarte passt zu dir?',
  subtitle = 'Tarife & Roaming im Direktvergleich',
  link = '/ladekarten',
  linkLabel = 'Jetzt vergleichen',
}) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 3000);
    const onScroll = () => {
      if (!dismissed && window.scrollY > 400) setVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl
        bg-[#171917] text-white rounded-2xl shadow-2xl border border-[#DFE3DC]/20
        flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4
        animate-[slideUp_0.35s_ease-out]"
      style={{ animation: 'slideUp 0.35s ease-out' }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 2rem); opacity: 0; }
          to   { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="bg-white/10 rounded-lg p-1.5 shrink-0 text-[#C7F000]">
          <Zap className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight truncate">{title}</p>
          <p className="text-xs text-slate-400 leading-tight truncate">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          to={link}
          className="flex items-center gap-1 bg-[#C7F000] text-[#171917] text-xs font-black
            px-3.5 py-2 rounded-xl hover:bg-[#b5dc00] transition-colors whitespace-nowrap shadow-xs"
        >
          {linkLabel}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={() => { setDismissed(true); setVisible(false); }}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          aria-label="Schließen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FloatingCTABar;
