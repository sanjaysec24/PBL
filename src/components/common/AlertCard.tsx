import React from 'react';
import { AlertItem } from '../../types';
import { StatusBadge } from './StatusBadge';
import { CheckCircle, Clock } from 'lucide-react';
import { formatISOToShortTime } from '../../utils/date';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface AlertCardProps {
  alert: AlertItem;
  onResolve?: (id: string) => void;
  className?: string;
}

export const AlertCard: React.FC<AlertCardProps> = React.memo(({ alert, onResolve, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      role="article"
      aria-label={`Alert: ${alert.sensorName} - ${alert.message}`}
      className={cn(
        'p-4 sm:p-5 rounded-2xl border bg-[#FFFFFF] shadow-soft transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3',
        alert.resolved
          ? 'border-[#B6CCD9]/60 opacity-80 bg-[#F3FBFF]/60'
          : alert.severity === 'critical'
          ? 'border-[#EF4444]/40 bg-[#EF4444]/5'
          : alert.severity === 'warning'
          ? 'border-[#F59E0B]/40 bg-[#F59E0B]/5'
          : 'border-[#B6CCD9]',
        className
      )}
    >
      <div className="space-y-2 flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <StatusBadge status={alert.severity} />
          <span className="text-xs font-bold text-[#0E6B6B]">{alert.sensorName}</span>
          <span className="text-[11px] font-mono font-semibold text-[#0E6B6B] bg-[#E6F6FF] border border-[#B6CCD9]/60 px-2 py-0.5 rounded-md">
            Value: {alert.value} {alert.unit}
          </span>
          <span className="text-[11px] text-[#7FA3B8] font-normal ml-auto sm:ml-0 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#7FA3B8]" aria-hidden="true" />
            {formatISOToShortTime(alert.timestamp)}
          </span>
        </div>
        <p className="text-xs text-[#0E6B6B]/90 font-normal leading-relaxed">{alert.message}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        {alert.resolved ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16A34A] bg-[#16A34A]/10 border border-[#16A34A]/30 px-2.5 py-1 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
            Resolved
          </span>
        ) : (
          onResolve && (
            <button
              onClick={() => onResolve(alert.id)}
              aria-label={`Acknowledge alert for ${alert.sensorName}`}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#0E6B6B] bg-[#FFFFFF] hover:bg-[#E6F6FF] border border-[#B6CCD9] hover:border-[#0BAA9F] rounded-xl shadow-soft transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0BAA9F]/30 cursor-pointer"
            >
              Acknowledge
            </button>
          )
        )}
      </div>
    </motion.div>
  );
});

AlertCard.displayName = 'AlertCard';

