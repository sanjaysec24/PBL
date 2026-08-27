import { AlertRepository } from '../repositories/alertRepository';
import { AlertItem } from '../types';

export class AlertService {
  /**
   * Fetch recent system alerts
   */
  static async getAlerts(limitCount: number = 30): Promise<AlertItem[]> {
    return AlertRepository.getAlerts(limitCount);
  }

  /**
   * Resolve a specific alert
   */
  static async resolveAlert(alertId: string): Promise<void> {
    return AlertRepository.resolveAlert(alertId);
  }

  /**
   * Create a new alert
   */
  static async createAlert(alert: Omit<AlertItem, 'id'>): Promise<string> {
    return AlertRepository.addAlert(alert);
  }

  /**
   * Realtime alert snapshot listener
   */
  static subscribeAlerts(callback: (alerts: AlertItem[]) => void, limitCount: number = 30) {
    return AlertRepository.subscribeToAlerts(callback, limitCount);
  }
}
