export const DESIGN_TOKENS = {
  colors: {
    bgApp: '#FAFAFA',
    bgCard: '#FFFFFF',
    bgSubtle: '#F8FAFC',
    borderSubtle: '#E2E8F0',
    borderStrong: '#CBD5E1',
    primary: '#0284C7',
    primaryLight: '#F0F9FF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
  },
  spacing: {
    unit: 8, // 8px grid system
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
  },
  borderRadius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    pill: '9999px',
  },
} as const;
