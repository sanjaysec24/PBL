import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { MetricCard } from '../components/common/MetricCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { SensorStatus, SensorType } from '../types';
import { useSensorReadings } from '../hooks/useSensorReadings';
import { SensorService } from '../services/SensorService';
import {
  Play,
  Pause,
  Activity,
  Radio,
  Clock,
  Layers,
  Thermometer,
  Droplet,
  Eye,
  Waves,
  Sparkles,
  Wifi
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatISOToShortTime } from '../utils/date';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const SENSOR_TABS: { id: SensorType; label: string; icon: React.ElementType; unit: string; range: string }[] = [
  { id: 'temperature', label: 'Temperature', icon: Thermometer, unit: '°C', range: '18 – 28 °C' },
  { id: 'ph', label: 'pH Level', icon: Activity, unit: 'pH', range: '6.5 – 8.5 pH' },
  { id: 'tds', label: 'TDS Meter', icon: Droplet, unit: 'ppm', range: '50 – 500 ppm' },
  { id: 'turbidity', label: 'Turbidity', icon: Eye, unit: 'NTU', range: '0.0 – 5.0 NTU' },
  { id: 'waterLevel', label: 'Water Level', icon: Waves, unit: '%', range: '20 – 98 %' },
];

export const LiveMonitorPage: React.FC = () => {
  const { statuses, readings: liveStreamBuffer } = useSensorReadings(30);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [sampleRateMs, setSampleRateMs] = useState<number>(2000);
  const [packetCount, setPacketCount] = useState<number>(2410);
  const [selectedSensorId, setSelectedSensorId] = useState<SensorType>('temperature');

  const statusesRef = useRef(statuses);
  useEffect(() => {
    statusesRef.current = statuses;
  }, [statuses]);

  // Real-time telemetry simulator loop that persists to Firestore
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(async () => {
      setPacketCount((prev) => prev + 1);

      const currentStatuses = statusesRef.current;
      const getVal = (id: string) => currentStatuses.find((s) => s.id === id)?.value ?? 20;

      const nextTemp = Math.max(0, Number((getVal('temperature') + (Math.random() - 0.5) * 0.4).toFixed(1)));
      const nextPh = Math.max(0, Number((getVal('ph') + (Math.random() - 0.5) * 0.08).toFixed(2)));
      const nextTds = Math.max(0, Math.round(getVal('tds') + (Math.random() - 0.5) * 4));
      const nextTurbidity = Math.max(0, Number((getVal('turbidity') + (Math.random() - 0.5) * 0.2).toFixed(1)));
      const nextWaterLevel = Math.max(0, Math.round(getVal('waterLevel') + (Math.random() - 0.5) * 1));

      try {
        await SensorService.createReading({
          deviceId: 'ESP32-001',
          temperature: nextTemp,
          ph: nextPh,
          tds: nextTds,
          turbidity: nextTurbidity,
          waterLevel: nextWaterLevel,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Live stream firestore log error:', err);
      }
    }, sampleRateMs);

    return () => clearInterval(interval);
  }, [isStreaming, sampleRateMs]);

  const activeSensorStatus = statuses.find((s) => s.id === selectedSensorId) || statuses[0];
  const activeTabConfig = SENSOR_TABS.find((t) => t.id === selectedSensorId) || SENSOR_TABS[0];
  const ActiveIcon = activeTabConfig.icon;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Page Header */}
      <PageHeader
        title="Live Sensor Monitoring"
        description="Real-time high-frequency telemetry observation from connected probe matrix"
        badgeText={isStreaming ? 'Stream Active' : 'Stream Paused'}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={cn(
                'px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-soft',
                isStreaming
                  ? 'bg-[#FFFFFF] text-[#0E6B6B] border border-[#B6CCD9] hover:bg-[#E6F6FF]'
                  : 'bg-[#16A34A] text-white hover:bg-[#15803d]'
              )}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#F59E0B] stroke-[2]" />
                  <span>Pause Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 stroke-[2]" />
                  <span>Resume Stream</span>
                </>
              )}
            </button>
          </div>
        }
      />

      {/* 2. Top Sensor Parameter Selector & Hardware Stream Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-3 sm:p-4 bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] shadow-soft">
        {/* Sensor Parameter Segmented Tabs */}
        <div className="flex items-center overflow-x-auto p-1 bg-[#F3FBFF] rounded-xl border border-[#B6CCD9]/60 max-w-full">
          {SENSOR_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedSensorId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedSensorId(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer',
                  isSelected
                    ? 'bg-[#E6F6FF] text-[#0E6B6B] border border-[#B6CCD9] shadow-xs'
                    : 'text-[#7FA3B8] hover:text-[#0E6B6B] hover:bg-[#FFFFFF]/60'
                )}
              >
                <Icon className={cn('w-3.5 h-3.5 stroke-[1.75]', isSelected ? 'text-[#0BAA9F]' : 'text-[#7FA3B8]')} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Stream Telemetry Pill & Rate */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F3FBFF] border border-[#B6CCD9]/60 rounded-xl">
            <Radio className={cn('w-3.5 h-3.5', isStreaming ? 'text-[#16A34A] animate-pulse' : 'text-[#7FA3B8]')} />
            <span className="text-[#7FA3B8] font-sans">Data Stream:</span>
            <span className={cn('font-bold font-sans', isStreaming ? 'text-[#16A34A]' : 'text-[#7FA3B8]')}>
              {isStreaming ? 'Receiving data' : 'Paused'}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F3FBFF] border border-[#B6CCD9]/60 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-[#0BAA9F]" />
            <span className="text-[#7FA3B8] font-sans">Interval:</span>
            <select
              value={sampleRateMs}
              onChange={(e) => setSampleRateMs(Number(e.target.value))}
              aria-label="Sample Interval"
              className="bg-transparent font-bold text-[#0E6B6B] focus:outline-hidden cursor-pointer"
            >
              <option value={1000}>1.0s (High)</option>
              <option value={2000}>2.0s (Standard)</option>
              <option value={5000}>5.0s (Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Primary Live Waveform Visualization Card */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] p-6 sm:p-7 shadow-card space-y-6 relative overflow-hidden">
        {/* Subtle Ambient Water Ripple Motif in background */}
        <div 
          className="absolute -top-12 -right-12 w-64 h-64 pointer-events-none opacity-30 rounded-full"
          style={{
            background: 'radial-gradient(circle, #E6F6FF 0%, rgba(243, 251, 255, 0) 70%)'
          }}
          aria-hidden="true"
        />

        {/* Selected Sensor Hero Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#B6CCD9]/60 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F6FF] text-[#0BAA9F] border border-[#B6CCD9]/60 flex items-center justify-center shadow-soft shrink-0">
              <ActiveIcon className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#0E6B6B] tracking-tight">
                  {activeSensorStatus.name}
                </h3>
                <StatusBadge status={activeSensorStatus.status} />
              </div>
              <p className="text-xs text-[#7FA3B8] font-normal mt-0.5">
                Optimal Operational Bounds: <strong className="text-[#0E6B6B] font-mono">{activeTabConfig.range}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 self-start sm:self-auto bg-[#F3FBFF] border border-[#B6CCD9] px-4 py-2.5 rounded-xl font-mono">
            <div>
              <span className="text-[10px] text-[#7FA3B8] font-sans block">Current Live Value</span>
              <span className="text-2xl font-extrabold text-[#0E6B6B] leading-none">
                {activeSensorStatus.value} <span className="text-sm font-sans font-semibold text-[#7FA3B8]">{activeSensorStatus.unit}</span>
              </span>
            </div>
            <div className="border-l border-[#B6CCD9] pl-4 text-right text-xs">
              <span className="text-[10px] text-[#7FA3B8] font-sans block">Packets Logged</span>
              <span className="font-bold text-[#0BAA9F]">{packetCount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Oscilloscope Real-Time Telemetry Chart */}
        <div className="h-72 sm:h-84 w-full pt-2 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={liveStreamBuffer.map((b) => ({
                time: formatISOToShortTime(b.timestamp),
                val: b[selectedSensorId],
              }))}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="liveStreamGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0BAA9F" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0BAA9F" stopOpacity={0.0} />
                </linearGradient>
              </defs>
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
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#FFFFFF] text-[#0E6B6B] p-3 rounded-xl border border-[#B6CCD9] shadow-card text-xs font-mono space-y-1">
                        <p className="text-[11px] text-[#7FA3B8] font-sans font-medium">{label}</p>
                        <div className="flex items-baseline gap-1.5 pt-0.5">
                          <span className="text-[#0E6B6B] font-sans">{activeSensorStatus.name}:</span>
                          <span className="font-bold text-[#0BAA9F] text-sm">
                            {payload[0].value} {activeSensorStatus.unit}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="val"
                stroke="#0BAA9F"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#liveStreamGradient)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Real-time Status Footer with Dimensional Water & Hardware Indicator */}
        <div className="pt-4 border-t border-[#B6CCD9]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#7FA3B8]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span className="font-sans">Hardware Node: <strong className="text-[#0E6B6B]">ESP32-001</strong></span>
            <span className="text-[#B6CCD9]">•</span>
            <span className="font-sans">Signal: <strong className="text-[#16A34A]">-62 dBm</strong></span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#0BAA9F]" />
            <span>Continuous ADC Sampling Stream</span>
          </div>
        </div>
      </div>

      {/* 4. Supporting Sensor Grid */}
      <section aria-label="Attached Sensor Probe Array" className="space-y-3">
        <SectionHeader
          title="Attached Probe Matrix"
          subtitle="Click any sensor to focus its high-frequency real-time stream"
          icon={Layers}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statuses.map((sensor) => {
            const isSelected = sensor.id === selectedSensorId;
            return (
              <div 
                key={sensor.id} 
                className={cn(
                  'rounded-2xl transition-all',
                  isSelected && 'ring-2 ring-[#0BAA9F] shadow-soft'
                )}
              >
                <MetricCard
                  status={sensor}
                  onClick={() => setSelectedSensorId(sensor.id)}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
