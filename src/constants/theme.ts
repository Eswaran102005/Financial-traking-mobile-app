/**
 * Centralized Color Theme — FinTrack
 * Strictly built around the exact 5-color palette:
 * - Deep Black: #0B0F14
 * - Dark Navy:  #24303E
 * - Slate Blue: #64748B
 * - Light Slate:#CBD5E1
 * - Off White:  #F8FAFC
 */

export const PALETTE = {
  deepBlack: '#0B0F14',
  darkNavy: '#24303E',
  slateBlue: '#64748B',
  lightSlate: '#CBD5E1',
  offWhite: '#F8FAFC',
};

export const COLORS = {
  // Core Five-Color Palette
  deepBlack: PALETTE.deepBlack,
  darkNavy: PALETTE.darkNavy,
  slateBlue: PALETTE.slateBlue,
  lightSlate: PALETTE.lightSlate,
  offWhite: PALETTE.offWhite,

  // Primary & Interactive (Dark Navy for primary buttons/surfaces)
  primary: PALETTE.darkNavy,
  primaryDark: PALETTE.deepBlack,
  primaryLight: '#EAEFF5',
  primaryMuted: 'rgba(36, 48, 62, 0.12)',

  // Secondary & Supporting (Slate Blue for secondary elements)
  secondary: PALETTE.slateBlue,
  secondaryLight: '#F1F5F9',

  // Surfaces & Backgrounds
  background: PALETTE.offWhite,     // #F8FAFC - Primary light background
  surfaceDark: PALETTE.deepBlack,   // #0B0F14 - Dark surfaces & sections
  card: '#FFFFFF',                  // Light-mode cards
  cardOffWhite: PALETTE.offWhite,   // #F8FAFC - Alternative card surface
  cardDark: PALETTE.darkNavy,       // #24303E - Dark dashboard cards & highlights
  cardMuted: '#F1F5F9',

  // Borders & Dividers (Light Slate #CBD5E1)
  border: PALETTE.lightSlate,       // #CBD5E1 - Standard subtle borders
  borderLight: '#E2E8F0',
  borderDark: PALETTE.darkNavy,

  // Typography
  textPrimary: PALETTE.deepBlack,       // #0B0F14 on light backgrounds
  textSecondary: PALETTE.slateBlue,     // #64748B on light backgrounds
  textMuted: PALETTE.slateBlue,
  textLight: PALETTE.offWhite,          // #F8FAFC on dark backgrounds
  textLightSecondary: PALETTE.lightSlate, // #CBD5E1 on dark backgrounds

  // Subtle financial indicators (used strictly when necessary with high contrast)
  income: '#059669',        // Accessible emerald green
  incomeBg: '#F0FDF4',
  incomeDark: '#065F46',

  expense: '#DC2626',       // Accessible crimson red
  expenseBg: '#FEF2F2',
  expenseDark: '#991B1B',

  warning: '#D97706',
  warningBg: '#FFFBEB',
  warningDark: '#92400E',

  overlay: 'rgba(11, 15, 20, 0.70)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// Subtle, clean shadows (avoiding excessive shadows as required)
export const SHADOWS = {
  sm: {
    shadowColor: PALETTE.deepBlack,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: PALETTE.deepBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: PALETTE.deepBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardDark: {
    shadowColor: PALETTE.deepBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
};

export const TYPOGRAPHY = {
  titleLarge: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  titleMedium: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  titleSmall: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.textPrimary,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: COLORS.textPrimary,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: COLORS.textSecondary,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: COLORS.textMuted,
  },
  caption: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: COLORS.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
};
