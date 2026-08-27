import React from 'react';
import { Cpu, Wifi, ShieldCheck, Activity, HardDrive, Zap, Radio } from 'lucide-react';
import { useDevice } from '../../hooks/useDevice';
import { APP_CONFIG } from '../../constants/config';

export const DeviceStatusWidget: React.FC = () => {
  const { device: info } = useDevice();

  // Format uptime in hours & minutes
  const hoursUptime = (info.uptimeSeconds / 3600).toFixed(1);

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] p-5 sm:p-6 shadow-soft space-y-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#B6CCD9]/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E6F6FF] text-[#0BAA9F] border border-[#B6CCD9]/60 flex items-center justify-center shadow-soft shrink-0">
            <Cpu className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7FA3B8]">
              Connected Node
            </h3>
            <p className="text-xs font-semibold text-[#0E6B6B]">{info.deviceId || APP_CONFIG.deviceModel}</p>
          </div>
        </div>

        {/* Semantic Status Badge */}
        <span className="text-[11px] font-semibold bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
          Online
        </span>
      </div>

      {/* Grid of hardware parameters */}
      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-[#F3FBFF] border border-[#B6CCD9]/60 space-y-1">
          <span className="text-[10px] text-[#7FA3B8] font-sans font-medium flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-[#0BAA9F]" /> Wi-Fi Signal
          </span>
          <p className="font-bold text-[#0E6B6B]">
            {info.rssiDbm ? `${info.rssiDbm} dBm` : '-62 dBm (Strong)'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[#F3FBFF] border border-[#B6CCD9]/60 space-y-1">
          <span className="text-[10px] text-[#7FA3B8] font-sans font-medium flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#16A34A]" /> Node Uptime
          </span>
          <p className="font-bold text-[#0E6B6B]">{hoursUptime} hrs</p>
        </div>

        <div className="p-3 rounded-xl bg-[#F3FBFF] border border-[#B6CCD9]/60 space-y-1">
          <span className="text-[10px] text-[#7FA3B8] font-sans font-medium flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-[#F59E0B]" /> SRAM Usage
          </span>
          <p className="font-bold text-[#0E6B6B]">
            {info.sramUsedKb} / {info.sramTotalKb} KB
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[#F3FBFF] border border-[#B6CCD9]/60 space-y-1">
          <span className="text-[10px] text-[#7FA3B8] font-sans font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0BAA9F]" /> Firmware
          </span>
          <p className="font-bold text-[#0E6B6B]">{info.firmwareVersion || 'v1.0.0'}</p>
        </div>
      </div>

      {/* Quick hardware link footer */}
      <div className="pt-2 flex items-center justify-between text-[11px] text-[#7FA3B8]">
        <div className="flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-[#0BAA9F]" />
          <span>ADC Sampling 12-bit</span>
        </div>
        <span className="font-mono">Last update: Just now</span>
      </div>
    </div>
  );
};
