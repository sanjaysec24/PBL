import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { PageRoute, ConnectionStatus } from '../types';
import { formatLiveClock, formatFullDate } from '../utils/date';
import { useAlerts } from '../hooks/useAlerts';

interface NavigationContextType {
  currentRoute: PageRoute;
  setCurrentRoute: (route: PageRoute) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebarCollapse: () => void;
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;
  currentTimeString: string;
  currentDateString: string;
  activeAlertsCount: number;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const [currentTimeString, setCurrentTimeString] = useState<string>(formatLiveClock());
  const [currentDateString, setCurrentDateString] = useState<string>(formatFullDate());

  // Hook to get live active alerts count for badge display
  const { activeAlerts } = useAlerts();
  const activeAlertsCount = activeAlerts.length;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeString(formatLiveClock(now));
      setCurrentDateString(formatFullDate(now));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleSidebarCollapse = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  // Keyboard accessibility: Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileSidebarOpen]);

  // Lock body scroll when mobile drawer is active
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  return (
    <NavigationContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebarCollapse,
        connectionStatus,
        setConnectionStatus,
        currentTimeString,
        currentDateString,
        activeAlertsCount,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

