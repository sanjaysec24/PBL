export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface AlertItem {
  id: string;
  sensorId: 'temperature' | 'ph' | 'tds' | 'turbidity' | 'waterLevel';
  sensorName: string;
  severity: AlertSeverity;
  message: string;
  value: number;
  unit: string;
  threshold: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface ThresholdRule {
  sensorId: 'temperature' | 'ph' | 'tds' | 'turbidity' | 'waterLevel';
  sensorName: string;
  unit: string;
  minThreshold: number;
  maxThreshold: number;
  criticalMin: number;
  criticalMax: number;
  optimalRange: string;
}
