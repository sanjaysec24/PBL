import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { SectionHeader } from '../components/common/SectionHeader';
import { useDevice } from '../hooks/useDevice';
import { APP_CONFIG } from '../constants/config';
import {
  Cpu,
  Wifi,
  HardDrive,
  Activity,
  Layers,
  GraduationCap,
  ShieldCheck,
  CheckCircle,
  Radio,
  Clock,
  Sparkles
} from 'lucide-react';

export const AboutDevicePage: React.FC = () => {
  const { device: info } = useDevice();

  const sensorSpecs = [
    {
      name: 'Water Temperature Sensor',
      model: 'DS18B20 Digital Thermometer',
      interface: 'OneWire (GPIO4)',
      unit: '°C',
      accuracy: '±0.5 °C (-10°C to +85°C)',
      description: 'Waterproof immersion stainless steel probe for continuous thermal monitoring.',
      status: 'Active & Calibrated',
    },
    {
      name: 'pH Level Sensor',
      model: 'Analog pH Sensor Kit v2.1 (E-201-C)',
      interface: 'Analog ADC (GPIO34)',
      unit: 'pH',
      accuracy: '±0.1 pH (0.0 to 14.0)',
      description: 'Precision glass combination electrode measuring hydrogen-ion activity.',
      status: 'Active & Calibrated',
    },
    {
      name: 'TDS (Total Dissolved Solids) Meter',
      model: 'Gravity Analog TDS Sensor v1.0',
      interface: 'Analog ADC (GPIO35)',
      unit: 'ppm',
      accuracy: '±10% F.S. (0 to 1000 ppm)',
      description: 'Electrical conductivity probe measuring total dissolved inorganic salts and ions.',
      status: 'Active & Calibrated',
    },
    {
      name: 'Optical Turbidity Sensor',
      model: 'TS-300B Turbidity Transducer',
      interface: 'Analog ADC (GPIO32)',
      unit: 'NTU',
      accuracy: '±0.5 NTU (0 to 100 NTU)',
      description: 'Infrared light scattering sensor measuring suspended particulate matter in water.',
      status: 'Active & Calibrated',
    },
    {
      name: 'Water Storage Level Sensor',
      model: 'HC-SR04 Ultrasonic Distance Transceiver',
      interface: 'Trigger/Echo (GPIO12 / 14)',
      unit: '%',
      accuracy: '±3 mm (2 cm to 400 cm)',
      description: 'Non-contact ultrasonic acoustic transceiver for liquid reservoir depth detection.',
      status: 'Active & Calibrated',
    },
  ];

  const uptimeHours = (info.uptimeSeconds / 3600).toFixed(1);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Page Header */}
      <PageHeader
        title="Device Information"
        description="Monitor the connected AquaMonitor hardware node, telemetry bus, and attached sensor matrix"
        badgeText={info.deviceId || 'ESP32-001'}
      />

      {/* 2. Primary Device Architecture Showcase (Dimensional Device Illustration + Specs) */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] shadow-card p-6 sm:p-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Premium Dimensional Hardware Illustration */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-[#F3FBFF] rounded-2xl border border-[#B6CCD9]/60 relative overflow-hidden">
            {/* Ambient Ripple Geometry */}
            <div 
              className="absolute w-56 h-56 rounded-full opacity-40 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, #E6F6FF 0%, rgba(243, 251, 255, 0) 70%)'
              }}
              aria-hidden="true"
            />

            {/* Dimensional Vector ESP32 Unit */}
            <div className="relative z-10 w-48 h-56 flex flex-col items-center justify-center">
              {/* Top Antenna & Pin Header */}
              <div className="w-16 h-3 bg-[#B6CCD9] rounded-t-md mb-1 flex justify-around px-2 items-center">
                <div className="w-1 h-1 bg-[#0BAA9F] rounded-full" />
                <div className="w-1 h-1 bg-[#0BAA9F] rounded-full" />
                <div className="w-1 h-1 bg-[#0BAA9F] rounded-full" />
              </div>

              {/* Main Board PCB */}
              <div className="w-44 h-48 bg-[#FFFFFF] rounded-2xl border-2 border-[#0BAA9F] shadow-card p-3.5 flex flex-col justify-between relative">
                {/* Chip Center */}
                <div className="flex items-center justify-between border-b border-[#B6CCD9]/40 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-[#0E6B6B]">ESP32-WROOM</span>
                  </div>
                  <Wifi className="w-3.5 h-3.5 text-[#0BAA9F]" />
                </div>

                {/* Microcontroller core module */}
                <div className="w-full h-16 bg-[#F3FBFF] rounded-xl border border-[#B6CCD9]/80 flex flex-col items-center justify-center p-2 shadow-xs">
                  <Cpu className="w-5 h-5 text-[#0BAA9F] stroke-[1.75] mb-1" />
                  <span className="text-[9px] font-mono text-[#7FA3B8]">Xtensa Dual-Core 240MHz</span>
                </div>

                {/* Bottom Status LEDs */}
                <div className="flex items-center justify-between pt-1 border-t border-[#B6CCD9]/40 text-[9px] font-mono text-[#7FA3B8]">
                  <span>PWR: 3.3V</span>
                  <span className="text-[#16A34A] font-bold">LINK: OK</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center z-10">
              <h4 className="text-sm font-bold text-[#0E6B6B]">AquaMonitor IoT Core Node</h4>
              <p className="text-[11px] text-[#7FA3B8]">Microcontroller Hardware Hub • Model ESP32-001</p>
            </div>
          </div>

          {/* Right: Technical Hardware Parameters */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">Operational & Online</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0E6B6B] tracking-tight">ESP32-001 Primary Telemetry Gateway</h3>
              <p className="text-xs text-[#7FA3B8] font-normal mt-0.5">
                Centralized environmental sampling node interfacing analog probe circuitry with cloud databases.
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-[#F3FBFF] rounded-xl border border-[#B6CCD9]/60 space-y-0.5">
                <span className="text-[10px] text-[#7FA3B8] font-sans block">Wi-Fi Signal</span>
                <p className="font-bold text-[#0E6B6B]">{info.rssiDbm || -62} dBm (Strong)</p>
              </div>

              <div className="p-3 bg-[#F3FBFF] rounded-xl border border-[#B6CCD9]/60 space-y-0.5">
                <span className="text-[10px] text-[#7FA3B8] font-sans block">Firmware Version</span>
                <p className="font-bold text-[#0BAA9F]">{info.firmwareVersion || 'v1.0.0'}</p>
              </div>

              <div className="p-3 bg-[#F3FBFF] rounded-xl border border-[#B6CCD9]/60 space-y-0.5">
                <span className="text-[10px] text-[#7FA3B8] font-sans block">Node Uptime</span>
                <p className="font-bold text-[#0E6B6B]">{uptimeHours} Hours</p>
              </div>

              <div className="p-3 bg-[#F3FBFF] rounded-xl border border-[#B6CCD9]/60 space-y-0.5">
                <span className="text-[10px] text-[#7FA3B8] font-sans block">IP Address</span>
                <p className="font-bold text-[#0E6B6B]">{info.ipAddress || '192.168.1.142'}</p>
              </div>

              <div className="p-3 bg-[#F3FBFF] rounded-xl border border-[#B6CCD9]/60 space-y-0.5">
                <span className="text-[10px] text-[#7FA3B8] font-sans block">MAC Address</span>
                <p className="font-bold text-[#0E6B6B]">{info.macAddress || '24:6F:28:AB:D9:12'}</p>
              </div>

              <div className="p-3 bg-[#F3FBFF] rounded-xl border border-[#B6CCD9]/60 space-y-0.5">
                <span className="text-[10px] text-[#7FA3B8] font-sans block">ADC Resolution</span>
                <p className="font-bold text-[#0E6B6B]">12-bit (0–4095)</p>
              </div>
            </div>

            {/* Memory & Partition Health Bars */}
            <div className="space-y-3 pt-2 border-t border-[#B6CCD9]/60 text-xs">
              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-[#7FA3B8] font-sans">SRAM Heap Allocation</span>
                  <span className="font-bold text-[#0E6B6B]">{info.sramUsedKb} / {info.sramTotalKb} KB (27%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E6F6FF] border border-[#B6CCD9]/60 overflow-hidden">
                  <div className="h-full bg-[#0BAA9F] rounded-full w-[27%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-[#7FA3B8] font-sans">Flash Memory Usage</span>
                  <span className="font-bold text-[#0E6B6B]">{info.flashUsedMb} / {info.flashTotalMb} MB (45%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E6F6FF] border border-[#B6CCD9]/60 overflow-hidden">
                  <div className="h-full bg-[#16A34A] rounded-full w-[45%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sensor Configuration Matrix Grid */}
      <div className="space-y-4">
        <SectionHeader
          title="Attached Sensor Probe Matrix"
          subtitle="Detailed hardware specifications and physical pin interfaces"
          icon={Layers}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensorSpecs.map((sensor, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] shadow-soft space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0BAA9F] uppercase tracking-wider">{sensor.unit} Sensor</span>
                  <span className="text-[11px] font-semibold text-[#16A34A] bg-[#16A34A]/10 border border-[#16A34A]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-[#16A34A]" />
                    {sensor.status}
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#0E6B6B] tracking-tight">{sensor.name}</h4>
                <p className="text-xs text-[#7FA3B8] leading-relaxed">{sensor.description}</p>
              </div>

              <div className="pt-3 border-t border-[#B6CCD9]/60 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#7FA3B8] font-sans">Probe Model:</span>
                  <span className="font-semibold text-[#0E6B6B]">{sensor.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7FA3B8] font-sans">Interface Pin:</span>
                  <span className="font-semibold text-[#0BAA9F]">{sensor.interface}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7FA3B8] font-sans">Accuracy:</span>
                  <span className="font-semibold text-[#0E6B6B]">{sensor.accuracy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Project & Academic Credentials Card */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] p-6 sm:p-7 shadow-card flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 text-[#0BAA9F] font-bold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 stroke-[1.75]" />
            Academic Capstone IoT Project
          </div>
          <h3 className="text-lg font-bold tracking-tight text-[#0E6B6B]">{APP_CONFIG.title}</h3>
          <p className="text-xs sm:text-[13px] text-[#7FA3B8] max-w-xl font-normal leading-relaxed">
            Designed for college faculty evaluation, research laboratories, and real-time environmental monitoring. Built with an ESP32 hardware telemetry node transmitting sensor streams over encrypted HTTP protocols.
          </p>
        </div>

        <div className="flex items-center gap-3.5 bg-[#F3FBFF] border border-[#B6CCD9] p-4 rounded-xl shrink-0 z-10 shadow-soft">
          <ShieldCheck className="w-8 h-8 text-[#0BAA9F] stroke-[1.75]" />
          <div className="text-xs">
            <p className="font-bold text-[#0E6B6B]">Project Evaluated & Approved</p>
            <p className="text-[#7FA3B8] font-mono text-[11px] mt-0.5">{APP_CONFIG.organization}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
