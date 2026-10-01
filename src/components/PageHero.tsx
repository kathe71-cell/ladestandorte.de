import React from 'react';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

export type HeroLevel = 2 | 3;

export interface PageHeroProps {
  level?: HeroLevel;
  /** Eyebrow label or custom node (e.g. icon + text badge) */
  eyebrow?: React.ReactNode;
  /** Badge color scheme for standard string eyebrows */
  eyebrowVariant?: 'emerald' | 'amber' | 'purple' | 'slate' | 'blue';
  /** Main semantic H1 title */
  title: React.ReactNode;
  /** Introductory summary text */
  description?: React.ReactNode;
  /** Secondary route or metadata line (e.g. Streckenführung, Street Address) */
  subtitle?: React.ReactNode;
  /** Breadcrumb items */
  breadcrumbs?: BreadcrumbItem[];
  /** Optional actions (buttons, search bars, filters) placed inside the hero flow */
  actions?: React.ReactNode;
  /** Optional extra content (e.g. stats grid, bento metrics) */
  children?: React.ReactNode;
  className?: string;
}

const EYEBROW_STYLES: Record<NonNullable<PageHeroProps['eyebrowVariant']>, string> = {
  emerald: 'bg-[#F7F7F2] text-[#171917] border-[#DFE3DC]',
  amber: 'bg-amber-50 text-amber-950 border-amber-300',
  purple: 'bg-slate-100 text-[#171917] border-slate-200',
  slate: 'bg-[#F7F7F2] text-[#171917] border-[#DFE3DC]',
  blue: 'bg-slate-100 text-[#2F5E73] border-slate-200'
};

export const PageHero: React.FC<PageHeroProps> = ({
  level = 2,
  eyebrow,
  eyebrowVariant = 'slate',
  title,
  description,
  subtitle,
  breadcrumbs,
  actions,
  children,
  className = ''
}) => {
  const isDetail = level === 3;

  return (
    <header className={`space-y-4 sm:space-y-5 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} className="mb-2" />
      )}

      {eyebrow && (
        <div className="flex flex-wrap items-center gap-2">
          {typeof eyebrow === 'string' ? (
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono font-bold uppercase tracking-wider ${EYEBROW_STYLES[eyebrowVariant]}`}
            >
              <span>{eyebrow}</span>
            </div>
          ) : (
            eyebrow
          )}
        </div>
      )}

      <div className={`space-y-3 ${isDetail ? 'max-w-4xl' : 'max-w-3xl'}`}>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
          {title}
        </h1>

        {subtitle && (
          <div className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
            {subtitle}
          </div>
        )}

        {description && (
          <div className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {description}
          </div>
        )}
      </div>

      {actions && (
        <div className="pt-2">
          {actions}
        </div>
      )}

      {children && (
        <div className="pt-2 sm:pt-4">
          {children}
        </div>
      )}
    </header>
  );
};

export default PageHero;
