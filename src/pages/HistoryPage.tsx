import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { DataTable, Column } from '../components/common/DataTable';
import { calculateWQI } from '../mocks/mockData';
import { useSensorReadings } from '../hooks/useSensorReadings';
import { SensorReading, SensorType } from '../types';
import { Download, Calendar, Filter, History, LineChart as LineChartIcon, Activity } from 'lucide-react';
import { formatFullDate, formatISOToShortTime } from '../utils/date';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { cn } from '../lib/utils';

export const HistoryPage: React.FC = () => {
  const { readings } = useSensorReadings(100);
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [activeParameter, setActiveParameter] = useState<SensorType | 'all'>('all');

  // Filtered telemetry slice according to date range
  const filteredReadings = useMemo(() => {
    if (dateRange === '24h') return readings.slice(0, 24);
    if (dateRange === '7d') return readings.slice(0, 56);
    return readings;
  }, [readings, dateRange]);

  // CSV Export
  const handleExportCsv = () => {
    const headers = 'Timestamp,Temperature (°C),pH,TDS (ppm),Turbidity (NTU),Water Level (%),Calculated WQI\n';
    const rows = filteredReadings
      .map((r) => {
        const wqi = calculateWQI(r);
        return `"${r.timestamp}",${r.temperature},${r.ph},${r.tds},${r.turbidity},${r.waterLevel},"${wqi.score} (${wqi.status})"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aquamonitor_sensor_history_${dateRange}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns: Column<SensorReading>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[#0BAA9F]" />
          <span className="font-semibold text-[#0E6B6B]">
            {formatISOToShortTime(row.timestamp)}
          </span>
          <span className="text-[10px] text-[#7FA3B8] font-sans">
            ({formatFullDate(new Date(row.timestamp))})
          </span>
        </div>
      ),
    },
    {
      key: 'temperature',
      header: 'Temp (°C)',
      align: 'right',
      render: (row) => (
        <span className="font-bold text-[#0E6B6B]">{row.temperature.toFixed(1)} °C</span>
      ),
    },
    {
      key: 'ph',
      header: 'pH Level',
      align: 'right',
      render: (row) => (
        <span
          className={cn(
            'font-bold',
            row.ph < 6.5 || row.ph > 8.5 ? 'text-[#F59E0B]' : 'text-[#0E6B6B]'
          )}
        >
          {row.ph.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'tds',
      header: 'TDS (ppm)',
      align: 'right',
      render: (row) => <span className="font-bold text-[#0E6B6B]">{row.tds}</span>,
    },
    {
      key: 'turbidity',
      header: 'Turbidity (NTU)',
      align: 'right',
      render: (row) => (
        <span
          className={cn(
            'font-bold',
            row.turbidity > 4.0 ? 'text-[#F59E0B]' : 'text-[#0E6B6B]'
          )}
        >
          {row.turbidity.toFixed(1)}
        </span>
      ),
    },
    {
      key: 'waterLevel',
      header: 'Water Level (%)',
      align: 'right',
      render: (row) => <span className="font-bold text-[#0E6B6B]">{row.waterLevel}%</span>,
    },
    {
      key: 'wqi',
      header: 'WQI Status',
      align: 'center',
      render: (row) => {
        const wqi = calculateWQI(row);
        return (
          <span
            className="px-2.5 py-0.5 text-[11px] font-bold rounded-full text-white shadow-xs inline-block"
            style={{ backgroundColor: wqi.color }}
          >
            {wqi.score} • {wqi.status.split(' ')[0]}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Page Header */}
      <PageHeader
        title="Sensor History"
        description="Review historical water-quality measurements and export verified telemetry datasets"
        badgeText={`${filteredReadings.length} Logged Entries`}
        actions={
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0BAA9F] hover:bg-[#0BAA9F]/90 rounded-xl shadow-soft flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Export CSV</span>
          </button>
        }
      />

      {/* 2. Compact Historical Trend Visualization */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#B6CCD9]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E6F6FF] text-[#0BAA9F] border border-[#B6CCD9]/60 flex items-center justify-center shadow-soft shrink-0">
              <LineChartIcon className="w-4 h-4 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="text-[17px] font-semibold text-[#0E6B6B] tracking-tight">
                Historical Trend Dynamics
              </h3>
              <p className="text-xs text-[#7FA3B8] font-normal mt-0.5">
                Time-series movement over selected historical scope
              </p>
            </div>
          </div>

          {/* Time Scope Tabs */}
          <div className="inline-flex rounded-xl bg-[#F3FBFF] border border-[#B6CCD9]/60 p-1 text-xs">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  'px-3 py-1 font-semibold rounded-lg transition-all cursor-pointer',
                  dateRange === range
                    ? 'bg-[#0BAA9F] text-white shadow-soft'
                    : 'text-[#7FA3B8] hover:text-[#0E6B6B] hover:bg-[#FFFFFF]/60'
                )}
              >
                {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Line Chart */}
        <div className="h-56 sm:h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredReadings.slice(0, 30).reverse().map((r) => ({
                time: formatISOToShortTime(r.timestamp),
                temp: r.temperature,
                ph: r.ph * 10, // scaled for composite display
                tds: r.tds / 10,
                turbidity: r.turbidity * 10,
              }))}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
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
                        <p className="text-[#0BAA9F] font-bold">Temperature: {payload[0]?.value} °C</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                name="Temperature"
                stroke="#0BAA9F"
                strokeWidth={2.5}
                dot={{ fill: '#0BAA9F', r: 2 }}
                activeDot={{ r: 5, stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Filter & Historical Readings Table */}
      <div className="space-y-3">
        <DataTable
          columns={columns}
          data={filteredReadings}
          pageSize={12}
          searchableKey="timestamp"
          searchPlaceholder="Filter historical log by timestamp..."
        />
      </div>
    </div>
  );
};
