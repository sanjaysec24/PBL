import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  label: string;
  statusColor?: string;
  className?: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = React.memo(({
  value,
  min = 0,
  max = 100,
  unit = '',
  label,
  statusColor = '#0BAA9F',
  className,
}) => {
  // Normalize value to angle between -90 and 90 degrees
  const clampedValue = Math.min(max, Math.max(min, value));
  const percentage = (clampedValue - min) / (max - min || 1);
  const strokeDashoffset = 251.2 * (1 - percentage * 0.75); // 270 deg arc

  return (
    <div
      role="meter"
      aria-label={`${label} gauge`}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      className={cn(
        'flex flex-col items-center justify-center p-5 bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] shadow-soft hover:shadow-card transition-all duration-200',
        className
      )}
    >
      <div className="relative w-36 h-28 flex items-center justify-center">
        <svg className="w-36 h-36 transform -rotate-135" viewBox="0 0 100 100" aria-hidden="true">
          {/* Background Arc */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#E6F6FF"
            strokeWidth="8"
            strokeDasharray="251.2"
            strokeDashoffset="62.8" // leave 25% bottom open
            strokeLinecap="round"
          />
          {/* Value Arc */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={statusColor}
            strokeWidth="8"
            strokeDasharray="251.2"
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-2xl font-bold font-mono text-[#0E6B6B] tracking-tight">
            {typeof value === 'number' ? value : value}
          </span>
          <span className="text-[11px] font-semibold text-[#7FA3B8] font-sans">{unit}</span>
        </div>
      </div>

      <div className="text-center mt-1">
        <span className="text-xs font-semibold text-[#0E6B6B] block">{label}</span>
        <span className="text-[11px] text-[#7FA3B8] font-mono">
          Range: {min} - {max} {unit}
        </span>
      </div>
    </div>
  );
});

GaugeChart.displayName = 'GaugeChart';

