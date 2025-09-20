import { PageBuilderTheme } from '../types'

export const darkPurpleTheme: PageBuilderTheme = {
  name: 'dark-purple',
  colors: {
    // Primary purple palette
    primary: '#8B5CF6', // purple.500
    secondary: '#A78BFA', // purple.400
    accent: '#C4B5FD', // purple.300
    
    // Dark backgrounds
    background: '#0F0F23', // Very dark navy
    surface: '#1A1B3A', // Dark purple-navy
    
    // Text colors
    text: '#F8FAFC', // slate.50
    textSecondary: '#CBD5E1', // slate.300
    
    // UI elements
    border: '#334155', // slate.700
    success: '#10B981', // emerald.500
    warning: '#F59E0B', // amber.500
    error: '#EF4444', // red.500
  },
  fonts: {
    heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  spacing: {
    xs: '0.5rem', // 8px
    sm: '1rem',   // 16px
    md: '1.5rem', // 24px
    lg: '2rem',   // 32px
    xl: '3rem',   // 48px
  },
  borderRadius: {
    sm: '0.375rem', // 6px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
  }
}

export const lightPurpleTheme: PageBuilderTheme = {
  name: 'light-purple',
  colors: {
    // Primary purple palette
    primary: '#7C3AED', // violet.600
    secondary: '#8B5CF6', // purple.500
    accent: '#A78BFA', // purple.400
    
    // Light backgrounds
    background: '#FFFFFF', // white
    surface: '#F8FAFC', // slate.50
    
    // Text colors
    text: '#1E293B', // slate.800
    textSecondary: '#64748B', // slate.500
    
    // UI elements
    border: '#E2E8F0', // slate.200
    success: '#059669', // emerald.600
    warning: '#D97706', // amber.600
    error: '#DC2626', // red.600
  },
  fonts: {
    heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  }
}

export const themes = {
  'dark-purple': darkPurpleTheme,
  'light-purple': lightPurpleTheme,
}

export const defaultTheme = darkPurpleTheme
