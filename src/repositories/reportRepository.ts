import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { ReportConfig, ReportSummaryStats } from '../types';

export interface ReportRecord {
  reportId: string;
  title: string;
  generatedAt: string;
  dateRange: ReportConfig['dateRange'];
  format: ReportConfig['format'];
  preparedBy: string;
  department: string;
  summary: ReportSummaryStats;
}

const REPORTS_COLLECTION = 'reports';

export class ReportRepository {
  /**
   * Save a generated report to Firestore
   */
  static async saveReport(report: ReportRecord): Promise<string> {
    const docRef = doc(db, REPORTS_COLLECTION, report.reportId);
    await setDoc(docRef, report);
    return report.reportId;
  }

  /**
   * Get all generated reports
   */
  static async getReports(limitCount: number = 20): Promise<ReportRecord[]> {
    try {
      const q = query(
        collection(db, REPORTS_COLLECTION),
        orderBy('generatedAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const results: ReportRecord[] = [];

      snapshot.forEach((docSnap) => {
        results.push(docSnap.data() as ReportRecord);
      });

      return results;
    } catch (error) {
      console.warn('ReportRepository.getReports warning:', error);
      return [];
    }
  }

  /**
   * Realtime subscription to generated reports
   */
  static subscribeToReports(
    callback: (reports: ReportRecord[]) => void,
    limitCount: number = 20
  ): Unsubscribe {
    const q = query(
      collection(db, REPORTS_COLLECTION),
      orderBy('generatedAt', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const results: ReportRecord[] = [];
        snapshot.forEach((docSnap) => {
          results.push(docSnap.data() as ReportRecord);
        });
        callback(results);
      },
      (error) => {
        console.warn('ReportRepository real-time subscription error:', error);
      }
    );
  }
}
