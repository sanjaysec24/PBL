import { useState, useEffect, useCallback, useMemo } from 'react';
import { SensorService } from '../services/SensorService';
import { SensorReading, SensorStatus } from '../types';
import { generateHistoricalReadings, calculateWQI, INITIAL_SENSOR_STATUSES } from '../mocks/mockData';

const DEFAULT_READINGS = generateHistoricalReadings();

export function useSensorReadings(limitCount: number = 50) {
  const [readings, setReadings] = useState<SensorReading[]>(DEFAULT_READINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReadings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await SensorService.getReadingHistory(limitCount);
      if (data && data.length > 0) {
        setReadings(data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch sensor readings';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [limitCount]);

  useEffect(() => {
    fetchReadings();

    // Subscribe to Firestore snapshot updates
    const unsubscribe = SensorService.subscribeHistory(limitCount, (realtimeReadings) => {
      if (realtimeReadings && realtimeReadings.length > 0) {
        setReadings(realtimeReadings);
      }
    });

    return () => unsubscribe();
  }, [limitCount, fetchReadings]);

  // Derived current sensor status cards
  const statuses = useMemo<SensorStatus[]>(() => {
    if (!readings || readings.length === 0) return INITIAL_SENSOR_STATUSES;
    const latest = readings[readings.length - 1];
    return SensorService.deriveSensorStatuses(latest);
  }, [readings]);

  // Derived current WQI calculation
  const wqi = useMemo(() => {
    if (!readings || readings.length === 0) {
      return calculateWQI({
        temperature: 24.2,
        ph: 7.25,
        tds: 182,
        turbidity: 3.4,
        waterLevel: 86,
      });
    }
    const latest = readings[readings.length - 1];
    return calculateWQI(latest);
  }, [readings]);

  const addReading = useCallback(
    async (payload: {
      temperature: number;
      ph: number;
      tds: number;
      turbidity: number;
      waterLevel: number;
    }) => {
      try {
        await SensorService.createReading(payload);
      } catch (err: unknown) {
        console.warn('Error adding reading to Firestore:', err);
      }
    },
    []
  );

  return {
    readings,
    statuses,
    wqi,
    loading,
    error,
    isEmpty: readings.length === 0,
    refresh: fetchReadings,
    addReading,
  };
}
