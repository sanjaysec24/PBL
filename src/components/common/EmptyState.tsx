import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  action,
}) => {
  return (
    <div className="p-8 sm:p-12 text-center bg-[#FFFFFF] rounded-2xl border border-dashed border-[#B6CCD9] shadow-soft flex flex-col items-center justify-center">
      <div className="p-3.5 rounded-2xl bg-[#E6F6FF] text-[#0BAA9F] border border-[#B6CCD9]/60 mb-3.5 shadow-soft">
        <Icon className="w-6 h-6 stroke-[1.75]" />
      </div>
      <h3 className="text-sm sm:text-base font-bold text-[#0E6B6B] tracking-tight">{title}</h3>
      {description && <p className="text-xs sm:text-[13px] text-[#7FA3B8] font-normal max-w-sm mt-1 leading-relaxed">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
