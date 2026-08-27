/**
 * AquaMonitor Mock Folder Architecture
 * Reserved for mock data handlers, telemetry simulators, and API stubbing.
 */

export interface MockTelemetryServiceContract {
  subscribeToTelemetry: (callback: (data: unknown) => void) => () => void;
  getHistoricalData: (range: string) => Promise<unknown[]>;
}

export const MOCK_SERVICES_READY = true;
