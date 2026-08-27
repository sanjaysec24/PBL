import React from 'react';
import { Menu, Wifi, WifiOff, Bell, Clock, Cpu } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { APP_CONFIG } from '../../constants/config';
import { cn } from '../../lib/utils';

export const Navbar: React.FC = () => {
  const { 
    currentRoute,
    setCurrentRoute,
    connectionStatus, 
    currentTimeString, 
    currentDateString,
    isMobileSidebarOpen, 
    setIsMobileSidebarOpen,
    activeAlertsCount
  } = useNavigation();

  // Determine current contextual heading based on route
  const getContextualHeading = () => {
    switch (currentRoute) {
      case 'dashboard':
        return { title: 'Overview Dashboard', subtitle: 'Real-time telemetry and water quality index' };
      case 'live-monitor':
        return { title: 'Live Sensor Monitor', subtitle: 'High-frequency telemetry stream & gauges' };
      case 'history':
        return { title: 'Historical Logs', subtitle: 'Historical sensor database and trend analysis' };
      case 'alerts':
        return { title: 'Alerts & Thresholds', subtitle: 'System anomaly alerts and trigger configuration' };
      case 'reports':
        return { title: 'Compliance Reports', subtitle: 'Water safety certification and lab export' };
      case 'about-device':
        return { title: 'Hardware Diagnostics', subtitle: 'Microcontroller specifications and pin matrix' };
      default:
        return { title: 'AquaMonitor', subtitle: 'Water Quality Monitoring System' };
    }
  };

  const pageContext = getContextualHeading();
  const isConnected = connectionStatus === 'connected';

  return (
    <header 
      role="banner"
      className="sticky top-0 z-30 h-16 bg-[#FFFFFF] border-b border-[#B6CCD9] shadow-soft px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-200"
    >
      {/* Left: Mobile Drawer Trigger & Contextual Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="md:hidden p-2 text-[#7FA3B8] hover:text-[#0E6B6B] hover:bg-[#E6F6FF] rounded-xl transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5 stroke-[1.75]" />
        </button>

        {/* Contextual Page Heading */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-[#0E6B6B] text-[15px] sm:text-[17px] tracking-tight leading-none">
              {pageContext.title}
            </h1>
          </div>
          <p className="text-[11px] text-[#7FA3B8] font-normal hidden sm:block mt-0.5 leading-none">
            {pageContext.subtitle}
          </p>
        </div>
      </div>

      {/* Center: Generous Whitespace */}
      <div className="flex-1" />

      {/* Right: Operational Status, Live Time, Alerts Bell, & User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Clean Connection Status Indicator */}
        <div 
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200",
            isConnected 
              ? "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/30" 
              : connectionStatus === 'reconnecting'
              ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30"
              : "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30"
          )}
          title={`ESP32 Hardware Connection: ${connectionStatus}`}
        >
          {/* Subtle status dot */}
          <span 
            className={cn(
              "w-2 h-2 rounded-full",
              isConnected ? "bg-[#16A34A]" : connectionStatus === 'reconnecting' ? "bg-[#F59E0B]" : "bg-[#EF4444]"
            )} 
            aria-hidden="true"
          />
          <span className="font-sans font-medium text-[11px] sm:text-xs">
            {isConnected ? 'ESP32 Online' : connectionStatus === 'reconnecting' ? 'Reconnecting...' : 'ESP32 Offline'}
          </span>
          {isConnected ? (
            <Wifi className="w-3.5 h-3.5 text-[#16A34A] stroke-[2] hidden sm:inline-block" aria-hidden="true" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-[#EF4444] stroke-[2] hidden sm:inline-block" aria-hidden="true" />
          )}
        </div>

        {/* Live Date & Time Telemetry */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#F3FBFF] border border-[#B6CCD9] rounded-xl text-[#0E6B6B] text-xs">
          <Clock className="w-3.5 h-3.5 text-[#0BAA9F] stroke-[1.75]" aria-hidden="true" />
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="font-bold text-[#0E6B6B] text-[12px]">{currentTimeString}</span>
            <span className="text-[11px] text-[#7FA3B8] font-sans">({currentDateString})</span>
          </div>
        </div>

        {/* Notification Bell Button with Anomaly Count */}
        <button
          onClick={() => setCurrentRoute('alerts')}
          className={cn(
            "p-2 text-[#7FA3B8] hover:text-[#0E6B6B] hover:bg-[#E6F6FF] rounded-xl transition-colors relative cursor-pointer",
            currentRoute === 'alerts' && "bg-[#E6F6FF] text-[#0BAA9F]"
          )}
          aria-label={`View alerts: ${activeAlertsCount} active`}
          title={`View Alerts (${activeAlertsCount} active)`}
        >
          <Bell className="w-4 h-4 stroke-[1.75]" />
          {activeAlertsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444]" />
          )}
        </button>

        {/* User Profile Avatar & Identity */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#B6CCD9]">
          <div 
            className="w-8 h-8 rounded-full bg-[#E6F6FF] border border-[#B6CCD9] flex items-center justify-center text-[#0E6B6B] font-bold text-xs shadow-soft"
            title={`${APP_CONFIG.labUserName} (${APP_CONFIG.labUserRole})`}
          >
            SJ
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-[#0E6B6B] leading-tight">
              {APP_CONFIG.labUserName}
            </p>
            <p className="text-[10px] text-[#7FA3B8] font-normal leading-tight">
              {APP_CONFIG.labUserRole}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
