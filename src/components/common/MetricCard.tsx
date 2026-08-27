import React from 'react';
import { Thermometer, Activity, Droplet, Eye, Waves, LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SensorType, SensorStatus } from '../../types';
import { StatusBadge } from './StatusBadge';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface MetricCardProps {
  status: SensorStatus;
  onClick?: () => void;
  className?: string;
  trendDelta?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

const SENSOR_ICONS: Record<SensorType, LucideIcon> = {
  temperature: Thermometer,
  ph: Activity,
  tds: Droplet,
  turbidity: Eye,
  waterLevel: Waves,
};

const SENSOR_OPTIMAL_TEXT: Record<SensorType, string> = {
  temperature: '18 - 28 °C',
  ph: '6.5 - 8.5 pH',
  tds: '50 - 500 ppm',
  turbidity: '0 - 5.0 NTU',
  waterLevel: '20 - 98 %',
};

// Default subtle trend mock values based on sensor id
const DEFAULT_TRENDS: Record<SensorType, { delta: string; direction: 'up' | 'down' | 'neutral' }> = {
  temperature: { delta: '+0.4%', direction: 'up' },
  ph: { delta: '-0.1%', direction: 'down' },
  tds: { delta: '+1.2%', direction: 'up' },
  turbidity: { delta: '0.0%', direction: 'neutral' },
  waterLevel: { delta: '-0.5%', direction: 'down' },
};

export const MetricCard: React.FC<MetricCardProps> = React.memo(({ 
  status, 
  onClick, 
  className,
  trendDelta,
  trendDirection
}) => {
  const Icon = SENSOR_ICONS[status.id] || Activity;
  const optimalRange = SENSOR_OPTIMAL_TEXT[status.id];
  const trend = trendDelta 
    ? { delta: trendDelta, direction: trendDirection || 'neutral' }
    : DEFAULT_TRENDS[status.id] || { delta: '0.0%', direction: 'neutral' };

  // Calculate percentage within thresholds for range bar
  const rangeSpan = status.maxThreshold - status.minThreshold;
  const percentage = Math.min(
    100,
    Math.max(0, ((status.value - status.minThreshold) / (rangeSpan || 1)) * 100)
  );

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onClick={onClick}
      role={onClick ? 'button' : 'region'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${status.name} telemetry card: ${status.value} ${status.unit}, status ${status.status}`}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        'group bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] p-5 sm:p-5.5 shadow-soft hover:shadow-card transition-all duration-200 cursor-pointer flex flex-col justify-between focus:outline-hidden focus:ring-2 focus:ring-[#0BAA9F]/30 focus:border-[#0BAA9F]',
        className
      )}
    >
      {/* Card Header: Icon, Name & Status */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#E6F6FF] text-[#0BAA9F] border border-[#B6CCD9]/60 group-hover:bg-[#0BAA9F] group-hover:text-white transition-colors flex items-center justify-center shadow-soft shrink-0">
            <Icon className="w-4 h-4 stroke-[1.75]" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-[#0E6B6B] uppercase tracking-wider truncate">
              {status.name}
            </h3>
            <p className="text-[11px] text-[#7FA3B8] font-normal mt-0.5 truncate">
              {optimalRange}
            </p>
          </div>
        </div>
        <StatusBadge status={status.status} />
      </div>

      {/* Main Metric Value & Trend Badge */}
      <div className="my-2 flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#0E6B6B] font-mono leading-none">
            {typeof status.value === 'number' ? status.value : status.value}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-[#7FA3B8] font-sans">
            {status.unit}
          </span>
        </div>

        {/* Small trend delta badge */}
        <div 
          className={cn(
            "flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md border",
            trend.direction === 'up' && "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20",
            trend.direction === 'down' && "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
            trend.direction === 'neutral' && "bg-[#E6F6FF] text-[#7FA3B8] border-[#B6CCD9]/60"
          )}
          title={`24h trend delta: ${trend.delta}`}
        >
          {trend.direction === 'up' && <TrendingUp className="w-3 h-3 stroke-[2]" />}
          {trend.direction === 'down' && <TrendingDown className="w-3 h-3 stroke-[2]" />}
          {trend.direction === 'neutral' && <Minus className="w-3 h-3 stroke-[2]" />}
          <span>{trend.delta}</span>
        </div>
      </div>

      {/* Visual Range Indicator Bar */}
      <div className="mt-3 pt-3 border-t border-[#B6CCD9]/50 space-y-1.5">
        <div className="flex justify-between text-[10px] text-[#7FA3B8] font-normal font-mono">
          <span>Min: {status.minThreshold}</span>
          <span>Max: {status.maxThreshold}</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[#E6F6FF] overflow-hidden relative">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              status.status === 'normal' && 'bg-[#0BAA9F]',
              status.status === 'warning' && 'bg-[#F59E0B]',
              status.status === 'critical' && 'bg-[#EF4444]'
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${status.name} threshold position ${percentage.toFixed(0)}%`}
          />
        </div>
      </div>
    </motion.div>
  );
});

MetricCard.displayName = 'MetricCard';
