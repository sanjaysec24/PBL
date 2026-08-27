import { 
  LayoutDashboard, 
  Activity, 
  History, 
  Bell, 
  FileText, 
  Cpu 
} from 'lucide-react';
import { NavItem } from '../types/navigation';

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'System overview & water quality metrics'
  },
  {
    id: 'live-monitor',
    label: 'Live Monitor',
    icon: Activity,
    description: 'Real-time ESP32 sensor data telemetry'
  },
  {
    id: 'history',
    label: 'History',
    icon: History,
    description: 'Historical logs & sensor trend analysis'
  },
  {
    id: 'alerts',
    label: 'Alerts',
    icon: Bell,
    description: 'Threshold warnings & anomaly events'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    description: 'Water safety & lab report summaries'
  },
  {
    id: 'about-device',
    label: 'About Device',
    icon: Cpu,
    description: 'ESP32 hardware details & specs'
  }
];

