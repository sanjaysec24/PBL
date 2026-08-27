import { SensorStatus, SensorReading, DeviceInfo, AlertItem, ThresholdRule } from '../types';

export const INITIAL_SENSOR_STATUSES: SensorStatus[] = [
  {
    id: 'temperature',
    name: 'Water Temperature',
    value: 24.2,
    unit: '°C',
    status: 'normal',
    minThreshold: 18.0,
    maxThreshold: 28.0,
    lastUpdated: 'Just now',
  },
  {
    id: 'ph',
    name: 'pH Level',
    value: 7.25,
    unit: 'pH',
    status: 'normal',
    minThreshold: 6.5,
    maxThreshold: 8.5,
    lastUpdated: 'Just now',
  },
  {
    id: 'tds',
    name: 'Total Dissolved Solids (TDS)',
    value: 182,
    unit: 'ppm',
    status: 'normal',
    minThreshold: 50,
    maxThreshold: 500,
    lastUpdated: 'Just now',
  },
  {
    id: 'turbidity',
    name: 'Turbidity',
    value: 3.4,
    unit: 'NTU',
    status: 'normal',
    minThreshold: 0,
    maxThreshold: 5.0,
    lastUpdated: 'Just now',
  },
  {
    id: 'waterLevel',
    name: 'Water Storage Level',
    value: 86,
    unit: '%',
    status: 'normal',
    minThreshold: 20,
    maxThreshold: 98,
    lastUpdated: 'Just now',
  },
];

export const INITIAL_DEVICE_INFO: DeviceInfo & {
  sramUsedKb: number;
  sramTotalKb: number;
  flashUsedMb: number;
  flashTotalMb: number;
  rssiDbm: number;
  cpuFreqMhz: number;
  chipModel: string;
  wifiSsid: string;
} = {
  deviceId: 'ESP32-AQM-9842',
  hardwareVersion: 'ESP32-WROOM-32U Rev 3',
  firmwareVersion: 'v2.4.1-build88',
  ipAddress: '192.168.1.142',
  macAddress: '24:0A:C4:9F:88:B4',
  uptimeSeconds: 342180, // ~3.9 days
  lastPingTime: new Date().toISOString(),
  sramUsedKb: 142,
  sramTotalKb: 520,
  flashUsedMb: 1.8,
  flashTotalMb: 4.0,
  rssiDbm: -62,
  cpuFreqMhz: 240,
  chipModel: 'Dual Core Xtensa LX6',
  wifiSsid: 'Campus_IoT_Lab_Net',
};

