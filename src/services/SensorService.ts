import { SensorRepository } from '../repositories/sensorRepository';
import { AlertRepository } from '../repositories/alertRepository';
import { DeviceRepository } from '../repositories/deviceRepository';
import { SensorReading, SensorStatus } from '../types';
import { calculateWQI, INITIAL_THRESHOLDS, INITIAL_SENSOR_STATUSES } from '../mocks/mockData';

export class SensorService {
  /**
   * Fetch historical sensor telemetry
   */
  static async getReadingHistory(limitCount: number = 50): Promise<SensorReading[]> {
    return SensorRepository.getHistory(limitCount);
  }

  /**
   * Derive current sensor status cards from latest readings
   */
  static deriveSensorStatuses(latestReading: SensorReading): SensorStatus[] {
    return INITIAL_SENSOR_STATUSES.map((statusItem) => {
      let value = latestReading[statusItem.id];
      if (typeof value !== 'number') value = statusItem.value;

      let status: 'normal' | 'warning' | 'critical' = 'normal';
      const rule = INITIAL_THRESHOLDS.find((r) => r.sensorId === statusItem.id);

      if (rule) {
        if (value < rule.criticalMin || value > rule.criticalMax) {
          status = 'critical';
        } else if (value < rule.minThreshold || value > rule.maxThreshold) {
          status = 'warning';
        }
      }

      return {
        ...statusItem,
        value,
        status,
        lastUpdated: 'Just now',
      };
    });
  }

  /**
   * Log a new telemetry packet (from ESP32 or client simulation)
   * Automatically updates Firestore reading history, device ping, and evaluates threshold alerts
   */
  static async createReading(payload: {
    deviceId?: string;
    temperature: number;
    ph: number;
    tds: number;
    turbidity: number;
    waterLevel: number;
    timestamp?: string;
  }): Promise<{ readingId: string; wqi: { score: number; status: string; color: string } }> {
    const timestamp = payload.timestamp || new Date().toISOString();
    const wqi = calculateWQI(payload);

    // 1. Save reading
    const readingId = await SensorRepository.addReading({
      ...payload,
      timestamp,
      qualityStatus: wqi.status,
    });

    // 2. Ping device status
    const deviceId = payload.deviceId || 'ESP32-AQM-9842';
    await DeviceRepository.updateDevice(deviceId, {
      status: 'online',
      lastSeen: timestamp,
    });

    // 3. Evaluate threshold violations and generate alerts if necessary
    for (const rule of INITIAL_THRESHOLDS) {
      const val = payload[rule.sensorId];
      if (val !== undefined) {
        let isCritical = val < rule.criticalMin || val > rule.criticalMax;
        let isWarning = !isCritical && (val < rule.minThreshold || val > rule.maxThreshold);

        if (isCritical || isWarning) {
          const severity = isCritical ? 'critical' : 'warning';
          const direction = val > rule.maxThreshold ? 'exceeded max threshold' : 'dropped below min threshold';

          await AlertRepository.addAlert({
            sensorId: rule.sensorId,
            sensorName: rule.sensorName,
            severity,
            message: `${rule.sensorName} ${direction} (${val} ${rule.unit}).`,
            value: val,
            unit: rule.unit,
            threshold: isCritical ? `< ${rule.criticalMin} / > ${rule.criticalMax}` : `${rule.minThreshold} - ${rule.maxThreshold}`,
            timestamp,
            resolved: false,
          });
        }
      }
    }

    return { readingId, wqi };
  }

  /**
   * Realtime subscription to telemetry readings
   */
  static subscribeHistory(limitCount: number = 50, callback: (readings: SensorReading[]) => void) {
    return SensorRepository.subscribeToReadings(limitCount, callback);
  }
}
