import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { AlertCard } from '../components/common/AlertCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { INITIAL_THRESHOLDS } from '../mocks/mockData';
import { ThresholdRule } from '../types';
import { useAlerts } from '../hooks/useAlerts';
import { Bell, AlertTriangle, AlertOctagon, CheckCircle2, History, Sliders, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'motion/react';

export const AlertsPage: React.FC = () => {
  const { alerts, activeAlerts, resolveAlert: handleResolve } = useAlerts();
  const [thresholds, setThresholds] = useState<ThresholdRule[]>(INITIAL_THRESHOLDS);
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'thresholds'>('active');

  const handleUpdateThreshold = (
    sensorId: string,
    field: 'minThreshold' | 'maxThreshold',
    val: number
  ) => {
    setThresholds((prev) =>
      prev.map((t) => (t.sensorId === sensorId ? { ...t, [field]: val } : t))
    );
  };

  const resolvedAlerts = alerts.filter((a) => a.resolved);
  const warningCount = activeAlerts.filter((a) => a.severity === 'warning').length;
  const criticalCount = activeAlerts.filter((a) => a.severity === 'critical').length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Page Header */}
      <PageHeader
        title="Alerts & Notifications"
        description="Review abnormal sensor conditions, anomaly warnings, and safety boundary thresholds"
        badgeText={`${activeAlerts.length} Active`}
      />

      {/* 2. Top Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Alerts */}
        <div className="p-4 sm:p-5 bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] shadow-soft space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7FA3B8]">Active Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-[#E6F6FF] text-[#0BAA9F] flex items-center justify-center border border-[#B6CCD9]/60">
              <Bell className="w-4 h-4 stroke-[1.75]" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-[#0E6B6B]">{activeAlerts.length}</p>
          <span className="text-[11px] text-[#7FA3B8] font-sans block">Unresolved events</span>
        </div>

        {/* Warnings */}
        <div className="p-4 sm:p-5 bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] shadow-soft space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7FA3B8]">Warnings</span>
            <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center border border-[#F59E0B]/30">
              <AlertTriangle className="w-4 h-4 stroke-[1.75]" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-[#F59E0B]">{warningCount}</p>
          <span className="text-[11px] text-[#7FA3B8] font-sans block">Moderate deviation</span>
        </div>

        {/* Critical */}
        <div className="p-4 sm:p-5 bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] shadow-soft space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7FA3B8]">Critical</span>
            <div className="w-8 h-8 rounded-xl bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center border border-[#EF4444]/30">
              <AlertOctagon className="w-4 h-4 stroke-[1.75]" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-[#EF4444]">{criticalCount}</p>
          <span className="text-[11px] text-[#7FA3B8] font-sans block">Action required</span>
        </div>

        {/* Resolved */}
        <div className="p-4 sm:p-5 bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] shadow-soft space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7FA3B8]">Resolved</span>
            <div className="w-8 h-8 rounded-xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center border border-[#16A34A]/30">
              <CheckCircle2 className="w-4 h-4 stroke-[1.75]" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-[#16A34A]">{resolvedAlerts.length}</p>
          <span className="text-[11px] text-[#7FA3B8] font-sans block">Archived log</span>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center overflow-x-auto p-1 bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] shadow-soft gap-1">
        <button
          onClick={() => setActiveTab('active')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer',
            activeTab === 'active'
              ? 'bg-[#E6F6FF] text-[#0E6B6B] border border-[#B6CCD9] shadow-xs'
              : 'text-[#7FA3B8] hover:text-[#0E6B6B]'
          )}
        >
          <Bell className="w-4 h-4 text-[#0BAA9F] stroke-[1.75]" />
          <span>Active Alerts ({activeAlerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer',
            activeTab === 'history'
              ? 'bg-[#E6F6FF] text-[#0E6B6B] border border-[#B6CCD9] shadow-xs'
              : 'text-[#7FA3B8] hover:text-[#0E6B6B]'
          )}
        >
          <History className="w-4 h-4 text-[#0BAA9F] stroke-[1.75]" />
          <span>Alert History ({resolvedAlerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('thresholds')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer',
            activeTab === 'thresholds'
              ? 'bg-[#E6F6FF] text-[#0E6B6B] border border-[#B6CCD9] shadow-xs'
              : 'text-[#7FA3B8] hover:text-[#0E6B6B]'
          )}
        >
          <Sliders className="w-4 h-4 text-[#0BAA9F] stroke-[1.75]" />
          <span>Threshold Limits</span>
        </button>
      </div>

      {/* 4. Tab Content: Active Alerts */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          <SectionHeader
            title="Unresolved Anomaly Events"
            subtitle="Requires engineering inspection or water treatment adjustment"
            icon={ShieldAlert}
          />
          {activeAlerts.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence>
                {activeAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} onResolve={handleResolve} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center bg-[#FFFFFF] rounded-2xl border border-dashed border-[#B6CCD9] shadow-soft space-y-2"
            >
              <CheckCircle2 className="w-8 h-8 text-[#16A34A] mx-auto stroke-[1.75]" />
              <h3 className="text-base font-bold text-[#0E6B6B]">All System Parameters Nominal</h3>
              <p className="text-xs text-[#7FA3B8] max-w-sm mx-auto">
                No active threshold alerts detected. Continuous telemetry streams are operating within safe tolerances.
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* 5. Tab Content: Alert History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <SectionHeader
            title="Archived Alert History"
            subtitle="Resolved and acknowledged water quality deviations"
            icon={History}
          />
          {resolvedAlerts.length > 0 ? (
            <div className="space-y-3">
              {resolvedAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] text-xs text-[#7FA3B8] shadow-soft">
              No historical resolved alerts recorded in current session.
            </div>
          )}
        </div>
      )}

      {/* 6. Tab Content: Threshold Settings */}
      {activeTab === 'thresholds' && (
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] shadow-soft p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="text-[17px] font-semibold text-[#0E6B6B]">Sensor Safety Threshold Matrix</h3>
            <p className="text-xs text-[#7FA3B8] mt-0.5">
              Target operational ranges and automated warning trigger limits
            </p>
          </div>

          <div className="overflow-x-auto border border-[#B6CCD9] rounded-xl">
            <table className="w-full text-left text-xs text-[#0E6B6B]">
              <thead className="bg-[#F3FBFF] border-b border-[#B6CCD9] text-[11px] uppercase tracking-wider font-semibold text-[#7FA3B8]">
                <tr>
                  <th className="px-4 py-3.5">Parameter Probe</th>
                  <th className="px-4 py-3.5">Optimal Range</th>
                  <th className="px-4 py-3.5">Warning Min Limit</th>
                  <th className="px-4 py-3.5">Warning Max Limit</th>
                  <th className="px-4 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B6CCD9]/40 font-mono">
                {thresholds.map((rule) => (
                  <tr key={rule.sensorId} className="hover:bg-[#E6F6FF]/40">
                    <td className="px-4 py-3.5 font-sans font-semibold text-[#0E6B6B]">
                      {rule.sensorName}
                    </td>
                    <td className="px-4 py-3.5 text-[#0BAA9F] font-semibold">{rule.optimalRange}</td>
                    <td className="px-4 py-3.5">
                      <input
                        type="number"
                        value={rule.minThreshold}
                        aria-label={`${rule.sensorName} minimum threshold`}
                        onChange={(e) =>
                          handleUpdateThreshold(
                            rule.sensorId,
                            'minThreshold',
                            Number(e.target.value)
                          )
                        }
                        className="w-20 px-2.5 py-1 bg-[#F3FBFF] border border-[#B6CCD9] rounded-lg text-[#0E6B6B] focus:outline-hidden focus:ring-2 focus:ring-[#0BAA9F]/20 focus:border-[#0BAA9F]"
                      />{' '}
                      <span className="text-[#7FA3B8] font-sans">{rule.unit}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <input
                        type="number"
                        value={rule.maxThreshold}
                        aria-label={`${rule.sensorName} maximum threshold`}
                        onChange={(e) =>
                          handleUpdateThreshold(
                            rule.sensorId,
                            'maxThreshold',
                            Number(e.target.value)
                          )
                        }
                        className="w-20 px-2.5 py-1 bg-[#F3FBFF] border border-[#B6CCD9] rounded-lg text-[#0E6B6B] focus:outline-hidden focus:ring-2 focus:ring-[#0BAA9F]/20 focus:border-[#0BAA9F]"
                      />{' '}
                      <span className="text-[#7FA3B8] font-sans">{rule.unit}</span>
                    </td>
                    <td className="px-4 py-3.5 font-sans text-right">
                      <StatusBadge status="normal" label="Configured" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
