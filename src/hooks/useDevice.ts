import { useState, useEffect, useCallback } from 'react';
import { DeviceService } from '../services/DeviceService';
import { Device } from '../types';
import { INITIAL_DEVICE_INFO } from '../mocks/mockData';

export function useDevice(deviceId: string = 'ESP32-AQM-9842') {
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevice = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DeviceService.getDeviceStatus(deviceId);
      setDevice(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch device status';
      setError(msg);
      setDevice(INITIAL_DEVICE_INFO as unknown as Device);
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    fetchDevice();

    // Subscribe to real-time updates
    const unsubscribe = DeviceService.subscribeDeviceStatus(deviceId, (realtimeData) => {
      if (realtimeData) {
        setDevice(realtimeData);
      }
    });

    return () => unsubscribe();
  }, [deviceId, fetchDevice]);

  const updateDevice = useCallback(
    async (updates: Partial<Device>) => {
      try {
        await DeviceService.updateDeviceStatus(deviceId, updates);
      } catch (err: unknown) {
        console.warn('Update device error:', err);
      }
    },
    [deviceId]
  );

  return {
    device: device || (INITIAL_DEVICE_INFO as unknown as Device),
    loading,
    error,
    refresh: fetchDevice,
    updateDevice,
    isEmpty: !device,
  };
}
