import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 rounded-xl bg-[#E6F6FF] text-[#0BAA9F] border border-[#B6CCD9]/60 flex items-center justify-center shadow-soft">
            <Icon className="w-4 h-4 stroke-[1.75]" />
          </div>
        )}
        <div>
          <h2 className="text-[17px] font-semibold text-[#0E6B6B] tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-[#7FA3B8] font-normal mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};
