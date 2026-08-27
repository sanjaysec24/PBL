import { DeviceRepository } from '../repositories/deviceRepository';
import { Device } from '../types';

export class DeviceService {
  /**
   * Fetch device telemetry status
   */
  static async getDeviceStatus(deviceId: string = 'ESP32-AQM-9842'): Promise<Device> {
    return DeviceRepository.getDevice(deviceId);
  }

  /**
   * Update device information or status parameters
   */
  static async updateDeviceStatus(deviceId: string, updates: Partial<Device>): Promise<void> {
    return DeviceRepository.updateDevice(deviceId, updates);
  }

  /**
   * Realtime device listener
   */
  static subscribeDeviceStatus(
    deviceId: string = 'ESP32-AQM-9842',
    callback: (device: Device | null) => void
  ) {
    return DeviceRepository.subscribeToDevice(deviceId, callback);
  }
}
