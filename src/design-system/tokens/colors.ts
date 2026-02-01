/**
 * COLOR TOKENS
 * Inspired by Dieter Rams' design philosophy for Braun
 * "Good design is as little design as possible."
 */

export const colors = {
  // Core Brand - Braun Orange
  brand: {
    orange: '#ea5b25',
    orangeHover: '#d14b1e',
    orangeLight: '#fef2ed',
  },

  // Neutral Scale - Minimalist Greys
  neutral: {
    white: '#ffffff',
    50: '#fafafa',
    100: '#f4f4f4',
    200: '#e6e6e6',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#888888',
    600: '#666666',
    700: '#444444',
    800: '#333333',
    900: '#111111',
    black: '#000000',
  },

  // Semantic Colors
  semantic: {
    success: '#22c55e',
    successLight: '#f0fdf4',
    error: '#ef4444',
    errorLight: '#fef2f2',
    warning: '#f59e0b',
    warningLight: '#fffbeb',
    info: '#3b82f6',
    infoLight: '#eff6ff',
  },
} as const;

// Type for color values
export type ColorToken = typeof colors;
