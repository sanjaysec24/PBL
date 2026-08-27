import { useState, useEffect, useCallback } from 'react';
import { ReportService } from '../services/ReportService';
import { ReportRecord } from '../repositories/reportRepository';
import { ReportConfig } from '../types';

export function useReports() {
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ReportService.getReports(20);
      setReports(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch reports';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();

    const unsubscribe = ReportService.subscribeReports((realtimeReports) => {
      setReports(realtimeReports);
    });

    return () => unsubscribe();
  }, [fetchReports]);

  const generateReport = useCallback(async (config: ReportConfig) => {
    setLoading(true);
    try {
      const newReport = await ReportService.generateReport(config);
      setReports((prev) => [newReport, ...prev]);
      return newReport;
    } catch (err: unknown) {
      console.warn('Generate report error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reports,
    loading,
    error,
    isEmpty: reports.length === 0,
    refresh: fetchReports,
    generateReport,
  };
}
