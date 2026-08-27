import React from 'react';
import { NAV_ITEMS } from '../../constants/navigation';
import { useNavigation } from '../../context/NavigationContext';
import { useDevice } from '../../hooks/useDevice';
import { PageRoute } from '../../types';
import { APP_CONFIG } from '../../constants/config';
import { cn } from '../../lib/utils';
import { Droplets, X, ChevronLeft, ChevronRight, Wifi, WifiOff } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    currentRoute, 
    setCurrentRoute, 
    isMobileSidebarOpen, 
    setIsMobileSidebarOpen,
    isSidebarCollapsed,
    toggleSidebarCollapse,
    connectionStatus,
    activeAlertsCount
  } = useNavigation();

  const { device } = useDevice();

  const handleNavClick = (id: PageRoute) => {
    setCurrentRoute(id);
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  const isOnline = connectionStatus === 'connected';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-[#0E6B6B]/30 backdrop-blur-xs z-50 md:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Element */}
      <aside
        id="app-sidebar"
        role="navigation"
        aria-label="Main Navigation"
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 bg-[#FFFFFF] border-r border-[#B6CCD9] shadow-soft flex flex-col justify-between transition-all duration-200 ease-out",
          // Mobile state: off-canvas drawer
          isMobileSidebarOpen 
            ? "translate-x-0 w-72 md:w-auto" 
            : "-translate-x-full md:translate-x-0",
          // Desktop & Tablet width states
          isSidebarCollapsed ? "md:w-[72px]" : "md:w-64"
        )}
      >
        {/* Top: AquaMonitor Brand Header */}
        <div className="h-16 px-4 border-b border-[#B6CCD9] flex items-center justify-between shrink-0 bg-[#FFFFFF]">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Water Drop Brand Mark */}
            <div 
              className="w-9 h-9 rounded-xl bg-[#0BAA9F] flex items-center justify-center text-white shrink-0 shadow-soft"
              aria-hidden="true"
            >
              <Droplets className="w-5 h-5 stroke-[1.75]" />
            </div>

            {/* Title & Subtitle (hidden when collapsed) */}
            {!isSidebarCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#0E6B6B] text-[15px] tracking-tight truncate leading-tight">
                    {APP_CONFIG.name}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#E6F6FF] text-[#0BAA9F] border border-[#B6CCD9]/60 px-1.5 py-0.2 rounded">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-[#7FA3B8] font-normal truncate leading-none mt-0.5">
                  Water Quality Monitoring
                </p>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden p-1.5 text-[#7FA3B8] hover:text-[#0E6B6B] hover:bg-[#E6F6FF] rounded-lg transition-colors cursor-pointer"
            aria-label="Close navigation sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle: Navigation Items List */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {!isSidebarCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#7FA3B8]">
              Navigation
            </div>
          )}

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              const isAlertsItem = item.id === 'alerts';
              const alertCount = isAlertsItem ? activeAlertsCount : undefined;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    "w-full flex items-center rounded-xl text-xs transition-all duration-150 group cursor-pointer relative",
                    isSidebarCollapsed 
                      ? "justify-center p-2.5" 
                      : "justify-between px-3.5 py-2.5",
                    isActive
                      ? "bg-[#E6F6FF] text-[#0E6B6B] font-semibold border border-[#B6CCD9]/70 shadow-xs"
                      : "text-[#0E6B6B]/80 hover:text-[#0E6B6B] hover:bg-[#F3FBFF] border border-transparent"
                  )}
                >
                  {/* Subtle active left indicator bar */}
                  {isActive && !isSidebarCollapsed && (
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#0BAA9F] rounded-r-full" 
                      aria-hidden="true"
                    />
                  )}

                  <div className={cn("flex items-center gap-3", isSidebarCollapsed && "justify-center")}>
                    <Icon 
                      className={cn(
                        "w-4 h-4 transition-colors stroke-[1.75] shrink-0",
                        isActive ? "text-[#0BAA9F]" : "text-[#7FA3B8] group-hover:text-[#0BAA9F]"
                      )} 
                      aria-hidden="true"
                    />
                    
                    {!isSidebarCollapsed && (
                      <span className="text-[13px] tracking-tight">{item.label}</span>
                    )}
                  </div>

                  {/* Alert Badge count */}
                  {isAlertsItem && alertCount !== undefined && alertCount > 0 && (
                    <>
                      {!isSidebarCollapsed ? (
                        <span 
                          className={cn(
                            "px-2 py-0.5 text-[10px] font-bold rounded-full font-mono transition-colors",
                            isActive
                              ? "bg-[#0BAA9F] text-white"
                              : "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30"
                          )}
                        >
                          {alertCount}
                        </span>
                      ) : (
                        <span 
                          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444]" 
                          title={`${alertCount} Active Alerts`}
                          aria-label={`${alertCount} Active Alerts`}
                        />
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Device Status Section & Collapse Button */}
        <div className="p-3 border-t border-[#B6CCD9] bg-[#FFFFFF] shrink-0 space-y-2">
          {!isSidebarCollapsed ? (
            /* Compact Operational Status Panel with subtle wave accent */
            <div className="relative overflow-hidden p-3 rounded-xl bg-[#F3FBFF] border border-[#B6CCD9] shadow-soft">
              {/* Subtle water wave vector ornament at bottom right */}
              <svg 
                className="absolute -bottom-1 -right-1 w-16 h-12 text-[#E6F6FF] opacity-60 pointer-events-none" 
                viewBox="0 0 100 60" 
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M0 40 Q 25 20, 50 40 T 100 40 L 100 60 L 0 60 Z" />
              </svg>

              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0E6B6B] tracking-tight">
                    {APP_CONFIG.deviceModel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isOnline ? (
                      <Wifi className="w-3.5 h-3.5 text-[#16A34A] stroke-[2]" aria-hidden="true" />
                    ) : (
                      <WifiOff className="w-3.5 h-3.5 text-[#EF4444] stroke-[2]" aria-hidden="true" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span 
                      className={cn(
                        "w-2 h-2 rounded-full",
                        isOnline ? "bg-[#16A34A]" : "bg-[#EF4444]"
                      )} 
                      aria-hidden="true"
                    />
                    <span className={cn(
                      "font-sans font-medium",
                      isOnline ? "text-[#16A34A]" : "text-[#EF4444]"
                    )}>
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <span className="text-[#7FA3B8] text-[10px] font-sans">
                    {device?.rssiDbm ? `${device.rssiDbm} dBm` : 'Just now'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Collapsed mini indicator */
            <div 
              className="flex justify-center p-2 rounded-xl bg-[#F3FBFF] border border-[#B6CCD9]"
              title={`ESP32 Device: ${isOnline ? 'Online' : 'Offline'}`}
            >
              <div 
                className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  isOnline ? "bg-[#16A34A]" : "bg-[#EF4444]"
                )} 
                aria-hidden="true"
              />
            </div>
          )}

          {/* Desktop/Tablet Collapse Toggle Button */}
          <button
            onClick={toggleSidebarCollapse}
            className="hidden md:flex w-full items-center justify-center py-1.5 text-xs text-[#7FA3B8] hover:text-[#0E6B6B] hover:bg-[#F3FBFF] rounded-lg transition-colors cursor-pointer"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 stroke-[1.75]" />
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] font-medium">
                <ChevronLeft className="w-3.5 h-3.5 stroke-[1.75]" />
                <span>Collapse Sidebar</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
