import { useState, useEffect, useCallback, useMemo } from 'react';
import { AlertService } from '../services/AlertService';
import { AlertItem } from '../types';
import { INITIAL_ALERTS } from '../mocks/mockData';

export function useAlerts(limitCount: number = 30) {
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AlertService.getAlerts(limitCount);
      if (data && data.length > 0) {
        setAlerts(data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch alerts';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [limitCount]);

  useEffect(() => {
    fetchAlerts();

    // Subscribe to Firestore snapshot updates
    const unsubscribe = AlertService.subscribeAlerts((realtimeAlerts) => {
      if (realtimeAlerts && realtimeAlerts.length > 0) {
        setAlerts(realtimeAlerts);
      }
    }, limitCount);

    return () => unsubscribe();
  }, [limitCount, fetchAlerts]);

  const resolveAlert = useCallback(async (alertId: string) => {
    // Optimistic local state update
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId ? { ...a, resolved: true, resolvedAt: new Date().toISOString() } : a
      )
    );

    try {
      await AlertService.resolveAlert(alertId);
    } catch (err: unknown) {
      console.warn('Resolve alert error:', err);
    }
  }, []);

  const activeAlerts = useMemo(() => alerts.filter((a) => !a.resolved), [alerts]);

  return {
    alerts,
    activeAlerts,
    loading,
    error,
    isEmpty: alerts.length === 0,
    refresh: fetchAlerts,
    resolveAlert,
  };
}