export const INITIAL_THRESHOLDS: ThresholdRule[] = [
  {
    sensorId: 'temperature',
    sensorName: 'Water Temperature',
    unit: '°C',
    minThreshold: 18.0,
    maxThreshold: 28.0,
    criticalMin: 15.0,
    criticalMax: 32.0,
    optimalRange: '20.0 °C - 26.0 °C',
  },
  {
    sensorId: 'ph',
    sensorName: 'pH Level',
    unit: 'pH',
    minThreshold: 6.5,
    maxThreshold: 8.5,
    criticalMin: 5.5,
    criticalMax: 9.5,
    optimalRange: '6.8 - 7.6 pH',
  },
  {
    sensorId: 'tds',
    sensorName: 'Total Dissolved Solids (TDS)',
    unit: 'ppm',
    minThreshold: 50,
    maxThreshold: 500,
    criticalMin: 20,
    criticalMax: 800,
    optimalRange: '100 - 300 ppm',
  },
  {
    sensorId: 'turbidity',
    sensorName: 'Turbidity',
    unit: 'NTU',
    minThreshold: 0,
    maxThreshold: 5.0,
    criticalMin: 0,
    criticalMax: 10.0,
    optimalRange: '0 - 2.5 NTU',
  },
  {
    sensorId: 'waterLevel',
    sensorName: 'Water Storage Level',
    unit: '%',
    minThreshold: 20,
    maxThreshold: 98,
    criticalMin: 10,
    criticalMax: 99,
    optimalRange: '50% - 90%',
  },
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-101',
    sensorId: 'turbidity',
    sensorName: 'Turbidity',
    severity: 'warning',
    message: 'Turbidity spiked above normal threshold (4.2 NTU > 3.5 NTU standard).',
    value: 4.2,
    unit: 'NTU',
    threshold: '> 3.5 NTU',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    resolved: false,
  },
  {
    id: 'alt-102',
    sensorId: 'waterLevel',
    sensorName: 'Water Storage Level',
    severity: 'info',
    message: 'Tank refilling sequence initiated. Storage level reached 86%.',
    value: 86,
    unit: '%',
    threshold: 'Routine Event',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    resolved: false,
  },
  {
    id: 'alt-103',
    sensorId: 'temperature',
    sensorName: 'Water Temperature',
    severity: 'warning',
    message: 'Ambient solar heat elevated reservoir temp to 27.8 °C.',
    value: 27.8,
    unit: '°C',
    threshold: '> 27.5 °C',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    resolved: true,
    resolvedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'alt-104',
    sensorId: 'ph',
    sensorName: 'pH Level',
    severity: 'critical',
    message: 'Sudden acid inflow detected. pH dropped to 6.2 (below minimum 6.5 pH).',
    value: 6.2,
    unit: 'pH',
    threshold: '< 6.5 pH',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    resolved: true,
    resolvedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
];

// Generate 48 historical readings representing 24 hours (30-min steps)
export const generateHistoricalReadings = (): SensorReading[] => {
  const readings: SensorReading[] = [];
  const now = new Date();

  for (let i = 47; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000);
    // Add realistic subtle sine-wave and minor noise variance
    const hourFactor = Math.sin((i / 48) * Math.PI * 2);

    readings.push({
      timestamp: timestamp.toISOString(),
      temperature: Number((23.5 + hourFactor * 1.8 + (Math.random() * 0.4 - 0.2)).toFixed(1)),
      ph: Number((7.2 + hourFactor * 0.2 + (Math.random() * 0.1 - 0.05)).toFixed(2)),
      tds: Math.round(175 + hourFactor * 15 + (Math.random() * 10 - 5)),
      turbidity: Number((2.1 + Math.abs(hourFactor) * 1.2 + (Math.random() * 0.3)).toFixed(1)),
      waterLevel: Math.min(100, Math.max(10, Math.round(82 + hourFactor * 8 + (Math.random() * 4 - 2)))),
    });
  }

  return readings;
};

export function calculateWQI(readings: {
  temperature: number;
  ph: number;
  tds: number;
  turbidity: number;
  waterLevel: number;
}): { score: number; status: string; color: string } {
  // Simplified Canadian Council of Ministers of the Environment (CCME) style sub-index calculation
  let phSub = 100 - Math.abs(7.2 - readings.ph) * 20;
  let tempSub = readings.temperature <= 26 ? 95 : 100 - (readings.temperature - 26) * 8;
  let tdsSub = readings.tds <= 300 ? 95 : 100 - ((readings.tds - 300) / 500) * 40;
  let turbSub = readings.turbidity <= 4 ? 92 : 100 - readings.turbidity * 10;
  
  const score = Math.round(
    Math.max(0, Math.min(100, phSub * 0.3 + tempSub * 0.2 + tdsSub * 0.25 + turbSub * 0.25))
  );

  if (score >= 90) return { score, status: 'Excellent Water Quality', color: '#10B981' };
  if (score >= 75) return { score, status: 'Good Water Quality', color: '#0284C7' };
  if (score >= 60) return { score, status: 'Fair Water Quality', color: '#F59E0B' };
  return { score, status: 'Poor Water Quality (Action Needed)', color: '#EF4444' };
}
