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
      {/* Bildmarke: Weißer Container mit Border #DFE3DC, Radius 12-14px, L-Geometrie und Lime-Dot */}
      <div className="w-[42px] h-[42px] sm:w-12 sm:h-12 2xl:w-[50px] 2xl:h-[50px] rounded-[13px] bg-white flex items-center justify-center border border-[#DFE3DC] group-hover:border-[#171917] transition-colors relative shrink-0">
        <svg viewBox="0 0 40 40" className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] 2xl:w-[34px] 2xl:h-[34px]" fill="none" aria-hidden="true">
          {/* Geometrisches starkes L in Graphit #171917 */}
          <path
            d="M10 8H15.5V26.5H27V32H10V8Z"
            fill="#171917"
          />
          {/* Signal Lime Datenknoten oben rechts (#C7F000) */}
          <circle cx="28" cy="13.5" r="5.5" fill="#C7F000" />
        </svg>
      </div>

      {/* Wortmarke & Claim */}
      <div className="flex flex-col">
        <span
          className={`text-[19px] sm:text-[23px] 2xl:text-[24px] font-black tracking-tight flex items-center leading-none ${
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
