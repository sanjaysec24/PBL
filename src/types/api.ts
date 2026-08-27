export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface WaterQuality {
  score: number;
  status: string;
  color: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface Device {
  deviceId: string;
  deviceName: string;
  status: 'online' | 'offline' | 'degraded';
  firmwareVersion: string;
  hardwareVersion: string;
  wifiStrength: number;
  ipAddress: string;
  macAddress: string;
  uptimeSeconds: number;
  lastSeen: string;
  createdAt: string;
  sramUsedKb?: number;
  sramTotalKb?: number;
  flashUsedMb?: number;
  flashTotalMb?: number;
  rssiDbm?: number;
  cpuFreqMhz?: number;
  chipModel?: string;
  wifiSsid?: string;
}
