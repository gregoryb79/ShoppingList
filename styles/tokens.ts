import { Dimensions } from 'react-native';

// Responsive scaling function
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_WIDTH = 375; // iPhone 11 Pro as base
const scale = (size: number) => Math.round((SCREEN_WIDTH / BASE_WIDTH) * size);
export const colors = {
  // Primary colors
  primary: '#007AFF',
  background: '#fff',
  
  // Text colors
  textPrimary: '#111827',
  textSecondary: '#666',
  textLight: '#6B7280',
  textWhite: '#fff',
  
  // Surface colors
  surface: '#f5f5f5',
  surfaceSecondary: '#f9f9f9',
  surfaceLight: '#f0f0f0',
  primaryBlue: '#3B82F6',
  primaryLight: '#c1dbfbff',
  
  // Border colors
  border: '#ddd',
  borderLight: '#eee',
};

export const typography = {
  // Font sizes
  xs: scale(12),
  sm: scale(14),
  base: scale(16),
  md: scale(18),
  lg: scale(20),
  xl: scale(24),
  xxl: scale(28),
  
  // Font weights
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: 'bold' as const,
  },
};

export const spacing = {
  xs: scale(2),
  sm: scale(5),
  base: scale(10),
  md: scale(15),
  lg: scale(20),
  xl: scale(40),
};

export const borderRadius = {
  sm: 8,
  base: 10,
  lg: 15,
};

export const iconSizes = {
  xs: scale(16),
  sm: scale(24),
  md: scale(30),
  lg: scale(40),
};
