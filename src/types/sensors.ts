export type ConnectionStatus = 'connected' | 'reconnecting' | 'offline';

export type SensorType = 'temperature' | 'ph' | 'tds' | 'turbidity' | 'waterLevel';

export interface SensorReading {
  timestamp: string;
  temperature: number; // °C
  ph: number;          // pH units (0-14)
  tds: number;         // ppm
  turbidity: number;   // NTU
  waterLevel: number;  // %
}

export interface SensorStatus {
  id: SensorType;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  minThreshold: number;
  maxThreshold: number;
  lastUpdated: string;
}

export interface DeviceInfo {
  deviceId: string;
  hardwareVersion: string;
  firmwareVersion: string;
  ipAddress: string;
  macAddress: string;
  uptimeSeconds: number;
  lastPingTime: string;
}
