import React, { useCallback } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { MetricCard } from '../components/common/MetricCard';
import { WaterQualityIndexCard } from '../components/dashboard/WaterQualityIndexCard';
import { DeviceStatusWidget } from '../components/dashboard/DeviceStatusWidget';
import { DashboardTrendChart } from '../components/dashboard/DashboardTrendChart';
import { LatestReadingsTable } from '../components/dashboard/LatestReadingsTable';
import { AlertCard } from '../components/common/AlertCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { useSensorReadings } from '../hooks/useSensorReadings';
import { useAlerts } from '../hooks/useAlerts';
import { useNavigation } from '../context/NavigationContext';
import { Bell, RefreshCw, Layers, ArrowUpRight, Activity, FileText } from 'lucide-react';
import { APP_CONFIG } from '../constants/config';
import { motion, AnimatePresence } from 'motion/react';

export const DashboardPage: React.FC = () => {
  const { statuses, readings, loading: isRefreshing, refresh: refreshSensors } = useSensorReadings();
  const { activeAlerts, resolveAlert: handleResolveAlert } = useAlerts();
  const { setCurrentRoute, currentTimeString } = useNavigation();

  // Manual Refresh trigger
  const handleRefresh = useCallback(() => {
    refreshSensors();
  }, [refreshSensors]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Dashboard Header */}
      <PageHeader
        title="Water Quality Overview"
        description="Monitor live environmental parameters, WQI safety ratings, and ESP32 telemetry feeds."
        badgeText="ESP32 Active"
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Actions */}
            <button
              onClick={() => setCurrentRoute('live-monitor')}
              aria-label="Navigate to Live Monitor"
              className="px-3.5 py-2 text-xs font-semibold text-[#0E6B6B] bg-[#FFFFFF] hover:bg-[#E6F6FF] border border-[#B6CCD9] rounded-xl shadow-soft flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-[#0BAA9F]" aria-hidden="true" />
              <span>Live Monitor</span>
            </button>

            <button
              onClick={() => setCurrentRoute('reports')}
              aria-label="Navigate to Reports"
              className="px-3.5 py-2 text-xs font-semibold text-[#0E6B6B] bg-[#FFFFFF] hover:bg-[#E6F6FF] border border-[#B6CCD9] rounded-xl shadow-soft flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#0BAA9F]" aria-hidden="true" />
              <span>Reports</span>
            </button>

            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label="Refresh Telemetry Data"
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0BAA9F] hover:bg-[#0BAA9F]/90 border border-transparent rounded-xl shadow-soft flex items-center gap-2 transition-all disabled:opacity-50 focus:outline-hidden focus:ring-2 focus:ring-[#0BAA9F]/30 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-white ${isRefreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>
        }
      />

      {/* 2. Overall Water Quality / WQI Hero Section */}
      <section aria-label="Water Quality Index Hero">
        <WaterQualityIndexCard statuses={statuses} />
      </section>

      {/* 3. Five Sensor Metric Cards */}
      <section aria-label="Core Sensor Metrics" className="space-y-3">
        <SectionHeader
          title="Current Sensor Telemetry"
          subtitle="Real-time multi-probe stream from ESP32 analog & digital interfaces"
          icon={Layers}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statuses.map((sensor) => (
            <MetricCard 
              key={sensor.id} 
              status={sensor} 
              onClick={() => setCurrentRoute('live-monitor')}
            />
          ))}
        </div>
      </section>

      {/* 4. Large Trend Analytics + Device Status */}
      <section aria-label="Trend and Hardware Diagnostics" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardTrendChart readings={readings} />
        </div>
        <div className="lg:col-span-1">
          <DeviceStatusWidget />
        </div>
      </section>

      {/* 5. Recent Alerts + Latest Readings Table */}
      <section aria-label="System Alerts and Latest Snapshot" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts Column */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <SectionHeader
              title="Recent Alerts"
              subtitle={`${activeAlerts.length} unresolved anomaly events`}
              icon={Bell}
            />
            {activeAlerts.length > 0 && (
              <button
                onClick={() => setCurrentRoute('alerts')}
                className="text-xs font-semibold text-[#0BAA9F] hover:text-[#0E6B6B] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {activeAlerts.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence>
                {activeAlerts.slice(0, 3).map((alert) => (
                  <AlertCard key={alert.id} alert={alert} onResolve={handleResolveAlert} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] text-center text-xs text-[#7FA3B8] shadow-soft"
            >
              All sensors are operating nominally within safe limits.
            </motion.div>
          )}
        </div>

        {/* Latest Readings Table Column */}
        <div className="lg:col-span-2">
          <LatestReadingsTable statuses={statuses} />
        </div>
      </section>
    </div>
  );
};
