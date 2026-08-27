import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { AlertItem } from '../types';
import { INITIAL_ALERTS } from '../mocks/mockData';

const ALERTS_COLLECTION = 'alerts';

export class AlertRepository {
  /**
   * Fetch all alerts ordered by timestamp descending
   */
  static async getAlerts(limitCount: number = 30): Promise<AlertItem[]> {
    try {
      const q = query(
        collection(db, ALERTS_COLLECTION),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        await AlertRepository.seedInitialAlerts();
        return INITIAL_ALERTS;
      }

      const results: AlertItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        results.push({
          id: docSnap.id,
          sensorId: data.sensorId,
          sensorName: data.sensorName,
          severity: data.severity,
          message: data.message,
          value: data.value,
          unit: data.unit,
          threshold: data.threshold,
          timestamp: data.timestamp,
          resolved: Boolean(data.resolved),
          resolvedAt: data.resolvedAt || undefined,
        });
      });

      return results;
    } catch (error) {
      console.warn('AlertRepository.getAlerts error, returning default alerts:', error);
      return INITIAL_ALERTS;
    }
  }

  /**
   * Add a new alert document
   */
  static async addAlert(alert: Omit<AlertItem, 'id'>): Promise<string> {
    const newDocRef = doc(collection(db, ALERTS_COLLECTION));
    const alertData = {
      ...alert,
      id: newDocRef.id,
      deviceId: 'ESP32-AQM-9842',
      timestamp: alert.timestamp || new Date().toISOString(),
      resolved: alert.resolved ?? false,
    };

    await setDoc(newDocRef, alertData);
    return newDocRef.id;
  }

  /**
   * Mark an alert as resolved
   */
  static async resolveAlert(alertId: string): Promise<void> {
    try {
      const docRef = doc(db, ALERTS_COLLECTION, alertId);
      await updateDoc(docRef, {
        resolved: true,
        resolvedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('AlertRepository.resolveAlert warning:', error);
    }
  }

  /**
   * Realtime snapshot listener for alerts
   */
  static subscribeToAlerts(
    callback: (alerts: AlertItem[]) => void,
    limitCount: number = 30
  ): Unsubscribe {
    const q = query(
      collection(db, ALERTS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const results: AlertItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          results.push({
            id: docSnap.id,
            sensorId: data.sensorId,
            sensorName: data.sensorName,
            severity: data.severity,
            message: data.message,
            value: data.value,
            unit: data.unit,
            threshold: data.threshold,
            timestamp: data.timestamp,
            resolved: Boolean(data.resolved),
            resolvedAt: data.resolvedAt || undefined,
          });
        });

        callback(results);
      },
      (error) => {
        console.warn('AlertRepository real-time subscription error:', error);
      }
    );
  }

  /**
   * Seed initial baseline alerts if collection is empty
   */
  static async seedInitialAlerts(): Promise<void> {
    try {
      const batch = writeBatch(db);

      INITIAL_ALERTS.forEach((alert) => {
        const docRef = doc(db, ALERTS_COLLECTION, alert.id);
        batch.set(docRef, {
          ...alert,
          deviceId: 'ESP32-AQM-9842',
        });
      });

      await batch.commit();
    } catch (error) {
      console.warn('Seed initial alerts warning:', error);
    }
  }
}
