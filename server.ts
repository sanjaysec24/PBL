import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { SensorService } from './src/services/SensorService';
import { DeviceService } from './src/services/DeviceService';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'AquaMonitor Backend API',
      timestamp: new Date().toISOString(),
    });
  });

  // ESP32 Telemetry Ingestion Endpoint
  app.post('/api/readings', async (req, res) => {
    try {
      const { deviceId, temperature, ph, tds, turbidity, waterLevel, timestamp } = req.body;

      if (
        temperature === undefined ||
        ph === undefined ||
        tds === undefined ||
        turbidity === undefined ||
        waterLevel === undefined
      ) {
        return res.status(400).json({
          success: false,
          error:
            'Missing required sensor parameters in payload (temperature, ph, tds, turbidity, waterLevel)',
          timestamp: new Date().toISOString(),
        });
      }

      const result = await SensorService.createReading({
        deviceId: deviceId || 'ESP32-001',
        temperature: Number(temperature),
        ph: Number(ph),
        tds: Number(tds),
        turbidity: Number(turbidity),
        waterLevel: Number(waterLevel),
        timestamp: timestamp || new Date().toISOString(),
      });

      return res.status(201).json({
        success: true,
        message: 'Telemetry payload logged and evaluated in Firestore',
        data: {
          readingId: result.readingId,
          deviceId: deviceId || 'ESP32-001',
          wqi: result.wqi,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error handling ESP32 telemetry POST /api/readings:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error processing reading',
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Get Latest Readings API
  app.get('/api/readings', async (req, res) => {
    try {
      const limitCount = req.query.limit ? Number(req.query.limit) : 50;
      const readings = await SensorService.getReadingHistory(limitCount);
      return res.json({
        success: true,
        count: readings.length,
        data: readings,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch readings',
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Get Device Info API
  app.get('/api/device', async (req, res) => {
    try {
      const deviceId = (req.query.deviceId as string) || 'ESP32-AQM-9842';
      const device = await DeviceService.getDeviceStatus(deviceId);
      return res.json({
        success: true,
        data: device,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch device info',
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Vite middleware in development or static serve in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AquaMonitor Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
