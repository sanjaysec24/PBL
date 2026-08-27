export interface ReportConfig {
  reportTitle: string;
  preparedBy: string;
  department: string;
  dateRange: '24h' | '7d' | '30d' | 'custom';
  selectedSensors: Array<'temperature' | 'ph' | 'tds' | 'turbidity' | 'waterLevel'>;
  includeCharts: boolean;
  includeAnomalyLog: boolean;
  format: 'pdf' | 'csv' | 'json';
}

export interface ReportSummaryStats {
  averageWqi: number;
  wqiGrade: string;
  totalSamples: number;
  complianceRate: number; // %
  anomaliesDetected: number;
  tempAvg: number;
  phAvg: number;
  tdsAvg: number;
  turbidityAvg: number;
  waterLevelAvg: number;
}
