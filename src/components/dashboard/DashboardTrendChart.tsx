import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { SensorReading, SensorType } from '../../types';
import { formatISOToShortTime } from '../../utils/date';
import { cn } from '../../lib/utils';
import { Activity, Calendar } from 'lucide-react';

interface DashboardTrendChartProps {
  readings: SensorReading[];
}

const SENSOR_METRICS: {
  id: SensorType;
  label: string;
  unit: string;
  color: string;
}[] = [
  { id: 'temperature', label: 'Temperature', unit: '°C', color: '#0BAA9F' },
  { id: 'ph', label: 'pH Level', unit: 'pH', color: '#0E6B6B' },
  { id: 'tds', label: 'TDS', unit: 'ppm', color: '#F59E0B' },
  { id: 'turbidity', label: 'Turbidity', unit: 'NTU', color: '#7FA3B8' },
  { id: 'waterLevel', label: 'Water Level', unit: '%', color: '#0BAA9F' },
];

type TimeRangeOption = '24h' | '7d' | '30d';

export const DashboardTrendChart: React.FC<DashboardTrendChartProps> = ({ readings }) => {
  const [activeMetric, setActiveMetric] = useState<SensorType>('temperature');
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('7d');

  const currentConfig = SENSOR_METRICS.find((m) => m.id === activeMetric) || SENSOR_METRICS[0];

  // Adjust data according to timeRange (for mock demo, downsample/slice or use timestamps)
  const chartData = readings.map((r, index) => {
    let timeLabel = formatISOToShortTime(r.timestamp);
    if (timeRange === '7d') {
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      timeLabel = `${dayNames[index % 7]} ${timeLabel}`;
    } else if (timeRange === '30d') {
      timeLabel = `Day ${index + 1}`;
    }
    return {
      time: timeLabel,
      value: r[activeMetric],
      fullTimestamp: r.timestamp,
    };
  });

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] p-5 sm:p-6 shadow-soft space-y-5">
      {/* Header & Dual Controls: Time Range + Sensor Selector */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-[#B6CCD9]/60">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#0BAA9F]" />
            <h3 className="text-[17px] font-semibold text-[#0E6B6B] tracking-tight">
              Water Quality Trend
            </h3>
          </div>
          <p className="text-xs text-[#7FA3B8] font-normal mt-0.5">
            Continuous telemetry measurements sampled across active sensor array
          </p>
        </div>

        {/* Action Controls Group: Time Range Tabs + Metric Selectors */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Time Range Selector (24 Hours, 7 Days, 30 Days) */}
          <div className="flex items-center bg-[#F3FBFF] border border-[#B6CCD9] p-1 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-[#7FA3B8] ml-2 mr-1 hidden sm:inline-block" />
            {(['24h', '7d', '30d'] as TimeRangeOption[]).map((range) => {
              const label = range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : '30 Days';
              const isActive = timeRange === range;
              return (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer font-mono',
                    isActive
                      ? 'bg-[#0E6B6B] text-white shadow-soft'
                      : 'text-[#7FA3B8] hover:text-[#0E6B6B] hover:bg-[#E6F6FF]'
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap gap-1 bg-[#E6F6FF]/70 border border-[#B6CCD9]/60 p-1 rounded-xl">
            {SENSOR_METRICS.map((metric) => (
              <button
                key={metric.id}
                onClick={() => setActiveMetric(metric.id)}
                className={cn(
                  'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                  activeMetric === metric.id
                    ? 'bg-[#0BAA9F] text-white shadow-soft'
                    : 'text-[#0E6B6B]/80 hover:text-[#0E6B6B] hover:bg-[#FFFFFF]/60'
                )}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas & Visual Telemetry */}
      <div className="h-68 sm:h-76 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Light blue-gray grid lines */}
            <CartesianGrid strokeDasharray="3 3" stroke="#E6F6FF" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: '#7FA3B8', fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#B6CCD9' }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#7FA3B8', fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
            />
            {/* Clean Scientific Tooltip */}
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#FFFFFF] text-[#0E6B6B] p-3 rounded-xl shadow-card text-xs font-mono space-y-1 border border-[#B6CCD9]">
                      <p className="text-[11px] text-[#7FA3B8] font-sans font-medium">{label}</p>
                      <div className="flex items-baseline gap-1.5 pt-0.5">
                        <span className="text-[#0E6B6B] font-sans">{currentConfig.label}:</span>
                        <span className="font-bold text-[#0BAA9F] text-sm">
                          {payload[0].value} {currentConfig.unit}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={currentConfig.color}
              strokeWidth={2.5}
              dot={{ r: 2, fill: currentConfig.color, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: '#FFFFFF', fill: currentConfig.color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
