/**
 * APPLICATION CONFIGURATION
 * Central location for all configurable values
 */

// KaTeX CDN Configuration
export const KATEX_CONFIG = {
  CSS_URL: 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css',
  JS_URL: 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js',
  OPTIONS: {
    throwOnError: false,
    displayMode: false,
    strict: false,
    trust: true,
  },
} as const;

// Application Metadata
export const APP_CONFIG = {
  name: 'Process.Card',
  version: '1.0.0',
  tagline: 'Gutes Design ist so wenig Design wie möglich.',
  author: 'Inspiriert von Dieter Rams',
} as const;

// Default Tags for Tasks
export const DEFAULT_TAGS = [
  'Thermodynamik',
  'Reaktionstechnik',
] as const;

// Animation Durations (ms)
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
} as const;

// Layout Constants
export const LAYOUT = {
  maxContentWidth: '4xl', // max-w-4xl
  headerHeight: '4rem',   // h-16
  sidebarWidth: '16rem',  // w-64
} as const;
