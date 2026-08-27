import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { SectionHeader } from '../components/common/SectionHeader';
import { ReportConfig, ReportSummaryStats } from '../types';
import { APP_CONFIG } from '../constants/config';
import { useReports } from '../hooks/useReports';
import {
  FileText,
  Printer,
  ShieldCheck,
  BarChart3,
  CheckCircle,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Clock,
  FileCheck2,
  FileDown
} from 'lucide-react';
import { cn } from '../lib/utils';

export const ReportsPage: React.FC = () => {
  const { generateReport, loading: isGenerating } = useReports();
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('weekly');
  const [config, setConfig] = useState<ReportConfig>({
    reportTitle: 'Water Safety & Environmental Quality Compliance Report',
    preparedBy: APP_CONFIG.labUserName,
    department: APP_CONFIG.organization,
    dateRange: '7d',
    selectedSensors: ['temperature', 'ph', 'tds', 'turbidity', 'waterLevel'],
    includeCharts: true,
    includeAnomalyLog: true,
    format: 'pdf',
  });

  // Recent Reports data list
  const recentReports = [
    {
      id: 'REP-2026-08W3',
      title: 'Weekly Water Safety & Potability Audit',
      type: 'Weekly Audit',
      dateRange: 'Aug 19 – Aug 26, 2026',
      generatedAt: 'Today, 09:30 AM',
      wqi: 87,
      status: 'Compliant',
      samples: 336,
    },
    {
      id: 'REP-2026-08W2',
      title: 'Weekly Environmental Hydro-Audit',
      type: 'Weekly Audit',
      dateRange: 'Aug 12 – Aug 19, 2026',
      generatedAt: 'Aug 19, 2026',
      wqi: 84,
      status: 'Compliant',
      samples: 336,
    },
    {
      id: 'REP-2026-07M',
      title: 'Monthly CCME Water Quality Evaluation',
      type: 'Monthly Audit',
      dateRange: 'Jul 01 – Jul 31, 2026',
      generatedAt: 'Aug 01, 2026',
      wqi: 89,
      status: 'Compliant',
      samples: 1440,
    },
  ];

  // Calculated Mock Statistics
  const stats: ReportSummaryStats = {
    averageWqi: 87,
    wqiGrade: 'B (Good Quality)',
    totalSamples: reportType === 'daily' ? 48 : reportType === 'weekly' ? 336 : 1440,
    complianceRate: 98.4,
    anomaliesDetected: 2,
    tempAvg: 24.6,
    phAvg: 7.35,
    tdsAvg: 182,
    turbidityAvg: 2.1,
    waterLevelAvg: 85,
  };

  const handleGeneratePdf = async () => {
    try {
      await generateReport(config);
      window.print();
    } catch (err) {
      console.warn('Report generation failed:', err);
      window.print();
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Page Header */}
      <PageHeader
        title="Reports & Analytics"
        description="Generate formal laboratory compliance summaries and ISO-standard water safety documents"
        badgeText="Lab Verified"
        actions={
          <button
            onClick={handleGeneratePdf}
            disabled={isGenerating}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0BAA9F] hover:bg-[#0BAA9F]/90 rounded-xl shadow-soft flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Export PDF / Print</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Report Configuration & Recent Archives */}
        <div className="space-y-6">
          {/* Report Configuration Card */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] p-5 sm:p-6 shadow-soft space-y-4">
            <SectionHeader
              title="Report Generator"
              subtitle="Configure scope and metadata"
              icon={FileText}
            />

            {/* Report Type Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#0E6B6B]">Report Period Type</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['daily', 'weekly', 'monthly', 'custom'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setReportType(type);
                      setConfig({
                        ...config,
                        dateRange: type === 'daily' ? '24h' : type === 'monthly' ? '30d' : '7d',
                      });
                    }}
                    className={cn(
                      'py-2 px-3 rounded-xl font-semibold capitalize transition-all border text-center cursor-pointer',
                      reportType === type
                        ? 'bg-[#E6F6FF] text-[#0E6B6B] border-[#0BAA9F]'
                        : 'bg-[#F3FBFF] text-[#7FA3B8] border-[#B6CCD9] hover:text-[#0E6B6B]'
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label htmlFor="report-title-input" className="block text-[#0E6B6B] font-semibold mb-1">Report Title</label>
                <input
                  id="report-title-input"
                  type="text"
                  value={config.reportTitle}
                  onChange={(e) => setConfig({ ...config, reportTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F3FBFF] border border-[#B6CCD9] rounded-xl text-[#0E6B6B] font-sans focus:outline-hidden focus:ring-2 focus:ring-[#0BAA9F]/20 focus:border-[#0BAA9F]"
                />
              </div>

              <div>
                <label htmlFor="prepared-by-input" className="block text-[#0E6B6B] font-semibold mb-1">Evaluator / Prepared By</label>
                <input
                  id="prepared-by-input"
                  type="text"
                  value={config.preparedBy}
                  onChange={(e) => setConfig({ ...config, preparedBy: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F3FBFF] border border-[#B6CCD9] rounded-xl text-[#0E6B6B] font-sans focus:outline-hidden focus:ring-2 focus:ring-[#0BAA9F]/20 focus:border-[#0BAA9F]"
                />
              </div>

              <div className="pt-2 border-t border-[#B6CCD9]/60 space-y-2 text-xs">
                <label className="block text-[#0E6B6B] font-semibold">Included Sections</label>

                <label className="flex items-center gap-2 cursor-pointer text-[#7FA3B8] hover:text-[#0E6B6B]">
                  <input
                    type="checkbox"
                    checked={config.includeCharts}
                    onChange={(e) => setConfig({ ...config, includeCharts: e.target.checked })}
                    className="rounded text-[#0BAA9F] focus:ring-[#0BAA9F]"
                  />
                  <span>Include CCME Metric Trends</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#7FA3B8] hover:text-[#0E6B6B]">
                  <input
                    type="checkbox"
                    checked={config.includeAnomalyLog}
                    onChange={(e) => setConfig({ ...config, includeAnomalyLog: e.target.checked })}
                    className="rounded text-[#0BAA9F] focus:ring-[#0BAA9F]"
                  />
                  <span>Include Anomaly & Safety Log</span>
                </label>
              </div>

              <button
                onClick={handleGeneratePdf}
                disabled={isGenerating}
                className="w-full py-2.5 mt-2 bg-[#0BAA9F] hover:bg-[#0BAA9F]/90 text-white rounded-xl font-semibold shadow-soft flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>{isGenerating ? 'Compiling Report...' : 'Generate Lab Report'}</span>
              </button>
            </div>
          </div>

          {/* Recent Reports Archive Card */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] p-5 shadow-soft space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7FA3B8] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0BAA9F]" />
              Recent Generated Reports
            </h4>

            <div className="space-y-2.5">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="p-3 bg-[#F3FBFF] rounded-xl border border-[#B6CCD9]/60 hover:bg-[#E6F6FF]/60 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-[#0E6B6B]">{report.title}</p>
                    <p className="text-[10px] text-[#7FA3B8]">{report.dateRange} • {report.samples} samples</p>
                  </div>
                  <button
                    onClick={handleGeneratePdf}
                    aria-label={`Download ${report.title}`}
                    className="p-1.5 text-[#0BAA9F] hover:text-[#0E6B6B] bg-white border border-[#B6CCD9] rounded-lg shadow-xs cursor-pointer"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Report Document Live Preview */}
        <div className="lg:col-span-2 bg-[#FFFFFF] rounded-2xl border border-[#B6CCD9] p-6 sm:p-8 shadow-card space-y-6 print:shadow-none">
          {/* Document Header */}
          <div className="pb-5 border-b border-[#B6CCD9]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#0BAA9F] font-bold text-xs uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 stroke-[1.75]" />
                AquaMonitor Environmental Lab
              </div>
              <h2 className="text-xl font-bold text-[#0E6B6B] tracking-tight">{config.reportTitle}</h2>
              <p className="text-xs text-[#7FA3B8] font-normal mt-0.5">
                Prepared by: <strong className="text-[#0E6B6B]">{config.preparedBy}</strong> | Evaluation Scope: <strong className="text-[#0E6B6B]">{reportType.toUpperCase()}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/30 px-3 py-1.5 rounded-full inline-block">
                Status: COMPLIANT
              </span>
            </div>
          </div>

          {/* Key Compliance Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3.5 rounded-xl bg-[#F3FBFF] border border-[#B6CCD9]/60 space-y-1">
              <span className="text-[10px] text-[#7FA3B8] font-sans font-medium block">Overall WQI</span>
              <p className="text-xl font-bold text-[#0E6B6B]">{stats.averageWqi} / 100</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F3FBFF] border border-[#B6CCD9]/60 space-y-1">
              <span className="text-[10px] text-[#7FA3B8] font-sans font-medium block">Compliance Rate</span>
              <p className="text-xl font-bold text-[#16A34A]">{stats.complianceRate}%</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F3FBFF] border border-[#B6CCD9]/60 space-y-1">
              <span className="text-[10px] text-[#7FA3B8] font-sans font-medium block">Total Telemetry Frames</span>
              <p className="text-xl font-bold text-[#0E6B6B]">{stats.totalSamples}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F3FBFF] border border-[#B6CCD9]/60 space-y-1">
              <span className="text-[10px] text-[#7FA3B8] font-sans font-medium block">Threshold Anomalies</span>
              <p className="text-xl font-bold text-[#F59E0B]">{stats.anomaliesDetected}</p>
            </div>
          </div>

          {/* Average Parameters Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7FA3B8] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#0BAA9F]" />
              Parameter Metric Summary Matrix
            </h3>

            <div className="overflow-x-auto border border-[#B6CCD9] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#F3FBFF] border-b border-[#B6CCD9] text-[11px] text-[#7FA3B8] uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Parameter</th>
                    <th className="px-4 py-3">Observed Mean</th>
                    <th className="px-4 py-3">Target Safe Bounds</th>
                    <th className="px-4 py-3 text-right">Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B6CCD9]/40">
                  <tr className="hover:bg-[#E6F6FF]/30">
                    <td className="px-4 py-3 font-sans font-medium text-[#0E6B6B]">Water Temperature</td>
                    <td className="px-4 py-3 font-bold text-[#0E6B6B]">{stats.tempAvg} °C</td>
                    <td className="px-4 py-3 text-[#7FA3B8] font-sans">18.0 – 28.0 °C</td>
                    <td className="px-4 py-3 text-right font-sans">
                      <span className="text-[#16A34A] font-semibold">Nominal</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#E6F6FF]/30">
                    <td className="px-4 py-3 font-sans font-medium text-[#0E6B6B]">pH Level</td>
                    <td className="px-4 py-3 font-bold text-[#0E6B6B]">{stats.phAvg} pH</td>
                    <td className="px-4 py-3 text-[#7FA3B8] font-sans">6.50 – 8.50 pH</td>
                    <td className="px-4 py-3 text-right font-sans">
                      <span className="text-[#16A34A] font-semibold">Nominal</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#E6F6FF]/30">
                    <td className="px-4 py-3 font-sans font-medium text-[#0E6B6B]">TDS (Total Dissolved Solids)</td>
                    <td className="px-4 py-3 font-bold text-[#0E6B6B]">{stats.tdsAvg} ppm</td>
                    <td className="px-4 py-3 text-[#7FA3B8] font-sans">50 – 500 ppm</td>
                    <td className="px-4 py-3 text-right font-sans">
                      <span className="text-[#16A34A] font-semibold">Nominal</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#E6F6FF]/30">
                    <td className="px-4 py-3 font-sans font-medium text-[#0E6B6B]">Turbidity</td>
                    <td className="px-4 py-3 font-bold text-[#0E6B6B]">{stats.turbidityAvg} NTU</td>
                    <td className="px-4 py-3 text-[#7FA3B8] font-sans">0.0 – 5.0 NTU</td>
                    <td className="px-4 py-3 text-right font-sans">
                      <span className="text-[#16A34A] font-semibold">Nominal</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#E6F6FF]/30">
                    <td className="px-4 py-3 font-sans font-medium text-[#0E6B6B]">Water Storage Level</td>
                    <td className="px-4 py-3 font-bold text-[#0E6B6B]">{stats.waterLevelAvg}%</td>
                    <td className="px-4 py-3 text-[#7FA3B8] font-sans">20 – 98%</td>
                    <td className="px-4 py-3 text-right font-sans">
                      <span className="text-[#16A34A] font-semibold">Nominal</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Verification Footer */}
          <div className="p-4 rounded-xl bg-[#F3FBFF] border border-[#B6CCD9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7FA3B8]">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#16A34A] shrink-0" />
              <div>
                <p className="font-bold text-[#0E6B6B]">Certified Environmental Audit Report</p>
                <p className="text-[11px] text-[#7FA3B8]">
                  Telemetry signed with ESP32 node identifier and SHA-256 validation timestamps.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const json = JSON.stringify({ config, stats, generatedAt: new Date().toISOString() }, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `aquamonitor_audit_${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
              }}
              className="px-3.5 py-1.5 bg-white border border-[#B6CCD9] hover:bg-[#E6F6FF] rounded-xl font-semibold text-[#0E6B6B] flex items-center gap-1.5 cursor-pointer shadow-soft transition-colors"
            >
              <Download className="w-3.5 h-3.5 stroke-[1.75]" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
