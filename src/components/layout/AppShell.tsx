import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useNavigation } from '../../context/NavigationContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

import { DashboardPage } from '../../pages/DashboardPage';
import { LiveMonitorPage } from '../../pages/LiveMonitorPage';
import { HistoryPage } from '../../pages/HistoryPage';
import { AlertsPage } from '../../pages/AlertsPage';
import { ReportsPage } from '../../pages/ReportsPage';
import { AboutDevicePage } from '../../pages/AboutDevicePage';

export const AppShell: React.FC = () => {
  const { currentRoute, isSidebarCollapsed } = useNavigation();

  const renderActivePage = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardPage />;
      case 'live-monitor':
        return <LiveMonitorPage />;
      case 'history':
        return <HistoryPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'about-device':
        return <AboutDevicePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F3FBFF] flex font-sans text-[#0E6B6B] selection:bg-[#0BAA9F]/20 selection:text-[#0E6B6B] relative overflow-x-hidden">
      {/* Subtle decorative background water ambient radiance */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40" 
        style={{
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, #E6F6FF 0%, rgba(243, 251, 255, 0) 80%)'
        }}
        aria-hidden="true"
      />

      {/* Left Sidebar (Desktop fixed left / Mobile drawer) */}
      <Sidebar />

      {/* Right Column: Top Header + Main Page Content */}
      <div 
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-200 ease-out relative z-10",
          isSidebarCollapsed ? "md:pl-[72px]" : "md:pl-64"
        )}
      >
        {/* Top Header */}
        <Navbar />

        {/* Main Content Area */}
        <main 
          id="main-content" 
          tabIndex={-1}
          className="flex-1 flex flex-col focus:outline-hidden"
        >
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRoute}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="flex-1 flex flex-col"
              >
                {renderActivePage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
