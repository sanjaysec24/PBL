import React from 'react';
import { SensorStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Table, ArrowUpDown } from 'lucide-react';

interface LatestReadingsTableProps {
  statuses: SensorStatus[];
}

export const LatestReadingsTable: React.FC<LatestReadingsTableProps> = ({ statuses }) => {
  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-[#B6CCD9]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E6F6FF] text-[#0BAA9F] border border-[#B6CCD9]/60 flex items-center justify-center shadow-soft shrink-0">
            <Table className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div>
            <h3 className="text-[17px] font-semibold text-[#0E6B6B] tracking-tight">
              Latest Sensor Telemetry Snapshot
            </h3>
            <p className="text-xs text-[#7FA3B8] font-normal mt-0.5">
              Calibrated live values and analytical status limits
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-[#7FA3B8] bg-[#F3FBFF] border border-[#B6CCD9] px-2.5 py-1 rounded-lg self-start sm:self-auto">
          Updated: {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#0E6B6B]">
          <thead className="bg-[#F3FBFF] border-b border-[#B6CCD9] text-[11px] uppercase tracking-wider font-semibold text-[#7FA3B8]">
            <tr>
              <th className="px-4 sm:px-5 py-3.5">Sensor Parameter</th>
              <th className="px-4 sm:px-5 py-3.5">Current Value</th>
              <th className="px-4 sm:px-5 py-3.5">Scientific Unit</th>
              <th className="px-4 sm:px-5 py-3.5">Optimal Bounds</th>
              <th className="px-4 sm:px-5 py-3.5">Status</th>
              <th className="px-4 sm:px-5 py-3.5 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#B6CCD9]/40 font-mono">
            {statuses.map((sensor) => (
              <tr key={sensor.id} className="hover:bg-[#E6F6FF]/40 transition-colors">
                <td className="px-4 sm:px-5 py-3.5 font-sans font-semibold text-[#0E6B6B]">
                  {sensor.name}
                </td>
                <td className="px-4 sm:px-5 py-3.5 font-bold text-[#0E6B6B] text-sm">
                  {sensor.value}
                </td>
                <td className="px-4 sm:px-5 py-3.5 text-[#7FA3B8] font-sans">{sensor.unit}</td>
                <td className="px-4 sm:px-5 py-3.5 text-[#7FA3B8] font-sans text-[11px]">
                  {sensor.minThreshold} – {sensor.maxThreshold} {sensor.unit}
                </td>
                <td className="px-4 sm:px-5 py-3.5 font-sans">
                  <StatusBadge status={sensor.status} />
                </td>
                <td className="px-4 sm:px-5 py-3.5 text-right text-[#7FA3B8] text-[11px]">
                  {sensor.lastUpdated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
