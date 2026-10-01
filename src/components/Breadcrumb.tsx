import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1.5 text-xs font-mono text-slate-500 ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1 || item.isCurrent;
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 select-none" aria-hidden="true" />
            )}
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="hover:text-[#171917] transition-colors truncate max-w-[200px] sm:max-w-none"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-slate-900 font-bold truncate max-w-[220px] sm:max-w-md"
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
