import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
  writeBatch,
  doc,
} from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { SensorReading } from '../types';
import { generateHistoricalReadings } from '../mocks/mockData';

const READINGS_COLLECTION = 'sensorReadings';

export class SensorRepository {
  /**
   * Save a new sensor reading document to Firestore
   */
  static async addReading(
    reading: Omit<SensorReading, 'timestamp'> & { timestamp?: string; deviceId?: string; qualityStatus?: string }
  ): Promise<string> {
    const docData = {
      deviceId: reading.deviceId || 'ESP32-AQM-9842',
      temperature: Number(reading.temperature),
      ph: Number(reading.ph),
      tds: Number(reading.tds),
      turbidity: Number(reading.turbidity),
      waterLevel: Number(reading.waterLevel),
      timestamp: reading.timestamp || new Date().toISOString(),
      qualityStatus: reading.qualityStatus || 'Good',
    };

    const docRef = await addDoc(collection(db, READINGS_COLLECTION), docData);
    return docRef.id;
  }

  /**
   * Fetch latest readings ordered by timestamp descending
   */
  static async getHistory(limitCount: number = 50): Promise<SensorReading[]> {
    try {
      const q = query(
        collection(db, READINGS_COLLECTION),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Seed historical readings if database is empty
        await SensorRepository.seedInitialReadings();
        return generateHistoricalReadings();
      }

      const results: SensorReading[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        results.push({
          timestamp: data.timestamp,
          temperature: data.temperature,
          ph: data.ph,
          tds: data.tds,
          turbidity: data.turbidity,
          waterLevel: data.waterLevel,
        });
      });

      // Return chronologically ascending for chart plotting
      return results.reverse();
    } catch (error) {
      console.warn('SensorRepository.getHistory error, returning local generation:', error);
      return generateHistoricalReadings();
    }
  }

  /**
   * Realtime snapshot listener for telemetry history/live updates
   */
  static subscribeToReadings(
    limitCount: number = 50,
    callback: (readings: SensorReading[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db, READINGS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const results: SensorReading[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          results.push({
            timestamp: data.timestamp,
            temperature: data.temperature,
            ph: data.ph,
            tds: data.tds,
            turbidity: data.turbidity,
            waterLevel: data.waterLevel,
          });
        });

        callback(results.reverse());
      },
      (error) => {
        console.warn('SensorRepository real-time subscription warning:', error);
      }
    );
  }

  /**
   * Seed initial 48 historical data points into Firestore if collection is empty
   */
  static async seedInitialReadings(): Promise<void> {
    try {
      const mockReadings = generateHistoricalReadings();
      const batch = writeBatch(db);

      mockReadings.forEach((reading) => {
        const newDocRef = doc(collection(db, READINGS_COLLECTION));
        batch.set(newDocRef, {
          ...reading,
          deviceId: 'ESP32-AQM-9842',
          qualityStatus: 'Good',
        });
      });

      await batch.commit();
    } catch (error) {
      console.warn('Seed initial readings warning:', error);
    }
  }
}
