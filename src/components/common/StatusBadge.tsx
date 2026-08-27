import React from 'react';
import { cn } from '../../lib/utils';
import { AlertTriangle, CheckCircle2, AlertOctagon, Info } from 'lucide-react';

export type BadgeStatus = 'normal' | 'warning' | 'critical' | 'connected' | 'offline' | 'info';

interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  showIcon = true,
  className,
}) => {
  const getStyles = () => {
    switch (status) {
      case 'normal':
      case 'connected':
        return {
          bg: 'bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/30',
          icon: CheckCircle2,
          defaultLabel: 'Normal',
          dotBg: 'bg-[#16A34A]',
        };
      case 'warning':
        return {
          bg: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
          icon: AlertTriangle,
          defaultLabel: 'Warning',
          dotBg: 'bg-[#F59E0B]',
        };
      case 'critical':
      case 'offline':
        return {
          bg: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30',
          icon: AlertOctagon,
          defaultLabel: 'Critical',
          dotBg: 'bg-[#EF4444]',
        };
      case 'info':
      default:
        return {
          bg: 'bg-[#E6F6FF] text-[#0E6B6B] border-[#B6CCD9]',
          icon: Info,
          defaultLabel: 'Info',
          dotBg: 'bg-[#0BAA9F]',
        };
    }
  };

  const config = getStyles();
  const IconComponent = config.icon;
  const displayText = label || config.defaultLabel;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-colors whitespace-nowrap',
        config.bg,
        className
      )}
    >
      {showIcon && <IconComponent className="w-3 h-3 shrink-0 stroke-[2]" />}
      <span className="capitalize">{displayText}</span>
    </span>
  );
};
