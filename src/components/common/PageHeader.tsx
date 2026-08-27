import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  badgeText?: string;
  status?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badgeText,
  status,
  breadcrumbs,
  actions,
}) => {
  return (
    <header className="flex flex-col gap-3 pb-5 mb-6 sm:mb-8 border-b border-[#B6CCD9]">
      {/* Optional Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#7FA3B8] font-medium">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#B6CCD9] shrink-0" aria-hidden="true" />}
              {crumb.onClick ? (
                <button
                  type="button"
                  onClick={crumb.onClick}
                  className="hover:text-[#0BAA9F] transition-colors cursor-pointer"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className={crumb.active ? 'text-[#0E6B6B] font-semibold' : ''}>
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title, Badge, Status & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#0E6B6B] tracking-tight leading-tight">
              {title}
            </h1>
            {badgeText && (
              <span className="text-[11px] font-semibold bg-[#E6F6FF] text-[#0BAA9F] border border-[#B6CCD9] px-2.5 py-0.5 rounded-full font-mono">
                {badgeText}
              </span>
            )}
            {status}
          </div>
          {description && (
            <p className="text-xs sm:text-[13px] text-[#7FA3B8] font-normal mt-1 leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};
