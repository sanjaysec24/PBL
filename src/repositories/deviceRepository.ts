import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase/firebase';
import { Device } from '../types';
import { INITIAL_DEVICE_INFO } from '../mocks/mockData';

const DEVICES_COLLECTION = 'devices';

export class DeviceRepository {
  /**
   * Fetch a device by ID or seed with INITIAL_DEVICE_INFO if absent.
   */
  static async getDevice(deviceId: string = 'ESP32-AQM-9842'): Promise<Device> {
    try {
      const docRef = doc(db, DEVICES_COLLECTION, deviceId);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        return snapshot.data() as Device;
      }

      // Seed initial device if not existing
      const defaultDevice: Device = {
        deviceId: INITIAL_DEVICE_INFO.deviceId,
        deviceName: 'AquaMonitor Node #1 (ESP32)',
        status: 'online',
        firmwareVersion: INITIAL_DEVICE_INFO.firmwareVersion,
        hardwareVersion: INITIAL_DEVICE_INFO.hardwareVersion,
        wifiStrength: INITIAL_DEVICE_INFO.rssiDbm,
        ipAddress: INITIAL_DEVICE_INFO.ipAddress,
        macAddress: INITIAL_DEVICE_INFO.macAddress,
        uptimeSeconds: INITIAL_DEVICE_INFO.uptimeSeconds,
        lastSeen: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        sramUsedKb: INITIAL_DEVICE_INFO.sramUsedKb,
        sramTotalKb: INITIAL_DEVICE_INFO.sramTotalKb,
        flashUsedMb: INITIAL_DEVICE_INFO.flashUsedMb,
        flashTotalMb: INITIAL_DEVICE_INFO.flashTotalMb,
        rssiDbm: INITIAL_DEVICE_INFO.rssiDbm,
        cpuFreqMhz: INITIAL_DEVICE_INFO.cpuFreqMhz,
        chipModel: INITIAL_DEVICE_INFO.chipModel,
        wifiSsid: INITIAL_DEVICE_INFO.wifiSsid,
      };

      await setDoc(docRef, defaultDevice);
      return defaultDevice;
    } catch (error) {
      console.warn('DeviceRepository.getDevice error, returning mock:', error);
      return INITIAL_DEVICE_INFO as unknown as Device;
    }
  }

  /**
   * Update device status or metadata
   */
  static async updateDevice(deviceId: string, data: Partial<Device>): Promise<void> {
    try {
      const docRef = doc(db, DEVICES_COLLECTION, deviceId);
      await updateDoc(docRef, {
        ...data,
        lastSeen: new Date().toISOString(),
      });
    } catch (error) {
      // If doc doesn't exist yet, setDoc instead
      const docRef = doc(db, DEVICES_COLLECTION, deviceId);
      await setDoc(docRef, { ...data, deviceId, lastSeen: new Date().toISOString() }, { merge: true });
    }
  }

  /**
   * Subscribe to real-time updates for a single device document
   */
  static subscribeToDevice(
    deviceId: string,
    callback: (device: Device | null) => void
  ): Unsubscribe {
    const docRef = doc(db, DEVICES_COLLECTION, deviceId);

    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data() as Device);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.warn('DeviceRepository real-time subscription error:', error);
      }
    );
  }
}
