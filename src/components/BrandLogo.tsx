import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  className?: string;
  variant?: 'header' | 'footer';
  onClick?: () => void;
}

/**
 * BrandLogo
 * Verbindliche, zentrale Markenkomponente für ladestandorte.de
 * Spezifikation:
 * - Helles Quadrat (bg-[#FFFFFF]), feine Border (#DFE3DC), Radius 12-14px
 * - Geometrisches 'L' in Graphit (#171917)
 * - Datenknoten oben rechts in Signal Lime (#C7F000)
 * - Wortmarke: ladestandorte (#171917 bzw. #FFFFFF im Footer) + .de (#6C716B)
 * - Sublabel Desktop: LADEINFRASTRUKTUR · DATENBASIERT
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'header',
  onClick
}) => {
  const isFooter = variant === 'footer';

  return (
    <Link
      to="/"
      onClick={onClick}
      className={`flex items-center gap-3 group shrink-0 ${className}`}
      aria-label="ladestandorte.de Startseite"
    >
      {/* Bildmarke: Weißer Container mit Border #DFE3DC, geometrisches Graphit-L (#171917), Signal-Lime Datenknoten (#C7F000) */}
      <div className="w-10 h-10 rounded-[13px] bg-white flex items-center justify-center border border-[#DFE3DC] group-hover:border-[#171917] transition-colors relative shadow-2xs shrink-0">
        <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none" aria-hidden="true">
          {/* Geometrisches starkes L in Graphit #171917 */}
          <path
            d="M12 9.5H16.2V26H25.5V30.5H12V9.5Z"
            fill="#171917"
          />
          {/* Signal Lime Datenknoten oben rechts */}
          <circle cx="28.5" cy="14" r="5" fill="#C7F000" />
        </svg>
      </div>

      {/* Wortmarke & Claim */}
      <div className="flex flex-col">
        <span
          className={`text-xl sm:text-2xl font-black tracking-tight flex items-center leading-none ${
            isFooter ? 'text-white' : 'text-[#171917]'
          }`}
        >
          ladestandorte
          <span className={isFooter ? 'text-slate-400 font-semibold' : 'text-[#6C716B] font-semibold'}>
            .de
          </span>
        </span>
        <span
          className={`hidden sm:block text-[9px] font-mono uppercase tracking-widest font-bold mt-1 ${
            isFooter ? 'text-[#C7F000]' : 'text-[#6C716B]'
          }`}
        >
          {isFooter ? 'Ladeinfrastruktur · Datenbasiert' : 'LADEINFRASTRUKTUR · DATENBASIERT'}
        </span>
      </div>
    </Link>
  );
};
