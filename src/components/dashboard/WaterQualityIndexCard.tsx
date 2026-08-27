import React from 'react';
import { ShieldCheck, Sparkles, Activity, CheckCircle2 } from 'lucide-react';
import { calculateWQI } from '../../mocks/mockData';
import { SensorStatus } from '../../types';

interface WaterQualityIndexCardProps {
  statuses: SensorStatus[];
}

export const WaterQualityIndexCard: React.FC<WaterQualityIndexCardProps> = ({ statuses }) => {
  const getVal = (id: string) => statuses.find((s) => s.id === id)?.value ?? 0;

  const currentWqi = calculateWQI({
    temperature: getVal('temperature'),
    ph: getVal('ph'),
    tds: getVal('tds'),
    turbidity: getVal('turbidity'),
    waterLevel: getVal('waterLevel'),
  });

  const score = currentWqi.score;
  // Calculate stroke dash for a 270-degree gauge (radius 58)
  const radius = 58;
  const circumference = 2 * Math.PI * radius * 0.75; // 270 deg
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] p-6 sm:p-7 shadow-card flex flex-col lg:flex-row items-stretch justify-between gap-6 sm:gap-8 relative overflow-hidden">
      {/* Subtle ambient water radiance pattern in background */}
      <div 
        className="absolute -top-16 -right-16 w-80 h-80 pointer-events-none opacity-40 rounded-full"
        style={{
          background: 'radial-gradient(circle, #E6F6FF 0%, rgba(243, 251, 255, 0) 70%)'
        }}
        aria-hidden="true"
      />

      {/* Left: Overall Water Quality & Scientific Guidance */}
      <div className="space-y-4 max-w-xl z-10 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-[#E6F6FF] text-[#0BAA9F] border border-[#B6CCD9]/60 flex items-center justify-center shadow-soft">
              <ShieldCheck className="w-4 h-4 stroke-[1.75]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E6B6B]">
              Overall Water Quality Index (WQI)
            </span>
            <span className="ml-auto sm:ml-0 text-[11px] font-semibold uppercase bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 stroke-[2]" />
              Real-time Analysis
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3 my-2">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-[#0E6B6B]">
              {score}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-semibold text-[#7FA3B8] font-sans">
                / 100 —
              </span>
              <span 
                className="text-lg sm:text-2xl font-bold font-sans uppercase tracking-tight" 
                style={{ color: currentWqi.color }}
              >
                {currentWqi.status}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-[13px] text-[#7FA3B8] font-normal leading-relaxed mt-1">
            Water quality is currently within the acceptable laboratory monitoring range. Weighted telemetry based on CCME standards confirms nominal pH balance, low turbidity, and stable mineral conductivity.
          </p>
        </div>

        {/* CCME Quality Scale Segment Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-[11px] text-[#7FA3B8] font-mono font-medium">
            <span>0 Poor</span>
            <span>45 Marginal</span>
            <span>65 Fair</span>
            <span>80 Good</span>
            <span>95–100 Excellent</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#E6F6FF] border border-[#B6CCD9]/60 overflow-hidden flex">
            <div className="h-full w-[45%] bg-[#EF4444]/75" title="Poor (0-44)" />
            <div className="h-full w-[20%] bg-[#F59E0B]/75" title="Fair (45-64)" />
            <div className="h-full w-[15%] bg-[#0BAA9F]/70" title="Good (65-79)" />
            <div className="h-full w-[20%] bg-[#16A34A]/90" title="Excellent (80-100)" />
          </div>
        </div>
      </div>

      {/* Right: Circular Gauge & Dimensional Water Illustration Hybrid */}
      <div className="bg-[#F3FBFF] border border-[#B6CCD9] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 min-w-[320px] lg:min-w-[360px] z-10 shadow-soft">
        
        {/* Semi-Circular Scientific Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-135 transform" viewBox="0 0 140 140">
            {/* Background track */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#B6CCD9"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset="0"
              fill="none"
              opacity="0.3"
            />
            {/* Active value track */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#0BAA9F"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              fill="none"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Centered Gauge Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold font-mono text-[#0E6B6B] leading-none">
              {score}%
            </span>
            <span className="text-[10px] text-[#7FA3B8] font-sans font-medium uppercase tracking-wider mt-1">
              Safety Index
            </span>
          </div>
        </div>

        {/* Dimensional Water Droplet / Ripple Vector Hybrid Illustration */}
        <div className="flex flex-col items-center text-center sm:text-left sm:items-start space-y-3 shrink-0">
          {/* Dimensional Droplet Object */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Ambient outer ripple ring */}
            <div className="absolute inset-0 rounded-full border border-[#0BAA9F]/20 bg-[#E6F6FF]/50 animate-pulse" />
            
            {/* Middle ripple ring */}
            <div className="absolute inset-2 rounded-full border border-[#0BAA9F]/40 bg-[#FFFFFF] shadow-soft" />

            {/* Dimensional Droplet Shape */}
            <svg 
              className="w-8 h-8 text-[#0BAA9F] drop-shadow-[0_4px_6px_rgba(11,170,159,0.25)]" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" 
                fill="url(#dropletGradient)" 
                stroke="#0E6B6B" 
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="dropletGradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0BAA9F" />
                  <stop offset="1" stopColor="#0E6B6B" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0E6B6B]">
              <Sparkles className="w-3.5 h-3.5 text-[#0BAA9F]" />
              <span>Sensors Nominal</span>
            </div>
            <p className="text-[11px] text-[#7FA3B8] font-mono">
              5/5 Telemetry Channels Active
            </p>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-[#7FA3B8] font-sans">
            <Activity className="w-3 h-3 text-[#0BAA9F]" />
            <span>Updated continuous live stream</span>
          </div>
        </div>

      </div>
    </div>
  );
};
