import { LucideIcon } from 'lucide-react';

export type PageRoute = 
  | 'dashboard'
  | 'live-monitor'
  | 'history'
  | 'alerts'
  | 'reports'
  | 'about-device';

export interface NavItem {
  id: PageRoute;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
  description?: string;
}
