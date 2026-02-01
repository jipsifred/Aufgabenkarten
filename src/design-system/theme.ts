/**
 * THEME - Tailwind Class Mappings
 * Maps semantic concepts to Tailwind classes
 * Ensures 1:1 design consistency across all components
 */

export const theme = {
  // Background Colors
  bg: {
    page: 'bg-[#f4f4f4]',
    surface: 'bg-white',
    elevated: 'bg-[#fafafa]',
    accent: 'bg-[#ea5b25]',
    accentHover: 'hover:bg-[#d14b1e]',
    muted: 'bg-neutral-100',
    dark: 'bg-neutral-800',
  },

  // Text Colors
  text: {
    primary: 'text-[#111111]',
    secondary: 'text-[#666666]',
    muted: 'text-[#888888]',
    inverse: 'text-white',
    accent: 'text-[#ea5b25]',
    success: 'text-green-600',
    error: 'text-red-600',
  },

  // Border Colors
  border: {
    default: 'border-[#e6e6e6]',
    light: 'border-neutral-100',
    medium: 'border-neutral-200',
    dark: 'border-neutral-300',
    dashed: 'border-dashed border-neutral-200',
  },

  // Typography
  typography: {
    heading: {
      h1: 'text-3xl font-bold tracking-tight',
      h2: 'text-2xl font-semibold tracking-tight',
      h3: 'text-lg font-medium',
      h4: 'text-sm font-bold uppercase tracking-widest',
    },
    body: {
      default: 'text-base leading-relaxed',
      small: 'text-sm leading-relaxed',
      tiny: 'text-xs',
    },
    label: 'text-xs font-semibold uppercase tracking-wider',
  },

  // Spacing Utilities (component-level)
  spacing: {
    page: 'px-6 py-12',
    section: 'mb-16',
    card: 'p-6',
    cardLarge: 'p-8',
  },

  // Shadows
  shadow: {
    sm: 'shadow-sm',
    default: 'shadow',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  },

  // Border Radius
  radius: {
    sm: 'rounded',
    default: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  },

  // Interactive States
  interactive: {
    button: {
      primary: 'bg-[#ea5b25] hover:bg-[#d14b1e] text-white shadow-sm transition-all',
      secondary: 'bg-white border border-[#e6e6e6] hover:shadow-md text-[#111111] transition-all',
      ghost: 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors',
    },
    focus: 'focus:outline-none focus:ring-2 focus:ring-[#ea5b25] focus:ring-offset-2',
  },

  // Animations
  animation: {
    fadeIn: 'animate-in fade-in',
    slideUp: 'animate-in fade-in slide-in-from-bottom-4 duration-500',
    slideUpLarge: 'animate-in slide-in-from-bottom-8 duration-700',
    zoomIn: 'animate-in fade-in zoom-in-95 duration-200',
  },

  // Layout
  layout: {
    container: 'max-w-4xl mx-auto',
    flexCenter: 'flex items-center justify-center',
    flexBetween: 'flex items-center justify-between',
  },
} as const;

// Selection styling (applied globally)
export const selectionStyle = 'selection:bg-[#ea5b25] selection:text-white';

// Font family
export const fontFamily = 'font-sans';

export type Theme = typeof theme;
